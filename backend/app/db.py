import motor
import motor.motor_asyncio
from beanie import init_beanie
from dotenv import load_dotenv
from models.datasets import Dataset
import os

load_dotenv()

mongo_user = os.environ.get("MONGO_INITDB_ROOT_USERNAME")
mongo_pass = os.environ.get("MONGO_INITDB_ROOT_PASSWORD")
mongo_host = os.environ.get("MONGO_HOST")
mongo_container_port = os.environ.get("MONGO_CONTAINER_PORT")
mongo_initdb_database = os.environ.get("MONGO_INITDB_DATABASE")

mongodb_uri = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_container_port}/"


async def init_database():
    client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_uri)
    await init_beanie(database=client.graspos, document_models=[Dataset])