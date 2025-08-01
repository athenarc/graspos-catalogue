"""Zenodo router."""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional
from models.zenodo import Zenodo, ZenodoView, ZenodoUpdate
from models.user import User
from models.dataset import Dataset
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from util.update_zenodo import update_records

router = APIRouter(prefix="/api/v1/zenodo", tags=["Zenodo"])


@router.get("/", status_code=200)
async def get_all_zenodo_records():

    records = await Zenodo.find().to_list()
    return records


@router.post("/update", status_code=200)
async def update_all_zenodo_records(
    zenodo: Zenodo | None = None,
    user: User = Depends(current_user_mandatory)):
 
    if zenodo:
        return await update_records(user_id=user.id, zenodo_id=zenodo.id)

    return await update_records(user_id=user.id, zenodo_id=None)


@router.post("/search", status_code=200)
async def post_zenodo_records(dataset: Dataset) -> Zenodo:

    zenodo = await Zenodo.find_one(Zenodo.source == dataset.source)

    if zenodo:
        raise HTTPException(status_code=409, detail="Resource already exists")

    try:
        data = await get_zenodo_data(dataset.source)
        if data["status"] != 200:
            raise HTTPException(status_code=data["status"],
                                detail=data["detail"])

        zenodo = Zenodo(**data["zenodo_object"])

    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))

    return zenodo


@router.get("/licenses")
async def get_licenses():
    unique_licenses = await Zenodo.get_unique_licenses()
    return {"unique_licenses": unique_licenses}


@router.get("/{zenodo_id}",
            responses={404: {
                "detail": "Dataset does not exist"
            }})
async def get_zenodo(
    zenodo_id: PydanticObjectId, user: User = Depends(current_user)) -> Zenodo:

    zenodo = await Zenodo.get(zenodo_id)

    if not zenodo:

        return HTTPException(status_code=404,
                             detail="Zenodo data does not exist")

    return zenodo


@router.delete("/{zenodo_id}", status_code=200)
async def delete_zenodo(zenodo_id: str, user: User = Depends(current_user)):

    zenodo = await Zenodo.find_one(Zenodo.id == PydanticObjectId(zenodo_id))

    if not zenodo:

        return HTTPException(status_code=404,
                             detail="Zenodo data does not exist")

    await Zenodo.find_one(Zenodo.id == PydanticObjectId(zenodo_id)).delete()
    return {"message": "Zenodo deleted successfully"}
