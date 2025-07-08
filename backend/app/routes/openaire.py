from fastapi import APIRouter, HTTPException, Depends
from beanie import PydanticObjectId
from models.openaire import OpenAIRE, OpenAIREMetadata
from models.dataset import Dataset
from models.user import User
from util.current_user import current_user_mandatory
import httpx

router = APIRouter(prefix="/api/v1/openaire", tags=["OpenAIRE"])


@router.get("/", status_code=200)
async def get_all_openaire_records():
    return await OpenAIRE.find_all().to_list()


@router.post("/search", status_code=200)
async def fetch_openaire_from_url(
    dataset: Dataset
):
    url = dataset.source

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Could not fetch data")

            data = response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Έλεγχος αν υπάρχει ήδη βάση του metadata.id
    existing = await OpenAIRE.find_one(OpenAIRE.metadata.id == data.get("id"))
    if existing:
        raise HTTPException(status_code=409, detail="Resource already exists")

    # Δημιουργία εγγραφής
    try:
        openaire = OpenAIRE(source=url, metadata=data)
        await openaire.create()
        return openaire

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create OpenAIRE record: {str(e)}")
