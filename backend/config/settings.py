"""
Application settings and configuration management using Pydantic Settings.
All environment variables are validated at startup.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from pathlib import Path


class Settings(BaseSettings):
    """Application settings with validation."""
    
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore'
    )
    
    # ==================== Application ====================
    APP_NAME: str = "Kawesh API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # ==================== Security ====================
    SECRET_KEY: str  # REQUIRED - JWT secret key
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Admin credentials (for initialization only)
    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@kawesh.com"
    ADMIN_PASSWORD: str  # REQUIRED for admin initialization
    
    # ==================== Database ====================
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "kawesh_db"
    
    # ==================== CORS ====================
    CORS_ORIGINS: str = "*"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # ==================== Email Configuration ====================
    EMAIL_ENABLED: bool = False
    ADMIN_EMAIL_RECIPIENT: str = "admin@kawesh.com"
    FROM_EMAIL: str = "noreply@kawesh.com"
    
    # Email service providers (optional)
    SENDGRID_API_KEY: str | None = None
    AWS_SES_ACCESS_KEY: str | None = None
    AWS_SES_SECRET_KEY: str | None = None
    
    # ==================== Rate Limiting ====================
    RATE_LIMIT_ENABLED: bool = True
    
    # ==================== Error Tracking ====================
    SENTRY_DSN: str | None = None
    
    # ==================== Feature Flags ====================
    ENABLE_REGISTRATION: bool = True
    ENABLE_SOCIAL_LOGIN: bool = False
    
    # ==================== Logging ====================
    LOG_LEVEL: str = "INFO"
    


# Create global settings instance
settings = Settings()
