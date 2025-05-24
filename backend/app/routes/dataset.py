"""Dataset router."""

from fastapi import APIRouter, HTTPException, Depends, Query
from models.dataset import Dataset, DatasetPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional
from datetime import datetime
from bson import DBRef, ObjectId

router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])

from fastapi import HTTPException


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


@router.delete("/{dataset_id}", status_code=200)
async def delete_dataset(dataset_id: PydanticObjectId,
                         user: User = Depends(current_user_mandatory)):

    dataset_to_delete = await Dataset.find_one(Dataset.id == dataset_id,
                                               fetch_links=True)

    if not dataset_to_delete:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    await dataset_to_delete.delete(link_rule=DeleteRules.DELETE_LINKS)
    await Update.find(zenodo_id=dataset_to_delete.zenodo.id).delete()
    return {"message": "Dataset deleted successfully"}


@router.patch("/{dataset_id}", status_code=200)
async def update_dataset(
    update: DatasetPatch,
    dataset_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> DatasetPatch:

    dataset = await Dataset.get(dataset_id)

    if not dataset:
        return HTTPException(status_code=404, detail="Dataset does not exist")

    fields = update.model_dump(exclude_unset=True)

    if "approved" in fields and not fields["approved"]:
        await dataset.delete(link_rule=DeleteRules.DELETE_LINKS)
    else:
        dataset = Dataset.model_copy(dataset, update=fields)
        await dataset.save()

    return dataset
