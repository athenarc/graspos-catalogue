"""Dataset router."""

from fastapi import APIRouter, HTTPException, Depends
from models.dataset import Dataset, DatasetPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from jwt import access_security
from util.current_user import current_user
from util.requests import get_zenodo_data

router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])


@router.get("", status_code=200, response_model=list[Dataset])
async def get_all_datasets(user: User | None = Depends(current_user)) -> list[Dataset]:

    if user and user.super_user:  # Validate only if user exists
        datasets = await Dataset.find_all(fetch_links=True).to_list()
    else:
        search = {"$or": [{"approved": True}]}
        if user:
            search["$or"].append(
                {"owner": user.id})  # Include user-owned datasets if logged in

        datasets = await Dataset.find(search, fetch_links=True).to_list()

    return datasets


@router.post("/create", status_code=201)
async def create_dataset(dataset: Dataset, user: User = Depends(current_user)):
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
async def delete_dataset(dataset_id: PydanticObjectId):

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
    user: User = Depends(current_user)
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
