from beanie import Document
from pydantic import Field
from pydantic import BaseModel

class GeographicalCoverage(Document):
    code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    label: str
    flag: str


    class Settings:
        name = "geographical_coverage"
        
class GeoCoverageWithCount(BaseModel):
    id: str
    code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    label: str
    flag: str
    resource_count: int