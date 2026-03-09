from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import User, Event, Reviews, Registration
from routers import login_auth

app = FastAPI(title="Woman First API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(login_auth.router)

@app.get("/")
def root():
    return {"message": "Woman First API is running"}