from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ========== Login Schemas ==========

class LoginRequestSchema(BaseModel):
    """Schema for user login request."""
    email: str = Field(..., min_length=1, description="Username or email address")
    password: str = Field(..., min_length=1, description="User password")
    remember_me: bool = Field(default=False, description="Extended session (30 days instead of 7)")


class UserResponseSchema(BaseModel):
    """Schema for user information in responses."""
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class TokenDataSchema(BaseModel):
    """Schema for JWT token data."""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")


class LoginResponseSchema(BaseModel):
    """Schema for login response."""
    user: UserResponseSchema
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    message: str = "Login successful"


# ========== Token Refresh Schemas ==========

class RefreshTokenRequestSchema(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str = Field(..., description="Valid refresh token")


class RefreshTokenResponseSchema(BaseModel):
    """Schema for token refresh response."""
    access_token: str = Field(..., description="New JWT access token")
    refresh_token: Optional[str] = Field(None, description="New refresh token (optional)")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")
    message: str = Field(default="Token refreshed successfully")


# ========== Logout Schemas ==========

class LogoutRequestSchema(BaseModel):
    """Schema for logout request."""
    refresh_token: str = Field(..., description="Refresh token to revoke")


class LogoutResponseSchema(BaseModel):
    """Schema for logout response."""
    message: str = Field(default="Logout successful")


# ========== Error Response Schema ==========

class ErrorResponseSchema(BaseModel):
    """Schema for error responses."""
    message: str = Field(..., description="Error message")
