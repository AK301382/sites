"""Security utilities - JWT and password handling."""
from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from config.settings import settings
import re

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class PasswordHandler:
    """Handle password hashing and verification."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, list[str]]:
        """Validate password strength.
        
        Returns:
            tuple: (is_valid, list_of_errors)
        """
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r"[A-Z]", password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r"[a-z]", password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r"\d", password):
            errors.append("Password must contain at least one digit")
        
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            errors.append("Password must contain at least one special character")
        
        return len(errors) == 0, errors


class JWTHandler:
    """Handle JWT token creation and verification."""
    
    def __init__(self, secret_key: str = None, algorithm: str = None, expire_hours: int = None):
        self.secret_key = secret_key or settings.SECRET_KEY
        self.algorithm = algorithm or settings.JWT_ALGORITHM
        self.expire_hours = expire_hours or settings.ACCESS_TOKEN_EXPIRE_HOURS
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token."""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(hours=self.expire_hours)
        
        to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def decode_token(self, token: str) -> Optional[dict]:
        """Decode and verify a JWT token."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None


# Create global instances
password_handler = PasswordHandler()
jwt_handler = JWTHandler()

# Helper function for creating tokens
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token using global jwt_handler."""
    return jwt_handler.create_access_token(data, expires_delta)
