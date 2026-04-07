"""
Pydantic schemas for Rider API endpoints.
"""
from datetime import date, datetime
from typing import Optional, Dict
from uuid import UUID
from pydantic import BaseModel, Field, field_validator


# ========== Rider Schemas ==========

class RiderSchema(BaseModel):
    """Full rider response schema"""
    id: UUID
    user_id: UUID
    saef_number: Optional[str] = None
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    date_of_birth: date
    gender: str
    ethnicity: Optional[str] = None
    nationality: Optional[str] = None

    # Address fields
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    suburb: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

    # Banking details
    account_type: Optional[str] = None
    account_name: Optional[str] = None
    bank_name: Optional[str] = None

    # Status fields
    is_active: bool
    is_test: bool

    # Computed properties
    full_name: str
    age: int
    full_address: str
    status: str

    # Audit fields
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @field_validator('nationality', 'country', mode='before')
    @classmethod
    def convert_country_field(cls, v):
        """
        Convert django_countries.Country object to string (ISO 3166-1 alpha-2 code).

        Django's CountryField returns a Country object with .code and .name attributes.
        We need to extract just the code string for JSON serialization.
        """
        if v is None:
            return None
        # If it's a Country object, get the code
        if hasattr(v, 'code'):
            return v.code if v.code else None
        # If it's already a string, return as is
        if isinstance(v, str):
            return v
        return str(v)


class RiderCreateSchema(BaseModel):
    """Schema for creating a new rider"""
    user_id: UUID
    saef_number: Optional[str] = None
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    date_of_birth: date
    gender: str = Field(..., pattern="^(MALE|FEMALE|OTHER)$")
    ethnicity: Optional[str] = Field(None, pattern="^(BLACK_AFRICAN|COLOURED|INDIAN|WHITE|OTHER)$")
    nationality: str = Field(..., min_length=1)
    
    # Address fields
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    suburb: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    
    # Banking details
    account_type: Optional[str] = Field(None, pattern="^(SAVINGS|CURRENT|CHEQUE)$")
    account_name: Optional[str] = None
    bank_name: Optional[str] = None
    
    # Status fields
    is_test: bool = False
    
    @field_validator('nationality')
    @classmethod
    def validate_nationality(cls, v):
        if not v or not v.strip():
            raise ValueError("Nationality cannot be empty or whitespace")
        return v
    
    @field_validator('id_number')
    @classmethod
    def validate_id_number(cls, v):
        if v and (len(v) != 13 or not v.isdigit()):
            raise ValueError("SA ID number must be exactly 13 digits")
        return v


class RiderUpdateSchema(BaseModel):
    """Schema for updating a rider (all fields optional)"""
    saef_number: Optional[str] = None
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, pattern="^(MALE|FEMALE|OTHER)$")
    ethnicity: Optional[str] = Field(None, pattern="^(BLACK_AFRICAN|COLOURED|INDIAN|WHITE|OTHER)$")
    nationality: Optional[str] = None

    # Address fields
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    suburb: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

    # Banking details
    account_type: Optional[str] = Field(None, pattern="^(SAVINGS|CURRENT|CHEQUE)$")
    account_name: Optional[str] = None
    bank_name: Optional[str] = None

    @field_validator('nationality', 'country', mode='before')
    @classmethod
    def convert_country_field(cls, v):
        """
        Convert django_countries.Country object to string (ISO 3166-1 alpha-2 code).

        Django's CountryField returns a Country object with .code and .name attributes.
        We need to extract just the code string for JSON serialization.
        """
        if v is None:
            return None
        # If it's a Country object, get the code
        if hasattr(v, 'code'):
            return v.code if v.code else None
        # If it's already a string, return as is
        if isinstance(v, str):
            return v
        return str(v)

    @field_validator('id_number')
    @classmethod
    def validate_id_number(cls, v):
        if v and (len(v) != 13 or not v.isdigit()):
            raise ValueError("SA ID number must be exactly 13 digits")
        return v


