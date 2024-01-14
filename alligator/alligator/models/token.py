from pydantic import BaseModel, Field


class TokenData(BaseModel):
    email: str | None = None
