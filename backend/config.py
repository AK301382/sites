"""
Configuration and Environment Validation
Ensures all required environment variables are present and valid
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings with validation"""
    
    # Database
    MONGO_URL: str
    DB_NAME: str = "fabulous_nails"
    
    # CORS
    CORS_ORIGINS: str = "*"
    
    # Security
    JWT_SECRET: Optional[str] = "your-secret-key-change-in-production"
    
    # Admin Credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    
    # Application
    APP_NAME: str = "Fabulous Nails & Spa"
    APP_VERSION: str = "1.0.0"
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get settings instance"""
    return settings


def validate_settings():
    """Validate critical settings"""
    errors = []
    
    if not settings.MONGO_URL:
        errors.append("MONGO_URL is required")
    
    if not settings.DB_NAME:
        errors.append("DB_NAME is required")
    
    if settings.JWT_SECRET == "your-secret-key-change-in-production":
        print("⚠️  WARNING: Using default JWT_SECRET. Change this in production!")
    
    if settings.ADMIN_PASSWORD == "admin123":
        print("⚠️  WARNING: Using default admin password. Change this in production!")
    
    if errors:
        raise ValueError(f"Configuration errors: {', '.join(errors)}")
    
    print("✅ Configuration validated successfully")
    return True
