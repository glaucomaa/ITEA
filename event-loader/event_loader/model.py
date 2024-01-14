from datetime import datetime
from pydantic import BaseModel, Field, AnyUrl
from typing import List


class Event(BaseModel):
    """Model for storing event's data"""
    title: str = Field(..., min_length=2)
    kind: str = Field(..., min_length=2)
    cluster: int | None
    description_vec: List[float] | None
    category_list: List[str] | None
    date_time: datetime
    full_date_time: str = Field(..., min_length=2)
    full_place: str = Field(..., min_length=2)
    site: str | None
    organizers: List[str] | None
    image_url: AnyUrl | None
    description: str

    def __eq__(self, other):
        if isinstance(other, self.__class__):
            return self.title.lower().strip() == other.title.lower().strip()
        else:
            return False

    def __hash__(self):
        return hash(('title', self.title.lower().strip()))
