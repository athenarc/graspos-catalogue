"""API router for managing Scope resources."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime

from beanie import PydanticObjectId

from models.dataset import Dataset
from models.document import Documents
from models.service import Service
from models.tool import Tool
from models.scope import Scope, ScopeCreate, ScopeView, ScopePatch
from models.user import User
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/scope", tags=["Scope"])


@router.get("/scopes-with-count", response_model=List[ScopeView])
async def get_scopes_with_count():

    pipeline = [{
        "$match": {
            "approved": True
        }
    }, {
        "$unwind": "$scopes"
    }, {
        "$group": {
            "_id": "$scopes",
            "count": {
                "$sum": 1
            }
        }
    }]

    agg_datasets = await Dataset.get_motor_collection().aggregate(
        pipeline).to_list(None)

    agg_tools = await Tool.get_motor_collection().aggregate(pipeline).to_list(
        None)

    agg_documents = await Documents.get_motor_collection().aggregate(
        pipeline).to_list(None)

    agg_services = await Service.get_motor_collection().aggregate(
        pipeline).to_list(None)

    counts = {}

    def merge_counts(agg_results):
        for item in agg_results:
            # _id είναι DBRef - παίρνουμε το id
            scope_id = str(item["_id"].id)
            counts[scope_id] = counts.get(scope_id, 0) + int(item["count"])

    merge_counts(agg_datasets)
    merge_counts(agg_tools)
    merge_counts(agg_documents)
    merge_counts(agg_services)

    scopes = await Scope.find_all().to_list()

    data = []
    for scope in scopes:
        count = counts.get(str(scope.id), 0)
        data.append(
            ScopeView(id=str(scope.id),
                      name=scope.name,
                      description=scope.description,
                      bg_color=scope.bg_color,
                      usage_count=count))

    data.sort(key=lambda x: x.usage_count, reverse=True)
    return data


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
