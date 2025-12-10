"""Tool router."""

import re
from fastapi import APIRouter, HTTPException, Depends, Query, status
from models.tool import Tool, ToolPatch
from models.user import User
from models.zenodo import Zenodo
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data
from typing import List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/tool", tags=["Tool"])


@router.get("", status_code=200, response_model=list[Tool])
async def get_all_tools(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(None),
        scope: Optional[List[str]] = Query(None),
        assessment: Optional[List[str]] = Query(None),
        geographical_coverage: Optional[List[str]] = Query(None),
        tag: Optional[List[str]] = Query(None),
        language: Optional[List[str]] = Query(None),
        access_right: Optional[List[str]] = Query(None),
        assessment_values: Optional[List[str]] = Query(None),
        evidence_types: Optional[List[str]] = Query(None),
        covered_fields: Optional[List[str]] = Query(None),
        covered_research_products: Optional[List[str]] = Query(None),
        graspos: Optional[bool] = Query(None),
        trl: Optional[List[str]] = Query(None),
        assessment_functionalities: Optional[List[str]] = Query(None),
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

    # Language filter
    if language:
        filters.append({"zenodo.metadata.language": {"$in": language}})

    # Access right filtering
    if access_right:
        filters.append({"zenodo.metadata.access_right": {"$in": access_right}})

    # License filter
    if license:
        filters.append({"zenodo.metadata.license.id": {"$in": license}})

    # Scope filter
    if scope:
        scope_ids = [PydanticObjectId(s) for s in scope]
        filters.append({"scopes._id": {"$in": scope_ids}})

    # Assessment filtering
    if assessment:
        assessment_ids = [PydanticObjectId(s) for s in assessment]
        filters.append({"assessments._id": {"$in": assessment_ids}})

    # TRL filter
    if trl:
        trl_cleaned = [re.sub(r"^\d+ - ", "", str(s)) for s in trl]
        filters.append({"trl.european_description": {"$in": trl_cleaned}})

    # Assessment values filtering
    if assessment_values:
        filters.append({"assessment_values": {"$in": assessment_values}})

    # Evidence types filtering
    if evidence_types:
        filters.append({"evidence_types": {"$in": evidence_types}})

    # Covered fields filtering
    if covered_fields:
        filters.append({"covered_fields": {"$in": covered_fields}})

    # Covered research products filtering
    if covered_research_products:
        filters.append(
            {"covered_research_products": {
                "$in": covered_research_products
            }})

    # Assessment Functionalities filter
    if assessment_functionalities:
        filters.append({
            "assessment_functionalities": {
                "$in": assessment_functionalities
            }
        })

    # Geographical Coverage filtering
    if geographical_coverage:
        geographical_coverage_ids = [
            PydanticObjectId(s) for s in geographical_coverage
        ]
        filters.append(
            {"geographical_coverage._id": {
                "$in": geographical_coverage_ids
            }})

    # GraspOS funded filtering - match with url https://cordis.europa.eu/projects/101095129 or with word graspos in lowercase in acronym
    if graspos:
        filters.append({
            "$or": [
                {
                    "zenodo.metadata.grants.url": {
                        "$in": [
                            "https://cordis.europa.eu/projects/101095129",
                            "http://cordis.europa.eu/projects/101095129"
                        ]
                    }
                },
                {
                    # lowercase match for acronym containing "graspos"
                    "zenodo.metadata.grants.acronym": {
                        "$regex": "graspos",
                        "$options": "i"  # i = case-insensitive
                    }
                }
            ]
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
        if sort_field == "citations":
            zenodo_sort_field = "zenodo.indicators.citationImpact.citationCount"
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

    data = await get_zenodo_data(tool.source)
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
async def get_unique_metadata_values(
        field: str = Query(...,
                           description="Field name inside zenodo.metadata"),
        scope: str = Query(...,
                           description="Field name inside zenodo.metadata")):
    """
    Return unique values from the given field in Zenodo metadata across all tools.
    """
    try:
        if scope == "local":
            unique_values = await Tool.get_unique_field_values(field)
        else:
            unique_values = await Tool.get_unique_field_values_from_zenodo(
                field)
        return {f"unique_{field}": unique_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{tool_id}", responses={404: {"detail": "Tool does not exist"}})
async def get_tool(tool_id: PydanticObjectId):

    tool = await Tool.get(tool_id, fetch_links=True)

    if not tool:

        raise HTTPException(status_code=404, detail="Tool does not exist")

    return tool


@router.delete("/{tool_id}", status_code=status.HTTP_200_OK)
async def delete_tool(tool_id: PydanticObjectId,
                      user: User = Depends(current_user_mandatory)):
    """
    Delete a tool by its ID, along with its related Zenodo record and updates.
    Does not cascade delete unrelated links.
    """
    logger.info(f"User {user.id} requested deletion of tool {tool_id}")

    tool = await Tool.find_one(Tool.id == tool_id, fetch_links=True)

    if not tool:
        logger.warning(f"Dataset {tool_id} not found for user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Dataset not found")

    try:
        # Delete linked Zenodo and associated updates
        if tool.zenodo:
            logger.info(
                f"Deleting linked Zenodo {tool.zenodo.id} and related updates")
            await Update.find(zenodo_id=tool.zenodo.id).delete()
            await Zenodo.find(Zenodo.id == tool.zenodo.id).delete()

        # Delete tool without deleting other linked objects
        await tool.delete(link_rule=DeleteRules.DO_NOTHING)

        logger.info(
            f"Dataset {tool_id} deleted successfully by user {user.id}")
        return {"message": "Dataset deleted successfully"}

    except Exception as e:
        logger.exception(f"Error deleting tool {tool_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the tool")


@router.patch("/{tool_id}", status_code=status.HTTP_200_OK)
async def update_tool(
    update: ToolPatch,
    tool_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> ToolPatch:
    """
    Update an existing tool by ID.
    If `approved=False`, delete the tool and its linked Zenodo and Update tools.
    Otherwise, update the tool with the provided fields.
    """
    logger.info(f"User {user.id} requested update on tool {tool_id}")

    tool = await Tool.find_one(Tool.id == tool_id, fetch_links=True)

    if not tool:
        logger.warning(
            f"Tool {tool_id} not found for update by user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tool not found")

    try:
        fields = update.model_dump(exclude_unset=True)

        if "approved" in fields and not fields["approved"]:
            logger.info(
                f"Tool {tool_id} marked as unapproved. Deleting tool and linked Zenodo and updates."
            )

            if tool.zenodo:
                logger.info(
                    f"Deleting linked Zenodo {tool.zenodo.id} and related updates."
                )
                await Update.find(zenodo_id=tool.zenodo.id).delete()
                await Zenodo.find(Zenodo.id == tool.zenodo.id).delete()

            await tool.delete(link_rule=DeleteRules.DO_NOTHING)

            logger.info(
                f"Tool {tool_id} and linked Zenodo/Updates deleted successfully."
            )
            return {"message": "Tool and linked Zenodo/Updates deleted"}

        logger.info(f"Updating tool {tool_id} with fields: {fields}")
        tool = Tool.model_copy(tool, update=fields)
        await tool.save()

        logger.info(f"Tool {tool_id} updated successfully by user {user.id}")
        return tool

    except Exception:
        logger.exception(f"Error updating tool {tool_id} for user {user.id}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while updating the tool")
