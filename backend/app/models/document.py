"""Document models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
from typing import Optional
import requests
from typing import Dict


class Documents(BaseModel):
    title: str
    source: str | None = None
    description: str | None = None
    communities: list | None = None
    created: Optional[datetime] = None
    data_last_updated: Optional[datetime] = None
    metadata_last_updated: Optional[datetime] = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DocumentsPatch(BaseModel):
    title: str | None = None
    source: str | None = None
    description: str | None = None
    created: Optional[datetime] | None = None
    data_last_updated: Optional[datetime] | None = None
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

    def update_from_zenodo(self, data: Dict) -> Document:

        for k, v in self.model_validate(data).model_dump(
                exclude="_id").items():
            setattr(self, k, v)

        return self

    @classmethod
    def get_data(cls, source):
        x = None
        try:
            x = requests.get(source)
        except requests.exceptions.RequestException as e:
            return {"status": 404, "detail": "Not a valid Zenodo url."}

        if x and x.json():
            resource = x.json()
            resource = resource | resource["metadata"]
            resource["zenodo_id"] = resource["id"]
            del resource["metadata"]
            del resource["id"]
            return {
                "status": 200,
                "detail": "Parsed resource successfully",
                "resource": resource
            }
