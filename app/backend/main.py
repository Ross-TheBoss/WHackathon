import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from models import User, Event, Reviews, Registration
from routers import login_auth, crud

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    logger.info("Database initialization completed")
    yield


app = FastAPI(
    title="Woman First API",
    description="RESTful API with full CRUD operations for Users, Events, Reviews, and Registrations",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

# CORS is optional. Keep it disabled by default when frontend proxies to backend
# from the same origin (Railway nginx setup).
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(login_auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(crud.router, prefix="/api/v1", tags=["CRUD Operations"])

@app.get("/")
def root():
    return {"message": "Woman First API is running"}