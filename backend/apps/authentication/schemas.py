from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ========== Login Schemas ==========

class LoginRequestSchema(BaseModel):
    """Schema for user login request."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=1, description="User's password")


class UserSchema(BaseModel):
    """Schema for user information in responses."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True


class TokenResponseSchema(BaseModel):
    """Schema for JWT token response."""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")


class LoginResponseSchema(BaseModel):
    """Schema for login response."""
    user: UserSchema
    tokens: TokenResponseSchema
    message: str = Field(default="Login successful")


# ========== Token Refresh Schemas ==========

class RefreshTokenRequestSchema(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str = Field(..., description="Valid refresh token")


class RefreshTokenResponseSchema(BaseModel):
    """Schema for token refresh response."""
    access_token: str = Field(..., description="New JWT access token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")


# ========== Forgot Password Schemas ==========

class ForgotPasswordRequestSchema(BaseModel):
    """Schema for forgot password request."""
    email: EmailStr = Field(..., description="Email address of the user")


class ForgotPasswordResponseSchema(BaseModel):
    """Schema for forgot password response."""
    message: str = Field(..., description="Response message")
    email: str = Field(..., description="Email where reset link was sent")


# ========== Reset Password Schemas ==========

class ResetPasswordRequestSchema(BaseModel):
    """Schema for reset password request."""
    token: str = Field(..., min_length=1, description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")
    confirm_password: str = Field(..., min_length=8, description="Password confirmation")
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        """Validate that passwords match."""
        if 'new_password' in info.data and v != info.data['new_password']:
            raise ValueError('Passwords do not match')
        return v


class ResetPasswordResponseSchema(BaseModel):
    """Schema for reset password response."""
    message: str = Field(..., description="Response message")
    success: bool = Field(default=True, description="Whether the reset was successful")


# ========== Change Password Schemas ==========

class ChangePasswordRequestSchema(BaseModel):
    """Schema for changing password while authenticated."""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")
    confirm_password: str = Field(..., min_length=8, description="Password confirmation")
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        """Validate that passwords match."""
        if 'new_password' in info.data and v != info.data['new_password']:
            raise ValueError('Passwords do not match')
        return v


class ChangePasswordResponseSchema(BaseModel):
    """Schema for change password response."""
    message: str = Field(..., description="Response message")
    success: bool = Field(default=True, description="Whether the change was successful")


# ========== Error Schemas ==========

class ErrorResponseSchema(BaseModel):
    """Schema for error responses."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    code: Optional[str] = Field(None, description="Error code")


# ========== Logout Schema ==========

class LogoutRequestSchema(BaseModel):
    """Schema for logout request."""
    refresh_token: str = Field(..., description="Refresh token to invalidate")


class LogoutResponseSchema(BaseModel):
    """Schema for logout response."""
    message: str = Field(default="Logout successful", description="Response message")

