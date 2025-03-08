"""Document models."""

from beanie import Document
from datetime import datetime
from models.user import User
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
from typing import Optional


class Documents(BaseModel):
    title: str
    url: str | None = None
    description: str | None = None
    created: Optional[datetime] = None
    data_last_updated: Optional[datetime] = None
    metadata_last_updated: Optional[datetime] = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DocumentsPatch(BaseModel):
    title: str | None = None
    url: str | None = None
    description: str | None = None
    created: Optional[datetime] | None = None
    data_last_updated: Optional[datetime] | None = None
    metadata_last_updated: Optional[datetime] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Documents(Document, DocumentsPatch):

    class Settings:
        name = "documents"

    class Config:
        json_schema_extra = {
            "example": {
                "title": "example-name",
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
