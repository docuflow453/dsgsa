from typing import Optional
from ninja import Router, Query
from django.http import HttpRequest

from .schemas import (
    YearSchema, YearCreateSchema, YearUpdateSchema,
    YearFilterSchema, YearListResponseSchema
)
from .services import YearService
from .models import Year


router = Router(tags=["Year Management"])


# ==================== Year Endpoints ====================

@router.get("/years", response={200: YearListResponseSchema, 400: dict})
def list_years(
    request: HttpRequest,
    filters: YearFilterSchema = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    List all competition years with optional filtering and pagination.

    **Query Parameters:**
    - status: Filter by status (PENDING, ACTIVE, COMPLETE, ARCHIVED)
    - year: Filter by year number
    - is_registration_open: Filter by registration status
    - limit: Number of results (default: 100, max: 1000)
    - offset: Pagination offset

    **Response:**
    - 200: Paginated list of years
    - 400: Error occurred
    """
    try:
        filter_dict = {}
        if filters.status:
            filter_dict['status'] = filters.status
        if filters.year:
            filter_dict['year'] = filters.year
        if filters.is_registration_open is not None:
            filter_dict['is_registration_open'] = filters.is_registration_open

        count, years = YearService.get_years(filters=filter_dict, limit=limit, offset=offset)

        # Convert to schema format
        year_list = []
        for year in years:
            year_data = {
                'id': str(year.id),
                'name': year.name,
                'year': year.year,
                'start_date': year.start_date,
                'end_date': year.end_date,
                'is_registration_open': year.is_registration_open,
                'status': year.status,
                'notes': year.notes,
                'is_active': year.is_active,
                'is_current': year.is_current,
                'days_remaining': year.days_remaining,
                'duration_days': year.duration_days,
                'created_at': year.created_at,
                'updated_at': year.updated_at,
            }
            year_list.append(year_data)

        return 200, {
            'count': count,
            'results': year_list
        }
    except Exception as e:
        return 400, {"message": str(e)}


@router.post("/years", response={201: YearSchema, 400: dict})
def create_year(request: HttpRequest, payload: YearCreateSchema):
    """
    Create a new competition year.

    **Request Body:**
    - All year details including name, year, start_date, end_date, etc.

    **Response:**
    - 201: Year created successfully
    - 400: Validation error or business logic violation
    """
    success, year, error = YearService.create_year(payload.dict())

    if not success:
        return 400, {"message": error}

    return 201, {
        'id': str(year.id),
        'name': year.name,
        'year': year.year,
        'start_date': year.start_date,
        'end_date': year.end_date,
        'is_registration_open': year.is_registration_open,
        'status': year.status,
        'notes': year.notes,
        'is_active': year.is_active,
        'is_current': year.is_current,
        'days_remaining': year.days_remaining,
        'duration_days': year.duration_days,
        'created_at': year.created_at,
        'updated_at': year.updated_at,
    }


@router.get("/years/{year_id}", response={200: YearSchema, 404: dict})
def get_year(request: HttpRequest, year_id: str):
    """
    Get details for a specific competition year.

    **Parameters:**
    - year_id: UUID of the year

    **Response:**
    - 200: Year details
    - 404: Year not found
    """
    year = YearService.get_year(year_id)

    if not year:
        return 404, {"message": "Year not found"}

    return 200, {
        'id': str(year.id),
        'name': year.name,
        'year': year.year,
        'start_date': year.start_date,
        'end_date': year.end_date,
        'is_registration_open': year.is_registration_open,
        'status': year.status,
        'notes': year.notes,
        'is_active': year.is_active,
        'is_current': year.is_current,
        'days_remaining': year.days_remaining,
        'duration_days': year.duration_days,
        'created_at': year.created_at,
        'updated_at': year.updated_at,
    }





@router.patch("/years/{year_id}", response={200: YearSchema, 400: dict, 404: dict})
def update_year(request: HttpRequest, year_id: str, payload: YearUpdateSchema):
    """
    Update a competition year's details.

    **Parameters:**
    - year_id: UUID of the year

    **Request Body:**
    - Fields to update (all optional)

    **Response:**
    - 200: Year updated successfully
    - 400: Validation error
    - 404: Year not found
    """
    success, year, error = YearService.update_year(year_id, payload.dict(exclude_unset=True))

    if not success:
        if error == "Year not found":
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, {
        'id': str(year.id),
        'name': year.name,
        'year': year.year,
        'start_date': year.start_date,
        'end_date': year.end_date,
        'is_registration_open': year.is_registration_open,
        'status': year.status,
        'notes': year.notes,
        'is_active': year.is_active,
        'is_current': year.is_current,
        'days_remaining': year.days_remaining,
        'duration_days': year.duration_days,
        'created_at': year.created_at,
        'updated_at': year.updated_at,
    }


@router.delete("/years/{year_id}", response={200: dict, 404: dict})
def delete_year(request: HttpRequest, year_id: str):
    """
    Delete a competition year.

    **Parameters:**
    - year_id: UUID of the year

    **Response:**
    - 200: Year deleted successfully
    - 404: Year not found
    """
    success, error = YearService.delete_year(year_id)

    if not success:
        return 404, {"message": error}

    return 200, {"message": "Year deleted successfully"}


@router.post("/years/{year_id}/activate", response={200: YearSchema, 404: dict, 400: dict})
def activate_year(request: HttpRequest, year_id: str):
    """
    Activate a specific year and deactivate all others.

    **Parameters:**
    - year_id: UUID of the year to activate

    **Response:**
    - 200: Year activated successfully
    - 404: Year not found
    - 400: Error occurred
    """
    success, year, error = YearService.set_year_active(year_id)

    if not success:
        if error == "Year not found":
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, {
        'id': str(year.id),
        'name': year.name,
        'year': year.year,
        'start_date': year.start_date,
        'end_date': year.end_date,
        'is_registration_open': year.is_registration_open,
        'status': year.status,
        'notes': year.notes,
        'is_active': year.is_active,
        'is_current': year.is_current,
        'days_remaining': year.days_remaining,
        'duration_days': year.duration_days,
        'created_at': year.created_at,
        'updated_at': year.updated_at,
    }
