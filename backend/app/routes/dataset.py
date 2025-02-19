"""Dataset router."""

from fastapi import APIRouter, HTTPException
from models.dataset import Dataset
from beanie import PydanticObjectId

router = APIRouter(prefix="/api/v1/dataset", tags=["Dataset"])


@router.get("/", status_code=200)
async def get_all_datasets() -> list[Dataset]:
    datasets = await Dataset.find_all().to_list()
    return datasets


@router.post("/", status_code=201)
async def create_dataset(dataset: Dataset) -> Dataset:
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
async def delete_dataset(dataset_id: PydanticObjectId):
    dataset_to_delete = await Dataset.get(dataset_id)

    if not dataset_to_delete:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    await dataset_to_delete.delete()
    return {"message": "Dataset successfully deleted"}

@router.put("/{dataset_id}", status_code=200)
async def update_dataset(dataset: Dataset, dataset_id: PydanticObjectId) -> Dataset:
    
    dataset_to_update = await Dataset.get(dataset_id)

    if not dataset:

        return HTTPException(status_code=404, detail="Dataset does not exist")

    dataset_to_update.name = dataset.name
    dataset_to_update.description = dataset.description
    dataset_to_update.tags = dataset.tags
    
    await dataset_to_update.save()
     
    return dataset_to_update
