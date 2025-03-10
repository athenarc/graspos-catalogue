"""Zenodo router."""

from fastapi import APIRouter, HTTPException, Depends
from models.zenodo import Zenodo
from models.user import User
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user
from util.requests import get_zenodo_data

router = APIRouter(prefix="/api/v1/zenodo", tags=["Zenodo"])


@router.get("/", status_code=200, response_model=list[Zenodo])
async def get_all_zenodo_records() -> list[Zenodo]:

    records = await Zenodo.find_all().to_list()
    return records


@router.get("/search", status_code=200, response_model=Zenodo)
async def get_all_zenodo_records(source: str):

    try:
       zenodo = Zenodo(source=source)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) 
        
    await zenodo.create()
    return zenodo