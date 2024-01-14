import pymongo.database
from event_loader.model import Event
from pydantic import BaseSettings, Field, MongoDsn
from pymongo import MongoClient
from typing import List


class DBSettings(BaseSettings):
    """Base database settings"""

    CONNECTION_STRING: MongoDsn = Field()

    class Config:
        env_prefix = "DB_"
        env_file = "config/.env"


def get_database(db_settings: DBSettings) -> pymongo.database.Database:
    """Function that creates database.
    Args:
        db_settings: Base database settings.
    Returns:
        Database.
    """
    client = MongoClient(db_settings.CONNECTION_STRING)
    event_db = client["alligator_database"]
    return event_db


def upsert_data(events: List[Event]):
    """Function that updates or inserts events in database
    and sorts them by date_time.
    Should be called after classification.py.
    Args:
        events: Classified event list.
    """
    db_settings = DBSettings()
    alligator_db = get_database(db_settings)
    event_collection = alligator_db["event_collection"]

    for event in sorted(events, key=lambda ev: ev.date_time):
        event_collection.replace_one(
            {
                "title": event.title,
            },
            event.dict(),
            upsert=True,
        )
