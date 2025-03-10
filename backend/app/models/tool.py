"""Tool models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
import requests
from typing import Dict


class Tool(BaseModel):
    title: str
    version: str | None = None
    source: str | None = None
    description: str | None = None
    keywords: list | None = None
    license: Dict | None = None
    organization: str | None = None
    visibility: str | None = None
    version: str | None = None
    creators: list | None = None
    communities: list | None = None
    api_url: str | None = None
    api_url_instructions: str | None = None
    documentation_url: str | None = None
    contact_person: str | None = None
    contact_person_email: str | None = None
    created: datetime | None = None
    modified: datetime | None = None
    updated: datetime | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ToolPatch(BaseModel):
    source: str | None = None
    created: datetime | None = None
    modified: datetime | None = None
    updated: datetime | None = None
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ToolView(BaseModel):
    title: str | None = None
    version: str | None = None
    source: str | None = None
    description: str | None = None
    keywords: list | None = None
    license: Dict | None = None
    organization: str | None = None
    visibility: str | None = None
    version: str | None = None
    creators: list | None = None
    communities: list | None = None
    api_url: str | None = None
    api_url_instructions: str | None = None
    documentation_url: str | None = None
    contact_person: str | None = None
    contact_person_email: str | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    created: datetime | None = None
    modified: datetime | None = None
    updated: datetime | None = None
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

    def update_from_zenodo(self, data: Dict) -> Tool:

        for k, v in self.model_validate(data).model_dump(
                exclude="_id").items():
            setattr(self, k, v)

        return self

    @classmethod
    def get_data(cls, source):
        if "https://zenodo.org/records/" in source:
            source = source.replace("/records/", "/api/records/")
        x = None
        try:
            x = requests.get(source)
        except requests.exceptions.RequestException as e:
            return {"status": 404, "detail": "Not a valid Zenodo url."}

        if x and x.json():
            resource = x.json()
            resource = resource | resource["metadata"]
            resource["zenodo_id"] = resource["id"]
            resource["source"] = source
            del resource["metadata"]
            del resource["id"]
            return {
                "status": 200,
                "detail": "Parsed resource successfully",
                "resource": resource
            }
