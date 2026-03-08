from pydantic import BaseModel
from enum import Enum
from datetime import date

class EventType(str, Enum):
    public = "public"
    private = "private"

class EventCategory(str, Enum):
    music = "Music"
    sports = "Sports"
    arts_craft = "Arts & Craft"
    technology = "Technology"
    food = "Food"
    gaming = "Gaming"

class EventBase(BaseModel):
    title: str
    description: str | None = None
    location: str
    longitude: float | None = None
    latitude: float | None = None
    event_type: EventType
    category: EventCategory
    capacity: int
    start_time: str  
    end_time: str  
    organiser_id: int

class EventResponse(EventBase):
    id: int
    created_at: date
    


    class Config:
        orm_mode = True