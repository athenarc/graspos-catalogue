"""Dataset models."""

from beanie import Document
from datetime import datetime


class Dataset(Document):
    name: str
    description: str
    tags: list

    class Settings:
        name = "datasets"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "example-name",
                "description": "example-description",
                "tags": ["example-tag-1", "example-tag-2"]
            }
        }


# Name
# Description
# Tags
# Licence
# Organisation
# Visibility
# Source
# Version
# Authors
# API URL
# API URL instructions
# Documentation URL
# Contact person
# Contact person email
