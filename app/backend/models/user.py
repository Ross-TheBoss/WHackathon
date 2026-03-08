from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class userRole(str, enum.Enum):
    participant="participant"
    organiser="organiser"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    role = Column(Enum(userRole), nullable=False)

    events = relationship("Event", back_populates="organiser")
    messages = relationship("Message", back_populates="user")
    chat_memberships = relationship("ChatMembership", back_populates="user")