"""API router for managing Scope resources."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime

from beanie import PydanticObjectId

from models.scope import Scope, ScopeCreate, ScopeView, ScopePatch
from models.user import User
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/scope", tags=["Scope"])


@router.get("", response_model=List[Scope], status_code=status.HTTP_200_OK)
async def get_all_scopes(
        user: Optional[User] = Depends(current_user),
        scopes: Optional[List[str]] = Query(None),
) -> List[Scope]:
    """
    Retrieve all scopes. Optionally filters by a list of scope names.
    """
    query = {}
    if scopes:
        query["name"] = {"$in": scopes}
    return await Scope.find(query, fetch_links=True).to_list()


@router.post("/create",
             response_model=ScopeView,
             status_code=status.HTTP_201_CREATED)
async def create_scope(
    scope_data: ScopeCreate, user: User = Depends(current_user_mandatory)
) -> ScopeView:
    """
    Create a new scope with the given name and description.
    """
    new_scope = Scope(name=scope_data.name, description=scope_data.description)
    await new_scope.create()
    return new_scope


@router.delete("/{scope_id}", status_code=status.HTTP_200_OK)
async def delete_scope(
        scope_id: PydanticObjectId,
        user: User = Depends(current_user_mandatory),
):
    """
    Delete a scope by its ID.
    """
    scope = await Scope.get(scope_id)
    if not scope:
        raise HTTPException(status_code=404, detail="Scope not found")

    await scope.delete()
    return {"message": "Scope deleted successfully"}


@router.patch("/{scope_id}",
              response_model=ScopeView,
              status_code=status.HTTP_200_OK)
async def update_scope(
    scope_id: PydanticObjectId,
    scope_update: ScopePatch,
) -> ScopeView:
    """
    Update an existing scope with new data.
    """
    scope = await Scope.get(scope_id)
    if not scope:
        raise HTTPException(status_code=404, detail="Scope not found")

    update_data = scope_update.model_dump(exclude_unset=True)
    updated_scope = Scope.model_copy(scope, update=update_data)
    await updated_scope.save()
    return updated_scope
