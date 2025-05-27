"""Documents router."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from models.document import Documents, DocumentsPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/document", tags=["Documents"])


@router.get("", status_code=200, response_model=list[Documents])
async def get_all_documents(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(None),
        scope: Optional[List[str]] = Query(None),
        geographical_coverage: Optional[List[str]] = Query(None),
        tag: Optional[List[str]] = Query(None),
        graspos: Optional[bool] = Query(None),
        sort_field: Optional[str] = Query(None),
        sort_direction: Optional[str] = Query(None),
        start: Optional[str] = Query(None),
        end: Optional[str] = Query(None),
        text: Optional[str] = Query(None),
) -> list[Documents]:

    filters = []

    # User access filter
    if user:
        if not user.super_user:
            filters.append({"$or": [{"approved": True}, {"owner": user.id}]})
    else:
        filters.append({"approved": True})

    # License filter
    if license:
        filters.append({"zenodo.metadata.license.id": {"$in": license}})

    # Scope filter - convert to ObjectId if necessary
    if scope:
        scope_ids = [PydanticObjectId(s) for s in scope]
        filters.append({"scopes._id": {"$in": scope_ids}})

    # Geographical Coverage filtering
    if geographical_coverage:
        geographical_coverage_ids = [PydanticObjectId(s) for s in geographical_coverage]
        filters.append({"geographical_coverage._id": {"$in": geographical_coverage_ids}})

    # Tag filter
    if tag:
        filters.append({"zenodo.metadata.keywords": {"$in": tag}})

    # GraspOS verified filter
    if graspos:
        filters.append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    # Date range filters
    if start:
        start_date = datetime.fromisoformat(start)
        filters.append(
            {"zenodo.metadata.publication_date": {
                "$gte": start_date
            }})

    if end:
        end_date = datetime.fromisoformat(end)
        filters.append(
            {"zenodo.metadata.publication_date": {
                "$lte": end_date
            }})

    # Full text search
    if text:
        zenodo_search_results = await Zenodo.find({
            "$text": {
                "$search": text
            }
        }).to_list()
        zenodo_ids = [PydanticObjectId(z.id) for z in zenodo_search_results]
        if zenodo_ids:
            filters.append({"zenodo._id": {"$in": zenodo_ids}})
        else:
            # If no matching Zenodo results, return empty early
            return []

    # Compose final filter
    if len(filters) == 1:
        query_filter = filters[0]
    elif filters:
        query_filter = {"$and": filters}
    else:
        query_filter = {}

    # Sorting logic
    if sort_field and sort_direction:
        zenodo_sort_field = "zenodo.metadata.stats." + sort_field
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == "asc" else -1
        documents = await Documents.find(query_filter, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
        documents = await Documents.find(query_filter,
                                         fetch_links=True).to_list()
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


@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
async def delete_document(document_id: PydanticObjectId,
                          user: User = Depends(current_user_mandatory)):
    """
    Delete a document by its ID, along with its related Zenodo record and updates.
    Does not cascade delete unrelated links.
    """
    logger.info(f"User {user.id} requested deletion of document {document_id}")

    document = await Documents.find_one(Documents.id == document_id,
                                        fetch_links=True)

    if not document:
        logger.warning(f"Document {document_id} not found for user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Document not found")

    try:
        # Delete linked Zenodo and associated updates
        if document.zenodo:
            logger.info(
                f"Deleting linked Zenodo {document.zenodo.id} and related updates"
            )
            await Update.find(zenodo_id=document.zenodo.id).delete()
            await Zenodo.find(Zenodo.id == document.zenodo.id).delete()

        # Delete document without deleting other linked objects
        await document.delete(link_rule=DeleteRules.DO_NOTHING)

        logger.info(
            f"Document {document_id} deleted successfully by user {user.id}")
        return {"message": "Document deleted successfully"}

    except Exception as e:
        logger.exception(
            f"Error deleting document {document_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the document")


@router.patch("/{document_id}", status_code=status.HTTP_200_OK)
async def update_document(
    update: DocumentsPatch,
    document_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> DocumentsPatch:
    """
    Update an existing document by ID.
    If `approved=False`, delete the document and its linked Zenodo and Update documents.
    Otherwise, update the document with the provided fields.
    """
    logger.info(f"User {user.id} requested update on document {document_id}")

    document = await Documents.find_one(Documents.id == document_id,
                                        fetch_links=True)

    if not document:
        logger.warning(
            f"Document {document_id} not found for update by user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Document not found")

    try:
        fields = update.model_dump(exclude_unset=True)

        if "approved" in fields and not fields["approved"]:
            logger.info(
                f"Document {document_id} marked as unapproved. Deleting document and linked Zenodo and updates."
            )

            if document.zenodo:
                logger.info(
                    f"Deleting linked Zenodo {document.zenodo.id} and related updates."
                )
                await Update.find(zenodo_id=document.zenodo.id).delete()
                await Zenodo.find(Zenodo.id == document.zenodo.id).delete()

            await document.delete(link_rule=DeleteRules.DO_NOTHING)

            logger.info(
                f"Document {document_id} and linked Zenodo/Updates deleted successfully."
            )
            return {"message": "Document and linked Zenodo/Updates deleted"}

        logger.info(f"Updating document {document_id} with fields: {fields}")
        document = Documents.model_copy(document, update=fields)
        await document.save()

        logger.info(
            f"Document {document_id} updated successfully by user {user.id}")
        return document

    except Exception:
        logger.exception(
            f"Error updating document {document_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the document")
