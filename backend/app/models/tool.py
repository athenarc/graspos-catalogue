"""Tool models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
from models.zenodo import Zenodo


class Tool(BaseModel):
    doi: str | None = None
    source: str | None = None
    zenodo_metadata: Zenodo | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ToolPatch(BaseModel):
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ToolView(BaseModel):
    doi: str | None = None
    source: str | None = None
    zenodo_metadata: Zenodo | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Tool(Document, ToolView):

    class Settings:
        name = "tools"

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
