from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from ninja import FilterSchema


class YearSchema(BaseModel):
    """Schema for Year response data"""
    id: int
    name: str
    year: int
    start_date: date
    end_date: date
    is_registration_open: bool
    status: str
    notes: Optional[str] = None
    created_at: str
    updated_at: str
    
    model_config = ConfigDict(from_attributes=True)


class YearCreateSchema(BaseModel):
    """Schema for creating a new year"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the competition year")
    year: int = Field(..., gt=1900, lt=2200, description="Year number (e.g., 2024)")
    start_date: date = Field(..., description="Start date of the competition year")
    end_date: date = Field(..., description="End date of the competition year")
    is_registration_open: bool = Field(False, description="Whether registration is open")
    status: str = Field('PENDING', description="Status: PENDING, ACTIVE, COMPLETE, or ARCHIVED")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    @field_validator('end_date')
    @classmethod
    def validate_end_date(cls, v, info):
        """Ensure end_date is not before start_date"""
        if 'start_date' in info.data and v < info.data['start_date']:
            raise ValueError('End date cannot be before start date')
        return v
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        """Validate status choices"""
        valid_statuses = ['PENDING', 'ACTIVE', 'COMPLETE', 'ARCHIVED']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v
    
    model_config = ConfigDict(from_attributes=True)


class YearUpdateSchema(BaseModel):
    """Schema for updating an existing year"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Name of the competition year")
    year: Optional[int] = Field(None, gt=1900, lt=2200, description="Year number")
    start_date: Optional[date] = Field(None, description="Start date")
    end_date: Optional[date] = Field(None, description="End date")
    is_registration_open: Optional[bool] = Field(None, description="Registration status")
    status: Optional[str] = Field(None, description="Year status")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        """Validate status choices"""
        if v is not None:
            valid_statuses = ['PENDING', 'ACTIVE', 'COMPLETE', 'ARCHIVED']
            if v not in valid_statuses:
                raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v
    
    model_config = ConfigDict(from_attributes=True)


class YearListResponseSchema(BaseModel):
    """Schema for paginated year list response"""
    count: int
    results: list[YearSchema]
    
    model_config = ConfigDict(from_attributes=True)


class MessageResponseSchema(BaseModel):
    """Schema for generic message responses"""
    message: str
    
    model_config = ConfigDict(from_attributes=True)


class YearFilterSchema(FilterSchema):
    """Schema for filtering years"""
    status: Optional[str] = Field(None, description="Filter by status (PENDING, ACTIVE, COMPLETE, ARCHIVED)")
    year: Optional[int] = Field(None, description="Filter by year number")
    is_registration_open: Optional[bool] = Field(None, description="Filter by registration status")
    limit: int = Field(100, description="Number of results to return (default: 100, max: 1000)", ge=1, le=1000)
    offset: int = Field(0, description="Number of results to skip (for pagination)", ge=0)
    
    def filter(self, queryset):
        """Apply filters to the queryset"""
        # Apply status filter
        if self.status:
            queryset = queryset.filter(status=self.status)
        
        # Apply year filter
        if self.year:
            queryset = queryset.filter(year=self.year)
        
        # Apply registration status filter
        if self.is_registration_open is not None:
            queryset = queryset.filter(is_registration_open=self.is_registration_open)
        
        return queryset

