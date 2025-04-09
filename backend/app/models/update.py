"""Zenodo models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import Link
from models.zenodo import Zenodo
from models.user import User


class UpdatedZenodoItems(BaseModel):

    zenodo: Link[Zenodo] | None = None
    old_version: int 
    new_version: int


class Update(BaseModel):

    user_id: Link[User] | None = None
    created_at: datetime | None = datetime.now()
    updates: list[UpdatedZenodoItems] | None = None


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
