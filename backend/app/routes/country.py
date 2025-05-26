"""API router for managing Scope resources."""

from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional
from models.shared import GeographicalCoverage
from models.user import User
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/country", tags=["Country"])


@router.get("", response_model=List[GeographicalCoverage], status_code=status.HTTP_200_OK)
async def get_all_countries(
        user: Optional[User] = Depends(current_user),
        scopes: Optional[List[str]] = Query(None),
) -> List[GeographicalCoverage]:
    """
    Retrieve all countries
    """
    query = {}
    return await GeographicalCoverage.find(query).to_list()

