"""Zenodo models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import Link
from models.zenodo import Zenodo
from models.user import User


class Update(BaseModel):

    zenodo_id: Link[Zenodo]
    user_id: Link[User] | None = None
    created_at: datetime | None = datetime.now()
    old_version: int
    new_version: int


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
