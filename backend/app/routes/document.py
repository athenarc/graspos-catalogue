"""Documents router."""

from fastapi import APIRouter, HTTPException, Depends
from models.document import Documents, DocumentsPatch
from models.user import User
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/document", tags=["Documents"])


@router.get("/", status_code=200, response_model=list[Documents])
async def get_all_documents() -> list[Documents]:

    documents = await Documents.find(Documents.approved == True).to_list()

    return documents


@router.get("/admin/", status_code=200, response_model=list[Documents])
async def get_all_documents_admin(user: User = Depends(
    current_user)) -> list[Documents]:

    if user.super_user:
        documents = await Documents.find_all().to_list()
    else:
        documents = await Documents.find(Documents.approved == True).to_list()
        
    return documents


@router.post("/", status_code=201)
async def create_document(
    document: Documents, user: User = Depends(current_user)) -> Documents:

    url_validation = document.get_data(document.source)

    if url_validation["status"] is not 200:
        raise HTTPException(status_code=url_validation["status"],
                            detail=url_validation["detail"])

    document = document.update(url_validation["resource"])
    document.owner = user.id
    if user.super_user:
        document.approved = True
    await document.create()
    return document


@router.get("/{document_id}",
            responses={404: {
                "detail": "Documents does not exist"
            }})
async def get_document(document_id: PydanticObjectId) -> Documents:

    document = await Documents.get(document_id)

    if not document:

        return HTTPException(status_code=404,
                             detail="Documents does not exist")

    return document


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: PydanticObjectId,
                          user: User = Depends(current_user)):
    document_to_delete = await Documents.get(document_id)

    if not document_to_delete:

        return HTTPException(status_code=404,
                             detail="Documents does not exist")

    await document_to_delete.delete()
    return {"message": "Documents successfully deleted"}


@router.patch("/{document_id}", status_code=200)
async def update_document(
    update: DocumentsPatch,
    document_id: PydanticObjectId,
    user: User = Depends(current_user)
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
