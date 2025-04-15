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
from datetime import datetime

router = APIRouter(prefix="/api/v1/document", tags=["Documents"])


@router.get("", status_code=200, response_model=list[Documents])
async def get_all_datasets(user: Optional[User] = Depends(current_user),
                           license: Optional[List[str]] = Query(None),
                           keyword: Optional[List[str]] = Query(None),
                           graspos: Optional[bool] = Query(None),
                           sort_field: Optional[str] = Query(None),
                           sort_direction: Optional[str] = Query(None),
                           start: Optional[str] = Query(None),
                           end: Optional[str] = Query(
                               None)) -> list[Documents]:

    search = {}

    if user:
        if user.super_user:
            documents = await Documents.find_all(fetch_links=True).to_list()
        else:
            search["$or"] = [{"approved": True}]
            search["$or"].append({"owner": user.id})

    if license:
        search["$or"] = search.get("$or", [])
        search["$or"].append({"zenodo.metadata.license.id": {"$in": license}})

    # Keyword filtering
    if keyword:
        search["$or"] = search.get("$or", [])
        search["$or"].append({"zenodo.metadata.keywords": {"$in": keyword}})

    if graspos:

        search["$and"] = search.get("$and", [])
        search["$and"].append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    # Date range filtering
    if start:
        start_date = datetime.fromisoformat(
            start)  # Parse the ISO date string to a datetime object
        # Append $gte filter to existing filter, if any
        search["$and"] = search.get("$and", [])
        search["$and"].append(
            {"zenodo.metadata.publication_date": {
                "$gte": start_date
            }})

    if end:
        end_date = datetime.fromisoformat(
            end)  # Parse the ISO date string to a datetime object
        # Append $lte filter to existing filter, if any
        search["$and"] = search.get("$and", [])
        search["$and"].append(
            {"zenodo.metadata.publication_date": {
                "$lte": end_date
            }})

    if sort_field and sort_direction:
        zenodo_sort_field = "zenodo.metadata.stats." + sort_field
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == 'asc' else -1
        documents = await Documents.find(search, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
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


@router.get("/fields/unique")
async def get_unique_metadata_values(field: str = Query(
    ..., description="Field name inside zenodo.metadata")):
    """
    Return unique values from the given field in Zenodo metadata across all documents.
    """
    try:
        unique_values = await Documents.get_unique_field_values_from_zenodo(
            field)
        return {f"unique_{field}": unique_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
