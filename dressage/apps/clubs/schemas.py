from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator
from ninja import FilterSchema


class ClubBaseSchema(BaseModel):
    """Base schema with common fields"""
    name: str = Field(..., min_length=1, max_length=255)
    registration_number: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    website: Optional[str] = None
    
    address_line_1: str = Field(..., max_length=255)
    address_line_2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    province_id: str
    postal_code: str = Field(..., max_length=20)
    country: str = Field(..., min_length=2, max_length=2, description="ISO 3166-1 alpha-2 country code")
    
    primary_contact_name: str = Field(..., max_length=255)
    primary_contact_email: EmailStr
    primary_contact_phone: str = Field(..., max_length=20)
    
    bank_name: Optional[str] = Field(None, max_length=255)
    account_number: Optional[str] = Field(None, max_length=50)
    branch_code: Optional[str] = Field(None, max_length=20)
    account_type: Optional[str] = None
    account_holder_name: Optional[str] = Field(None, max_length=255)
    
    status: Optional[str] = 'ACTIVE'
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()
    
    @validator('country')
    def validate_country(cls, v):
        if v and len(v) != 2:
            raise ValueError('Country must be a 2-letter ISO code')
        return v.upper()
    
    class Config:
        from_attributes = True


class ClubCreateSchema(ClubBaseSchema):
    """Schema for creating a new Club"""
    pass


class ClubUpdateSchema(BaseModel):
    """Schema for updating an existing Club (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    registration_number: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = None
    
    address_line_1: Optional[str] = Field(None, max_length=255)
    address_line_2: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    province_id: Optional[str] = None
    postal_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, min_length=2, max_length=2)
    
    primary_contact_name: Optional[str] = Field(None, max_length=255)
    primary_contact_email: Optional[EmailStr] = None
    primary_contact_phone: Optional[str] = Field(None, max_length=20)
    
    bank_name: Optional[str] = Field(None, max_length=255)
    account_number: Optional[str] = Field(None, max_length=50)
    branch_code: Optional[str] = Field(None, max_length=20)
    account_type: Optional[str] = None
    account_holder_name: Optional[str] = Field(None, max_length=255)
    
    status: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip() if v else v
    
    class Config:
        from_attributes = True


class ProvinceSchema(BaseModel):
    """Nested schema for province"""
    id: str
    name: str
    country: str
    
    class Config:
        from_attributes = True


class ClubSchema(BaseModel):
    """Complete schema for Club response"""
    id: str
    name: str
    registration_number: Optional[str] = None
    logo: Optional[str] = None
    email: str
    phone: str
    website: Optional[str] = None
    
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    province: ProvinceSchema
    postal_code: str
    country: str
    
    primary_contact_name: str
    primary_contact_email: str
    primary_contact_phone: str
    
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    branch_code: Optional[str] = None
    account_type: Optional[str] = None
    account_holder_name: Optional[str] = None
    
    status: str
    is_active: bool
    full_address: str
    has_bank_details: bool
    has_logo: bool
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ClubFilterSchema(FilterSchema):
    """Filter schema for listing Clubs"""
    name: Optional[str] = Field(None, q='name__icontains')
    status: Optional[str] = Field(None, q='status')
    is_active: Optional[bool] = None
    province_id: Optional[str] = Field(None, q='province_id')
    country: Optional[str] = Field(None, q='country')
    search: Optional[str] = None

