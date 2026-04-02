from typing import Optional, List
from pydantic import BaseModel, Field, UUID4
from datetime import date, datetime
from ninja import FilterSchema, Field as NinjaField


# ==================== Classification Schemas ====================

class ClassificationSchema(BaseModel):
    """Schema for Classification"""
    id: str
    name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClassificationCreateSchema(BaseModel):
    """Schema for creating a Classification"""
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(default="")
    is_active: bool = Field(default=True)


class ClassificationUpdateSchema(BaseModel):
    """Schema for updating a Classification"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ClassificationFilterSchema(FilterSchema):
    """Filter schema for Classifications"""
    name: Optional[str] = NinjaField(None, q='name__icontains')
    is_active: Optional[bool] = NinjaField(None, q='is_active')


# ==================== Breed Schemas ====================

class BreedSchema(BaseModel):
    """Schema for Breed"""
    id: str
    name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BreedCreateSchema(BaseModel):
    """Schema for creating a Breed"""
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(default="")
    is_active: bool = Field(default=True)


class BreedUpdateSchema(BaseModel):
    """Schema for updating a Breed"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class BreedFilterSchema(FilterSchema):
    """Filter schema for Breeds"""
    name: Optional[str] = NinjaField(None, q='name__icontains')
    is_active: Optional[bool] = NinjaField(None, q='is_active')


# ==================== Breed Type Schemas ====================

class BreedTypeSchema(BaseModel):
    """Schema for BreedType"""
    id: str
    name: str
    breed_id: str
    breed_name: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BreedTypeCreateSchema(BaseModel):
    """Schema for creating a BreedType"""
    name: str = Field(..., min_length=1, max_length=100)
    breed_id: str = Field(..., description="UUID of the parent breed")
    is_active: bool = Field(default=True)


class BreedTypeUpdateSchema(BaseModel):
    """Schema for updating a BreedType"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    breed_id: Optional[str] = None
    is_active: Optional[bool] = None


class BreedTypeFilterSchema(FilterSchema):
    """Filter schema for BreedTypes"""
    name: Optional[str] = NinjaField(None, q='name__icontains')
    breed_id: Optional[str] = NinjaField(None, q='breed__id')
    is_active: Optional[bool] = NinjaField(None, q='is_active')


# ==================== Horse Color Schemas ====================

class HorseColorSchema(BaseModel):
    """Schema for HorseColor"""
    id: str
    name: str
    color_code: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HorseColorCreateSchema(BaseModel):
    """Schema for creating a HorseColor"""
    name: str = Field(..., min_length=1, max_length=100)
    color_code: str = Field(default="")
    is_active: bool = Field(default=True)


class HorseColorUpdateSchema(BaseModel):
    """Schema for updating a HorseColor"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color_code: Optional[str] = None
    is_active: Optional[bool] = None


class HorseColorFilterSchema(FilterSchema):
    """Filter schema for HorseColors"""
    name: Optional[str] = NinjaField(None, q='name__icontains')
    is_active: Optional[bool] = NinjaField(None, q='is_active')


# ==================== Horse Schemas ====================

class HorseSchema(BaseModel):
    """Schema for Horse"""
    id: str
    name: str
    gender: str
    passport_number: str
    microchip_number: str
    date_of_birth: date
    breed_id: str
    breed_name: Optional[str] = None
    breed_type_id: Optional[str] = None
    breed_type_name: Optional[str] = None
    color_id: str
    color_name: Optional[str] = None
    country: str
    sire: str
    dam: str
    sire_of_dam: str
    status: str
    is_banned: bool
    banned_at: Optional[datetime] = None
    age: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HorseCreateSchema(BaseModel):
    """Schema for creating a Horse"""
    name: str = Field(..., min_length=1, max_length=200)
    gender: str = Field(..., description="MARE, STALLION, or GELDING")
    passport_number: str = Field(..., min_length=1, max_length=100)
    microchip_number: str = Field(..., min_length=1, max_length=100)
    date_of_birth: date
    breed_id: str
    breed_type_id: Optional[str] = None
    color_id: str
    country: str = Field(..., min_length=1, max_length=100)
    sire: str = Field(default="")
    dam: str = Field(default="")
    sire_of_dam: str = Field(default="")
    status: str = Field(default="ACTIVE")


