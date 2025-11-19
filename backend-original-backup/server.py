from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, validator, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import re
from translation_service import translation_service
import shutil
from PIL import Image
import io
import httpx
from notification_service import NotificationService
from notification_cleanup_scheduler import initialize_cleanup_scheduler, shutdown_cleanup_scheduler
from reminder_scheduler import initialize_reminder_scheduler, shutdown_reminder_scheduler
from booking_service import (
    parse_duration,
    time_to_minutes,
    generate_time_slots,
    get_blocked_slots,
    filter_available_slots,
    check_overlap,
    is_valid_booking_date
)
# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
# Initialize Notification Service
notification_service = NotificationService(db)

# Create the main app without a prefix
app = FastAPI(
    title="Fabulous Nails & Spa API",
    version="1.0.0",
    description="Smart Booking System with Advanced Features"
)

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models - Now with automatic translation
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_de: str
    name_fr: str
    description_en: str
    description_de: str
    description_fr: str
    category: str
    price: str
    duration: str
    image_url: Optional[str] = None

class ServiceCreate(BaseModel):
    """Admin only needs to provide German text, auto-translates to EN and FR"""
    name: str  # German (Swiss or Standard)
    description: str  # German (Swiss or Standard)
    category: str
    price: str
    duration: str
    image_url: Optional[str] = None

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_phone: str
    service_id: str
    artist_id: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None
    status: str = "pending"
    user_id: Optional[str] = None  # Link to User for authenticated bookings
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # Reminder fields
    reminder_sent: bool = False  # آیا reminder ارسال شده
    reminder_sent_at: Optional[str] = None  # زمان ارسال reminder (ISO format)
    # Populated fields (not stored in DB, only for API response)
    service_name_en: Optional[str] = None
    service_name_de: Optional[str] = None
    service_name_fr: Optional[str] = None
    service_duration: Optional[str] = None  # Duration as string (e.g., "45 min")
    artist_name: Optional[str] = None


class AppointmentCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr  # Email validation
    customer_phone: str
    service_id: str
    artist_id: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None
    
    @validator('customer_name')
    def validate_name(cls, v):
        """Validate customer name"""
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name too long (max 100 characters)')
        return v.strip()
    
    @validator('customer_phone')
    def validate_phone(cls, v):
        """Validate phone number (basic validation)"""
        # Remove spaces and common separators
        cleaned = re.sub(r'[\s\-\(\)]', '', v)
        # Check if it's a reasonable phone number
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError('Invalid phone number format')
        return v
    
    @validator('appointment_date')
    def validate_date(cls, v):
        """Validate appointment date"""
        try:
            date_obj = datetime.strptime(v, '%Y-%m-%d').date()
            if date_obj < datetime.now().date():
                raise ValueError('Cannot book appointments in the past')
            # Don't allow booking too far in advance (e.g., 6 months)
            max_date = datetime.now().date() + timedelta(days=180)
            if date_obj > max_date:
                raise ValueError('Cannot book more than 6 months in advance')
            return v
        except ValueError as e:
            if 'past' in str(e) or 'advance' in str(e):
                raise
            raise ValueError('Invalid date format. Use YYYY-MM-DD')
    
    @validator('appointment_time')
    def validate_time(cls, v):
        """Validate appointment time"""
        try:
            time_obj = datetime.strptime(v, '%H:%M').time()
            # Business hours: 9 AM - 7 PM
            if time_obj < datetime.strptime('09:00', '%H:%M').time():
                raise ValueError('Appointment time must be after 9:00 AM')
            if time_obj >= datetime.strptime('19:00', '%H:%M').time():
                raise ValueError('Appointment time must be before 7:00 PM')
            return v
        except ValueError as e:
            if 'after' in str(e) or 'before' in str(e):
                raise
            raise ValueError('Invalid time format. Use HH:MM')
    
    @validator('notes')
    def validate_notes(cls, v):
        """Validate notes length"""
        if v and len(v) > 500:
            raise ValueError('Notes too long (max 500 characters)')
        return v

# ============= USER AUTH MODELS =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    email: str
    name: str
    google_id: Optional[str] = None
    password_hash: Optional[str] = None  # For email/password auth
    profile_picture: Optional[str] = None
    auth_method: str = "google"  # "google" or "email"
    email_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    """Email/Password registration with validation"""
    email: EmailStr  # Email validation
    password: str
    name: str
    
    @validator('name')
    def validate_name(cls, v):
        """Validate name"""
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name too long (max 100 characters)')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        if len(v) > 100:
            raise ValueError('Password too long (max 100 characters)')
        return v

class UserLogin(BaseModel):
    """Email/Password login"""
    email: EmailStr  # Email validation
    password: str

# ============= END USER AUTH MODELS =============

# ============= NOTIFICATION MODELS =============

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # "appointment_confirmed", "appointment_reminder", "appointment_cancelled", "general"
    title_de: str
    title_en: str
    title_fr: str
    message_de: str
    message_en: str
    message_fr: str
    appointment_id: Optional[str] = None
    is_read: bool = False
    created_at: str  # ISO format datetime string

# ============= END NOTIFICATION MODELS =============
class NotificationBroadcast(BaseModel):
    """Admin notification broadcast model - no auto-translation"""
    title: str  # Title in admin's chosen language
    message: str  # Message in admin's chosen language
    user_ids: List[str]  # List of user IDs to send to (empty = all users)

