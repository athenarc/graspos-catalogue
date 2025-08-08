from pydantic import Field
from beanie import Document


class TRLEntry(Document):
    trl_id: int = Field(..., ge=1, le=9, description="TRL level from 1 to 9")
    nasa_description: str = Field(..., description="NASA-style description")
    european_description: str = Field(
        ..., description="European Commission-style description")

    class Settings:
        name = "trl"

    class Config:
        schema_extra = {
            "example": {
                "trl_id": 3,
                "nasa_description":
                "Analytical and experimental critical function and/or characteristic proof-of concept",
                "european_description": "Experimental proof of concept"
            }
        }
