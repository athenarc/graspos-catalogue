"""Zenodo router."""

from fastapi import APIRouter, HTTPException, Depends, Request
from models.openaire import OpenAIRE
from util.update_records import update_openaire_records, update_zenodo_records
from models.zenodo import Zenodo
from models.user import User
from models.update import Update
from jwt import access_security
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/update", tags=["Update"])


@router.get("", status_code=200)
async def get_all_update_records(user: User = Depends(current_user)) -> list[Update]:

    records = await Update.find(fetch_links=True).to_list()
    return records



@router.post("/update", status_code=200)
async def update_all_zenodo_records(
    zenodo: Zenodo | None = None,      
    openaire: OpenAIRE | None = None,
    user: User = Depends(current_user_mandatory)):
 
    if zenodo:
        return await update_zenodo_records(user_id=user.id, zenodo_id=zenodo.id)

    if openaire:
        return await update_openaire_records(user_id=user.id, openaire_id=openaire.id)

    return await update_openaire_records(user_id=user.id, openaire_id=None) and await update_zenodo_records(user_id=user.id, zenodo_id=None)