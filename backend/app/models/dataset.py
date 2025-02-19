"""Dataset models."""

from beanie import Document
from datetime import datetime
from models.user import User

class Dataset(Document):
    name: str
    description: str
    tags: list
    license: str
    organization: str
    visibility: str
    version: str
    authors: list
    api_url: str
    api_url_instructions: str
    documentation_url: str
    contact_person: str
    contact_person_email: str
    approved: bool

    class Settings:
        name = "datasets"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "example-name",
                "description": "example-description",
                "tags": ["example-tag-1", "example-tag-2"],
                "license": "",
                "organization": "",
                "visibility": "public/private",
                "version": "",
                "authors": ["Author-1", "Author-2"],
                "api_url": "",
                "api_url_instructions": "",
                "documentation_url": "",
                "contact_person": "",
                "contact_person_email": "",
                "approved": "True/False"
            }
        }
