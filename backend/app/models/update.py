"""Zenodo models."""

from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import BaseModel
from beanie import Link
from models.openaire import OpenAIRE
from models.zenodo import Zenodo
from models.user import User


class UpdatedZenodoItems(BaseModel):

    zenodo: Link[Zenodo] | None = None
    openaire: Link[OpenAIRE] | None = None
    old_version: str | None = None
    new_version: str | None = None
    status: str | None = None
    detail: str | None = None
    


class Update(BaseModel):

    user_id: Link[User] | None = None
    created_at: datetime | None = datetime.now()
    source: str | None = None
    updates: list[UpdatedZenodoItems] | None = None

class UpdateRequest(BaseModel):
    zenodo_id: PydanticObjectId | None = None
    openaire_id: PydanticObjectId | None = None

class Update(Document, Update):

    class Settings:
        name = "update"

    class Config:
        json_schema_extra = {
            "example": {
                "user": "User id",
                "zenodo_id": "Zenodo id"
            }
        }
