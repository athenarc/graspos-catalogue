"""Dataset router."""

from fastapi import APIRouter, HTTPException, Depends, Query, status, HTTPException
from models.dataset import Dataset, DatasetPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])


@router.get("", status_code=200, response_model=List[Dataset])
async def get_all_datasets(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(None),
        scope: Optional[List[str]] = Query(None),
        tag: Optional[List[str]] = Query(None),
        graspos: Optional[bool] = Query(None),
        sort_field: Optional[str] = Query(None),
        sort_direction: Optional[str] = Query(None),
        start: Optional[str] = Query(None),
        end: Optional[str] = Query(None),
        text: Optional[str] = Query(None),
) -> List[Dataset]:

    filters = []

    # User filter
    if user:
        if not user.super_user:
            filters.append({"$or": [{"approved": True}, {"owner": user.id}]})
    else:
        filters.append({"approved": True})

    # License filtering
    if license:
        filters.append({"zenodo.metadata.license.id": {"$in": license}})

    # Scope filtering
    if scope:
        scope_ids = [PydanticObjectId(s) for s in scope]
        filters.append({"scopes._id": {"$in": scope_ids}})

    # Tag filtering
    if tag:
        filters.append({"zenodo.metadata.keywords": {"$in": tag}})

    # GraspOS verified filtering
    if graspos:
        filters.append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    # Date range filtering
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

    # Text search filter handling
    if text:
        zenodo_search_results = await Zenodo.find({
            "$text": {
                "$search": text
            }
        }).to_list()

        zenodo_ids = [PydanticObjectId(z.id) for z in zenodo_search_results]
        if zenodo_ids:
            filters.append({"zenodo.id": {"$in": zenodo_ids}})
        else:
            return []

    # Combine filters with $and if multiple
    if filters:
        if len(filters) == 1:
            query_filter = filters[0]
        else:
            query_filter = {"$and": filters}
    else:
        query_filter = {}

    # Sorting and querying datasets
    if sort_field and sort_direction:
        zenodo_sort_field = f"zenodo.stats.{sort_field}"
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == "asc" else -1

        datasets = await Dataset.find(query_filter, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
        datasets = await Dataset.find(query_filter, fetch_links=True).to_list()

    return datasets


@router.post("/create", status_code=201)
async def create_dataset(dataset: Dataset,
                         user: User = Depends(current_user_mandatory)):
    zenodo = None

    try:
        zenodo = Zenodo(source=dataset.source)

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    data = get_zenodo_data(dataset.source)
    if data["status"] != 200:
        raise HTTPException(status_code=data["status"], detail=data["detail"])

    zenodo = Zenodo(**data["zenodo_object"])
    await zenodo.create()
    dataset.zenodo = zenodo
    dataset.owner = user.id
    if user.super_user:
        dataset.approved = True

    await dataset.create()
    return dataset


@router.get("/fields/unique")
async def get_unique_metadata_values(field: str = Query(
    ..., description="Field name inside zenodo.metadata")):
    """
    Return unique values from the given field in Zenodo metadata across all datasets.
    """
    try:
        unique_values = await Dataset.get_unique_field_values_from_zenodo(field
                                                                          )
        return {f"unique_{field}": unique_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{dataset_id}",
            responses={404: {
                "detail": "Dataset does not exist"
            }})
async def get_dataset(dataset_id: PydanticObjectId) -> Dataset:

    dataset = await Dataset.get(dataset_id, fetch_links=True)

    if not dataset:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    return dataset


@router.delete("/{dataset_id}", status_code=status.HTTP_200_OK)
async def delete_dataset(dataset_id: PydanticObjectId,
                         user: User = Depends(current_user_mandatory)):
    """
    Delete a dataset by its ID, along with its related Zenodo record and updates.
    Does not cascade delete unrelated links.
    """
    logger.info(f"User {user.id} requested deletion of dataset {dataset_id}")

    dataset = await Dataset.find_one(Dataset.id == dataset_id,
                                     fetch_links=True)

    if not dataset:
        logger.warning(f"Dataset {dataset_id} not found for user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Dataset not found")

    try:
        # Delete linked Zenodo and associated updates
        if dataset.zenodo:
            logger.info(
                f"Deleting linked Zenodo {dataset.zenodo.id} and related updates"
            )
            await Update.find(zenodo_id=dataset.zenodo.id).delete()
            await Zenodo.find(Zenodo.id == dataset.zenodo.id).delete()

        # Delete dataset without deleting other linked objects
        await dataset.delete(link_rule=DeleteRules.DO_NOTHING)

        logger.info(
            f"Dataset {dataset_id} deleted successfully by user {user.id}")
        return {"message": "Dataset deleted successfully"}

    except Exception as e:
        logger.exception(
            f"Error deleting dataset {dataset_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the dataset")


@router.patch("/{dataset_id}", status_code=status.HTTP_200_OK)
async def update_dataset(
    update: DatasetPatch,
    dataset_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> DatasetPatch:
    """
    Update an existing dataset by ID.
    If `approved=False`, delete the dataset and its linked Zenodo and Update documents.
    Otherwise, update the dataset with the provided fields.
    """
    logger.info(f"User {user.id} requested update on dataset {dataset_id}")

    dataset = await Dataset.find_one(Dataset.id == dataset_id,
                                     fetch_links=True)

    if not dataset:
        logger.warning(
            f"Dataset {dataset_id} not found for update by user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Dataset not found")

    try:
        fields = update.model_dump(exclude_unset=True)

        if "approved" in fields and not fields["approved"]:
            logger.info(
                f"Dataset {dataset_id} marked as unapproved. Deleting dataset and linked Zenodo and updates."
            )

            if dataset.zenodo:
                logger.info(
                    f"Deleting linked Zenodo {dataset.zenodo.id} and related updates."
                )
                await Update.find(zenodo_id=dataset.zenodo.id).delete()
                await Zenodo.find(Zenodo.id == dataset.zenodo.id).delete()

            await dataset.delete(link_rule=DeleteRules.DO_NOTHING)

            logger.info(
                f"Dataset {dataset_id} and linked Zenodo/Updates deleted successfully."
            )
            return {"message": "Dataset and linked Zenodo/Updates deleted"}

        logger.info(f"Updating dataset {dataset_id} with fields: {fields}")
        dataset = Dataset.model_copy(dataset, update=fields)
        await dataset.save()

        logger.info(
            f"Dataset {dataset_id} updated successfully by user {user.id}")
        return dataset

    except Exception:
        logger.exception(
            f"Error updating dataset {dataset_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the dataset")
