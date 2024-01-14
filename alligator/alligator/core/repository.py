from bson.objectid import ObjectId
from datetime import datetime
from enum import Enum

from alligator.service.db.mongo import database

alligator_db = database.get_database(database.DBSettings())


class Action(Enum):
    SAVE = 0
    VISIT = 1
    RATE = 2


def get_user(email: str, db=alligator_db):
    users_collection = db["users_collection"]
    respond = users_collection.find_one({"email": email})
    if respond:
        respond = dict(respond)
    return respond


def add_user(item: dict, db=alligator_db):
    users_collection = db["users_collection"]
    users_collection.insert_one(item)


def add_action(
    user_id: str, event_id: str, kind: Action, grade: int | None, db=alligator_db
):
    user_actions_collection = db["user_actions_collection"]
    item = {
        "user_id": ObjectId(user_id),
        "event_id": ObjectId(event_id),
        "kind": kind.value,
    }
    action = user_actions_collection.find_one(item)
    item["grade"] = grade
    if not action:
        user_actions_collection.insert_one(item)
    elif action["grade"] != grade:
        user_actions_collection.update_one({"_id": action["_id"]}, {"$set": item})


def delete_action(
    user_id: str, event_id: str, kind: Action, grade: int | None, db=alligator_db
):
    user_actions_collection = db["user_actions_collection"]
    user_actions_collection.delete_one(
        {
            "user_id": ObjectId(user_id),
            "event_id": ObjectId(event_id),
            "kind": kind.value,
            "grade": grade,
        }
    )
    if kind == Action.VISIT:
        user_actions_collection.delete_one(
            {
                "user_id": ObjectId(user_id),
                "event_id": ObjectId(event_id),
                "kind": Action.RATE.value,
            }
        )


async def get_events(
    actual: bool = True,
    skip: int = 0,
    per_page: int = 10,
    search: str = None,
    db=alligator_db,
) -> [int, list]:
    events_collection = db["event_collection"]
    search = str(f"/*{search}/*") if search else "/*"
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    if actual:
        events = list(
            events_collection.find(
                {
                    "date_time": {"$gte": date},
                    "title": {"$regex": search, "$options": "i"},
                }
            )
            .sort([("date_time", 1), ("_id", 1)])
            .skip(skip)
            .limit(per_page)
        )
        total_count = events_collection.count_documents(
            {
                "date_time": {"$gte": date},
                "title": {"$regex": search, "$options": "i"},
            }
        )
    else:
        events = list(
            events_collection.find(
                {
                    "date_time": {"$lt": date},
                    "title": {"$regex": search, "$options": "i"},
                }
            )
            .sort([("date_time", -1), ("_id", 1)])
            .skip(skip)
            .limit(per_page)
        )
        total_count = events_collection.count_documents(
            {
                "date_time": {"$lt": date},
                "title": {"$regex": search, "$options": "i"},
            }
        )
    return total_count, events


def get_actual_events_total_count(db=alligator_db):
    events_collection = db["event_collection"]
    return events_collection.count_documents(
        {
            "date_time": {
                "$gte": datetime.now().replace(
                    hour=0, minute=0, second=0, microsecond=0
                )
            }
        }
    )


def get_event_by_id(id: str, db=alligator_db):
    events_collection = db["event_collection"]
    event = events_collection.find_one({"_id": ObjectId(id)})
    return event


def get_events_ids(user_id: str, kind: Action, db=alligator_db):
    actions_collection = db["user_actions_collection"]
    events = list(
        actions_collection.find({"user_id": ObjectId(user_id), "kind": kind.value})
    )
    events_ids = list(map(lambda x: str(x["event_id"]), events))
    return events_ids


def get_events_by_ids(
    ids: list, skip: int = 0, limit: int = 10, search: str = None, db=alligator_db
):
    events_collection = db["event_collection"]
    search = str(f"/*{search}/*") if search and len(search) > 0 else "/*"
    events = (
        events_collection.find(
            {
                "_id": {"$in": list(map(lambda x: ObjectId(x), ids))},
                "title": {"$regex": search, "$options": "i"},
            }
        )
        .sort([("date_time", 1), ("_id", 1)])
        .skip(skip)
        .limit(limit)
    )
    total_count = events_collection.count_documents(
        {
            "_id": {"$in": list(map(lambda x: ObjectId(x), ids))},
            "title": {"$regex": search, "$options": "i"},
        }
    )
    return str(total_count), events


def get_actions(db=alligator_db):
    actions_collection = db["user_actions_collection"]
    return list(actions_collection.find())


def get_rate_action(user_id: str, event_id: str, db=alligator_db):
    actions_collection = db["user_actions_collection"]
    return actions_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "event_id": ObjectId(event_id),
            "kind": Action.RATE.value,
        }
    )


def change_anketa_status(user_id: str, db=alligator_db):
    users_collection = db["users_collection"]
    users_collection.update_one(
        filter={"_id": ObjectId(user_id)}, update={"$set": {"anketa_passed": True}}, upsert=False
    )


def save_anketa_result(user_id: str, interests: dict, db=alligator_db):
    recommendations_collection = db["recommendations_collection"]
    item = {
        "user_id": ObjectId(user_id),
        "interests_vec": interests,
        "rating": None,
        "updated_at": None,
    }
    recommendations_collection.insert_one(item)


def get_user_rec_data(user_id, db=alligator_db):
    recommendations_collection = db["recommendations_collection"]
    resp = recommendations_collection.find_one({"user_id": ObjectId(user_id)})
    return resp


def save_user_rec(user_id: str, recs: list, db=alligator_db):
    recommendations_collection = db["recommendations_collection"]
    recommendations_collection.update_one(
        filter={"user_id": ObjectId(user_id)},
        update={"$set": {"rating": recs, "updated_at": datetime.now()}},
    )


def update_rec_vector(user_id: str, interests_vector, db=alligator_db):
    recommendations_collection = db["recommendations_collection"]
    recommendations_collection.update_one(
        filter={"user_id": ObjectId(user_id)},
        update={"$set": {"interests_vec": interests_vector}},
    )
