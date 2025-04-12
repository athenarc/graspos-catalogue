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

router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])


@router.get("", status_code=200, response_model=list[Dataset])
async def get_all_datasets(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(
            None),  # Optional list of licenses filter
        graspos: Optional[bool] = Query(None)) -> list[Dataset]:
    # Start building the search query
    search = {}

    if user:
        if user.super_user:
            # If user is a super user, fetch all datasets (no 'approved' filter applied)
            datasets = await Dataset.find_all(fetch_links=True).to_list()
        else:
            # Apply 'approved' filter for non-superusers
            search["$or"] = [{"approved": True}]
            search["$or"].append(
                {"owner": user.id})  # Include user-owned datasets if logged in

    # If licenses are provided, add a filter for licenses
    if license:
        # Match datasets where the 'zenodo.metadata.license.id' is in the provided list of licenses
        search["$or"] = search.get("$or", [])
        search["$or"].append({"zenodo.metadata.license.id": {"$in": license}})

    if graspos:

        search["$and"] = search.get("$and", [])
        search["$and"].append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    # Fetch datasets based on the search query
    datasets = await Dataset.find(search, fetch_links=True).to_list()

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


@router.get("/licenses")
async def get_licenses():
    unique_licenses = await Dataset.get_unique_licenses_from_zenodo()
    return {"unique_licenses": unique_licenses}


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
        await dataset.delete()
    else:
        dataset = Dataset.model_copy(dataset, update=fields)
        await dataset.save()

    return dataset
