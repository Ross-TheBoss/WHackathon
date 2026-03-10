from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import User, Event, Reviews, Registration, ChatMember, Message
from routers import login_auth, crud, chat

app = FastAPI(
    title="Woman First API",
    description="RESTful API with full CRUD operations for Users, Events, Reviews, and Registrations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(login_auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(crud.router, prefix="/api/v1", tags=["CRUD Operations"])

app.include_router(chat.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Woman First API is running"}