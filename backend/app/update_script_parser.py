import os
import sys
import logging
from dotenv import load_dotenv
from models.openaire import OpenAIRE
from models.zenodo import Zenodo
from models.update import Update
from util.requests import get_zenodo_data
from beanie import init_beanie
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from util.update_records import update_zenodo_records, update_openaire_records
import traceback


async def init(mongodb_uri):
    db = AsyncIOMotorClient(mongodb_uri).graspos
    await init_beanie(db, document_models=[Zenodo, Update, OpenAIRE])


async def main():

    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s %(levelname)s %(message)s',
        handlers=[
            logging.FileHandler('update_script_parser.log', encoding='utf-8'),
            logging.StreamHandler(sys.stdout)
        ]
    )
    logger = logging.getLogger(__name__)

    load_dotenv(dotenv_path="/code/.env")
    mongo_user = os.environ.get("MONGO_INITDB_ROOT_USERNAME")
    mongo_pass = os.environ.get("MONGO_INITDB_ROOT_PASSWORD")
    mongo_host = os.environ.get("MONGO_HOST")
    mongo_container_port = os.environ.get("MONGO_CONTAINER_PORT")
    mongodb_uri = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_container_port}/"
    logger.debug(
        f"Mongo URI: mongodb://{mongo_user}:***@{mongo_host}:{mongo_container_port}/"
    )

    await init(mongodb_uri)

    try:
        logger.info("Starting Zenodo update process...")
        await update_zenodo_records()
        logger.info("Zenodo update process completed successfully.")
    except Exception as e:
        logger.error(f"Error during Zenodo update process: {e}", exc_info=True)

    try:
        logger.info("Starting OpenAIRE update process...")
        await update_openaire_records()
        logger.info("OpenAIRE update process completed successfully.")
    except Exception:
        logger.error("Error during OpenAIRE update process", exc_info=True)


if __name__ == "__main__":
    asyncio.run(main())
