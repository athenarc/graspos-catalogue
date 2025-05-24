"""Tool router."""

from fastapi import APIRouter, HTTPException, Depends, Query
from models.tool import Tool, ToolPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/v1/tool", tags=["Tool"])


@router.get("", status_code=200, response_model=list[Tool])
async def get_all_tools(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(None),
        scope: Optional[List[str]] = Query(None),
        tag: Optional[List[str]] = Query(None),
        graspos: Optional[bool] = Query(None),
        sort_field: Optional[str] = Query(None),
        sort_direction: Optional[str] = Query(None),
        start: Optional[str] = Query(None),
        end: Optional[str] = Query(None),
        text: Optional[str] = Query(None),
) -> list[Tool]:

    filters = []

    # User access filter
    if user:
        if not user.super_user:
            filters.append({"$or": [{"approved": True}, {"owner": user.id}]})
        else:
            # super_user: no filters, fetch all
            pass
    else:
        filters.append({"approved": True})

    # Tag filter
    if tag:
        filters.append({"zenodo.metadata.keywords": {"$in": tag}})

    # License filter
    if license:
        filters.append({"zenodo.metadata.license.id": {"$in": license}})

    # Scope filter - convert strings to ObjectId if needed
    if scope:
        try:
            scope_ids = [PydanticObjectId(s) for s in scope]
        except Exception:
            # fallback if scope ids are not ObjectId strings
            scope_ids = scope
        filters.append({"scope.id": {"$in": scope_ids}})

    # GraspOS communities filter
    if graspos:
        filters.append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    # Date range filters
    if start:
        start_date = datetime.fromisoformat(start)
        filters.append(
            {"zenodo.metadata.publication_date": {
                "$gte": start_date
            }})

    if end:
        end_date = datetime.fromisoformat(end)
        filters.append(
            {"zenodo.metadata.publication_date": {
                "$lte": end_date
            }})

    # Full text search on Zenodo
    if text:
        zenodo_search_results = await Zenodo.find({
            "$text": {
                "$search": text
            }
        }).to_list()
        zenodo_ids = [PydanticObjectId(z.id) for z in zenodo_search_results]
        if zenodo_ids:
            filters.append({"zenodo._id": {"$in": zenodo_ids}})
        else:
            # No results match text search → return empty list early
            return []

    # Compose final query filter
    if len(filters) == 1:
        query_filter = filters[0]
    elif filters:
        query_filter = {"$and": filters}
    else:
        query_filter = {}

    # Sorting
    if sort_field and sort_direction:
        zenodo_sort_field = "zenodo.stats." + sort_field
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == "asc" else -1
        tools = await Tool.find(query_filter, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
        tools = await Tool.find(query_filter, fetch_links=True).to_list()

    return tools


@router.post("/create", status_code=201)
async def create_tool(tool: Tool,
                      user: User = Depends(current_user_mandatory)):
    zenodo = None
    try:
        zenodo = Zenodo(source=tool.source)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    data = get_zenodo_data(tool.source)
    if data["status"] != 200:
        raise HTTPException(status_code=data["status"], detail=data["detail"])
    zenodo = Zenodo(**data["zenodo_object"])
    await zenodo.create()
    tool.zenodo = zenodo
    tool.owner = user.id
    if user.super_user:
        tool.approved = True
    await tool.create()
    return tool


@router.get("/fields/unique")
async def get_unique_metadata_values(field: str = Query(
    ..., description="Field name inside zenodo.metadata")):
    """
    Return unique values from the given field in Zenodo metadata across all tools.
    """
    try:
        unique_values = await Tool.get_unique_field_values_from_zenodo(field)
        return {f"unique_{field}": unique_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{tool_id}", responses={404: {"detail": "Tool does not exist"}})
async def get_tool(tool_id: PydanticObjectId) -> Tool:

    tool = await Tool.get(tool_id, fetch_links=True)

    if not tool:

        return HTTPException(status_code=404, detail="Tool does not exist")

    return tool


@router.delete("/{tool_id}", status_code=204)
async def delete_tool(tool_id: PydanticObjectId,
                      user: User = Depends(current_user_mandatory)):

    tool_to_delete = await Tool.get(tool_id, fetch_links=True)

    if not tool_to_delete:

        return HTTPException(status_code=404, detail="Tool does not exist")

    await tool_to_delete.delete(link_rule=DeleteRules.DELETE_LINKS)
    await Update.find(zenodo_id=tool_to_delete.zenodo.id).delete()
    return {"message": "Tool successfully deleted"}


@router.patch("/{tool_id}", status_code=200)
async def update_tool(
    update: ToolPatch,
    tool_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> ToolPatch:

    tool = await Tool.get(tool_id)

    if not tool:
        return HTTPException(status_code=404, detail="Tool does not exist")

    fields = update.model_dump(exclude_unset=True)

    if "approved" in fields and not fields["approved"]:
        await tool.delete(link_rule=DeleteRules.DELETE_LINKS)
    else:
        tool = Tool.model_copy(tool, update=fields)
        await tool.save()

    return tool
