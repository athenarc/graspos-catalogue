from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes import user, auth, mail, register, dataset, document, tool, zenodo, update, scope, country, assessment, service, openaire, trl
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from models.dataset import Dataset
from models.tool import Tool
from models.document import Documents
from models.user import User
from models.update import Update
from models.zenodo import Zenodo
from models.scope import Scope
from models.assessment import Assessment
from models.shared import GeographicalCoverage
from models.service import Service
from models.openaire import OpenAIRE
from models.trl import TRLEntry
from config import CONFIG
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize application services."""
    app.db = AsyncIOMotorClient(CONFIG.mongodb_uri).graspos
    await init_beanie(app.db,
                      document_models=[
                          Dataset, User, Documents, Tool, Zenodo, Update,
                          Scope, GeographicalCoverage, Assessment, Service,
                          OpenAIRE, TRLEntry
                      ])
    print("Startup complete")

    yield
    print("Shutdown complete")


app = FastAPI(
    title="GRASPOS Catalogue API",
    summary=
    "API for managing the GRASPOS Catalogue, including datasets, tools, documents, and services.",
    lifespan=lifespan,
    version="0.1.1",
    root_path=CONFIG.backend_proxy_path,
)
print("Base path:", app.root_path)
app.include_router(openaire.router)
app.include_router(zenodo.router)
app.include_router(scope.router)
app.include_router(trl.router)
app.include_router(country.router)
app.include_router(assessment.router)
app.include_router(dataset.router)
app.include_router(document.router)
app.include_router(tool.router)
app.include_router(service.router)
app.include_router(update.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(mail.router)
app.include_router(register.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CONFIG.allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
