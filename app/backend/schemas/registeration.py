from pydantic import BaseModel  

class RegistrationBase(BaseModel):
    name: str
    join_group_chat: bool = False
    user_id: int
    event_id: int

class RegistrationResponse(RegistrationBase):
    id: int

    class Config:
        orm_mode = True