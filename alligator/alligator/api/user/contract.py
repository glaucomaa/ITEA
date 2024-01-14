from typing import List

from pydantic import BaseModel, EmailStr, Field


class GetUserResponseModel(BaseModel):
    name: str
    last_name: str = Field(alias="lastName")
    anketa_passed: bool


class PostUserActionRequestModel(BaseModel):
    id: str
    append: bool


class PostUserRateRequestModel(BaseModel):
    id: str
    rate: int


class User(BaseModel):
    name: str | None = None
    last_name: str | None = Field(default=None, alias="lastName")
    email: EmailStr
    phone: str | None = None
    anketa_passed: bool | None = Field(default=None, alias="anketaPassed")


class UserInDB(User):
    hashed_password: str


class AnketaAnswer(BaseModel):
    id: str
    priority: int


class AnketaList(BaseModel):
    anketa_priority: List[AnketaAnswer]
