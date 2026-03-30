from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, Query

from .models import Year, YearStatus
from .schemas import (
    YearSchema,
    YearCreateSchema,
    YearUpdateSchema,
    YearListResponseSchema,
    YearFilterSchema,
    MessageResponseSchema,
)
from .services import YearService


router = Router(tags=["Years"])


@router.get("/years", response={200: YearListResponseSchema, 400: dict}, summary="List all years")
def list_years(request, filters: YearFilterSchema = Query(...)):
    """
    Retrieve a paginated list of competition years with optional filtering.
    
    - **status**: Filter by status (PENDING, ACTIVE, COMPLETE, ARCHIVED)
    - **year**: Filter by year number
    - **is_registration_open**: Filter by registration status
    - **limit**: Number of results to return (default: 100, max: 1000)
    - **offset**: Number of results to skip (for pagination)
    """
    # Validate status if provided
    if filters.status and filters.status not in [choice[0] for choice in YearStatus.choices]:
        return 400, {"message": f"Invalid status: {filters.status}"}
    
    # Get base queryset
    queryset = Year.objects.all()
    
    # Apply filters using FilterSchema
    queryset = filters.filter(queryset)
    
    # Get total count
    count = queryset.count()
    
    # Apply pagination
    years = list(queryset[filters.offset:filters.offset + filters.limit])
    
    return 200, {
        "count": count,
        "results": years
    }


@router.get("/years/{year_id}", response={200: YearSchema, 404: dict}, summary="Get year by ID")
def get_year(request, year_id: int):
    """
    Retrieve a specific competition year by its ID.
    
    - **year_id**: The unique identifier of the year
    """
    year = get_object_or_404(Year, id=year_id)
    return 200, year


@router.post("/years", response={201: YearSchema, 400: dict}, summary="Create a new year")
def create_year(request, payload: YearCreateSchema):
    """
    Create a new competition year.
    
    - **name**: Name of the competition year (e.g., "2024 Season")
    - **year**: Year number (e.g., 2024)
    - **start_date**: Start date of the competition year
    - **end_date**: End date of the competition year
    - **is_registration_open**: Whether registration is open (default: False)
    - **status**: Status (PENDING, ACTIVE, COMPLETE, ARCHIVED) - default: PENDING
    - **notes**: Additional notes (optional)
    """
    # Convert Pydantic model to dict
    data = payload.model_dump()
    
    # Use service to create year
    success, year, error = YearService.create_year(data)
    
    if not success:
        return 400, {"message": error}
    
    return 201, year


@router.patch("/years/{year_id}", response={200: YearSchema, 400: dict, 404: dict}, summary="Update year")
def update_year(request, year_id: int, payload: YearUpdateSchema):
    """
    Update an existing competition year.
    
    - **year_id**: The unique identifier of the year to update
    - **name**: New name (optional)
    - **year**: New year number (optional)
    - **start_date**: New start date (optional)
    - **end_date**: New end date (optional)
    - **is_registration_open**: New registration status (optional)
    - **status**: New status (optional)
    - **notes**: New notes (optional)
    """
    # Convert Pydantic model to dict, excluding unset values
    data = payload.model_dump(exclude_unset=True)
    
    if not data:
        return 400, {"message": "No fields provided for update"}
    
    # Use service to update year
    success, year, error = YearService.update_year(year_id, data)
    
    if not success:
        if error == "Year not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    return 200, year


@router.delete("/years/{year_id}", response={200: MessageResponseSchema, 404: dict, 400: dict}, summary="Delete a year")
def delete_year(request, year_id: int):
    """
    Delete a competition year.
    
    - **year_id**: The unique identifier of the year to delete
    """
    # Use service to delete year
    success, error = YearService.delete_year(year_id)
    
    if not success:
        if error == "Year not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    return 200, {"message": f"Year deleted successfully"}


@router.post("/years/{year_id}/activate", response={200: YearSchema, 404: dict, 400: dict}, summary="Activate a year")
def activate_year(request, year_id: int):
    """
    Set a competition year as active. This will deactivate all other years.
    
    - **year_id**: The unique identifier of the year to activate
    """
    success, error = YearService.set_year_active(year_id, deactivate_others=True)
    
    if not success:
        if error == "Year not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    year = get_object_or_404(Year, id=year_id)
    return 200, year

