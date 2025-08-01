"""Zenodo models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import Link
from models.zenodo import Zenodo
from models.user import User


class UpdatedZenodoItems(BaseModel):

    zenodo: Link[Zenodo] | None = None
    old_version: int | None = None
    new_version: int | None = None
    status: str | None = None
    detail: str | None = None
    


class Update(BaseModel):

    user_id: Link[User] | None = None
    created_at: datetime | None = datetime.now()
    source: str | None = None
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
