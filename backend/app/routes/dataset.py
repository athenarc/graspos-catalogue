"""Dataset router."""

from fastapi import APIRouter, HTTPException, Depends
from models.dataset import Dataset, DatasetPatch
from models.user import User
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])


@router.get("/", status_code=200, response_model=list[Dataset])
async def get_all_datasets(user: User | None = None) -> list[Dataset]:
    if user and user.super_user:
        datasets = await Dataset.find_all().to_list()
    else:
        datasets = await Dataset.find(Dataset.approved == True).to_list()

    return datasets


@router.post("/", status_code=201)
async def create_dataset(
    # https://zenodo.org/api/records/14582029
    dataset: Dataset,
    user: User = Depends(current_user)
) -> Dataset:
    dataset.owner = user.id
    if user.super_user:
        dataset.approved = True
    await dataset.create()
    return dataset


@router.get("/{dataset_id}",
            responses={404: {
                "detail": "Dataset does not exist"
            }})
async def get_dataset(dataset_id: PydanticObjectId) -> Dataset:

    dataset = await Dataset.get(dataset_id)

    if not dataset:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    return dataset


@router.delete("/{dataset_id}", status_code=204)
async def delete_dataset(dataset_id: PydanticObjectId,
                         user: User = Depends(current_user)):

    dataset_to_delete = await Dataset.get(dataset_id)

    if not dataset_to_delete:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    await dataset_to_delete.delete()
    return {"message": "Dataset successfully deleted"}


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
