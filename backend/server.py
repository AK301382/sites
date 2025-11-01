from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Response
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from translation_service import translation_service
import shutil
from PIL import Image
import io
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

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
    # Populated fields (not stored in DB, only for API response)
    service_name_en: Optional[str] = None
    service_name_de: Optional[str] = None
    service_name_fr: Optional[str] = None
    service_duration: Optional[str] = None  # Duration as string (e.g., "45 min")
    artist_name: Optional[str] = None


class AppointmentCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    service_id: str
    artist_id: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None

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
    """Email/Password registration"""
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    """Email/Password login"""
    email: str
    password: str

# ============= END USER AUTH MODELS =============

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

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
async def register_user(input: UserRegister, response: Response):
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
async def login_user(input: UserLogin, response: Response):
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

@api_router.get("/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if isinstance(appointment.get('created_at'), str):
        appointment['created_at'] = datetime.fromisoformat(appointment['created_at'])
    return appointment

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(input: AppointmentCreate, request: Request):
    appt_dict = input.model_dump()
    
    # If user is authenticated, link appointment to user
    user = await get_current_user(request)
    if user:
        appt_dict["user_id"] = user.id
    
    appt_obj = Appointment(**appt_dict)
    doc = appt_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    return appt_obj

# Artist Routes with Auto-Translation
@api_router.get("/artists", response_model=List[Artist])
async def get_artists():
    artists = await db.artists.find({}, {"_id": 0}).to_list(1000)
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
        instagram=input.instagram
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

# ============= END USER-SPECIFIC ROUTES =============

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
async def create_contact_message(input: ContactMessageCreate):
    msg_dict = input.model_dump()
    msg_obj = ContactMessage(**msg_dict)
    doc = msg_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
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
    
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
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
        "instagram": input.instagram
    }
    
    result = await db.artists.update_one(
        {"id": artist_id},
        {"$set": artist_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    return Artist(**artist_dict)

@api_router.delete("/artists/{artist_id}")
async def delete_artist(artist_id: str):
    result = await db.artists.delete_one({"id": artist_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"}

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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
