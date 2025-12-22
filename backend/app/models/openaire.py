from datetime import datetime
from typing import Optional, List, Any
from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, EmailStr, HttpUrl, model_validator
import pymongo
from pymongo import IndexModel

from models.trl import TRLEntry


class Contact(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    organisation: Optional[str] = None


class ScientificDomain(BaseModel):
    scientificDomain: Optional[str] = None
    scientificSubdomain: Optional[str] = None


class Category(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None


class Benefit(BaseModel):
    benefitsTitle: Optional[str] = None
    benefitsText: Optional[str] = None
    benefitsImage: Optional[str] = ""


class Feature(BaseModel):
    featuresTitle: Optional[str] = None
    featuresText: Optional[str] = None
    featuresImage: Optional[str] = None


class OpenAireChangeLogEntry(BaseModel):
    type: Optional[str] = None
    value: Optional[str] = None


class OpenAireChangeLog(BaseModel):
    changeLogVersion: Optional[str] = None
    changeDate: Optional[str] = None
    logs: Optional[List[OpenAireChangeLogEntry]] = None


class PaymentCategory(BaseModel):
    paymentTitle: Optional[str] = None
    paymentSubtitle: Optional[str] = None
    paymentBilling: Optional[str] = None
    paymentPrice: Optional[str] = None
    paymentIncludes: Optional[List[Optional[str]]] = None
    paymentButtonText: Optional[str] = None
    paymentURL: Optional[str] = None
    paymentHighlight: Optional[bool] = None


class UseCaseExtra(BaseModel):
    useCaseTitle: Optional[str] = None
    useCaseText: Optional[str] = None
    useCaseLink: Optional[str] = None
    useCaseImage: Optional[str] = None


class OpenaireMetadata(BaseModel):
    openaireId: Optional[str] = None
    abbreviation: Optional[str] = None
    name: Optional[str] = None
    resourceOrganisation: Optional[str] = None
    resourceProviders: Optional[List[Optional[str]]] = None
    webpage: Optional[HttpUrl] = None
    description: Optional[str] = None
    scientificDomains: Optional[List[ScientificDomain]] = None
    categories: Optional[List[Category]] = None
    targetUsers: Optional[List[Optional[str]]] = None
    accessTypes: Optional[List[Optional[str]]] = None
    accessModes: Optional[List[Optional[str]]] = None
    tags: Optional[List[Optional[str]]] = None
    geographicalAvailabilities: Optional[List[Optional[str]]] = None
    languageAvailabilities: Optional[List[Optional[str]]] = None
    resourceGeographicLocations: Optional[List[Optional[str]]] = None
    mainContact: Optional[Contact] = None
    publicContacts: Optional[List[Contact]] = None
    certifications: Optional[List[Optional[str]]] = None
    relatedPlatforms: Optional[List[Optional[str]]] = None

    standards: Optional[List[Optional[str]]] = None
    openSourceTechnologies: Optional[List[Optional[str]]] = None
    requiredResources: Optional[List[Optional[str]]] | None= None
    relatedResources: Optional[List[Optional[str]]] = None
    fundingBody: Optional[List[Optional[str]]] = None
    fundingPrograms: Optional[List[Optional[str]]] = None
    grantProjectNames: Optional[List[Optional[str]]] = None
    communities: Optional[List[dict]] = None

    tagline: Optional[str] = None
    logo: Optional[HttpUrl] = None
    multimedia: Optional[List[dict]] = None
    useCases: Optional[Any] = None
    helpdeskEmail: Optional[EmailStr] = None
    securityContactEmail: Optional[EmailStr] = None
    trl: Optional[Link[TRLEntry]] = None
    lifeCycleStatus: Optional[str] = None
    version: Optional[str] = None
    lastUpdate: Optional[str] = None
    changeLog: Optional[List[Optional[str]]] = None
    catalogueId: Optional[str] = None
    helpdeskPage: Optional[HttpUrl] = None
    userManual: Optional[HttpUrl] = None
    termsOfUse: Optional[HttpUrl] = None
    privacyPolicy: Optional[HttpUrl] = None
    accessPolicy: Optional[HttpUrl] = None
    resourceLevel: Optional[str] = None
    trainingInformation: Optional[HttpUrl] = None
    statusMonitoring: Optional[str] = None
    maintenance: Optional[str] = None
    orderType: Optional[str] = None
    order: Optional[HttpUrl] = None
    paymentModel: Optional[HttpUrl] = None
    pricing: Optional[HttpUrl] = None
    extras: Optional[dict] = None
    guides: Optional[HttpUrl] = None
    EOSCReady: Optional[bool] = None
    invertedLogo: Optional[HttpUrl] = None
    git: Optional[List[HttpUrl]] = None
    titleColor: Optional[str] = None
    longImage: Optional[HttpUrl] = None
    podcast: Optional[HttpUrl] = None
    relatedServices: Optional[List[Optional[str]]] = None
    openAireChangeLog: Optional[List[OpenAireChangeLog]] = None
    pitch: Optional[str] = None
    bundle: Optional[str] = None
    factsheets: Optional[List[HttpUrl]] = None
    pitchdeckPpt: Optional[str] = None
    image: Optional[HttpUrl] = None
    promotionVideos: Optional[HttpUrl] = None
    documentation: Optional[HttpUrl] = None
    portfolios: Optional[List[Optional[str]]] = None
    label: Optional[str] = None
    users: Optional[List[Optional[str]]] = None
    glossary: Optional[HttpUrl] = None
    useCasesExtras: Optional[List[UseCaseExtra]] = None
    faqs: Optional[HttpUrl] = None
    ebook: Optional[HttpUrl] = None
    tutorials: Optional[str] = None
    latestNews: Optional[HttpUrl] = None
    paymentCategories: Optional[List[PaymentCategory]] = None
    communityCalls: Optional[HttpUrl] = None
    shortName: Optional[str] = None
    mediakit: Optional[str] = None
    webinars: Optional[HttpUrl] = None


class OpenAIREBase(BaseModel):
    source: Optional[str] = None
    resource_url_name: str | None = None
    created: Optional[datetime] = datetime.now()
    modified: Optional[datetime] = datetime.now()
    metadata: OpenaireMetadata | None = None
    mapped_resource_type: dict | None = None

    @model_validator(mode="after")
    def set_mapped_resource_type(self):
        self.mapped_resource_type = {"value": "service", "label": "Service"}
        return self


class OpenAIREView(BaseModel):
    source: Optional[str] = None


class OpenAIREUpdate(BaseModel):
    openaireId: Optional[PydanticObjectId] = None


class OpenAIRE(Document, OpenAIREBase, OpenAIREView):

    class Settings:
        name = "openaire"
        indexes = [
            IndexModel(
                [
                    ("metadata.name", pymongo.TEXT),
                    ("metadata.description", pymongo.TEXT),
                ],
                name="openaire_metadata_title_description_text",
                weights={
                    "metadata.name": 1,
                    "metadata.description": 1,
                },
                default_language="english",
            )
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "source":
                "https://graspos-services.athenarc.gr/api/catalogue-resources/openaire.usage_statistics",
                "metadata": {
                    "id": "openaire.usage_statistics",
                    "name": "OpenAIRE UsageCounts",
                    "description":
                    "Tracks usage metrics for Open Access repositories.",
                    "webpage": "https://usagecounts.openaire.eu/",
                },
            }
        }
