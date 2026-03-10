from pydantic import BaseModel
from typing import Optional


class ReviewBase(BaseModel):
    rating: int
    text: Optional[str] = None
    user_id: int
    event_id: int

class ReviewResponse(BaseModel):
    id: int
    rating: int
    text: Optional[str] = None
    user_id: int
    event_id: int
    author: str = ""
    comment: str = ""
    date: str = ""

    class Config:
        from_attributes = True
