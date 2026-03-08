from pydantic import BaseModel


class ReviewBase(BaseModel):
    rating: int
    text: str | None = None
    user_id: int
    event_id: int

class ReviewResponse(ReviewBase):
    id: int

    class Config:
        orm_mode = True