from typing import List
from ninja import Router, Query
from apps.clubs.schemas import (
    ClubSchema,
    ClubCreateSchema,
    ClubUpdateSchema,
    ClubFilterSchema
)
from apps.clubs.services import ClubService


router = Router(tags=["Clubs"])


@router.get("/memberships/clubs", response={200: dict})
def list_clubs(request, filters: ClubFilterSchema = Query(...)):
    """
    List all Clubs with optional filters
    
    Filters:
    - name: Filter by name (case-insensitive partial match)
    - status: Filter by status
    - is_active: Filter by active/inactive status
    - province_id: Filter by province
    - country: Filter by country code
    - search: Search across name, email, city, registration number
    """
    filter_dict = filters.dict(exclude_none=True)
    
    # Handle is_active separately as it's not a direct filter
    is_active = filter_dict.pop('is_active', None)
    search = filter_dict.pop('search', None)
    
    success, result, error = ClubService.get_clubs(
        is_active=is_active,
        search=search,
        **filter_dict
    )
    
    if not success:
        return 400, {"message": error}
    
    # Serialize the items
    items = [ClubSchema.from_orm(item).dict() for item in result['items']]
    
    return 200, {
        "items": items,
        "total": result['total'],
        "skip": result['skip'],
        "limit": result['limit'],
        "count": result['count']
    }


@router.post("/memberships/clubs", response={201: ClubSchema, 400: dict})
def create_club(request, payload: ClubCreateSchema):
    """
    Create a new Club
    
    Required fields:
    - name: Unique name
    - email: Contact email
    - phone: Contact phone
    - address_line_1, city, province_id, postal_code, country: Address details
    - primary_contact_name, primary_contact_email, primary_contact_phone: Primary contact
    """
    success, club, error = ClubService.create_club(
        payload.dict(exclude_none=True)
    )
    
    if not success:
        return 400, {"message": error}
    
    return 201, club


@router.get("/memberships/clubs/{id}", response={200: ClubSchema, 404: dict})
def get_club(request, id: str):
    """
    Get a specific Club by ID
    """
    success, club, error = ClubService.get_club(id)

    if not success:
        return 404, {"message": error}

    return 200, club


@router.patch("/memberships/clubs/{id}", response={200: ClubSchema, 400: dict, 404: dict})
def update_club(request, id: str, payload: ClubUpdateSchema):
    """
    Update a Club

    All fields are optional. Only provided fields will be updated.
    """
    update_data = payload.dict(exclude_none=True)

    if not update_data:
        return 400, {"message": "No fields to update"}

    success, club, error = ClubService.update_club(id, update_data)

    if not success:
        if "not found" in error:
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, club


@router.delete("/memberships/clubs/{id}", response={200: dict, 404: dict})
def delete_club(request, id: str):
    """
    Delete (deactivate) a Club

    This performs a soft delete by setting the status to INACTIVE.
    """
    success, club, error = ClubService.delete_club(id)

    if not success:
        return 404, {"message": error}

    return 200, {
        "message": "Club successfully deactivated",
        "id": str(club.id)
    }

