from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Registration(Base):
    __tablename__ = "registrations"

    user_name = Column(String(255), nullable=False)
    join_group_chat = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), primary_key=True, nullable=False)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")