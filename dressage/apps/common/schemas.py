from typing import Optional
from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
import uuid


# Province Schemas
class ProvinceCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Province name")
    country: str = Field(..., description="Country code (ISO 3166-1 alpha-2)")
    is_active: bool = Field(default=True, description="Whether the province is active")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Province name cannot be empty or whitespace")
        return v.strip()


class ProvinceUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Province name")
    country: Optional[str] = Field(None, description="Country code (ISO 3166-1 alpha-2)")
    is_active: Optional[bool] = Field(None, description="Whether the province is active")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Province name cannot be empty or whitespace")
        return v.strip() if v else v


class ProvinceSchema(BaseModel):
    id: uuid.UUID
    name: str
    country: str
    is_active: bool
    status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# VatCode Schemas
class VatCodeCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="VAT code name")
    code: str = Field(..., min_length=1, max_length=50, description="Unique VAT code")
    percentage: Decimal = Field(..., ge=0, le=100, description="VAT percentage")
    is_applicable_to_membership: bool = Field(default=True, description="Apply to memberships")
    is_applicable_to_competitions: bool = Field(default=True, description="Apply to competitions")
    is_default: bool = Field(default=False, description="Is default VAT code")
    is_active: bool = Field(default=True, description="Is active")
    notes: Optional[str] = Field(default="", description="Additional notes")

    @field_validator('name', 'code')
    @classmethod
    def validate_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class VatCodeUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    percentage: Optional[Decimal] = Field(None, ge=0, le=100)
    is_applicable_to_membership: Optional[bool] = None
    is_applicable_to_competitions: Optional[bool] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None

    @field_validator('name', 'code')
    @classmethod
    def validate_not_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip() if v else v


class VatCodeSchema(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    percentage: Decimal
    is_applicable_to_membership: bool
    is_applicable_to_competitions: bool
    is_default: bool
    is_active: bool
    status: str
    notes: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# School Schemas
class SchoolCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="School name")
    province_id: Optional[uuid.UUID] = Field(None, description="Province ID")
    contact_person: Optional[str] = Field(default="", max_length=255)
    email: Optional[str] = Field(default="")
    phone: Optional[str] = Field(default="", max_length=50)
    address: Optional[str] = Field(default="")
    city: Optional[str] = Field(default="", max_length=100)
    status: str = Field(default="ACTIVE", description="School status")
    website: Optional[str] = Field(default="")
    description: Optional[str] = Field(default="")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("School name cannot be empty or whitespace")
        return v.strip()


class SchoolUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    province_id: Optional[uuid.UUID] = None
    contact_person: Optional[str] = Field(None, max_length=255)
    email: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("School name cannot be empty or whitespace")
        return v.strip() if v else v


class SchoolSchema(BaseModel):
    id: uuid.UUID
    name: str
    province_id: Optional[uuid.UUID]
    contact_person: str
    email: str
    phone: str
    address: str
    city: str
    status: str
    website: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# PaymentMethod Schemas
class PaymentMethodCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Payment method name")
    code: Optional[str] = Field(None, max_length=50, description="Unique slug code")
    description: Optional[str] = Field(default="", description="Description")
    is_active: bool = Field(default=True, description="Is active")
    allow_for_entries: bool = Field(default=True, description="Allow for competition entries")
    allow_for_renewals: bool = Field(default=True, description="Allow for membership renewals")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Payment method name cannot be empty or whitespace")
        return v.strip()


class PaymentMethodUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    allow_for_entries: Optional[bool] = None
    allow_for_renewals: Optional[bool] = None

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Payment method name cannot be empty or whitespace")
        return v.strip() if v else v


class PaymentMethodSchema(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    description: str
    is_active: bool
    status: str
    allow_for_entries: bool
    allow_for_renewals: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

