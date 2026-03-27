from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRoleSchema(BaseModel):
    """Schema for user role choices"""
    value: str
    label: str


class UserCreateSchema(BaseModel):
    """Schema for creating a new user"""
    username: str = Field(..., min_length=3, max_length=150, description="Unique username")
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    first_name: Optional[str] = Field(None, max_length=150, description="First name")
    last_name: Optional[str] = Field(None, max_length=150, description="Last name")
    role: Optional[str] = Field('MEMBER', description="User role (ADMIN, STAFF, MEMBER)")
    
    model_config = ConfigDict(from_attributes=True)


class UserUpdateSchema(BaseModel):
    """Schema for updating user information"""
    email: Optional[EmailStr] = Field(None, description="User email address")
    first_name: Optional[str] = Field(None, max_length=150, description="First name")
    last_name: Optional[str] = Field(None, max_length=150, description="Last name")
    role: Optional[str] = Field(None, description="User role (ADMIN, STAFF, MEMBER)")
    is_active: Optional[bool] = Field(None, description="Whether the user account is active")
    
    model_config = ConfigDict(from_attributes=True)


class UserPasswordUpdateSchema(BaseModel):
    """Schema for updating user password"""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")
    
    model_config = ConfigDict(from_attributes=True)


class UserResponseSchema(BaseModel):
    """Schema for user response data"""
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    is_staff: bool
    is_superuser: bool
    date_joined: datetime
    last_login: Optional[datetime] = None
    banned_at: Optional[datetime] = None
    activated_at: Optional[datetime] = None
    email_verified_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserListResponseSchema(BaseModel):
    """Schema for paginated user list response"""
    count: int
    results: list[UserResponseSchema]
    
    model_config = ConfigDict(from_attributes=True)


class MessageResponseSchema(BaseModel):
    """Schema for generic message responses"""
    message: str
    
    model_config = ConfigDict(from_attributes=True)


class ErrorResponseSchema(BaseModel):
    """Schema for error responses"""
    error: str
    details: Optional[dict] = None
    
    model_config = ConfigDict(from_attributes=True)

