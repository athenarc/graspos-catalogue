"""Documents router."""

from fastapi import APIRouter, HTTPException, Depends, Query
from models.document import Documents, DocumentsPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional

router = APIRouter(prefix="/api/v1/document", tags=["Documents"])


@router.get("", status_code=200, response_model=list[Documents])
async def get_all_datasets(
    user: Optional[User] = Depends(current_user),
    license: Optional[List[str]] = Query(
        None)  # Optional list of licenses filter
) -> list[Documents]:
    # Start building the search query
    search = {}

    if user:
        if user.super_user:
            # If user is a super user, fetch all documents (no 'approved' filter applied)
            documents = await Documents.find_all(fetch_links=True).to_list()
        else:
            # Apply 'approved' filter for non-superusers
            search["$or"] = [{"approved": True}]
            search["$or"].append(
                {"owner":
                 user.id})  # Include user-owned documents if logged in

    # If licenses are provided, add a filter for licenses
    if license:
        # Match documents where the 'zenodo.metadata.license.id' is in the provided list of licenses
        search["$or"] = search.get("$or", [])
        search["$or"].append({"zenodo.metadata.license.id": {"$in": license}})

    # Fetch documents based on the search query
    documents = await Documents.find(search, fetch_links=True).to_list()

    return documents


@router.post("/create", status_code=201)
async def create_document(
    document: Documents, user: User = Depends(current_user_mandatory)
) -> Documents:
    zenodo = None

    try:
        zenodo = Zenodo(source=document.source)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    data = get_zenodo_data(document.source)
    if data["status"] != 200:
        raise HTTPException(status_code=data["status"], detail=data["detail"])

    zenodo = Zenodo(**data["zenodo_object"])
    await zenodo.create()
    document.zenodo = zenodo
    document.owner = user.id
    if user.super_user:
        document.approved = True
    await document.create()
    return document


@router.get("/licenses")
async def get_licenses():
    unique_licenses = await Documents.get_unique_licenses_from_zenodo()
    return {"unique_licenses": unique_licenses}


@router.get("/{document_id}",
            responses={404: {
                "detail": "Documents does not exist"
            }})
async def get_document(document_id: PydanticObjectId) -> Documents:

    document = await Documents.get(document_id, fetch_links=True)

    if not document:

        return HTTPException(status_code=404,
                             detail="Documents does not exist")

    return document


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: PydanticObjectId,
                          user: User = Depends(current_user_mandatory)):
    document_to_delete = await Documents.get(document_id, fetch_links=True)

    if not document_to_delete:

        return HTTPException(status_code=404,
                             detail="Documents does not exist")

    await document_to_delete.delete(link_rule=DeleteRules.DELETE_LINKS)
    await Update.find(zenodo_id=document_to_delete.zenodo.id).delete()
    return {"message": "Document successfully deleted"}


@router.patch("/{document_id}", status_code=200)
async def update_document(
    update: DocumentsPatch,
    document_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> DocumentsPatch:

    document = await Documents.get(document_id)

    if not document:
        return HTTPException(status_code=404,
                             detail="Documents does not exist")

    fields = update.model_dump(exclude_unset=True)

    if "approved" in fields and not fields["approved"]:
        await document.delete()
    else:
        document = Documents.model_copy(document, update=fields)
        await document.save()

    return document
