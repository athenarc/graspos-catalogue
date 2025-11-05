"""API router for managing Scope resources."""

from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional
from models.shared import GeographicalCoverage, GeoCoverageWithCount
from models.user import User
from models.dataset import Dataset
from models.tool import Tool
from models.document import Documents
from models.service import Service
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/country", tags=["Country"])


@router.get("/geographical-coverage-with-count",
            response_model=List[GeoCoverageWithCount])
async def get_geographical_coverage_with_count(
        user: Optional[User] = Depends(current_user)):
    match_stage = {"$match": {"approved": True}}
    pipeline = [
        match_stage if user is None or not user.super_user else {
            "$match": {}
        }, {
            "$unwind": "$geographical_coverage"
        }, {
            "$group": {
                "_id": "$geographical_coverage",
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
            geo_id = str(item["_id"].id)
            counts[geo_id] = counts.get(geo_id, 0) + int(item["count"])

    merge_counts(agg_datasets)
    merge_counts(agg_tools)
    merge_counts(agg_documents)
    merge_counts(agg_services)

    countries = await GeographicalCoverage.find_all().to_list()

    data = []
    for country in countries:
        count = counts.get(str(country.id), 0)
        data.append(
            GeoCoverageWithCount(id=str(country.id),
                                 code=country.code,
                                 label=country.label,
                                 flag=country.flag,
                                 resource_count=count,
                                 lat=country.lat,
                                 lng=country.lng))

    data.sort(key=lambda x: x.resource_count, reverse=True)
    return data


@router.get("",
            response_model=List[GeographicalCoverage],
            status_code=status.HTTP_200_OK)
async def get_all_countries(
        user: Optional[User] = Depends(current_user),
        scopes: Optional[List[str]] = Query(None),
) -> List[GeographicalCoverage]:
    """
    Retrieve all countries
    """
    query = {}
    return await GeographicalCoverage.find(query).to_list()
