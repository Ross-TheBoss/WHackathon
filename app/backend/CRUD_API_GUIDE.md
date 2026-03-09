# CRUD API Documentation

The new CRUD router implements the OpenAPI standard and provides full Create, Read, Update, Delete operations for all database tables.

## Base URL
All CRUD endpoints are available at: `http://your-server/api/v1`

## Authentication Endpoints
Authentication endpoints are now prefixed with `/auth`:
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login and get access token

## API Documentation
FastAPI automatically generates interactive API documentation:
- **Swagger UI**: `http://your-server/docs`
- **ReDoc**: `http://your-server/redoc`
- **OpenAPI JSON**: `http://your-server/openapi.json`

## CRUD Endpoints Overview

### Users
- **POST** `/api/v1/users` - Create a new user
- **GET** `/api/v1/users` - Get all users (with filtering & pagination)
- **GET** `/api/v1/users/{user_id}` - Get a specific user
- **PUT** `/api/v1/users/{user_id}` - Update a user
- **DELETE** `/api/v1/users/{user_id}` - Delete a user

### Events
- **POST** `/api/v1/events` - Create a new event
- **GET** `/api/v1/events` - Get all events (with filtering & pagination)
- **GET** `/api/v1/events/{event_id}` - Get a specific event
- **PUT** `/api/v1/events/{event_id}` - Update an event
- **DELETE** `/api/v1/events/{event_id}` - Delete an event

### Reviews
- **POST** `/api/v1/reviews` - Create a new review
- **GET** `/api/v1/reviews` - Get all reviews (with filtering & pagination)
- **GET** `/api/v1/reviews/{review_id}` - Get a specific review
- **PUT** `/api/v1/reviews/{review_id}` - Update a review
- **DELETE** `/api/v1/reviews/{review_id}` - Delete a review

### Registrations
- **POST** `/api/v1/registrations` - Create a new registration
- **GET** `/api/v1/registrations` - Get all registrations (with filtering & pagination)
- **GET** `/api/v1/registrations/{registration_id}` - Get a specific registration
- **PUT** `/api/v1/registrations/{registration_id}` - Update a registration
- **DELETE** `/api/v1/registrations/{registration_id}` - Delete a registration

## Example Usage

### Create a User
```bash
curl -X POST "http://localhost:8000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28,
    "password": "securepassword",
    "role": "participant"
  }'
```

### Get All Users with Filtering
```bash
# Get participants only, skip first 10, limit to 20 results
curl "http://localhost:8000/api/v1/users?skip=10&limit=20&role=participant"
```

### Update a User (Partial Update)
```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "age": 29
  }'
```

### Create an Event
```bash
curl -X POST "http://localhost:8000/api/v1/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Workshop",
    "description": "Learn web development",
    "location": "Community Center",
    "longitude": -0.1278,
    "latitude": 51.5074,
    "event_type": "public",
    "category": "Technology",
    "capacity": 50,
    "start_time": "2026-04-15T10:00:00Z",
    "end_time": "2026-04-15T16:00:00Z",
    "organiser_id": 1
  }'
```

### Get Events with Filters
```bash
# Get public events in Technology category
curl "http://localhost:8000/api/v1/events?event_type=public&category=Technology"
```

### Create a Review
```bash
curl -X POST "http://localhost:8000/api/v1/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "text": "Amazing event! Highly recommend.",
    "user_id": 1,
    "event_id": 1
  }'
```

### Create a Registration
```bash
curl -X POST "http://localhost:8000/api/v1/registrations" \
  -H "Content-Type: application/json" \
  -d '{
    "join_group_chat": true,
    "user_id": 2,
    "event_id": 1
  }'
```

### Delete a Resource
```bash
curl -X DELETE "http://localhost:8000/api/v1/reviews/5"
```

## Query Parameters for GET Endpoints

### Pagination (Available on all list endpoints)
- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Maximum records to return

### Users Filters
- `role` - Filter by role: "participant" or "organiser"

### Events Filters
- `event_type` - Filter by type: "public" or "private"
- `category` - Filter by category: "Music", "Sports", "Arts & Craft", "Technology", "Food", "Gaming"
- `organiser_id` - Filter by organiser ID

### Reviews Filters
- `user_id` - Filter by user who wrote the review
- `event_id` - Filter by event being reviewed
- `min_rating` - Filter reviews with rating >= this value (1-5)

### Registrations Filters
- `user_id` - Filter by registered user
- `event_id` - Filter by event
- `join_group_chat` - Filter by group chat preference (true/false)

## OpenAPI Features

### 1. **Automatic Documentation**
All endpoints are automatically documented with:
- Request/response schemas
- Parameter descriptions
- Example values
- HTTP status codes

### 2. **Data Validation**
- Automatic request validation
- Type checking
- Range validation (e.g., pagination limits, ratings 1-5)
- Required field enforcement

### 3. **Error Handling**
Standard HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation errors, business logic violations)
- `404` - Not Found
- `422` - Unprocessable Entity (invalid data types)

### 4. **Partial Updates**
PUT endpoints support partial updates - only provide the fields you want to change.

### 5. **Business Logic Validation**
- Email uniqueness for users
- Event capacity checks for registrations
- Duplicate registration prevention
- Foreign key validation
- Start/end time validation
- Rating range validation (1-5)

## Testing the API

Start your FastAPI server:
```bash
cd /home/ross/Documents/Software-Projects/WHackathon/app/backend
uvicorn main:app --reload
```

Then visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

The interactive documentation allows you to:
- Try out all endpoints
- See request/response examples
- View schema definitions
- Test with sample data
