from contextlib import asynccontextmanager
from fastapi import FastAPI
from db import init_database
from routes.router import dataset_router

app = FastAPI(
    title="GRASPOS Catalogue API",
    summary="A simple API",
)

@app.on_event("startup")
async def start_db():
    await init_database()

app.include_router(dataset_router, prefix="/api/datasets")


