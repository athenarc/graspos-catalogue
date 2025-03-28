from fastapi import HTTPException
from config import CONFIG
from models.zenodo import Zenodo
from models.update import Update
from .requests import get_zenodo_data


async def update_records(user_id=None, zenodo_id=None):

    records = []
    records.append(await Zenodo.get(zenodo_id) if zenodo_id else await Zenodo.
                   find().to_list())
    updated = []
    for record in records:
        print(record)
        record.source += "/versions/latest" if not "/versions/latest" in record.source else ""
        data = get_zenodo_data(record.source)

        if data["status"] != 200:

            raise HTTPException(status_code=data["status"],
                                detail=data["detail"])

        if data["zenodo_object"]["zenodo_id"] != record.zenodo_id:

            zenodo_record = await Zenodo.get(record.id)

            if not zenodo_record:
                return HTTPException(status_code=404,
                                     detail="Zenodo record does not exist")

            zenodo = Zenodo(**data["zenodo_object"])
            fields = zenodo.model_dump(exclude_unset=True)
            updated_record = Zenodo.model_copy(zenodo_record, update=fields)
            await updated_record.save()

            update = Update(user_id=user_id,
                            zenodo_id=record.id,
                            old_version=record.zenodo_id,
                            new_version=data["zenodo_object"]["zenodo_id"])
            await update.save()
            updated.append(update)

    detail = "Zenodo records updated successfully" if not zenodo_id else "Zenodo record " + str(
        zenodo_id) + " updated successfully"

    return {"status": 200, "detail": detail, "records_updated": len(updated)}
