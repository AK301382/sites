from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from database import db
from auth import hash_password, verify_password, create_access_token, get_current_user
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])

admin_users_collection = db.admin_users

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    username: str
    email: str
    token: str

class AdminInfo(BaseModel):
    username: str
    email: str

@router.post("/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    """
    Admin login endpoint
    Returns JWT token on successful authentication
    """
    try:
        # Find admin user
        admin = await admin_users_collection.find_one(
            {"username": credentials.username},
            {"_id": 0}
        )
        
        if not admin:
            logger.warning(f"Login attempt with non-existent username: {credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, admin["password"]):
            logger.warning(f"Failed login attempt for user: {credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Create access token
        token = create_access_token(data={
            "sub": admin["username"],
            "email": admin["email"]
        })
        
        logger.info(f"Successful login: {credentials.username}")
        
        return AdminResponse(
            username=admin["username"],
            email=admin["email"],
            token=token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during admin login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.get("/verify", response_model=AdminInfo)
async def verify_token(current_user: dict = Depends(get_current_user)):
    """
    Verify JWT token and return user info
    Protected endpoint - requires valid token
    """
    return AdminInfo(
        username=current_user["username"],
        email=current_user["email"]
    )

@router.post("/logout")
async def admin_logout(current_user: dict = Depends(get_current_user)):
    """
    Admin logout endpoint
    Token invalidation is handled on frontend
    """
    logger.info(f"User logged out: {current_user['username']}")
    return {"message": "Logged out successfully"}
