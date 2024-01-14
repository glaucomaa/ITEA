from pydantic import BaseModel


class GetAllEventsEventResponse(BaseModel):
    id: str
    title: str = None
    date: str = None
    image: str = None
    form: str = None
    save: bool = None


class GetEventByIdResponse(BaseModel):
    id: str
    title: str = None
    date: str = None
    image: str = None
    form: str = None
    info: str = None
    location: str = None
    org: str = None
    source: str = None


class GetPastEventsEventResponse(BaseModel):
    id: str
    title: str = None
    date: str = None
    image: str = None
    form: str = None
    visited: bool = None
    rate: int = None
