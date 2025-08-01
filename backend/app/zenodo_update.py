import os, logging
from dotenv import load_dotenv
from models.zenodo import Zenodo
from models.update import Update
from util.requests import get_zenodo_data
from beanie import init_beanie
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from util.update_zenodo import update_records

async def init(mongodb_uri):
    db = AsyncIOMotorClient(mongodb_uri).graspos
    await init_beanie(db, document_models=[Zenodo, Update])


async def main():

    logger = logging.getLogger(__name__)
    logging.basicConfig(filename='zenodo_update.log',
                        encoding='utf-8',
                        level=logging.DEBUG)

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
    await update_records()
    # records = await Zenodo.find().to_list()

    # zenodo_updates = []
    # for record in records:
    #     if not record.zenodo_id:
    #         continue
        
    #     zenodo_update = {
    #         "zenodo": record,
    #         "old_version": int(record.zenodo_id),
    #         "new_version": None,
    #         "status": "not updated",
    #         "detail": "No update performed"
    #     }

    #     try:
    #         data = await get_zenodo_data(record.source)
    #         if data["status"] != 200:
    #             # If the data fetch fails, log the error and continue
    #             zenodo_update["status"] = "Error"
    #             zenodo_update["detail"] = data["detail"]
    #             continue  # If a record fails to fetch, skip to the next one

    #         new_zenodo = data["zenodo_object"]

    #         if new_zenodo["zenodo_id"] != record.zenodo_id:

    #             updated_model = Zenodo(**new_zenodo)
    #             fields = updated_model.model_dump(exclude_unset=True)
    #             updated_record = Zenodo.model_copy(record, update=fields)
    #             await updated_record.save()

    #             zenodo_update["zenodo"] = updated_record
    #             zenodo_update["new_version"] = int(new_zenodo["zenodo_id"])
    #             zenodo_update["status"] = "Updated"
    #             zenodo_update["detail"] = "Record updated successfully"
    #         else:
    #             # If the record is unchanged, log that as well
    #             zenodo_update["old_version"] = int(record.zenodo_id)
    #             zenodo_update["status"] = "Up to date"
    #             zenodo_update["detail"] = "Record is unchanged"

    #     except Exception as e:
    #         # If an error occurs during the update, log it
    #         zenodo_update["status"] = "error"
    #         zenodo_update["detail"] = str(e)

    #     zenodo_updates.append(zenodo_update)

    # if len(zenodo_updates) > 0:
    #     update = Update(updates=zenodo_updates,
    #                     source="Zenodo")
    #     await update.save()


asyncio.run(main())
