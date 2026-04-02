from typing import List
from ninja import Router, Query
from apps.showholdingbody.schemas import (
    ShowHoldingBodySchema,
    ShowHoldingBodyCreateSchema,
    ShowHoldingBodyUpdateSchema,
    ShowHoldingBodyFilterSchema
)
from apps.showholdingbody.services import ShowHoldingBodyService


router = Router(tags=["Show Holding Bodies"])


@router.get("/memberships", response={200: dict})
def list_show_holding_bodies(request, filters: ShowHoldingBodyFilterSchema = Query(...)):
    """
    List all Show Holding Bodies with optional filters
    
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
    
    success, result, error = ShowHoldingBodyService.get_show_holding_bodies(
        is_active=is_active,
        search=search,
        **filter_dict
    )
    
    if not success:
        return 400, {"message": error}
    
    # Serialize the items
    items = [ShowHoldingBodySchema.from_orm(item).dict() for item in result['items']]
    
    return 200, {
        "items": items,
        "total": result['total'],
        "skip": result['skip'],
        "limit": result['limit'],
        "count": result['count']
    }


@router.post("/memberships", response={201: ShowHoldingBodySchema, 400: dict})
def create_show_holding_body(request, payload: ShowHoldingBodyCreateSchema):
    """
    Create a new Show Holding Body
    
    Required fields:
    - name: Unique name
    - email: Contact email
    - phone: Contact phone
    - address_line_1, city, province_id, postal_code, country: Address details
    - primary_contact_name, primary_contact_email, primary_contact_phone: Primary contact
    """
    success, show_holding_body, error = ShowHoldingBodyService.create_show_holding_body(
        payload.dict(exclude_none=True)
    )
    
    if not success:
        return 400, {"message": error}
    
    return 201, show_holding_body


@router.get("/memberships/{id}", response={200: ShowHoldingBodySchema, 404: dict})
def get_show_holding_body(request, id: str):
    """
    Get a specific Show Holding Body by ID
    """
    success, show_holding_body, error = ShowHoldingBodyService.get_show_holding_body(id)
    
    if not success:
        return 404, {"message": error}
    
    return 200, show_holding_body


@router.patch("/memberships/{id}", response={200: ShowHoldingBodySchema, 400: dict, 404: dict})
def update_show_holding_body(request, id: str, payload: ShowHoldingBodyUpdateSchema):
    """
    Update a Show Holding Body
    
    All fields are optional. Only provided fields will be updated.
    """
    update_data = payload.dict(exclude_none=True)
    
    if not update_data:
        return 400, {"message": "No fields to update"}
    
    success, show_holding_body, error = ShowHoldingBodyService.update_show_holding_body(id, update_data)
    
    if not success:
        if "not found" in error:
            return 404, {"message": error}
        return 400, {"message": error}
    
    return 200, show_holding_body


@router.delete("/memberships/{id}", response={200: dict, 404: dict})
def delete_show_holding_body(request, id: str):
    """
    Delete (deactivate) a Show Holding Body
    
    This performs a soft delete by setting the status to INACTIVE.
    """
    success, show_holding_body, error = ShowHoldingBodyService.delete_show_holding_body(id)
    
    if not success:
        return 404, {"message": error}
    
    return 200, {
        "message": "Show Holding Body successfully deactivated",
        "id": str(show_holding_body.id)
    }

