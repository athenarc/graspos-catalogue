"""API router for managing Assessment resources."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime

from beanie import PydanticObjectId

from models.assessment import Assessment, AssessmentCreate, AssessmentView, AssessmentPatch
from models.user import User
from util.current_user import current_user, current_user_mandatory

router = APIRouter(prefix="/api/v1/assessment", tags=["Assessment"])


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
