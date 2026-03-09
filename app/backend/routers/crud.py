"""
CRUD Router implementing OpenAPI standard for all database tables.
Provides Create, Read, Update, Delete operations for Users, Events, Reviews, and Registrations.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.user import User
from models.event import Event
from models.event_review import Reviews
from models.registration import Registration
from schemas.user import UserResponse, UserRole
from schemas.event import EventBase, EventResponse, EventType, EventCategory
from schemas.event_review import ReviewBase, ReviewResponse
from schemas.registeration import RegistrationBase, RegistrationResponse
from services.auth import hash_password
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# ============================================================================
# PYDANTIC SCHEMAS FOR UPDATE OPERATIONS
# ============================================================================

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserCreate(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
    password: str
    role: UserRole

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    event_type: Optional[EventType] = None
    category: Optional[EventCategory] = None
    capacity: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    organiser_id: Optional[int] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    text: Optional[str] = None
    user_id: Optional[int] = None
    event_id: Optional[int] = None

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationUpdate(BaseModel):
    name: Optional[str] = None
    join_group_chat: Optional[bool] = None
    user_id: Optional[int] = None
    event_id: Optional[int] = None

# ============================================================================
# USER CRUD OPERATIONS
# ============================================================================

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    
    - **name**: User's full name
    - **email**: User's email (must be unique)
    - **age**: User's age (optional)
    - **password**: User's password (will be hashed)
    - **role**: User role (participant or organiser)
    """
    # Check if email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        age=user.age,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users", response_model=List[UserResponse], tags=["Users"])
