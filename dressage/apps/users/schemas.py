from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from ninja import FilterSchema
from django.db.models import Q


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


class UserFilterSchema(FilterSchema):
    """Schema for filtering users"""
    search: Optional[str] = Field(None, description="Search by username, email, first name, or last name")
    role: Optional[str] = Field(None, description="Filter by user role (ADMIN, STAFF, MEMBER)")
    is_active: Optional[bool] = Field(None, description="Filter by active status")
    limit: int = Field(100, description="Number of results to return (default: 100, max: 1000)", ge=1, le=1000)
    offset: int = Field(0, description="Number of results to skip (for pagination)", ge=0)

    def filter(self, queryset):
        """Apply filters to the queryset"""
        # Apply search filter
        if self.search:
            queryset = queryset.filter(
                Q(username__icontains=self.search) |
                Q(email__icontains=self.search) |
                Q(first_name__icontains=self.search) |
                Q(last_name__icontains=self.search)
            )

        # Apply role filter
        if self.role:
            queryset = queryset.filter(role=self.role)

        # Apply is_active filter
        if self.is_active is not None:
            queryset = queryset.filter(is_active=self.is_active)

        return queryset

