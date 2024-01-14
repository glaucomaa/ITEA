import pymongo.database
from pydantic import BaseSettings, MongoDsn
from pymongo import MongoClient

from project_path_getter import get_project_root


class DBSettings(BaseSettings):
    """Base database settings"""

    connection_string: MongoDsn

    class Config:
        env_prefix = "DB_"
        env_file = str(get_project_root()) + "/" + "alligator/config/.env"


def get_database(db_settings: DBSettings) -> pymongo.database.Database:
    """Function that creates database.
    Args:
        db_settings: Base database settings.
    Returns:
        Database.
    """
    client = MongoClient(db_settings.connection_string)
    db = client["alligator_database"]
    return db
