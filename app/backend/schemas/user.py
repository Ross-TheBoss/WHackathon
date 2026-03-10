from pydantic import BaseModel
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    participant = "participant"
    organiser = "organiser"

class UserRegister(BaseModel):
    name: str
    email: str
    age: int
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    age: Optional[int] = None

    class Config:
        from_attributes = True