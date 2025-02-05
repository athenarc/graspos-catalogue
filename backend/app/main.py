from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes.router import dataset_router
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from models.datasets import Dataset
from db import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize application services."""
    app.db = AsyncIOMotorClient(db.mongodb_uri).graspos  
    await init_beanie(app.db, document_models=[Dataset])  
    print("Startup complete")
    yield
    print("Shutdown complete")


app = FastAPI(
    title="GRASPOS Catalogue API",
    summary="A simple API",
    lifespan=lifespan
)

app.include_router(dataset_router, prefix="/api/datasets")