class Artist(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    bio_en: str
    bio_de: str
    bio_fr: str
    specialties_en: str
    specialties_de: str
    specialties_fr: str
    years_experience: int
    image_url: str
    instagram: Optional[str] = None
    active: bool = True

class ArtistCreate(BaseModel):
    """Admin only needs to provide German text"""
    name: str
    bio: str  # German
    specialties: str  # German
    years_experience: int
    image_url: str
    instagram: Optional[str] = None

class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    title_en: str
    title_de: str
    title_fr: str
    artist_name: str
    style: str
    colors: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryItemCreate(BaseModel):
    """Admin only needs to provide German text"""
    image_url: str
    title: str  # German
    artist_name: str
    style: str
    colors: List[str]

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    user_id: Optional[str] = None  # Link to User if they are registered
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr  # Email validation
    phone: Optional[str] = None
    message: str
    
    @validator('name')
    def validate_name(cls, v):
        """Validate name"""
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name too long')
        return v.strip()
    
    @validator('message')
    def validate_message(cls, v):
        """Validate message"""
        if not v or len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters')
        if len(v) > 1000:
            raise ValueError('Message too long (max 1000 characters)')
        return v.strip()
    
    @validator('phone')
    def validate_phone(cls, v):
        """Validate phone if provided"""
        if v:
            cleaned = re.sub(r'[\s\-\(\)]', '', v)
            if not re.match(r'^\+?\d{10,15}$', cleaned):
                raise ValueError('Invalid phone number format')
        return v

# ============= AUTH HELPER FUNCTIONS =============

async def get_current_user(request: Request) -> Optional[User]:
    """
    Get current user from session_token in cookie or Authorization header
    """
    # Try cookie first (preferred method)
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        return None
    
    # Find session in database
    session = await db.user_sessions.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    }, {"_id": 0})
    
    if not session:
        return None
    
    # Find user
    user_doc = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
    
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_user(request: Request) -> User:
    """
    Require authenticated user, raise 401 if not found
    """
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

# ============= END AUTH HELPER FUNCTIONS =============

# ============= AUTH ROUTES =============

EMERGENT_SESSION_API = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """
    Process session_id from frontend and create session_token
    """
    try:
        # Get session_id from request body
        body = await request.json()
        session_id = body.get("session_id")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")
        
        # Call Emergent API to get user data
        async with httpx.AsyncClient() as client:
            emergent_response = await client.get(
                EMERGENT_SESSION_API,
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            
            if emergent_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session_id")
            
            user_data = emergent_response.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
        
        if existing_user:
            # Use existing user
            user = User(**existing_user)
        else:
            # Create new user
            user = User(
                email=user_data["email"],
                name=user_data["name"],
                google_id=user_data["id"],
                profile_picture=user_data.get("picture"),
                auth_method="google",
                email_verified=True
            )
            
            # Save to database
            user_dict = user.model_dump()
            await db.users.insert_one(user_dict)
        
        # Create session with 7 days expiry
        session_token = user_data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        # Save session to database
        await db.user_sessions.insert_one(session.model_dump())
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,  # 7 days in seconds
            path="/"
        )
        
        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "profile_picture": user.profile_picture
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create session")

@api_router.get("/auth/me")
async def get_current_user_info(request: Request):
    """
    Get current authenticated user info
    """
    user = await require_user(request)
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat()
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """
    Logout user - delete session and clear cookie
    """
    session_token = request.cookies.get("session_token")
    
    if session_token:
        # Delete session from database
        await db.user_sessions.delete_one({"session_token": session_token})
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    
    return {"success": True, "message": "Logged out successfully"}

# ============= EMAIL/PASSWORD AUTH ROUTES =============

