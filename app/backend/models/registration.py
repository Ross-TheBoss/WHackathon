from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, Enum, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Registration(Base):
    __tablename__ = "registrations"

    user_name = Column(String(255), primary_key=True, autoincrement=True)
    join_group_chat = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")