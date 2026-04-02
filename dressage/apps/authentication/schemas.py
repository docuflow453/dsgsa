from uuid import UUID
from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr, Field, field_validator


# ========== Login Schemas ==========

class LoginRequestSchema(BaseModel):
    """Schema for user login request."""
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=1, description="User password")
    remember_me: bool = Field(default=False, description="Extended session (30 days instead of 7)")


class UserResponseSchema(BaseModel):
    """Schema for user information in responses."""
    id: UUID  # UUID as string
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


# ========== Registration Schemas ==========

class RegistrationRequestSchema(BaseModel):
    """Schema for user registration request."""
    # User fields
    email: EmailStr = Field(..., description="Email address (unique)")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    title: Optional[str] = Field(None, description="User title (MR, MRS, MS, MISS, DR, PROF)")
    first_name: str = Field(..., min_length=1, max_length=150, description="First name")
    maiden_name: Optional[str] = Field(None, max_length=150, description="Maiden name (optional)")
    last_name: str = Field(..., min_length=1, max_length=150, description="Last name")
    role: str = Field(..., description="User role (RIDER, OFFICIAL, CLUB, etc.)")

    # Rider/Official profile fields (required for RIDER and OFFICIAL roles)
    date_of_birth: Optional[date] = Field(None, description="Date of birth (required for riders and officials)")
    gender: Optional[str] = Field(None, description="Gender (MALE, FEMALE, OTHER)")
    nationality: Optional[str] = Field(None, min_length=2, max_length=2, description="Nationality (ISO 3166-1 alpha-2)")
    id_number: Optional[str] = Field(None, description="South African ID number (13 digits)")
    passport_number: Optional[str] = Field(None, description="Passport number")
    ethnicity: Optional[str] = Field(None, description="Ethnicity (optional)")

    # Address fields (optional)
    address_line_1: Optional[str] = Field(None, max_length=255, description="Address line 1")
    address_line_2: Optional[str] = Field(None, max_length=255, description="Address line 2")
    suburb: Optional[str] = Field(None, max_length=100, description="Suburb")
    city: Optional[str] = Field(None, max_length=100, description="City")
    province: Optional[str] = Field(None, max_length=100, description="Province")
    postal_code: Optional[str] = Field(None, max_length=20, description="Postal code")
    country: Optional[str] = Field(None, min_length=2, max_length=2, description="Country (ISO 3166-1 alpha-2)")

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        """Validate role is allowed."""
        allowed_roles = ['RIDER', 'OFFICIAL', 'CLUB', 'PROVINCIAL', 'SHOW_HOLDING_BODY', 'PUBLIC']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v

    @field_validator('id_number')
    @classmethod
    def validate_id_number(cls, v):
        """Validate SA ID number format."""
        if v and len(v) != 13:
            raise ValueError('SA ID number must be exactly 13 digits')
        if v and not v.isdigit():
            raise ValueError('SA ID number must contain only digits')
        return v


class RegistrationResponseSchema(BaseModel):
    """Schema for registration response."""
    user: UserResponseSchema
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")
    message: str = Field(default="Registration successful")