@api_router.post("/auth/register")
@limiter.limit("5/hour")  # Max 5 registrations per hour
async def register_user(request: Request, input: UserRegister, response: Response):
    """
    Register new user with email and password
    """
    try:
        # Check if email already exists
        existing_user = await db.users.find_one({"email": input.email.lower()}, {"_id": 0})
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Validate password strength (minimum 6 characters)
        if len(input.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Hash password using bcrypt
        import bcrypt
        password_hash = bcrypt.hashpw(input.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create new user
        user = User(
            email=input.email.lower(),
            name=input.name,
            password_hash=password_hash,
            auth_method="email",
            email_verified=False
        )
        
        # Save to database
        user_dict = user.model_dump()
        await db.users.insert_one(user_dict)
        
        # Create session
        session_token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        await db.user_sessions.insert_one(session.model_dump())
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "auth_method": user.auth_method
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")

@api_router.post("/auth/login")
@limiter.limit("10/minute")  # Max 10 login attempts per minute
async def login_user(request: Request, input: UserLogin, response: Response):
    """
    Login user with email and password
    """
    try:
        # Find user by email
        user_doc = await db.users.find_one({"email": input.email.lower()}, {"_id": 0})
        
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = User(**user_doc)
        
        # Check if user registered with email (not Google)
        if user.auth_method != "email" or not user.password_hash:
            raise HTTPException(status_code=400, detail="This email is registered with Google. Please use Google login.")
        
        # Verify password
        import bcrypt
        if not bcrypt.checkpw(input.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create session
        session_token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        await db.user_sessions.insert_one(session.model_dump())
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "profile_picture": user.profile_picture
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to login")

# ============= END EMAIL/PASSWORD AUTH ROUTES =============

# ============= END AUTH ROUTES =============

# Service Routes with Auto-Translation
@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    return services

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@api_router.post("/services", response_model=Service)
async def create_service(input: ServiceCreate):
    # Translate name and description automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    desc_translations = await translation_service.translate_to_all_languages(input.description)
    
    # Create service with all language versions
    service_obj = Service(
        name_en=name_translations['en'],
        name_de=name_translations['de'],
        name_fr=name_translations['fr']
,
        description_en=desc_translations['en'],
        description_de=desc_translations['de'],
        description_fr=desc_translations['fr'],
        category=input.category,
        price=input.price,
        duration=input.duration,
        image_url=input.image_url
    )
    
    doc = service_obj.model_dump()
    await db.services.insert_one(doc)
    return service_obj

# Appointment Routes

# ============= SMART BOOKING AVAILABILITY ROUTES =============
# NOTE: These must come BEFORE /appointments/{appointment_id} to avoid route conflicts

@api_router.get("/appointments/availability")
async def get_appointment_availability(
    artist_id: str,
    date: str,
    service_id: str,
    exclude_appointment_id: Optional[str] = None
):
    """
    Get available time slots for an artist on a specific date

    Query Parameters:
        - artist_id: Artist ID
        - date: Date in YYYY-MM-DD format
        - service_id: Service ID (to get duration)
        - exclude_appointment_id: Optional, for rescheduling

    Returns:
        {
            "success": true,
            "available_slots": ["09:00", "09:30", ...],
            "blocked_slots": [{"start": "10:00", "duration": 45}, ...],
            "service_duration": 45,
            "date": "2025-11-15",
            "artist_id": "artist-id"
        }
    """
    try:
        # Validate inputs
        if not artist_id or not date or not service_id:
            raise HTTPException(
                status_code=400,
                detail="artist_id, date, and service_id are required"
            )

        # Validate date
        is_valid, error_msg = is_valid_booking_date(date)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        # Get service details
        service = await db.services.find_one({"id": service_id}, {"_id": 0})
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")

        # Parse duration
        service_duration = parse_duration(service.get("duration", "60 min"))

        # Get all possible time slots (9 AM - 7 PM, 30 min intervals)
        all_slots = generate_time_slots(
            start_hour=9,
            end_hour=19,
            interval=30
        )

        # Get blocked slots for this artist on this date
        blocked_slots = await get_blocked_slots(
            db,
            artist_id,
            date,
            exclude_appointment_id
        )

        # Filter available slots
        available_slots = filter_available_slots(
            all_slots,
            blocked_slots,
            service_duration,
            buffer_time=10  # 10 min buffer between appointments
        )

        logger.info(
            f"Availability check: artist={artist_id}, date={date}, "
            f"service_duration={service_duration}min, "
            f"blocked={len(blocked_slots)}, available={len(available_slots)}"
        )

        return {
            "success": True,
            "available_slots": available_slots,
            "blocked_slots": blocked_slots,
            "service_duration": service_duration,
            "date": date,
            "artist_id": artist_id
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting availability: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get availability: {str(e)}"
        )


class AvailabilityCheckRequest(BaseModel):
    """Request model for checking specific time slot availability"""
    artist_id: str
    date: str
    time: str
    service_id: str
    exclude_appointment_id: Optional[str] = None


@api_router.post("/appointments/check-availability")
async def check_specific_availability(request_data: AvailabilityCheckRequest):
    """
    Check if a specific time slot is available

    Body:
        {
            "artist_id": "artist-id",
            "date": "2025-11-15",
            "time": "14:00",
            "service_id": "service-id",
            "exclude_appointment_id": "optional-for-rescheduling"
        }

    Returns:
        {
            "available": true/false,
            "reason": "Time slot not available" (if unavailable)
        }
    """
    try:
        # Validate date
        is_valid, error_msg = is_valid_booking_date(request_data.date)
        if not is_valid:
            return {"available": False, "reason": error_msg}

        # Get service duration
        service = await db.services.find_one({"id": request_data.service_id}, {"_id": 0})
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")

        service_duration = parse_duration(service.get("duration", "60 min"))

        # Get blocked slots
        blocked_slots = await get_blocked_slots(
            db,
            request_data.artist_id,
            request_data.date,
            request_data.exclude_appointment_id
        )

        # Check if requested time is available
        requested_minutes = time_to_minutes(request_data.time)

        for blocked in blocked_slots:
            blocked_start = time_to_minutes(blocked["start"])
            blocked_duration = blocked["duration"] + 10  # Add 10 min buffer

            if check_overlap(
                requested_minutes,
                service_duration + 10,
                blocked_start,
                blocked_duration
            ):
                return {
                    "available": False,
                    "reason": "This time slot overlaps with an existing appointment"
                }

        logger.info(
            f"Availability confirmed: {request_data.artist_id} - "
            f"{request_data.date} {request_data.time}"
        )

        return {"available": True}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking availability: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check availability: {str(e)}"
        )

# ============= END SMART BOOKING ROUTES =============

# Get All Appointments
@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    
    # Populate service and artist details
    for appt in appointments:
        if isinstance(appt.get('created_at'), str):
            appt['created_at'] = datetime.fromisoformat(appt['created_at'])
        
        # Get service details
        if appt.get('service_id'):
            service = await db.services.find_one({"id": appt['service_id']}, {"_id": 0})
            if service:
                appt['service_name_en'] = service.get('name_en', '')
                appt['service_name_de'] = service.get('name_de', '')
                appt['service_name_fr'] = service.get('name_fr', '')
                appt['service_duration'] = service.get('duration', '')
        
        # Get artist details
        if appt.get('artist_id'):
            artist = await db.artists.find_one({"id": appt['artist_id']}, {"_id": 0})
            if artist:
                appt['artist_name'] = artist.get('name', '')
    
    return appointments

# Get Single Appointment
@api_router.get("/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if isinstance(appointment.get('created_at'), str):
        appointment['created_at'] = datetime.fromisoformat(appointment['created_at'])
    return appointment

# Create Appointment
@api_router.post("/appointments", response_model=Appointment)
@limiter.limit("10/minute")  # Max 10 appointments per minute
async def create_appointment(request: Request, input: AppointmentCreate):
    appt_dict = input.model_dump()
    
    # If user is authenticated, link appointment to user
    user = await get_current_user(request)
    if user:
        appt_dict["user_id"] = user.id
    
    appt_obj = Appointment(**appt_dict)
    doc = appt_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    
    logger.info(f"Appointment created: {appt_obj.id} by {user.email if user else appt_dict['customer_email']}")
    return appt_obj

# Artist Routes with Auto-Translation
@api_router.get("/artists", response_model=List[Artist])
async def get_artists(admin: bool = False):
    """
    Get artists list
    - If admin=True: return all artists (for admin panel)
    - If admin=False: return only active artists (for customer-facing pages)
    """
    if admin:
        # Admin panel: show all artists
        artists = await db.artists.find({}, {"_id": 0}).to_list(1000)
    else:
        # Customer-facing: show only active artists
        artists = await db.artists.find({"active": True}, {"_id": 0}).to_list(1000)
    return artists

@api_router.get("/artists/{artist_id}", response_model=Artist)
async def get_artist(artist_id: str):
    artist = await db.artists.find_one({"id": artist_id}, {"_id": 0})
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist

@api_router.post("/artists", response_model=Artist)
async def create_artist(input: ArtistCreate):
    # Translate bio and specialties automatically
    bio_translations = await translation_service.translate_to_all_languages(input.bio)
    spec_translations = await translation_service.translate_to_all_languages(input.specialties)
    
    artist_obj = Artist(
        name=input.name,
        bio_en=bio_translations['en'],
        bio_de=bio_translations['de'],
        bio_fr=bio_translations['fr'],
        specialties_en=spec_translations['en'],
        specialties_de=spec_translations['de'],
        specialties_fr=spec_translations['fr'],
        years_experience=input.years_experience,
        image_url=input.image_url,
        instagram=input.instagram,
        active=True  # New artists are active by default
    )
    
    doc = artist_obj.model_dump()
    await db.artists.insert_one(doc)
    return artist_obj

# ============= USER-SPECIFIC ROUTES =============

@api_router.get("/user/appointments", response_model=List[Appointment])
async def get_user_appointments(request: Request):
    """
    Get all appointments for the authenticated user
    """
    user = await require_user(request)
    
    appointments = await db.appointments.find({"user_id": user.id}, {"_id": 0}).to_list(1000)
    
    # Populate service and artist details
    for appt in appointments:
        if isinstance(appt.get('created_at'), str):
            appt['created_at'] = datetime.fromisoformat(appt['created_at'])
        
        # Get service details
        if appt.get('service_id'):
            service = await db.services.find_one({"id": appt['service_id']}, {"_id": 0})
            if service:
                appt['service_name_en'] = service.get('name_en', '')
                appt['service_name_de'] = service.get('name_de', '')
                appt['service_name_fr'] = service.get('name_fr', '')
                appt['service_duration'] = service.get('duration', '')
        
        # Get artist details
        if appt.get('artist_id'):
            artist = await db.artists.find_one({"id": appt['artist_id']}, {"_id": 0})
            if artist:
                appt['artist_name'] = artist.get('name', '')
    
    return appointments

@api_router.get("/user/stats")
async def get_user_stats(request: Request):
    """
    Get user statistics for dashboard
    """
    user = await require_user(request)
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Calculate stats
    total_appointments = await db.appointments.count_documents({"user_id": user.id})
    
    upcoming_appointments = await db.appointments.count_documents({
        "user_id": user.id,
        "status": {"$in": ["pending", "confirmed"]},
        "appointment_date": {"$gte": today}
    })
    
    completed_appointments = await db.appointments.count_documents({
        "user_id": user.id,
        "status": "completed"
    })
    
    cancelled_appointments = await db.appointments.count_documents({
        "user_id": user.id,
        "status": "cancelled"
    })
    
    return {
        "total_appointments": total_appointments,
        "upcoming_appointments": upcoming_appointments,
        "completed_appointments": completed_appointments,
        "cancelled_appointments": cancelled_appointments
    }


@api_router.post("/user/appointments/{appointment_id}/cancel")
async def cancel_user_appointment(appointment_id: str, request: Request):
    """
    User can cancel their own appointment
    (Only pending and confirmed appointments can be cancelled)
    """
    user = await require_user(request)
    
    # Get appointment
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check ownership
    if appointment.get("user_id") != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this appointment")
    
    # Check status
    if appointment["status"] not in ["pending", "confirmed"]:
        raise HTTPException(
            status_code=400, 
            detail="Cannot cancel this appointment. Only pending or confirmed appointments can be cancelled."
        )
    
    # Update status to cancelled
    await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": "cancelled"}}
    )
    
    # Send notification to user
    try:
        service = await db.services.find_one({"id": appointment["service_id"]}, {"_id": 0})
        service_name = service.get("name_de", "Ihr Service") if service else "Ihr Service"
        
        title_text = "Termin storniert"
        message_text = (
            f"Sie haben Ihren Termin für {service_name} "
            f"am {appointment['appointment_date']} "
            f"um {appointment['appointment_time']} Uhr storniert."
        )
        
        await notification_service.create_notification(
            user_id=user.id,
            notification_type="appointment_cancelled",
            title_text=title_text,
            message_text=message_text,
            appointment_id=appointment_id
        )
        
        logger.info(f"User {user.id} cancelled appointment {appointment_id}")
    except Exception as e:
        logger.error(f"Error sending cancellation notification: {str(e)}")
        # Don't fail the cancellation if notification fails
    
    return {"success": True, "message": "Appointment cancelled successfully"}


@api_router.get("/user/profile")
async def get_user_profile(request: Request):
    """
    Get user profile information
    """
    user = await require_user(request)
    
    # Get user's appointment stats
    total_appointments = await db.appointments.count_documents({"user_id": user.id})
    upcoming_appointments = await db.appointments.count_documents({
        "user_id": user.id,
        "status": {"$in": ["pending", "confirmed"]},
        "appointment_date": {"$gte": datetime.now(timezone.utc).strftime("%Y-%m-%d")}
    })
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat(),
        "stats": {
            "total_appointments": total_appointments,
            "upcoming_appointments": upcoming_appointments
        }
    }


@api_router.put("/user/profile")
async def update_user_profile(request: Request):
    """
    Update user profile (name and phone)
    """
    user = await require_user(request)
    
    try:
        body = await request.json()
        
        update_data = {}
        if body.get("name"):
            update_data["name"] = body["name"]
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        await db.users.update_one(
            {"id": user.id},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await db.users.find_one({"id": user.id}, {"_id": 0})
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "user": {
                "id": updated_user["id"],
                "email": updated_user["email"],
                "name": updated_user["name"],
                "profile_picture": updated_user.get("profile_picture")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update profile")

# ============= END USER-SPECIFIC ROUTES =============

# ============= NOTIFICATION ROUTES =============

@api_router.get("/user/notifications")
async def get_user_notifications(request: Request, limit: int = 50, unread_only: bool = False):
    """
    Get notifications for authenticated user
    """
    user = await require_user(request)
    notifications = await notification_service.get_user_notifications(
        user.id,
        limit=limit,
        unread_only=unread_only
    )
    return {"notifications": notifications}

@api_router.get("/user/notifications/unread-count")
async def get_unread_count(request: Request):
    """
    Get count of unread notifications
    """
    user = await require_user(request)
    count = await notification_service.get_unread_count(user.id)
    return {"unread_count": count}

@api_router.patch("/user/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, request: Request):
    """
    Mark a specific notification as read
    """
    user = await require_user(request)
    success = await notification_service.mark_as_read(notification_id, user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"success": True, "message": "Notification marked as read"}

@api_router.patch("/user/notifications/read-all")
async def mark_all_notifications_read(request: Request):
    """
    Mark all notifications as read for authenticated user
    """
    user = await require_user(request)
    count = await notification_service.mark_all_as_read(user.id)
    return {"success": True, "marked_count": count}

@api_router.delete("/user/notifications/{notification_id}")
async def delete_notification(notification_id: str, request: Request):
    """
    Delete a specific notification
    """
    user = await require_user(request)
    success = await notification_service.delete_notification(notification_id, user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"success": True, "message": "Notification deleted"}

# ============= END NOTIFICATION ROUTES =============

# Gallery Routes with Auto-Translation
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery_items(style: Optional[str] = None, color: Optional[str] = None):
    query = {}
    if style:
        query["style"] = style
    if color:
        query["colors"] = color
    
    items = await db.gallery.find(query, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(input: GalleryItemCreate):
    # Translate title automatically
    title_translations = await translation_service.translate_to_all_languages(input.title)
    
    item_obj = GalleryItem(
        image_url=input.image_url,
        title_en=title_translations['en'],
        title_de=title_translations['de'],
        title_fr=title_translations['fr'],
        artist_name=input.artist_name,
        style=input.style,
        colors=input.colors
    )
    
    doc = item_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery.insert_one(doc)
    return item_obj

# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
@limiter.limit("5/hour")  # Max 5 contact messages per hour
async def create_contact_message(input: ContactMessageCreate, request: Request):
    msg_dict = input.model_dump()
    
    # Check if user is authenticated and link to user_id
    user = await get_current_user(request)
    if user:
        # Try to find user by email if not authenticated or link by email
        user_by_email = await db.users.find_one({"email": input.email.lower()}, {"_id": 0})
        if user_by_email:
            msg_dict["user_id"] = user_by_email["id"]
    
    msg_obj = ContactMessage(**msg_dict)
    doc = msg_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    
    logger.info(f"Contact message received from: {msg_obj.email}")
    return msg_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"}

@api_router.post("/admin/contact/{message_id}/send-notification")
async def send_notification_to_contact_sender(message_id: str, input: NotificationBroadcast):
    """
    Send notification to contact message sender if they have a user account
    No automatic translation - sends exactly what admin provides
    """
    try:
        # Get contact message
        contact_msg = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
        
        if not contact_msg:
            raise HTTPException(status_code=404, detail="Contact message not found")
        
        # Check if contact has user_id or find user by email
        user_id = contact_msg.get("user_id")
        
        if not user_id:
            # Try to find user by email
            user = await db.users.find_one({"email": contact_msg["email"].lower()}, {"_id": 0})
            if user:
                user_id = user["id"]
                # Update contact message with user_id for future use
                await db.contact_messages.update_one(
                    {"id": message_id},
                    {"$set": {"user_id": user_id}}
                )
            else:
                raise HTTPException(
                    status_code=400, 
                    detail="This contact message is not linked to a registered user account"
                )
        
        # Create notification (without translation)
        notification = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "general",
            "title_de": input.title,  # Same text for all languages
            "title_en": input.title,
            "title_fr": input.title,
            "message_de": input.message,  # Same text for all languages
            "message_en": input.message,
            "message_fr": input.message,
            "appointment_id": None,
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.notifications.insert_one(notification)
        
        logger.info(f"Sent notification to user {user_id} for contact message {message_id}")
        
        return {
            "success": True,
            "message": "Notification sent successfully",
            "user_id": user_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send notification")

# ============= ADMIN ROUTES =============

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminStats(BaseModel):
    total_appointments: int
    total_services: int
    total_gallery_items: int
    total_messages: int
    pending_appointments: int
    confirmed_appointments: int

# Admin Authentication (Simple - for MVP)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        return {
            "success": True,
            "token": "admin_authenticated",
            "username": ADMIN_USERNAME
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.post("/admin/logout")
async def admin_logout():
    return {"success": True, "message": "Logged out successfully"}

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats():
    total_appointments = await db.appointments.count_documents({})
    total_services = await db.services.count_documents({})
    total_gallery = await db.gallery.count_documents({})
    total_messages = await db.contact_messages.count_documents({})
    pending_appointments = await db.appointments.count_documents({"status": "pending"})
    confirmed_appointments = await db.appointments.count_documents({"status": "confirmed"})
    
    return AdminStats(
        total_appointments=total_appointments,
        total_services=total_services,
        total_gallery_items=total_gallery,
        total_messages=total_messages,
        pending_appointments=pending_appointments,
        confirmed_appointments=confirmed_appointments
    )

# Services Update/Delete with Auto-Translation
@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, input: ServiceCreate):
    # Translate name and description automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    desc_translations = await translation_service.translate_to_all_languages(input.description)
    
    service_dict = {
        "id": service_id,
        "name_en": name_translations['en'],
        "name_de": name_translations['de'],
        "name_fr": name_translations['fr']
,
        "description_en": desc_translations['en'],
        "description_de": desc_translations['de'],
        "description_fr": desc_translations['fr'],
        "category": input.category,
        "price": input.price,
        "duration": input.duration,
        "image_url": input.image_url
    }
    
    result = await db.services.update_one(
        {"id": service_id},
        {"$set": service_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return Service(**service_dict)

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

# Appointments Update/Delete
class AppointmentUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    service_id: Optional[str] = None
    artist_id: Optional[str] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

@api_router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, input: AppointmentUpdate):
    update_dict = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if isinstance(appointment.get('created_at'), str):
        appointment['created_at'] = datetime.fromisoformat(appointment['created_at'])
    return Appointment(**appointment)

@api_router.patch("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str):
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    # Get appointment details before updating
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Send notification if appointment is confirmed and user_id exists
    if status == "confirmed" and appointment.get("user_id"):
        try:
            # Get service details for notification
            service = await db.services.find_one({"id": appointment["service_id"]}, {"_id": 0})
            service_name = service.get("name_de", "Ihr Service") if service else "Ihr Service"
            
            # Create notification with German text (will be auto-translated)
            title_text = "Termin bestätigt! ✅"
            message_text = (
                f"Ihr Termin für {service_name} "
                f"am {appointment['appointment_date']} "
                f"um {appointment['appointment_time']} Uhr wurde bestätigt."
            )
            
            await notification_service.create_notification(
                user_id=appointment["user_id"],
                notification_type="appointment_confirmed",
                title_text=title_text,
                message_text=message_text,
                appointment_id=appointment_id
            )
            
            logger.info(f"Confirmation notification sent for appointment {appointment_id}")
        except Exception as e:
            logger.error(f"Error sending confirmation notification: {str(e)}")
            # Don't fail the status update if notification fails
    
    # Send notification if appointment is cancelled and user_id exists
    if status == "cancelled" and appointment.get("user_id"):
        try:
            # Get service details for notification
            service = await db.services.find_one({"id": appointment["service_id"]}, {"_id": 0})
            service_name = service.get("name_de", "Ihr Service") if service else "Ihr Service"
            
            title_text = "Termin abgesagt"
            message_text = (
                f"Ihr Termin für {service_name} "
                f"am {appointment['appointment_date']} "
                f"um {appointment['appointment_time']} Uhr wurde abgesagt."
            )
            
            await notification_service.create_notification(
                user_id=appointment["user_id"],
                notification_type="appointment_cancelled",
                title_text=title_text,
                message_text=message_text,
                appointment_id=appointment_id
            )
            
            logger.info(f"Cancellation notification sent for appointment {appointment_id}")
        except Exception as e:
            logger.error(f"Error sending cancellation notification: {str(e)}")
    
    return {"message": "Status updated successfully", "status": status}

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    result = await db.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}

# Gallery Update/Delete with Auto-Translation
@api_router.put("/gallery/{item_id}", response_model=GalleryItem)
async def update_gallery_item(item_id: str, input: GalleryItemCreate):
    # Translate title automatically
    title_translations = await translation_service.translate_to_all_languages(input.title)
    
    item_dict = {
        "id": item_id,
        "image_url": input.image_url,
        "title_en": title_translations['en'],
        "title_de": title_translations['de'],
        "title_fr": title_translations['fr'],
        "artist_name": input.artist_name,
        "style": input.style,
        "colors": input.colors
    }
    
    result = await db.gallery.update_one(
        {"id": item_id},
        {"$set": item_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    item = await db.gallery.find_one({"id": item_id}, {"_id": 0})
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    return GalleryItem(**item)

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}

# Artists Update/Delete with Auto-Translation
@api_router.put("/artists/{artist_id}", response_model=Artist)
async def update_artist(artist_id: str, input: ArtistCreate):
    # Get existing artist to preserve active status
    existing_artist = await db.artists.find_one({"id": artist_id}, {"_id": 0})
    if not existing_artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    # Translate bio and specialties automatically
    bio_translations = await translation_service.translate_to_all_languages(input.bio)
    spec_translations = await translation_service.translate_to_all_languages(input.specialties)
    
    artist_dict = {
        "id": artist_id,
        "name": input.name,
        "bio_en": bio_translations['en'],
        "bio_de": bio_translations['de'],
        "bio_fr": bio_translations['fr'],
        "specialties_en": spec_translations['en'],
        "specialties_de": spec_translations['de'],
        "specialties_fr": spec_translations['fr'],
        "years_experience": input.years_experience,
        "image_url": input.image_url,
        "instagram": input.instagram,
        "active": existing_artist.get("active", True)  # Preserve existing active status
    }
    
    result = await db.artists.update_one(
        {"id": artist_id},
        {"$set": artist_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    return Artist(**artist_dict)

@api_router.patch("/artists/{artist_id}/toggle-active")
async def toggle_artist_active(artist_id: str):
    """Toggle artist active/inactive status"""
    artist = await db.artists.find_one({"id": artist_id}, {"_id": 0})
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    # Toggle the active status
    new_active_status = not artist.get("active", True)
    
    result = await db.artists.update_one(
        {"id": artist_id},
        {"$set": {"active": new_active_status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    return {
        "message": "Artist status updated successfully",
        "active": new_active_status
    }

@api_router.delete("/artists/{artist_id}")
async def delete_artist(artist_id: str):
    result = await db.artists.delete_one({"id": artist_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"}

# ============= ADMIN USER MANAGEMENT ROUTES =============

@api_router.get("/admin/users")
async def get_all_users_with_stats():
    """
    Get all users with their booking statistics for admin panel
    Sorted by completed appointments count (descending)
    """
    try:
        # Get all users
        users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
        
        user_stats = []
        
        for user in users:
            # Get booking statistics
            total_bookings = await db.appointments.count_documents({"user_id": user["id"]})
            completed_bookings = await db.appointments.count_documents({
                "user_id": user["id"],
                "status": "completed"
            })
            pending_bookings = await db.appointments.count_documents({
                "user_id": user["id"],
                "status": {"$in": ["pending", "confirmed"]}
            })
            
            user_stats.append({
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "profile_picture": user.get("profile_picture"),
                "created_at": user["created_at"].isoformat() if isinstance(user.get("created_at"), datetime) else user.get("created_at"),
                "total_bookings": total_bookings,
                "completed_bookings": completed_bookings,
                "pending_bookings": pending_bookings,
                "auth_method": user.get("auth_method", "google")
            })
        
        # Sort by completed bookings (descending)
        user_stats.sort(key=lambda x: x["completed_bookings"], reverse=True)
        
        return {
            "success": True,
            "users": user_stats,
            "total_users": len(user_stats)
        }
        
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")


@api_router.post("/admin/notifications/send")
async def send_notification_to_users(input: NotificationBroadcast):
    """
    Send notification to selected users or all users
    No automatic translation - sends exactly what admin provides
    """
    try:
        # Determine target users
        if not input.user_ids or len(input.user_ids) == 0:
            # Send to all users
            users = await db.users.find({}, {"_id": 0, "id": 1}).to_list(10000)
            target_user_ids = [user["id"] for user in users]
        else:
            # Send to selected users
            target_user_ids = input.user_ids
        
        if not target_user_ids:
            raise HTTPException(status_code=400, detail="No users found to send notification")
        
        # Create notifications for each user (without translation)
        notifications = []
        for user_id in target_user_ids:
            notification = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "type": "general",
                "title_de": input.title,  # Same text for all languages
                "title_en": input.title,
                "title_fr": input.title,
                "message_de": input.message,  # Same text for all languages
                "message_en": input.message,
                "message_fr": input.message,
                "appointment_id": None,
                "is_read": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            notifications.append(notification)
        
        # Bulk insert notifications
        if notifications:
            await db.notifications.insert_many(notifications)
        
        logger.info(f"Sent notification to {len(target_user_ids)} users")
        
        return {
            "success": True,
            "message": f"Notification sent to {len(target_user_ids)} user(s)",
            "recipients_count": len(target_user_ids)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send notification")


@api_router.post("/admin/appointments/{appointment_id}/send-notification")
async def send_notification_to_appointment_customer(appointment_id: str, input: NotificationBroadcast):
    """
    Send notification to specific appointment customer
    No automatic translation - sends exactly what admin provides
    """
    try:
        # Get appointment
        appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Check if appointment has user_id
        if not appointment.get("user_id"):
            raise HTTPException(
                status_code=400, 
                detail="This appointment is not linked to a user account. Cannot send notification."
            )
        
        # Create notification (without translation)
        notification = {
            "id": str(uuid.uuid4()),
            "user_id": appointment["user_id"],
            "type": "general",
            "title_de": input.title,  # Same text for all languages
            "title_en": input.title,
            "title_fr": input.title,
            "message_de": input.message,  # Same text for all languages
            "message_en": input.message,
            "message_fr": input.message,
            "appointment_id": appointment_id,
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.notifications.insert_one(notification)
        
        logger.info(f"Sent notification to user {appointment['user_id']} for appointment {appointment_id}")
        
        return {
            "success": True,
            "message": "Notification sent successfully",
            "user_id": appointment["user_id"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send notification")

# ============= END ADMIN USER MANAGEMENT ROUTES =============

# ============= SETTINGS ROUTES =============

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    business_name_en: str = "Fabulous Nails & Spa"
    business_name_de: str = "Fabulous Nails & Spa"
    business_name_fr: str = "Fabulous Nails & Spa"
    phone: str
    email: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    postal_code: str
    country: str
    hours_weekday: str
    hours_saturday: str
    hours_sunday: str
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    whatsapp_number: Optional[str] = None

class SettingsUpdate(BaseModel):
    business_name: Optional[str] = None  # German input only
    phone: Optional[str] = None
    email: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    hours_weekday: Optional[str] = None
    hours_saturday: Optional[str] = None
    hours_sunday: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    whatsapp_number: Optional[str] = None

@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        # Return default settings if none exist
        default_settings = Settings(
            phone="+41433179015",
            email="info@fabulousnails.ch",
            address_line1="Werdstrasse 34",
            address_line2="",
            city="Zürich",
            postal_code="8004",
            country="Switzerland",
            hours_weekday="Mon-Fri: 10:00 - 19:00",
            hours_saturday="Sat: 10:00 - 16:00",
            hours_sunday="Sun: Closed",
            instagram_url="https://www.instagram.com/fabulousnails.ch/",
            facebook_url="https://www.facebook.com/p/Fabulous-Nails-100063610540446/",
            whatsapp_number="+41433179015"
        )
        await db.settings.insert_one(default_settings.model_dump())
        return default_settings
    return Settings(**settings)

@api_router.put("/settings", response_model=Settings)
async def update_settings(input: SettingsUpdate):
    update_dict = {}
    
    # Handle business name translation if provided
    if input.business_name:
        name_translations = await translation_service.translate_to_all_languages(input.business_name)
        update_dict['business_name_en'] = name_translations['en']
        update_dict['business_name_de'] = name_translations['de']
        update_dict['business_name_fr'] = name_translations['fr']
    
    # Handle other fields
    for field in ['phone', 'email', 'address_line1', 'address_line2', 'city', 'postal_code', 
                  'country', 'hours_weekday', 'hours_saturday', 'hours_sunday', 
                  'instagram_url', 'facebook_url', 'whatsapp_number']:
        value = getattr(input, field)
        if value is not None:
            update_dict[field] = value
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.settings.update_one(
        {"id": "site_settings"},
        {"$set": update_dict},
        upsert=True
    )
    
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    return Settings(**settings)
# ============= SERVICE CATEGORIES ROUTES =============

class ServiceCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_de: str
    name_fr: str

class ServiceCategoryCreate(BaseModel):
    """Admin provides name, auto-translates to all languages"""
    name: str  # German input

@api_router.get("/categories", response_model=List[ServiceCategory])
async def get_categories():
    categories = await db.service_categories.find({}, {"_id": 0}).to_list(1000)
    return categories

@api_router.post("/categories", response_model=ServiceCategory)
async def create_category(input: ServiceCategoryCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    category_obj = ServiceCategory(
        name_en=name_translations['en'],
        name_de=name_translations['de'],
        name_fr=name_translations['fr']
    )
    
    doc = category_obj.model_dump()
    await db.service_categories.insert_one(doc)
    return category_obj

@api_router.put("/categories/{category_id}", response_model=ServiceCategory)
async def update_category(category_id: str, input: ServiceCategoryCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    category_dict = {
        "id": category_id,
        "name_en": name_translations['en'],
        "name_de": name_translations['de'],
        "name_fr": name_translations['fr']
    }
    
    result = await db.service_categories.update_one(
        {"id": category_id},
        {"$set": category_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return ServiceCategory(**category_dict)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    result = await db.service_categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# ============= GALLERY STYLES ROUTES =============

class GalleryStyle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_de: str
    name_fr: str

class GalleryStyleCreate(BaseModel):
    """Admin provides name, auto-translates to all languages"""
    name: str  # German input

@api_router.get("/gallery-styles", response_model=List[GalleryStyle])
async def get_gallery_styles():
    styles = await db.gallery_styles.find({}, {"_id": 0}).to_list(1000)
    return styles

@api_router.post("/gallery-styles", response_model=GalleryStyle)
async def create_gallery_style(input: GalleryStyleCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    style_obj = GalleryStyle(
        name_en=name_translations['en'],
        name_de=name_translations['de'],
        name_fr=name_translations['fr']
    )
    
    doc = style_obj.model_dump()
    await db.gallery_styles.insert_one(doc)
    return style_obj

@api_router.put("/gallery-styles/{style_id}", response_model=GalleryStyle)
async def update_gallery_style(style_id: str, input: GalleryStyleCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    style_dict = {
        "id": style_id,
        "name_en": name_translations['en'],
        "name_de": name_translations['de'],
        "name_fr": name_translations['fr']
    }
    
    result = await db.gallery_styles.update_one(
        {"id": style_id},
        {"$set": style_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Style not found")
    
    return GalleryStyle(**style_dict)

@api_router.delete("/gallery-styles/{style_id}")
async def delete_gallery_style(style_id: str):
    result = await db.gallery_styles.delete_one({"id": style_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Style not found")
    return {"message": "Style deleted successfully"}

# ============= GALLERY COLORS ROUTES =============

class GalleryColor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_de: str
    name_fr: str

class GalleryColorCreate(BaseModel):
    """Admin provides name only, auto-translates to all languages"""
    name: str  # German input

@api_router.get("/gallery-colors", response_model=List[GalleryColor])
async def get_gallery_colors():
    colors = await db.gallery_colors.find({}, {"_id": 0}).to_list(1000)
    return colors

@api_router.post("/gallery-colors", response_model=GalleryColor)
async def create_gallery_color(input: GalleryColorCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    color_obj = GalleryColor(
        name_en=name_translations['en'],
        name_de=name_translations['de'],
        name_fr=name_translations['fr']
    )
    
    doc = color_obj.model_dump()
    await db.gallery_colors.insert_one(doc)
    return color_obj

@api_router.put("/gallery-colors/{color_id}", response_model=GalleryColor)
async def update_gallery_color(color_id: str, input: GalleryColorCreate):
    # Translate name automatically
    name_translations = await translation_service.translate_to_all_languages(input.name)
    
    color_dict = {
        "id": color_id,
        "name_en": name_translations['en'],
        "name_de": name_translations['de'],
        "name_fr": name_translations['fr']
    }
    
    result = await db.gallery_colors.update_one(
        {"id": color_id},
        {"$set": color_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Color not found")
    
    return GalleryColor(**color_dict)

@api_router.delete("/gallery-colors/{color_id}")
async def delete_gallery_color(color_id: str):
    result = await db.gallery_colors.delete_one({"id": color_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Color not found")
    return {"message": "Color deleted successfully"}

# ============= ADMIN REMINDER TRIGGER (FOR TESTING) =============

@api_router.post("/admin/trigger-reminder-check")
async def trigger_reminder_check():
    """
    Manually trigger reminder check (for testing)
    Admin can use this to test the reminder system without waiting 30 minutes
    """
    try:
        from reminder_scheduler import reminder_scheduler
        
        if reminder_scheduler:
            await reminder_scheduler.check_upcoming_appointments()
            return {"success": True, "message": "Reminder check triggered successfully"}
        else:
            raise HTTPException(status_code=500, detail="Reminder scheduler not initialized")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering reminder check: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to trigger reminder check: {str(e)}")

# ============= END ADMIN REMINDER TRIGGER =============

# ============= IMAGE UPLOAD ROUTE =============

# Create uploads directory if it doesn't exist
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed image formats
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def optimize_image(image: Image.Image, max_size: tuple = (1920, 1920)) -> io.BytesIO:
    """Optimize and resize image"""
    # Convert RGBA to RGB if needed
    if image.mode == 'RGBA':
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[3])
        image = background
    
    # Resize if too large
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Save optimized image to bytes
    output = io.BytesIO()
    image.save(output, format='JPEG', quality=85, optimize=True)
    output.seek(0)
    return output

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and optimize image"""
    try:
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Max size: 10MB")
        
        # Open and optimize image
        try:
            image = Image.open(io.BytesIO(content))
            optimized_image = optimize_image(image)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.jpg"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save optimized image
        with open(file_path, "wb") as f:
            f.write(optimized_image.getvalue())
        
        # Return URL path
        image_url = f"/uploads/{unique_filename}"
        
        logger.info(f"Image uploaded successfully: {unique_filename}")
        return {
            "success": True,
            "image_url": image_url,
            "filename": unique_filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

# Include the router in the main app
app.include_router(api_router)
# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# CORS Middleware با تنظیمات امنیتی
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for better error reporting"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        logger.info("🚀 Starting Fabulous Nails & Spa API...")
        logger.info(f"📊 CORS Origins: {cors_origins}")
        
        # Start notification cleanup scheduler
        initialize_cleanup_scheduler(notification_service)
        logger.info("✅ Notification cleanup scheduler initialized")
        
        # Start reminder scheduler
        initialize_reminder_scheduler(db, notification_service)
        logger.info("✅ Reminder scheduler initialized")
        
        logger.info("🎉 All services started successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error initializing services: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    """Cleanup on shutdown"""
    try:
        logger.info("🛑 Shutting down services...")
        
        # Shutdown schedulers
        shutdown_cleanup_scheduler()
        shutdown_reminder_scheduler()
        logger.info("✅ All schedulers stopped")
        
    except Exception as e:
        logger.error(f"❌ Error during shutdown: {str(e)}")
    finally:
        # Close database connection
        client.close()
        logger.info("✅ Database connection closed")

# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command('ping')
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "database": "connected",
            "services": {
                "notifications": "running",
                "reminders": "running"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "error": str(e)
            }
        )
