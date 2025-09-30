"""Base Resource Model."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from models.zenodo import Zenodo
from models.scope import Scope
from models.assessment import Assessment
from typing import List, Optional
from models.shared import GeographicalCoverage

class BaseResourceModel(BaseModel):
    source: str | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    approved: bool | None = None
    owner: PydanticObjectId | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()

class BaseResourcePatch(BaseModel):
    source: str | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    approved: bool | None = None
    owner: PydanticObjectId | None = None
    updated: datetime | None = None

class BaseResourceView(BaseModel):
    source: str | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None
    updated: datetime | None = None