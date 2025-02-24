"""Resource router."""

from fastapi import APIRouter, HTTPException, Depends
from models.resource import Resource, ResourcePatch
from models.user import User
from beanie import PydanticObjectId
from jwt import access_security
from util.current_user import current_user

router = APIRouter(prefix="/api/v1/resource", tags=["Resource"])


@router.get("/", status_code=200, response_model=list[Resource])
async def get_all_resources(user: User = Depends(
    current_user)) -> list[Resource]:
    if user.super_user:
        resources = await Resource.find_all().to_list()
    else:
        resources = await Resource.find(Resource.approved == True).to_list()

    return resources


@router.post("/", status_code=201)
async def create_resource(
    # https://zenodo.org/api/records/14582029
    resource: Resource,
    user: User = Depends(current_user)
) -> Resource:
    resource.owner = user.id
    if user.super_user:
        resource.approved = True
    await resource.create()
    return resource


@router.get("/{resource_id}",
            responses={404: {
                "detail": "Resource does not exist"
            }})
async def get_resource(resource_id: PydanticObjectId) -> Resource:

    resource = await Resource.get(resource_id)

    if not resource:

        return HTTPException(status_code=404, detail="Resource does not exist")

    return resource


@router.delete("/{resource_id}", status_code=204)
async def delete_resource(resource_id: PydanticObjectId):
    resource_to_delete = await Resource.get(resource_id)

    if not resource_to_delete:

        return HTTPException(status_code=404, detail="Resource does not exist")

    await resource_to_delete.delete()
    return {"message": "Resource successfully deleted"}


@router.patch("/{resource_id}", status_code=200)
async def update_resource(update: ResourcePatch,
                         resource_id: PydanticObjectId) -> ResourcePatch:

    resource = await Resource.get(resource_id)

    if not resource:
        return HTTPException(status_code=404, detail="Resource does not exist")

    fields = update.model_dump(exclude_unset=True)

    if "approved" in fields and not fields["approved"]:
        await resource.delete()
    else:
        resource = Resource.model_copy(resource, update=fields)
        await resource.save()

    return resource
