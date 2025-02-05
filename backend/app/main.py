from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes.dataset import dataset_router
from routes import user, auth, mail, register
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from models.dataset import Dataset
from models.user import User
from db import db
from config import CONFIG

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize application services."""
    app.db = AsyncIOMotorClient(CONFIG.mongodb_uri).graspos  
    await init_beanie(app.db, document_models=[Dataset, User])  
    print("Startup complete")
    yield
    print("Shutdown complete")


app = FastAPI(
    title="GRASPOS Catalogue API",
    summary="A simple API",
    lifespan=lifespan
)

app.include_router(dataset_router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(mail.router)
app.include_router(register.router)


