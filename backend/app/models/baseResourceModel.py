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
    approved: bool | None = None
    owner: PydanticObjectId | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    
    # Governance, Sustainability and Funding Model fields
    adopted_standards: List[str] | None = None
    governance_model: str | None = None
    governance_bodies: List[str] | None = None
    sustainability_plan: str | None = None

    # Support fields
    documentation_urls: List[str] | None = None
    training_materials: List[str] | None = None
    support_channels: List[str] | None = None
    
    # Coverage
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None # Links to assessments
    assessment_values: List[str] | None = None # User provided free text values
    assessment_functionalities: List[str] | None = None # e.g. Enrichment, Monitoring, Data
    evidence_types: List[str] | None = None # e.g. Narratives, Indicatiors, List of contributions, Badges, Other
    covered_fields: List[str] | None = None # user provided free text values
    covered_research_products: List[str] | None = None # user provided free text values
    temporal_coverage: str | None = None # user provided free text values

    # Equity & Ethical Considerations fields
    privacy_policy: str | None = None
    limitations: str | None = None
    ethical_considerations: str | None = None
    ethics_committee: List[str] | None = None

    
class BaseResourcePatch(BaseResourceModel):
    updated: datetime | None = None

class BaseResourceView(BaseResourceModel):
    updated: datetime | None = None