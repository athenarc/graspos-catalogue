from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import BaseModel
import pymongo
from pymongo import IndexModel


# ZenodoMetadata remains the same
class ZenodoMetadata(BaseModel):
    title: str | None = None
    doi: str | None = None
    publication_date: datetime | None = None
    description: str | None = None
    access_right: str | None = None
    creators: list | None = None
    keywords: list | None = None
    version: str | None = None
    references: list | None = None
    resource_type: object | None = None
    license: object | None = None
    grants: list | None = None
    communities: list | None = None
    relations: object | None = None
    notes: str | None = None


class Zenodo(BaseModel):
    source: str
    created: datetime | None = None
    modified: datetime | None = None
    zenodo_id: int | None = None
    conceptrecid: str | None = None
    doi: str | None = None
    conceptdoi: str | None = None
    doi_url: str | None = None
    metadata: ZenodoMetadata | None = None
    title: str | None = None
    links: object | None = None
    updated: datetime | None = None
    recid: str | None = None
    revision: int | None = None
    files: list | None = None
    swh: object | None = None
    owners: list | None = None
    status: str | None = None
    stats: object | None = None
    state: str | None = None
    submitted: bool | None = None


# ZenodoView remains unchanged
class ZenodoView(BaseModel):
    source: str | None = None


class ZenodoUpdate(BaseModel):
    id: PydanticObjectId | None = None


class Zenodo(Document, Zenodo, ZenodoView):

    class Settings:
        name = "zenodo"
        # Full-text index defined correctly using pymongo.TEXT
        # indexes = [
        #     "metadata_title_description_index", 
        #     [
        #         ("metadata.title", pymongo.TEXT),
        #         ("metadata.description", pymongo.TEXT),
        #     ],
        # ]
        indexes = [
            IndexModel(
                [("metadata.title", pymongo.TEXT), ("metadata.description", pymongo.TEXT)],  # Compound text index
                name="metadata_title_description_text",
                weights={"metadata.title": 1, "metadata.description": 1},  # Optional: You can add custom weights
                default_language="english",
                language_override="language",
                textIndexVersion=3
            ),
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "example-name",
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
    async def get_unique_licenses(cls) -> list[dict]:
        """Return all unique license dicts from the metadata."""
        documents = await cls.find_all().to_list()
        licenses = {
            frozenset(doc.metadata.license.items())
            for doc in documents
            if doc.metadata and isinstance(doc.metadata.license, dict)
        }
        return [dict(license) for license in licenses]