class HorseUpdateSchema(BaseModel):
    """Schema for updating a Horse"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    gender: Optional[str] = None
    passport_number: Optional[str] = Field(None, min_length=1, max_length=100)
    microchip_number: Optional[str] = Field(None, min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    breed_id: Optional[str] = None
    breed_type_id: Optional[str] = None
    color_id: Optional[str] = None
    country: Optional[str] = None
    sire: Optional[str] = None
    dam: Optional[str] = None
    sire_of_dam: Optional[str] = None
    status: Optional[str] = None
    is_banned: Optional[bool] = None


class HorseFilterSchema(FilterSchema):
    """Filter schema for Horses"""
    name: Optional[str] = NinjaField(None, q='name__icontains')
    gender: Optional[str] = NinjaField(None, q='gender')
    passport_number: Optional[str] = NinjaField(None, q='passport_number__icontains')
    microchip_number: Optional[str] = NinjaField(None, q='microchip_number__icontains')
    breed_id: Optional[str] = NinjaField(None, q='breed__id')
    color_id: Optional[str] = NinjaField(None, q='color__id')
    status: Optional[str] = NinjaField(None, q='status')
    is_banned: Optional[bool] = NinjaField(None, q='is_banned')


# ==================== Horse Vaccination Schemas ====================

class HorseVaccinationSchema(BaseModel):
    """Schema for HorseVaccination"""
    id: str
    horse_id: str
    horse_name: Optional[str] = None
    vaccination_type: str
    vaccination_date: date
    expiry_date: Optional[date] = None
    batch_number: str
    veterinarian: str
    notes: str
    is_expired: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HorseVaccinationCreateSchema(BaseModel):
    """Schema for creating a HorseVaccination"""
    horse_id: str
    vaccination_type: str = Field(..., description="FLU, AHS, TETANUS, RABIES, or OTHER")
    vaccination_date: date
    expiry_date: Optional[date] = None
    batch_number: str = Field(default="")
    veterinarian: str = Field(default="")
    notes: str = Field(default="")


class HorseVaccinationUpdateSchema(BaseModel):
    """Schema for updating a HorseVaccination"""
    vaccination_type: Optional[str] = None
    vaccination_date: Optional[date] = None
    expiry_date: Optional[date] = None
    batch_number: Optional[str] = None
    veterinarian: Optional[str] = None
    notes: Optional[str] = None


class HorseVaccinationFilterSchema(FilterSchema):
    """Filter schema for HorseVaccinations"""
    horse_id: Optional[str] = NinjaField(None, q='horse__id')
    vaccination_type: Optional[str] = NinjaField(None, q='vaccination_type')


# ==================== Horse Account Schemas ====================

class HorseAccountSchema(BaseModel):
    """Schema for HorseAccount"""
    id: str
    horse_id: str
    horse_name: Optional[str] = None
    account_ref: str
    classification_id: str
    classification_name: Optional[str] = None
    year_ref: str
    amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HorseAccountCreateSchema(BaseModel):
    """Schema for creating a HorseAccount"""
    horse_id: str
    account_ref: str = Field(..., min_length=1, max_length=100)
    classification_id: str
    year_ref: str = Field(..., min_length=1, max_length=50)
    amount: float = Field(..., gt=0)


class HorseAccountUpdateSchema(BaseModel):
    """Schema for updating a HorseAccount"""
    account_ref: Optional[str] = None
    classification_id: Optional[str] = None
    year_ref: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)



# ==================== Horse Document Schemas ====================

class HorseDocumentSchema(BaseModel):
    """Schema for HorseDocument"""
    id: str
    horse_id: str
    horse_name: Optional[str] = None
    document_type: str
    title: str
    file_name: str
    file_url: str
    upload_date: datetime
    expiry_date: Optional[date] = None
    notes: str
    uploaded_by_id: Optional[str] = None
    is_expired: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HorseDocumentCreateSchema(BaseModel):
    """Schema for creating a HorseDocument"""
    horse_id: str
    document_type: str = Field(..., description="PASSPORT, REGISTRATION, VACCINATION, MEDICAL, or OTHER")
    title: str = Field(..., min_length=1, max_length=200)
    file_name: str = Field(..., min_length=1, max_length=255)
    file_url: str
    expiry_date: Optional[date] = None
    notes: str = Field(default="")


class HorseDocumentUpdateSchema(BaseModel):
    """Schema for updating a HorseDocument"""
    document_type: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    expiry_date: Optional[date] = None
    notes: Optional[str] = None


class HorseDocumentFilterSchema(FilterSchema):
    """Filter schema for HorseDocuments"""
    horse_id: Optional[str] = NinjaField(None, q='horse__id')
    document_type: Optional[str] = NinjaField(None, q='document_type')

