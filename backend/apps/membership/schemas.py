from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict, field_validator
from ninja import FilterSchema


class MembershipSchema(BaseModel):
    """Schema for Membership response data"""
    id: int
    name: str
    description: str
    is_active: bool
    notes: Optional[str] = None
    created_at: str
    updated_at: str
    
    model_config = ConfigDict(from_attributes=True)


class MembershipCreateSchema(BaseModel):
    """Schema for creating a new membership"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the membership type")
    description: str = Field(..., min_length=1, description="Detailed description of the membership type")
    is_active: bool = Field(False, description="Whether this membership is active")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Ensure name is not empty or only whitespace"""
        if not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        return v.strip()
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        """Ensure description is not empty or only whitespace"""
        if not v.strip():
            raise ValueError('Description cannot be empty or only whitespace')
        return v.strip()
    
    model_config = ConfigDict(from_attributes=True)


class MembershipUpdateSchema(BaseModel):
    """Schema for updating an existing membership"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Name of the membership type")
    description: Optional[str] = Field(None, min_length=1, description="Description of the membership type")
    is_active: Optional[bool] = Field(None, description="Active status")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Ensure name is not empty or only whitespace"""
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        return v.strip() if v else v
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        """Ensure description is not empty or only whitespace"""
        if v is not None and not v.strip():
            raise ValueError('Description cannot be empty or only whitespace')
        return v.strip() if v else v
    
    model_config = ConfigDict(from_attributes=True)


class MembershipListResponseSchema(BaseModel):
    """Schema for paginated membership list response"""
    count: int
    results: list[MembershipSchema]
    
    model_config = ConfigDict(from_attributes=True)


class MessageResponseSchema(BaseModel):
    """Schema for generic message responses"""
    message: str
    
    model_config = ConfigDict(from_attributes=True)


class MembershipFilterSchema(FilterSchema):
    """Schema for filtering memberships"""
    name: Optional[str] = Field(None, description="Filter by name (case-insensitive lookup)")
    is_active: Optional[bool] = Field(None, description="Filter by active status")
    limit: int = Field(100, description="Number of results to return (default: 100, max: 1000)", ge=1, le=1000)
    offset: int = Field(0, description="Number of results to skip (for pagination)", ge=0)
    
    def filter(self, queryset):
        """Apply filters to the queryset"""
        # Apply name filter with case-insensitive lookup
        if self.name:
            queryset = queryset.filter(name__icontains=self.name)
        
        # Apply active status filter
        if self.is_active is not None:
            queryset = queryset.filter(is_active=self.is_active)

        return queryset


# Subscription Schemas

class SubscriptionSchema(BaseModel):
    """Schema for Subscription response data"""
    id: int
    name: str
    description: str
    year_id: int
    year_name: str = Field(alias="year.name")
    membership_id: int
    membership_name: str = Field(alias="membership.name")
    fee: Decimal
    fee_including_vat: Decimal
    is_active: bool
    is_recreational: bool
    notes: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SubscriptionCreateSchema(BaseModel):
    """Schema for creating a new subscription"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the subscription type")
    description: str = Field(..., min_length=1, description="Detailed description of the subscription")
    year_id: int = Field(..., description="ID of the competition year")
    membership_id: int = Field(..., description="ID of the membership type")
    fee: Decimal = Field(..., ge=0, description="Subscription fee (excluding VAT)")
    fee_including_vat: Decimal = Field(..., ge=0, description="Subscription fee including VAT")
    is_active: bool = Field(False, description="Whether this subscription is active")
    is_recreational: bool = Field(False, description="Whether this is recreational")
    notes: Optional[str] = Field(None, description="Additional notes")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Ensure name is not empty or only whitespace"""
        if not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        return v.strip()

    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        """Ensure description is not empty or only whitespace"""
        if not v.strip():
            raise ValueError('Description cannot be empty or only whitespace')
        return v.strip()

    @field_validator('fee')
    @classmethod
    def validate_fee(cls, v):
        """Ensure fee is non-negative"""
        if v < 0:
            raise ValueError('Fee must be non-negative')
        return v

    @field_validator('fee_including_vat')
    @classmethod
    def validate_fee_including_vat(cls, v, info):
        """Ensure fee_including_vat is >= fee"""
        if 'fee' in info.data and v < info.data['fee']:
            raise ValueError('Fee including VAT must be greater than or equal to base fee')
        return v

    model_config = ConfigDict(from_attributes=True)


class SubscriptionUpdateSchema(BaseModel):
    """Schema for updating an existing subscription"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Name of the subscription")
    description: Optional[str] = Field(None, min_length=1, description="Description of the subscription")
    year_id: Optional[int] = Field(None, description="ID of the competition year")
    membership_id: Optional[int] = Field(None, description="ID of the membership type")
    fee: Optional[Decimal] = Field(None, ge=0, description="Subscription fee (excluding VAT)")
    fee_including_vat: Optional[Decimal] = Field(None, ge=0, description="Subscription fee including VAT")
    is_active: Optional[bool] = Field(None, description="Active status")
    is_recreational: Optional[bool] = Field(None, description="Recreational status")
    notes: Optional[str] = Field(None, description="Additional notes")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Ensure name is not empty or only whitespace"""
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        return v.strip() if v else v

    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        """Ensure description is not empty or only whitespace"""
        if v is not None and not v.strip():
            raise ValueError('Description cannot be empty or only whitespace')
        return v.strip() if v else v

    @field_validator('fee')
    @classmethod
    def validate_fee(cls, v):
        """Ensure fee is non-negative"""
        if v is not None and v < 0:
            raise ValueError('Fee must be non-negative')
        return v

    model_config = ConfigDict(from_attributes=True)


class SubscriptionListResponseSchema(BaseModel):
    """Schema for paginated subscription list response"""
    count: int
    results: list[SubscriptionSchema]

    model_config = ConfigDict(from_attributes=True)


class SubscriptionFilterSchema(FilterSchema):
    """Schema for filtering subscriptions"""
    name: Optional[str] = Field(None, description="Filter by name (case-insensitive lookup)")
    is_active: Optional[bool] = Field(None, description="Filter by active status")
    year_id: Optional[int] = Field(None, description="Filter by year ID")
    membership_id: Optional[int] = Field(None, description="Filter by membership ID")
    is_recreational: Optional[bool] = Field(None, description="Filter by recreational status")
    limit: int = Field(100, description="Number of results to return (default: 100, max: 1000)", ge=1, le=1000)
    offset: int = Field(0, description="Number of results to skip (for pagination)", ge=0)

    def filter(self, queryset):
        """Apply filters to the queryset"""
        # Apply name filter with case-insensitive lookup
        if self.name:
            queryset = queryset.filter(name__icontains=self.name)

        # Apply active status filter
        if self.is_active is not None:
            queryset = queryset.filter(is_active=self.is_active)

        # Apply year filter
        if self.year_id:
            queryset = queryset.filter(year_id=self.year_id)

        # Apply membership filter
        if self.membership_id:
            queryset = queryset.filter(membership_id=self.membership_id)

        # Apply recreational filter
        if self.is_recreational is not None:
            queryset = queryset.filter(is_recreational=self.is_recreational)

        return queryset