def get_all_users(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    role: Optional[UserRole] = Query(None, description="Filter by user role"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all users with optional filtering and pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **role**: Filter by user role (optional)
    """
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse, tags=["Users"])
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific user by ID.
    
    - **user_id**: The ID of the user to retrieve
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserResponse, tags=["Users"])
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """
    Update an existing user.
    
    - **user_id**: The ID of the user to update
    - Provide only the fields you want to update
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update only provided fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Handle email uniqueness
    if "email" in update_data and update_data["email"] != db_user.email:
        existing_user = db.query(User).filter(User.email == update_data["email"]).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    # Handle password hashing
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Users"])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    
    - **user_id**: The ID of the user to delete
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return None

# ============================================================================
# EVENT CRUD OPERATIONS
# ============================================================================

@router.post("/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED, tags=["Events"])
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """
    Create a new event.
    
    - **title**: Event title
    - **description**: Event description (optional)
    - **location**: Event location
    - **longitude**: Longitude coordinate (optional)
    - **latitude**: Latitude coordinate (optional)
    - **event_type**: Type of event (public or private)
    - **category**: Event category
    - **capacity**: Maximum number of participants
    - **start_time**: Event start time (ISO format string)
    - **end_time**: Event end time (ISO format string)
    - **organiser_id**: ID of the user organizing the event
    """
    # Verify organiser exists
    organiser = db.query(User).filter(User.id == event.organiser_id).first()
    if not organiser:
        raise HTTPException(status_code=404, detail="Organiser not found")
    
    # Convert string times to datetime
    try:
        start_dt = datetime.fromisoformat(event.start_time.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(event.end_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format.")
    
    if end_dt <= start_dt:
        raise HTTPException(status_code=400, detail="End time must be after start time")
    
    new_event = Event(
        title=event.title,
        description=event.description,
        location=event.location,
        longitude=event.longitude,
        latitude=event.latitude,
        event_type=event.event_type,
        category=event.category,
        capacity=event.capacity,
        start_time=start_dt,
        end_time=end_dt,
        organiser_id=event.organiser_id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/events", response_model=List[EventResponse], tags=["Events"])
def get_all_events(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    event_type: Optional[EventType] = Query(None, description="Filter by event type"),
    category: Optional[EventCategory] = Query(None, description="Filter by category"),
    organiser_id: Optional[int] = Query(None, description="Filter by organiser ID"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all events with optional filtering and pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **event_type**: Filter by event type (optional)
    - **category**: Filter by category (optional)
    - **organiser_id**: Filter by organiser (optional)
    """
    query = db.query(Event)
    
    if event_type:
        query = query.filter(Event.event_type == event_type)
    if category:
        query = query.filter(Event.category == category)
    if organiser_id:
        query = query.filter(Event.organiser_id == organiser_id)
    
    events = query.offset(skip).limit(limit).all()
    return events

@router.get("/events/{event_id}", response_model=EventResponse, tags=["Events"])
def get_event(event_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific event by ID.
    
    - **event_id**: The ID of the event to retrieve
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/events/{event_id}", response_model=EventResponse, tags=["Events"])
def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    """
    Update an existing event.
    
    - **event_id**: The ID of the event to update
    - Provide only the fields you want to update
    """
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_update.model_dump(exclude_unset=True)
    
    # Verify organiser if being updated
    if "organiser_id" in update_data:
        organiser = db.query(User).filter(User.id == update_data["organiser_id"]).first()
        if not organiser:
            raise HTTPException(status_code=404, detail="Organiser not found")
    
    # Handle datetime conversions
    if "start_time" in update_data:
        try:
            update_data["start_time"] = datetime.fromisoformat(update_data["start_time"].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_time format. Use ISO format.")
    
    if "end_time" in update_data:
        try:
            update_data["end_time"] = datetime.fromisoformat(update_data["end_time"].replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_time format. Use ISO format.")
    
    # Validate times
    start_time = update_data.get("start_time", db_event.start_time)
    end_time = update_data.get("end_time", db_event.end_time)
    if end_time <= start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")
    
    for key, value in update_data.items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Events"])
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """
    Delete an event by ID.
    
    - **event_id**: The ID of the event to delete
    """
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(db_event)
    db.commit()
    return None

# ============================================================================
# REVIEW CRUD OPERATIONS
# ============================================================================

@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED, tags=["Reviews"])
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """
    Create a new review.
    
    - **rating**: Rating value (typically 1-5)
    - **text**: Review text (optional)
    - **user_id**: ID of the user writing the review
    - **event_id**: ID of the event being reviewed
    """
    # Verify user exists
    user = db.query(User).filter(User.id == review.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify event exists
    event = db.query(Event).filter(Event.id == review.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Validate rating
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    new_review = Reviews(
        rating=review.rating,
        text=review.text,
        user_id=review.user_id,
        event_id=review.event_id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/reviews", response_model=List[ReviewResponse], tags=["Reviews"])
def get_all_reviews(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    event_id: Optional[int] = Query(None, description="Filter by event ID"),
    min_rating: Optional[int] = Query(None, ge=1, le=5, description="Minimum rating"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all reviews with optional filtering and pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **user_id**: Filter by user (optional)
    - **event_id**: Filter by event (optional)
    - **min_rating**: Minimum rating filter (optional)
    """
    query = db.query(Reviews)
    
    if user_id:
        query = query.filter(Reviews.user_id == user_id)
    if event_id:
        query = query.filter(Reviews.event_id == event_id)
    if min_rating:
        query = query.filter(Reviews.rating >= min_rating)
    
    reviews = query.offset(skip).limit(limit).all()
    return reviews

@router.get("/reviews/{review_id}", response_model=ReviewResponse, tags=["Reviews"])
def get_review(review_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific review by ID.
    
    - **review_id**: The ID of the review to retrieve
    """
    review = db.query(Reviews).filter(Reviews.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.put("/reviews/{review_id}", response_model=ReviewResponse, tags=["Reviews"])
def update_review(review_id: int, review_update: ReviewUpdate, db: Session = Depends(get_db)):
    """
    Update an existing review.
    
    - **review_id**: The ID of the review to update
    - Provide only the fields you want to update
    """
    db_review = db.query(Reviews).filter(Reviews.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    update_data = review_update.model_dump(exclude_unset=True)
    
    # Verify user if being updated
    if "user_id" in update_data:
        user = db.query(User).filter(User.id == update_data["user_id"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    # Verify event if being updated
    if "event_id" in update_data:
        event = db.query(Event).filter(Event.id == update_data["event_id"]).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
    
    # Validate rating
    if "rating" in update_data and (update_data["rating"] < 1 or update_data["rating"] > 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    for key, value in update_data.items():
        setattr(db_review, key, value)
    
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Reviews"])
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """
    Delete a review by ID.
    
    - **review_id**: The ID of the review to delete
    """
    db_review = db.query(Reviews).filter(Reviews.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(db_review)
    db.commit()
    return None

# ============================================================================
# REGISTRATION CRUD OPERATIONS
# ============================================================================

@router.post("/registrations", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED, tags=["Registrations"])
def create_registration(registration: RegistrationCreate, db: Session = Depends(get_db)):
    """
    Create a new registration.
    
    - **name**: Name for the registration
    - **join_group_chat**: Whether user wants to join group chat
    - **user_id**: ID of the user registering
    - **event_id**: ID of the event to register for
    """
    # Verify user exists
    user = db.query(User).filter(User.id == registration.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify event exists
    event = db.query(Event).filter(Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user already registered
    existing = db.query(Registration).filter(
        Registration.user_id == registration.user_id,
        Registration.event_id == registration.event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered for this event")
    
    # Check event capacity
    current_registrations = db.query(Registration).filter(Registration.event_id == registration.event_id).count()
    if current_registrations >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is at full capacity")
    
    new_registration = Registration(
        user_name=registration.name,
        join_group_chat=registration.join_group_chat,
        user_id=registration.user_id,
        event_id=registration.event_id
    )
    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    return new_registration

@router.get("/registrations", response_model=List[RegistrationResponse], tags=["Registrations"])
def get_all_registrations(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    event_id: Optional[int] = Query(None, description="Filter by event ID"),
    join_group_chat: Optional[bool] = Query(None, description="Filter by group chat preference"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all registrations with optional filtering and pagination.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **user_id**: Filter by user (optional)
    - **event_id**: Filter by event (optional)
    - **join_group_chat**: Filter by group chat preference (optional)
    """
    query = db.query(Registration)
    
    if user_id:
        query = query.filter(Registration.user_id == user_id)
    if event_id:
        query = query.filter(Registration.event_id == event_id)
    if join_group_chat is not None:
        query = query.filter(Registration.join_group_chat == join_group_chat)
    
    registrations = query.offset(skip).limit(limit).all()
    return registrations

@router.get("/registrations/{registration_id}", response_model=RegistrationResponse, tags=["Registrations"])
def get_registration(registration_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific registration by ID.
    
    - **registration_id**: The ID of the registration to retrieve
    """
    registration = db.query(Registration).filter(Registration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    return registration

@router.put("/registrations/{registration_id}", response_model=RegistrationResponse, tags=["Registrations"])
def update_registration(registration_id: int, registration_update: RegistrationUpdate, db: Session = Depends(get_db)):
    """
    Update an existing registration.
    
    - **registration_id**: The ID of the registration to update
    - Provide only the fields you want to update
    """
    db_registration = db.query(Registration).filter(Registration.id == registration_id).first()
    if not db_registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    update_data = registration_update.model_dump(exclude_unset=True)
    
    # Verify user if being updated
    if "user_id" in update_data:
        user = db.query(User).filter(User.id == update_data["user_id"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    # Verify event if being updated
    if "event_id" in update_data:
        event = db.query(Event).filter(Event.id == update_data["event_id"]).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Check capacity if event is being changed
        if update_data["event_id"] != db_registration.event_id:
            current_registrations = db.query(Registration).filter(
                Registration.event_id == update_data["event_id"]
            ).count()
            if current_registrations >= event.capacity:
                raise HTTPException(status_code=400, detail="Event is at full capacity")
    
    for key, value in update_data.items():
        setattr(db_registration, key, value)
    
    db.commit()
    db.refresh(db_registration)
    return db_registration

@router.delete("/registrations/{registration_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Registrations"])
def delete_registration(registration_id: int, db: Session = Depends(get_db)):
    """
    Delete a registration by ID.
    
    - **registration_id**: The ID of the registration to delete
    """
    db_registration = db.query(Registration).filter(Registration.id == registration_id).first()
    if not db_registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    db.delete(db_registration)
    db.commit()
    return None
