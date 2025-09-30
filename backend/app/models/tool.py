"""Tool models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from models.zenodo import Zenodo
from models.scope import Scope
from typing import List, Optional 
from models.shared import GeographicalCoverage
from models.assessment import Assessment
from models.baseResourceModel import BaseResourceModel, BaseResourcePatch, BaseResourceView

class ToolBasicFields(BaseModel):
    doi: str | None = None
    zenodo: Link[Zenodo] | None = None

class Tool(ToolBasicFields, BaseResourceModel):
    pass

class ToolPatch(ToolBasicFields, BaseResourcePatch):
    pass 

class ToolView(ToolBasicFields, BaseResourceView):
    pass


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
    async def get_unique_field_values_from_zenodo(cls,
                                                  field_name: str) -> list:
        """
        Return all unique values for a given metadata field from linked Zenodo tools.

        :param field_name: The field name in zenodo.metadata to extract unique values from.
        :return: A list of unique field values (dicts or scalars).
        """
        tools = await cls.find_all().to_list()
        unique_values = set()

        for tool in tools:
            if tool.zenodo is not None:
                await tool.fetch_link("zenodo")
                zenodo = tool.zenodo
                metadata = zenodo.metadata

                if metadata:
                    value = getattr(metadata, field_name, None)

                    if isinstance(value, list):
                        for item in value:
                            if isinstance(item, dict):
                                unique_values.add(frozenset(item.items()))
                            else:
                                unique_values.add(item)
                    elif isinstance(value, dict):
                        unique_values.add(frozenset(value.items()))
                    elif value is not None:
                        unique_values.add(value)

        # Convert any frozen dicts back to regular dicts
        result = [
            dict(item) if isinstance(item, frozenset) else item
            for item in unique_values
        ]
        return result