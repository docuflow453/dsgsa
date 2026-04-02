from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from ninja import Schema, FilterSchema


class MembershipSchema(Schema):
    """Schema for membership response"""
    id: str
    name: str
    description: str
    is_active: bool
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class MembershipCreateSchema(Schema):
    """Schema for creating a new membership"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the membership type")
    description: str = Field(..., min_length=1, description="Detailed description of the membership")
    is_active: bool = Field(default=False, description="Whether the membership is active")
    notes: Optional[str] = Field(None, description="Additional notes")

    @field_validator('name', 'description')
    @classmethod
    def validate_not_whitespace(cls, v: str, info) -> str:
        """Ensure fields are not just whitespace"""
        if v and not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty or only whitespace")
        return v.strip() if v else v


class MembershipUpdateSchema(Schema):
    """Schema for updating a membership (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1)
    is_active: Optional[bool] = None
    notes: Optional[str] = None

    @field_validator('name', 'description')
    @classmethod
    def validate_not_whitespace(cls, v: Optional[str], info) -> Optional[str]:
        """Ensure fields are not just whitespace"""
        if v is not None and not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty or only whitespace")
        return v.strip() if v else v


class MembershipFilterSchema(FilterSchema):
    """Schema for filtering memberships"""
    name: Optional[str] = Field(None, description="Filter by name (case-insensitive)")
    is_active: Optional[bool] = Field(None, description="Filter by active status")


class MembershipListResponseSchema(Schema):
    """Schema for paginated membership list response"""
    count: int
    results: List[MembershipSchema]


# Subscription Schemas
class SubscriptionSchema(Schema):
    """Schema for subscription response"""
    id: str
    name: str
    description: str
    membership_id: str
    year_id: str
    fee: float
    is_recreational: bool
    is_active: bool
    status: str
    subscription_type: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class SubscriptionCreateSchema(Schema):
    """Schema for creating a new subscription"""
    name: str = Field(..., min_length=1, max_length=200, description="Name of the subscription")
    description: str = Field(..., min_length=1, description="Detailed description of the subscription")
    membership_id: str = Field(..., description="UUID of the associated membership type")
    year_id: str = Field(..., description="UUID of the associated competition year")
    fee: float = Field(..., ge=0, description="Subscription fee (must be non-negative)")
    is_recreational: bool = Field(default=False, description="Whether this is a recreational subscription")
    is_active: bool = Field(default=False, description="Whether the subscription is active")
    notes: Optional[str] = Field(None, description="Additional notes")

    @field_validator('name', 'description')
    @classmethod
    def validate_not_whitespace(cls, v: str, info) -> str:
        """Ensure fields are not just whitespace"""
        if v and not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty or only whitespace")
        return v.strip() if v else v


class SubscriptionUpdateSchema(Schema):
    """Schema for updating a subscription (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    membership_id: Optional[str] = None
    year_id: Optional[str] = None
    fee: Optional[float] = Field(None, ge=0)
    is_recreational: Optional[bool] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None

    @field_validator('name', 'description')
    @classmethod
    def validate_not_whitespace(cls, v: Optional[str], info) -> Optional[str]:
        """Ensure fields are not just whitespace"""
        if v is not None and not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty or only whitespace")
        return v.strip() if v else v


class SubscriptionFilterSchema(FilterSchema):
    """Schema for filtering subscriptions"""
    name: Optional[str] = Field(None, description="Filter by name (case-insensitive)")
    membership_id: Optional[str] = Field(None, description="Filter by membership ID")
    year_id: Optional[str] = Field(None, description="Filter by year ID")
    is_active: Optional[bool] = Field(None, description="Filter by active status")
    is_recreational: Optional[bool] = Field(None, description="Filter by recreational status")


class SubscriptionListResponseSchema(Schema):
    """Schema for paginated subscription list response"""
    count: int
    results: List[SubscriptionSchema]

