"""Zenodo router."""

from fastapi import APIRouter, HTTPException, Depends, Request
from models.zenodo import Zenodo, ZenodoView, ZenodoUpdate
from models.user import User
from models.update import Update
from models.dataset import Dataset
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/update", tags=["Update"])


@router.get("", status_code=200)
async def get_all_update_zenodo_records(user: User = Depends(current_user)) -> list[Update]:

    records = await Update.find(fetch_links=True).to_list()
    return records
