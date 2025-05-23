from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import BaseModel
import pymongo
from pymongo import IndexModel


class Scope(BaseModel):
    name: str
    description: str | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()


class ScopeView(BaseModel):
    name: str
    description: str | None = None


class ScopeCreate(BaseModel):
    name: str
    description: str | None = None


class ScopePatch(BaseModel):
    description: str | None = None


class Scope(Document, Scope, ScopeView, ScopeCreate, ScopePatch):

    class Settings:
        name = "scope"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Start",
                "description": "Begin evaluation by stating your personal values about the subject, avoiding external influences or relying solely on available data sources to prevent the 'Streetlight Effect'.",
                "created_at": "01/01/2020",
                "updated_at": "01/01/2020",
            }
        }
