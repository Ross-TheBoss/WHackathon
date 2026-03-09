from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    join_group_chat = Column(Boolean, default=False)
    registered_at = Column(DateTime, server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")