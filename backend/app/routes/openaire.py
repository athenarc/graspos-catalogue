from fastapi import APIRouter, HTTPException, Depends
from beanie import PydanticObjectId
from models.service import Service
from models.openaire import OpenAIRE
from models.dataset import Dataset
from models.user import User
from util.current_user import current_user_mandatory
from util.requests import get_openaire_data
import httpx
from util.url_transformer import transform_openaire_url

router = APIRouter(prefix="/api/v1/openaire", tags=["OpenAIRE"])


@router.get("/", status_code=200)
async def get_all_openaire_records():
    return await OpenAIRE.find_all().to_list()


@router.post("/search", status_code=200)
async def fetch_openaire_from_url(service: Service):
    """Fetch OpenAIRE metadata from a given URL or DOI.
    
    Returns:
        OpenAIRE object with metadata.
    """
    openaire = await OpenAIRE.find_one(OpenAIRE.source == service.source)
    if openaire:
        raise HTTPException(status_code=409, detail="Resource already exists")

    try:
        data = await get_openaire_data(service.source)
        if data["status"] != 200:
            raise HTTPException(status_code=data["status"],
                                detail=data["detail"])

        openaire = OpenAIRE(**data["openaire_object"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return openaire

    # # Fetch from the API
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(transformed_url)
    #     if response.status_code != 200:
    #         raise HTTPException(status_code=response.status_code, detail="Could not fetch data")
    #     data = response.json()

    # # Check if the resource already exists
    # existing = await OpenAIRE.find_one(OpenAIRE.metadata.id == data.get("id"))
    # if existing:
    #     raise HTTPException(status_code=409, detail="Resource already exists")

    # # Create a new record
    # openaire = OpenAIRE(source=dataset.source, metadata=data)

    # return openaire

    # except HTTPException:
    #     raise
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
