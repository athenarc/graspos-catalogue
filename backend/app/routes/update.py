"""Zenodo router."""

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Depends, Request
from models.openaire import OpenAIRE
from util.update_records import update_openaire_records, update_zenodo_records
from models.zenodo import Zenodo
from models.user import User
from models.update import Update, UpdateRequest
from jwt import access_security
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/update", tags=["Update"])


@router.get("", status_code=200)
async def get_all_update_records(user: User = Depends(
    current_user)) -> list[Update]:

    records = await Update.find(fetch_links=True).to_list()
    return records


@router.post("/update", status_code=200)
async def update_all_resources(body: UpdateRequest,
                               user: User = Depends(current_user_mandatory)):
    """Update all resources or specific ones based on IDs.
    If both IDs are provided, both resources will be updated.
    If no IDs are provided, all resources will be updated.
    """

    zenodo_id = body.zenodo_id
    openaire_id = body.openaire_id

    if zenodo_id:
        return await update_zenodo_records(user_id=user.id,
                                           zenodo_id=zenodo_id)

    if openaire_id:
        return await update_openaire_records(user_id=user.id,
                                             openaire_id=openaire_id)

    return {
        "openaire":
        await update_openaire_records(user_id=user.id, openaire_id=None),
        "zenodo":
        await update_zenodo_records(user_id=user.id, zenodo_id=None)
    }
