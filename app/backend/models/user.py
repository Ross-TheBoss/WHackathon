from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    participant = "participant"
    organiser = "organiser"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    # relationships
    events = relationship("Event", back_populates="organiser")
    registrations = relationship("Registration", back_populates="user")
    reviews = relationship("Reviews", back_populates="user")