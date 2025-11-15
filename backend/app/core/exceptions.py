"""Custom exceptions for the application."""
from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    """Exception raised when a resource is not found."""
    
    def __init__(self, resource: str, identifier: str = None):
        detail = f"{resource} not found"
        if identifier:
            detail = f"{resource} with identifier '{identifier}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class AlreadyExistsException(HTTPException):
    """Exception raised when a resource already exists."""
    
    def __init__(self, resource: str, identifier: str = None):
        detail = f"{resource} already exists"
        if identifier:
            detail = f"{resource} with identifier '{identifier}' already exists"
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class UnauthorizedException(HTTPException):
    """Exception raised when authentication fails."""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(HTTPException):
    """Exception raised when access is forbidden."""
    
    def __init__(self, detail: str = "Access forbidden"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ValidationException(HTTPException):
    """Exception raised when validation fails."""
    
    def __init__(self, detail: str, errors: list = None):
        response_detail = {"message": detail}
        if errors:
            response_detail["errors"] = errors
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=response_detail)


class DatabaseException(HTTPException):
    """Exception raised when database operations fail."""
    
    def __init__(self, detail: str = "Database operation failed"):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)


class DuplicateException(HTTPException):
    """Exception raised when a duplicate resource is attempted to be created."""
    
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class AuthenticationException(HTTPException):
    """Exception raised when authentication fails."""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class PermissionDeniedException(HTTPException):
    """Exception raised when user doesn't have required permissions."""
    
    def __init__(self, detail: str = "Permission denied"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)