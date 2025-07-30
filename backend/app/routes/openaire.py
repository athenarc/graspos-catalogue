from fastapi import APIRouter, HTTPException, Depends
from beanie import PydanticObjectId
from models.service import Service
from models.openaire import OpenAIRE, OpenAIREMetadata
from models.dataset import Dataset
from models.user import User
from util.current_user import current_user_mandatory
import httpx
from util.url_transformer import transform_openaire_url


router = APIRouter(prefix="/api/v1/openaire", tags=["OpenAIRE"])


@router.get("/", status_code=200)
async def get_all_openaire_records():
    return await OpenAIRE.find_all().to_list()


@router.post("/search", status_code=200)
async def fetch_openaire_from_url(dataset: Dataset):
    try:
        # Map the URL to the OpenAIRE API format
        transformed_url = transform_openaire_url(dataset.source)

        # Fetch from the API
        async with httpx.AsyncClient() as client:
            response = await client.get(transformed_url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Could not fetch data")
            data = response.json()

        # Check if the resource already exists
        existing = await OpenAIRE.find_one(OpenAIRE.metadata.id == data.get("id"))
        if existing:
            raise HTTPException(status_code=409, detail="Resource already exists")

        # Create a new record
        openaire = OpenAIRE(source=dataset.source, metadata=data)
        await openaire.create()
        return openaire

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
