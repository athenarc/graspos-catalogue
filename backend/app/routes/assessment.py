"""API router for managing Assessment resources."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime

from beanie import PydanticObjectId
from models.dataset import Dataset
from models.document import Documents
from models.service import Service
from models.tool import Tool
from models.assessment import Assessment, AssessmentCreate, AssessmentView, AssessmentPatch
from models.user import User
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/assessment", tags=["Assessment"])


@router.get("/assessment-with-count", response_model=List[Assessment])
async def get_assessments_with_count(
        user: Optional[User] = Depends(current_user)):
    match_stage = {"$match": {"approved": True}}
    pipeline = [
        match_stage if user is None or not user.super_user else {
            "$match": {}
        }, {
            "$unwind": "$assessments"
        }, {
            "$group": {
                "_id": "$assessments",
                "count": {
                    "$sum": 1
                }
            }
        }
    ]

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
            assessment_id = str(item["_id"].id)
            counts[assessment_id] = counts.get(assessment_id, 0) + int(
                item["count"])

    merge_counts(agg_datasets)
    merge_counts(agg_tools)
    merge_counts(agg_documents)
    merge_counts(agg_services)

    data = []
    for assessment in await Assessment.find_all().to_list():
        count = counts.get(str(assessment.id), 0)
        data.append(
            Assessment(_id=str(assessment.id),
                       name=assessment.name,
                       description=assessment.description,
                       bg_color=assessment.bg_color,
                       usage_count=count))

    data.sort(key=lambda x: x.usage_count, reverse=True)
    return data


@router.get("",
            response_model=List[Assessment],
            status_code=status.HTTP_200_OK)
async def get_all_assessments(
        user: Optional[User] = Depends(current_user),
        assessments: Optional[List[str]] = Query(None),
) -> List[Assessment]:
    """
    Retrieve all assessments. Optionally filters by a list of assessment names.
    """
    query = {}
    if assessments:
        query["name"] = {"$in": assessments}
    return await Assessment.find(query, fetch_links=True).to_list()


@router.post("/create",
             response_model=AssessmentView,
             status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_data: AssessmentCreate,
    user: User = Depends(current_user_mandatory)
) -> AssessmentView:
    """
    Create a new assessment with the given name and description.
    """
    new_assessment = Assessment(name=assessment_data.name,
                                description=assessment_data.description)
    await new_assessment.create()
    return new_assessment


@router.delete("/{assessment_id}", status_code=status.HTTP_200_OK)
async def delete_assessment(
        assessment_id: PydanticObjectId,
        user: User = Depends(current_user_mandatory),
):
    """
    Delete a assessment by its ID.
    """
    assessment = await Assessment.get(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    await assessment.delete()
    return {"message": "Assessment deleted successfully"}


@router.patch("/{assessment_id}",
              response_model=AssessmentView,
              status_code=status.HTTP_200_OK)
async def update_assessment(
    assessment_id: PydanticObjectId,
    assessment_update: AssessmentPatch,
) -> AssessmentView:
    """
    Update an existing assessment with new data.
    """
    assessment = await Assessment.get(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    update_data = assessment_update.model_dump(exclude_unset=True)
    updated_assessment = Assessment.model_copy(assessment, update=update_data)
    await updated_assessment.save()
    return updated_assessment
