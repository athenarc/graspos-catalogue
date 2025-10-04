"""API router for managing Scope resources."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional

from beanie import PydanticObjectId

from models.trl import TRLEntry
from models.user import User
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/trl", tags=["TRL"])


@router.get("", response_model=List[TRLEntry], status_code=status.HTTP_200_OK)
async def get_all_trl_entries(
        user: Optional[User] = Depends(current_user),
        scopes: Optional[List[str]] = Query(None),
) -> List[TRLEntry]:
    """
    Retrieve all TRL entries. Optionally filters by a list of TRL entry names.
    """
    query = {}
    if scopes:
        query["name"] = {"$in": scopes}
    return await TRLEntry.find(query, fetch_links=True).to_list()


