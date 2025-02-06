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
from fastapi.middleware.cors import CORSMiddleware

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
    lifespan=lifespan,
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.include_router(dataset_router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(mail.router)
app.include_router(register.router)

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)

import secrets
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from starlette.requests import Request

security = HTTPBasic()


def get_current_username(
        credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, CONFIG.backend_docs_username)
    correct_password = secrets.compare_digest(credentials.password, CONFIG.backend_docs_password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@app.get("/docs", include_in_schema=False)
async def get_swagger_documentation(
        username: str = Depends(get_current_username)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.get("/redoc", include_in_schema=False)
async def get_redoc_documentation(
        username: str = Depends(get_current_username)):
    return get_redoc_html(openapi_url="/openapi.json", title="docs")


@app.get("/openapi.json", include_in_schema=False)
async def openapi(username: str = Depends(get_current_username)):
    return get_openapi(title=app.title, version=app.version, routes=app.routes)


# security = HTTPBasic()

# def get_current_username(
#         credentials: HTTPBasicCredentials = Depends(security)):
#     correct_username = secrets.compare_digest(credentials.username, "user")
#     correct_password = secrets.compare_digest(credentials.password, "password")
#     if not (correct_username and correct_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Basic"},
#         )
#     return credentials.username

# @app.get("/docs", include_in_schema=False)
# async def get_documentation(request: Request,
#                             username: str = Depends(get_current_username)):
#     # openapi_url = request.scope.get('root_path') + "/openapi.json"
#     root_path = request.scope.get("path", "").rstrip("/")
#     openapi_url = str(root_path) + str(app.openapi_url)
#     print(request.scope.get("path"))
#     return get_swagger_ui_html(title="GRASPOS Catalogue API",
#                                openapi_url="/api/v1/openapi.json")

# app.include_router(dataset_router, prefix="/api/datasets", tags=["Datasets"])
# app.include_router(user.router)
# app.include_router(auth.router)
# app.include_router(mail.router)
# app.include_router(register.router)
