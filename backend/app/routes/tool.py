"""Tool router."""

from fastapi import APIRouter, HTTPException, Depends
from models.tool import Tool, ToolPatch
from models.user import User
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user
from typing import Annotated

router = APIRouter(prefix="/api/v1/tool", tags=["Tool"])


@router.get("/", status_code=200, response_model=list[Tool])
async def get_all_tools() -> list[Tool]:

    tools = await Tool.find(Tool.approved == True).to_list()
    return tools


@router.get("/admin", status_code=200, response_model=list[Tool])
async def get_all_tools_admin(user: User = Depends(
    current_user)) -> list[Tool]:

    if user.super_user:
        tools = await Tool.find_all().to_list()
    else:
        search = {"$or": [{"approved": {True}}, {"owner": user.id}]}
        tools = await Tool.find(search).to_list()

    return tools


@router.post("/", status_code=201)
async def create_tool(tool: Tool, user: User = Depends(current_user)):

    url_validation = tool.get_data(tool.source)

    if url_validation["status"] is not 200:
        raise HTTPException(status_code=url_validation["status"],
                            detail=url_validation["detail"])

    tool = tool.update_from_zenodo(url_validation["resource"])
    tool.owner = user.id
    if user.super_user:
        tool.approved = True
    await tool.create()
    return tool


@router.get("/{tool_id}", responses={404: {"detail": "Tool does not exist"}})
async def get_tool(tool_id: PydanticObjectId) -> Tool:

    tool = await Tool.get(tool_id)

    if not tool:

        return HTTPException(status_code=404, detail="Tool does not exist")

    return tool


@router.delete("/{tool_id}", status_code=204)
async def delete_tool(tool_id: PydanticObjectId,
                      user: User = Depends(current_user)):

    tool_to_delete = await Tool.get(tool_id)

    if not tool_to_delete:

        return HTTPException(status_code=404, detail="Tool does not exist")

    await tool_to_delete.delete()
    return {"message": "Tool successfully deleted"}


@router.patch("/{tool_id}", status_code=200)
async def update_tool(
    update: ToolPatch,
    tool_id: PydanticObjectId,
    user: User = Depends(current_user)) -> ToolPatch:

    tool = await Tool.get(tool_id)

    if not tool:
        return HTTPException(status_code=404, detail="Tool does not exist")

    fields = update.model_dump(exclude_unset=True)
    print(fields)
    if "approved" in fields and not fields["approved"]:
        await tool.delete()
    else:
        tool = Tool.model_copy(tool, update=fields)
        await tool.save()

    return tool
