from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.chat import Message, ChatMember
from models.registration import Registration
from typing import List, Dict
import json

router = APIRouter(prefix="/chat", tags=["Chat"])

# keeps track of who is connected to which event chat
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, event_id: int):
        await websocket.accept()
        if event_id not in self.active_connections:
            self.active_connections[event_id] = []
        self.active_connections[event_id].append(websocket)

    def disconnect(self, websocket: WebSocket, event_id: int):
        if event_id in self.active_connections:
            self.active_connections[event_id].remove(websocket)

    async def broadcast(self, message: str, event_id: int):
        if event_id in self.active_connections:
            for connection in self.active_connections[event_id]:
                await connection.send_text(message)

manager = ConnectionManager()

# GET MESSAGE HISTORY
@router.get("/{event_id}/messages")
def get_messages(event_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(
        Message.event_id == event_id
    ).order_by(Message.sent_at.asc()).all()

    return [
        {
            "id": m.id,
            "content": m.content,
            "sender_id": m.sender_id,
            "sender_name": m.sender.name,
            "sent_at": m.sent_at.isoformat()
        }
        for m in messages
    ]

# WEBSOCKET ENDPOINT
@router.websocket("/ws/{event_id}/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    event_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    # check user is registered for this event
    registration = db.query(Registration).filter(
        Registration.event_id == event_id,
        Registration.user_id == user_id
    ).first()

    if not registration:
        await websocket.close(code=4003)
        return

    await manager.connect(websocket, event_id)

    try:
        while True:
            # wait for a message from this user
            data = await websocket.receive_text()

            # save message to database
            new_message = Message(
                content=data,
                sender_id=user_id,
                event_id=event_id
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            # broadcast to everyone in this event's chat
            message_data = json.dumps({
                "sender_id": user_id,
                "sender_name": new_message.sender.name,
                "content": data,
                "sent_at": new_message.sent_at.isoformat()
            })
            await manager.broadcast(message_data, event_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, event_id)