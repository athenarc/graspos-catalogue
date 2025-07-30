"""Service router."""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from models.service import Service, ServicePatch
from models.user import User
from models.zenodo import Zenodo
from models.openaire import OpenAIRE
from models.update import Update
from beanie import PydanticObjectId, DeleteRules
from util.current_user import current_user, current_user_mandatory
from util.requests import get_zenodo_data, get_openaire_data
from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/service", tags=["Service"])


@router.get("", status_code=200, response_model=list[Service])
async def get_all_services(
        user: Optional[User] = Depends(current_user),
        license: Optional[List[str]] = Query(None),
        scope: Optional[List[str]] = Query(None),
        assessment: Optional[List[str]] = Query(None),
        geographical_coverage: Optional[List[str]] = Query(None),
        tag: Optional[List[str]] = Query(None),
        service_type: Optional[List[str]] = Query(None),
        graspos: Optional[bool] = Query(None),
        sort_field: Optional[str] = Query(None),
        sort_direction: Optional[str] = Query(None),
        start: Optional[str] = Query(None),
        end: Optional[str] = Query(None),
        text: Optional[str] = Query(None),
) -> list[Service]:

    filters = []

    # User access filter
    if user:
        if not user.super_user:
            filters.append({"$or": [{"approved": True}, {"owner": user.id}]})
    else:
        filters.append({"approved": True})

    # License filter
    if license:
        filters.append({"zenodo.metadata.license.id": {"$in": license}})

    # Scope filter - convert to ObjectId if necessary
    if scope:
        scope_ids = [PydanticObjectId(s) for s in scope]
        filters.append({"scopes._id": {"$in": scope_ids}})

    # Assessment filtering
    if assessment:
        assessment_ids = [PydanticObjectId(s) for s in assessment]
        filters.append({"assessments._id": {"$in": assessment_ids}})

    # Geographical Coverage filtering
    if geographical_coverage:
        geographical_coverage_ids = [
            PydanticObjectId(s) for s in geographical_coverage
        ]
        filters.append(
            {"geographical_coverage._id": {
                "$in": geographical_coverage_ids
            }})

    # Tag filter
    if tag:
        filters.append({"zenodo.metadata.keywords": {"$in": tag}})
    
    # Service Type filter
    if service_type:
        filters.append({"service_type": {"$in": service_type}})
        
    # GraspOS verified filter
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

    # Full text search
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
            # If no matching Zenodo results, return empty early
            return []

    # Compose final filter
    if len(filters) == 1:
        query_filter = filters[0]
    elif filters:
        query_filter = {"$and": filters}
    else:
        query_filter = {}

    # Sorting logic
    if sort_field and sort_direction:
        zenodo_sort_field = "zenodo.metadata.stats." + sort_field
        if sort_field == "dates":
            zenodo_sort_field = "zenodo.metadata.publication_date"
        sort_order = 1 if sort_direction.lower() == "asc" else -1
        services = await Service.find(query_filter, fetch_links=True).sort([
            (zenodo_sort_field, sort_order)
        ]).to_list()
    else:
        services = await Service.find(query_filter, fetch_links=True).to_list()
    return services


@router.post("/create", status_code=201)
async def create_service(
    service: Service, user: User = Depends(current_user_mandatory)) -> Service:
    openaire = None
    
    try:
        openaire = OpenAIRE(source=service.source)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    
    data = await get_openaire_data(service.source)
    if data["status"] != 200:
        raise HTTPException(status_code=data["status"], detail=data["detail"])  
    
    openaire = OpenAIRE(**data["openaire_object"])
    await openaire.create()    
    
    service.openaire = openaire
    service.owner = user.id
    if user.super_user:
        service.approved = True
    await service.create()
    return service


@router.get("/fields/unique")
async def get_unique_metadata_values(
    field: str = Query(..., description="Field name inside zenodo.metadata"), 
    scope: str = Query(..., description="Field name inside zenodo.metadata")):
    """
    Return unique values from the given field in Zenodo metadata or the service's metadata across all services.
    """

    try:
        if scope == "local":
            unique_values = await Service.get_unique_field_values(field)
        else:
            unique_values = await Service.get_unique_field_values_from_zenodo(field)
        return {f"unique_{field}": unique_values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{service_id}",
            responses={404: {
                "detail": "Service does not exist"
            }})
async def get_service(service_id: PydanticObjectId) -> Service:

    service = await Service.get(service_id, fetch_links=True)

    if not service:

        return HTTPException(status_code=404, detail="Service does not exist")

    return service


@router.delete("/{service_id}", status_code=status.HTTP_200_OK)
async def delete_service(service_id: PydanticObjectId,
                         user: User = Depends(current_user_mandatory)):
    """
    Delete a service by its ID, along with its related Zenodo record and updates.
    Does not cascade delete unrelated links.
    """
    logger.info(f"User {user.id} requested deletion of service {service_id}")

    service = await Service.find_one(Service.id == service_id,
                                     fetch_links=True)

    if not service:
        logger.warning(f"Service {service_id} not found for user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found")

    try:
        # Delete linked Zenodo and associated updates
        if service.zenodo:
            logger.info(
                f"Deleting linked Zenodo {service.zenodo.id} and related updates"
            )
            await Update.find(zenodo_id=service.zenodo.id).delete()
            await Zenodo.find(Zenodo.id == service.zenodo.id).delete()

        # Delete service without deleting other linked objects
        await service.delete(link_rule=DeleteRules.DO_NOTHING)

        logger.info(
            f"Service {service_id} deleted successfully by user {user.id}")
        return {"message": "Service deleted successfully"}

    except Exception as e:
        logger.exception(
            f"Error deleting service {service_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the service")


@router.patch("/{service_id}", status_code=status.HTTP_200_OK)
async def update_service(
    update: ServicePatch,
    service_id: PydanticObjectId,
    user: User = Depends(current_user_mandatory)
) -> ServicePatch:
    """
    Update an existing service by ID.
    If `approved=False`, delete the service and its linked Zenodo and Update services.
    Otherwise, update the service with the provided fields.
    """
    logger.info(f"User {user.id} requested update on service {service_id}")

    service = await Service.find_one(Service.id == service_id,
                                     fetch_links=True)

    if not service:
        logger.warning(
            f"Service {service_id} not found for update by user {user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found")

    try:
        fields = update.model_dump(exclude_unset=True)

        if "approved" in fields and not fields["approved"]:
            logger.info(
                f"Service {service_id} marked as unapproved. Deleting service and linked Zenodo and updates."
            )

            if service.zenodo:
                logger.info(
                    f"Deleting linked Zenodo {service.zenodo.id} and related updates."
                )
                await Update.find(zenodo_id=service.zenodo.id).delete()
                await Zenodo.find(Zenodo.id == service.zenodo.id).delete()

            await service.delete(link_rule=DeleteRules.DO_NOTHING)

            logger.info(
                f"Service {service_id} and linked Zenodo/Updates deleted successfully."
            )
            return {"message": "Service and linked Zenodo/Updates deleted"}

        logger.info(f"Updating service {service_id} with fields: {fields}")
        service = Service.model_copy(service, update=fields)
        await service.save()

        logger.info(
            f"Service {service_id} updated successfully by user {user.id}")
        return service

    except Exception:
        logger.exception(
            f"Error updating service {service_id} for user {user.id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the service")
