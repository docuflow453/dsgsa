from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field
from ninja import FilterSchema, Field as NinjaField


class YearSchema(BaseModel):
    """Schema for Year response"""
    id: str
    name: str
    year: int
    start_date: date
    end_date: date
    is_registration_open: bool
    status: str
    notes: str
    is_active: bool
    is_current: bool
    days_remaining: int
    duration_days: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class YearCreateSchema(BaseModel):
    """Schema for creating a Year"""
    name: str = Field(..., min_length=1, max_length=200, description="Name of the competition year")
    year: int = Field(..., gt=1900, lt=3000, description="Year number (e.g., 2024)")
    start_date: date = Field(..., description="Start date of the competition year")
    end_date: date = Field(..., description="End date of the competition year")
    is_registration_open: bool = Field(default=False, description="Whether registration is open")
    status: str = Field(default="PENDING", description="Year status: PENDING, ACTIVE, COMPLETE, ARCHIVED")
    notes: str = Field(default="", description="Additional notes")


class YearUpdateSchema(BaseModel):
    """Schema for updating a Year"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    year: Optional[int] = Field(None, gt=1900, lt=3000)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_registration_open: Optional[bool] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class YearFilterSchema(FilterSchema):
    """Filter schema for Years"""
    status: Optional[str] = NinjaField(None, q='status')
    year: Optional[int] = NinjaField(None, q='year')
    is_registration_open: Optional[bool] = NinjaField(None, q='is_registration_open')


class YearListResponseSchema(BaseModel):
    """Schema for paginated year list response"""
    count: int
    results: list[YearSchema]

