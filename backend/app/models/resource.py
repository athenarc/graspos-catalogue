"""Resource models."""

from beanie import Document
from datetime import datetime
from models.user import User
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime


class Resource(BaseModel):
    name: str
    url: str | None = None
    description: str | None = None
    created: datetime | None = None
    data_last_updated: datetime | None = None
    metadata_last_updated: datetime | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ResourcePatch(BaseModel):
    name: str | None = None
    url: str | None = None
    description: str | None = None
    created: datetime | None = None
    data_last_updated: datetime | None = None
    metadata_last_updated: datetime | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Resource(Document, ResourcePatch):

    class Settings:
        name = "resources"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "example-name",
                "url": "https://www.example.com/api/2131231",
                "description": "example-description",
                "approved": "True/False",
                "created": "01/01/2020",
                "data_last_updated": "01/01/2020",
                "metadata_last_updated": "01/01/2020",
                "created_at": "01/01/2020",
                "updated_at": "01/01/2020",
                "approved": "True/False",
                "owner": "user id"
            }
        }
