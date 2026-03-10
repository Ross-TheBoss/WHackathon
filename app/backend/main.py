from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import engine, Base
from models import User, Event, Reviews, Registration
from routers import login_auth, crud

app = FastAPI(
    title="Woman First API",
    description="RESTful API with full CRUD operations for Users, Events, Reviews, and Registrations",
    version="1.0.0"
)

cors_origins = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
if not origins:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(login_auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(crud.router, prefix="/api/v1", tags=["CRUD Operations"])

@app.get("/")
def root():
    return {"message": "Woman First API is running"}