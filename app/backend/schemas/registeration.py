from pydantic import BaseModel  

class RegistrationBase(BaseModel):
    username: str
    join_group_chat: bool = False
    user_id: int
    event_id: int