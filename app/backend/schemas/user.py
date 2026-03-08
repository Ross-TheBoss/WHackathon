from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    participant = "participant"
    organiser = "organiser"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: int
    password:str
    role: UserRole

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    age: int

    class Config:
        orm_mode = True