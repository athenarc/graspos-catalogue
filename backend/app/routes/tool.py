"""Tool router."""

from fastapi import APIRouter, HTTPException, Depends, Query
from models.tool import Tool, ToolPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from typing import Annotated
from util.requests import get_zenodo_data
from typing import List, Optional

router = APIRouter(prefix="/api/v1/tool", tags=["Tool"])


@router.get("", status_code=200, response_model=list[Tool])
async def get_all_datasets(user: Optional[User] = Depends(current_user),
                           license: Optional[List[str]] = Query(None),
                           graspos: Optional[bool] = Query(None),
                           sort_field: Optional[str] = Query(None),
                           sort_direction: Optional[str] = Query(
                               None)) -> list[Tool]:
    search = {}

    if user:
        if user.super_user:
            tools = await Tool.find_all(fetch_links=True).to_list()
        else:
            search["$or"] = [{"approved": True}]
            search["$or"].append({"owner": user.id})

    if license:
        search["$or"] = search.get("$or", [])
        search["$or"].append({"zenodo.metadata.license.id": {"$in": license}})

    if graspos:
        search["$and"] = search.get("$and", [])
        search["$and"].append({
            "zenodo.metadata.communities.id": {
                "$in": ["graspos-tools", "graspos-datasets"]
            }
        })

    if sort_field and sort_direction:
        zenodo_sort_field = "zenodo.stats." + sort_field
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == 'asc' else -1
        tools = await Tool.find(search, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
        tools = await Tool.find(search, fetch_links=True).to_list()

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


@router.get("/licenses")
async def get_licenses():
    unique_licenses = await Tool.get_unique_licenses_from_zenodo()
    return {"unique_licenses": unique_licenses}


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
        await tool.delete()
    else:
        tool = Tool.model_copy(tool, update=fields)
        await tool.save()

    return tool
