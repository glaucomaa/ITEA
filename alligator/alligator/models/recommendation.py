from datetime import datetime

from pydantic import BaseModel
from typing import Dict, List


class Recommendation(BaseModel):
    user_id: str
    interests_vec: Dict[int, List[float]]
    rating: list[str] | None
    updated_at: datetime | None