class RiderFilterSchema(BaseModel):
    """Schema for filtering riders"""
    search: Optional[str] = None
    is_active: Optional[bool] = None
    nationality: Optional[str] = None
    is_test: Optional[bool] = None
    limit: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class RiderListResponseSchema(BaseModel):
    """Paginated list response for riders"""
    total: int
    limit: int
    offset: int
    riders: list[RiderSchema]


# ========== RiderAccount Schemas ==========

class RiderAccountSchema(BaseModel):
    """Full rider account response schema"""
    id: UUID
    rider_id: UUID
    year_id: UUID
    subscription_id: Optional[UUID] = None
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RiderAccountCreateSchema(BaseModel):
    """Schema for creating a new rider account"""
    rider_id: UUID
    year_id: UUID
    subscription_id: Optional[UUID] = None


class RiderAccountUpdateSchema(BaseModel):
    """Schema for updating a rider account"""
    subscription_id: Optional[UUID] = None
    is_active: Optional[bool] = None


# ========== SaefMembership Schemas ==========

class SaefMembershipSchema(BaseModel):
    """Full SAEF membership response schema"""
    id: UUID
    rider_id: UUID
    membership_number: str
    year_id: UUID
    is_active: bool
    expiry_date: Optional[date] = None
    status: str
    is_expired: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SaefMembershipCreateSchema(BaseModel):
    """Schema for creating a new SAEF membership"""
    rider_id: UUID
    membership_number: str = Field(..., min_length=1)
    year_id: UUID
    expiry_date: Optional[date] = None

    @field_validator('membership_number')
    @classmethod
    def validate_membership_number(cls, v):
        if not v or not v.strip():
            raise ValueError("Membership number cannot be empty or whitespace")
        return v


class SaefMembershipUpdateSchema(BaseModel):
    """Schema for updating a SAEF membership"""
    membership_number: Optional[str] = None
    expiry_date: Optional[date] = None
    is_active: Optional[bool] = None


# ========== RiderClub Schemas ==========

class RiderClubSchema(BaseModel):
    """Full rider club response schema"""
    id: UUID
    rider_id: UUID
    name: str
    year_id: UUID
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RiderClubCreateSchema(BaseModel):
    """Schema for creating a new rider club"""
    rider_id: UUID
    name: str = Field(..., min_length=1)
    year_id: UUID

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Club name cannot be empty or whitespace")
        return v


class RiderClubUpdateSchema(BaseModel):
    """Schema for updating a rider club"""
    name: Optional[str] = None
    is_active: Optional[bool] = None


# ========== RiderShowHoldingBody Schemas ==========

class RiderShowHoldingBodySchema(BaseModel):
    """Full rider show holding body response schema"""
    id: UUID
    rider_id: UUID
    name: str
    year_id: UUID
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RiderShowHoldingBodyCreateSchema(BaseModel):
    """Schema for creating a new rider show holding body"""
    rider_id: UUID
    name: str = Field(..., min_length=1)
    year_id: UUID

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Show holding body name cannot be empty or whitespace")
        return v


class RiderShowHoldingBodyUpdateSchema(BaseModel):
    """Schema for updating a rider show holding body"""
    name: Optional[str] = None
    is_active: Optional[bool] = None


# ========== Registration & Renewal Schemas ==========

class RiderRegistrationSchema(BaseModel):
    """Schema for complete rider registration with subscription"""
    # User information
    user_id: UUID

    # Rider information
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    date_of_birth: date
    gender: str = Field(..., pattern="^(MALE|FEMALE|OTHER)$")
    ethnicity: Optional[str] = Field(None, pattern="^(BLACK_AFRICAN|COLOURED|INDIAN|WHITE|OTHER)$")
    nationality: str = Field(..., min_length=1)

    # Subscription selection
    subscription_id: UUID
    year_id: UUID

    # Optional fields
    saef_number: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    suburb: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class RenewalSchema(BaseModel):
    """Schema for annual membership renewal"""
    rider_id: UUID
    subscription_id: UUID
    year_id: UUID

