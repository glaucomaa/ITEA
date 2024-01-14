from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(min_length=1)
    last_name: str = Field(alias="lastName", min_length=1)
    email: EmailStr
    phone: str
    anketa_passed: bool = False


class UserRegistration(UserBase):
    password: str  # TODO add password requirements


class UserInDb(UserBase):
    hashed_password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
