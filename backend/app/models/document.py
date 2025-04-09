"""Document models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from typing import Optional
from models.zenodo import Zenodo


class Documents(BaseModel):
    source: str
    format: str | None = None
    url: str | None = None
    created: Optional[datetime] = None
    zenodo: Link[Zenodo] | None = None
    date_last_updated: Optional[datetime] = None
    metadata_last_updated: Optional[datetime] = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DocumentsPatch(BaseModel):
    source: str | None = None
    format: str | None = None
    url: str | None = None
    created: Optional[datetime] | None = None
    zenodo: Link[Zenodo] | None = None
    date_last_updated: Optional[datetime] | None = None
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
                "source": "https://www.example.com/api/2131231",
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

    
    @classmethod
    async def get_unique_licenses_from_zenodo(cls) -> list[dict]:
        """Return all unique license dicts from linked Zenodo documents."""
        documents = await cls.find_all().to_list()
        licenses = set()

        for document in documents:
            if document.zenodo is not None:
                await document.fetch_link("zenodo")  # 💡 this line fetches the full Zenodo doc
                zenodo = document.zenodo
                if zenodo.metadata and isinstance(zenodo.metadata.license, dict):
                    licenses.add(frozenset(zenodo.metadata.license.items()))

        return [dict(license) for license in licenses]