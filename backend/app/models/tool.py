"""Tool models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from models.zenodo import Zenodo


class Tool(BaseModel):
    doi: str | None = None
    source: str | None = None
    zenodo: Link[Zenodo] | None = None
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
    zenodo: Link[Zenodo] | None = None
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

    
    @classmethod
    async def get_unique_licenses_from_zenodo(cls) -> list[dict]:
        """Return all unique license dicts from linked Zenodo tools."""
        tools = await cls.find_all().to_list()
        licenses = set()

        for tool in tools:
            if tool.zenodo is not None:
                await tool.fetch_link("zenodo")  # 💡 this line fetches the full Zenodo doc
                zenodo = tool.zenodo
                if zenodo.metadata and isinstance(zenodo.metadata.license, dict):
                    licenses.add(frozenset(zenodo.metadata.license.items()))

        return [dict(license) for license in licenses]