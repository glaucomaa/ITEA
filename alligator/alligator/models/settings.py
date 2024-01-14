from pydantic import BaseSettings

from project_path_getter import get_project_root


class Settings(BaseSettings):
    algorithm: str
    secret_key: str

    class Config:
        path_prefix = get_project_root()
        env_file = str(path_prefix) + "/" + "alligator/config/.env"
