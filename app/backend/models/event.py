from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class EventType(str, enum.Enum):
    public = "public"
    private = "private"  

class EventCategory(str, enum.Enum):
    music = "Music"
    sports = "Sports"
    arts_crafts = "Arts & Crafts"
    technology = "Technology"
    food = "Food"
    gaming = "Gaming"
    health = "Health"
    dance = "Dance"
    talk = "Talk"

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    event_type = Column(Enum(EventType), nullable=False)
    category = Column(Enum(EventCategory), nullable=False)
    capacity = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    groups = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


    organiser_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organiser = relationship("User", back_populates="events")
    reviews = relationship("Reviews", back_populates="event")
    registrations = relationship("Registration", back_populates="event")