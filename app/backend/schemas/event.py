from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class EventType(str, Enum):
    public = "public"
    private = "private"

class EventCategory(str, Enum):
    music = "Music"
    sports = "Sports"
    arts_crafts = "Arts & Crafts"
    technology = "Technology"
    food = "Food"
    gaming = "Gaming"
    health = "Health"
    dance = "Dance"
    talk = "Talk"

class ReviewInEvent(BaseModel):
    id: int
    author: str = ""
    rating: int
    comment: str = ""
    date: str = ""

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    event_type: EventType
    category: EventCategory
    capacity: int
    start_time: str
    end_time: str
    organiser_id: int
    groups: Optional[List[str]] = None

class EventResponse(BaseModel):
    """Frontend-compatible event response."""
    id: int
    name: str
    author: str
    category: str
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    location: str
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    participants: int = 0
    rating: float = 0.0
    description: Optional[str] = None
    reviews: List[ReviewInEvent] = []
    groups: List[str] = []
    event_type: str
    capacity: int
    organiser_id: int
