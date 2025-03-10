"""Dataset models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
from models.zenodo import Zenodo


class Dataset(BaseModel):
    source: str
    organization: str | None = None
    visibility: str | None = None
    api_url: str | None = None
    api_url_instructions: str | None = None
    documentation_url: str | None = None
    contact_person: str | None = None
    contact_person_email: str | None = None
    zenodo_metadata: Zenodo | None = None 
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DatasetPatch(BaseModel):
    source: str | None = None
    created: datetime | None = None
    modified: datetime | None = None
    updated: datetime | None = None
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DatasetView(BaseModel):
    source: str
    organization: str | None = None
    visibility: str | None = None
    api_url: str | None = None
    api_url_instructions: str | None = None
    documentation_url: str | None = None
    contact_person: str | None = None
    contact_person_email: str | None = None
    zenodo_metadata: Zenodo | None = None 
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Dataset(Document, DatasetView):

    class Settings:
        name = "datasets"

    class Config:
        json_schema_extra = {
            "example": {
                "title": "example-name",
                "source": "https://www.example.com/api/2131231",
                "description": "example-description",
                "tags": "",
                "license": "",
                "organization": "",
                "visibility": "public/private",
                "version": "",
                "authors": "",
                "api_url": "",
                "api_url_instructions": "",
                "documentation_url": "",
                "contact_person": "",
                "contact_person_email": "",
                "created_at": "01/01/2020",
                "updated_at": "01/01/2020",
                "approved": "True/False",
                "owner": "user id"
            }
        }
