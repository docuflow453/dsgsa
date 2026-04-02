"""
API endpoints for Riders using Django Ninja.
"""
from uuid import UUID
from ninja import Router
from typing import List

from apps.riders.schemas import (
    RiderSchema, RiderCreateSchema, RiderUpdateSchema, RiderFilterSchema, RiderListResponseSchema,
    RiderAccountSchema, RiderAccountCreateSchema, RiderAccountUpdateSchema,
    SaefMembershipSchema, SaefMembershipCreateSchema, SaefMembershipUpdateSchema,
    RiderRegistrationSchema, RenewalSchema
)
from apps.riders.services import (
    RiderService, RiderAccountService, RiderRegistrationService, SaefMembershipService
)


router = Router()


# ========== Rider Endpoints ==========

@router.get("/riders", response=RiderListResponseSchema, tags=["Riders"])
def list_riders(request, filters: RiderFilterSchema = None):
    """List all riders with optional filtering"""
    filters_dict = filters.dict(exclude_none=True) if filters else {}
    limit = filters_dict.pop('limit', 100)
    offset = filters_dict.pop('offset', 0)
    
    success, result, error = RiderService.get_riders(filters_dict, limit, offset)
    
    if not success:
        return 500, {"message": error}
    
    return {
        'total': result['total'],
        'limit': limit,
        'offset': offset,
        'riders': result['riders']
    }


@router.post("/riders", response={201: RiderSchema}, tags=["Riders"])
def create_rider(request, data: RiderCreateSchema):
    """Create a new rider"""
    success, rider, error = RiderService.create_rider(data.dict(exclude_none=True))
    
    if not success:
        return 400, {"message": error}
    
    return 201, rider


@router.get("/riders/{rider_id}", response=RiderSchema, tags=["Riders"])
def get_rider(request, rider_id: UUID):
    """Get a specific rider by ID"""
    success, rider, error = RiderService.get_rider(rider_id)
    
    if not success:
        return 404, {"message": error}
    
    return rider


@router.patch("/riders/{rider_id}", response=RiderSchema, tags=["Riders"])
def update_rider(request, rider_id: UUID, data: RiderUpdateSchema):
    """Update a rider"""
    success, rider, error = RiderService.update_rider(rider_id, data.dict(exclude_none=True))
    
    if not success:
        return 400, {"message": error}
    
    return rider


@router.delete("/riders/{rider_id}", response={200: dict}, tags=["Riders"])
def delete_rider(request, rider_id: UUID):
    """Soft delete a rider (set is_active=False)"""
    success, rider, error = RiderService.delete_rider(rider_id)
    
    if not success:
        return 404, {"message": error}
    
    return {"message": "Rider deactivated successfully"}


@router.post("/riders/{rider_id}/activate", response={200: RiderSchema}, tags=["Riders"])
def activate_rider(request, rider_id: UUID):
    """Activate a rider"""
    success, rider, error = RiderService.activate_rider(rider_id)
    
    if not success:
        return 404, {"message": error}
    
    return rider


@router.post("/riders/{rider_id}/deactivate", response={200: RiderSchema}, tags=["Riders"])
def deactivate_rider(request, rider_id: UUID):
    """Deactivate a rider"""
    success, rider, error = RiderService.deactivate_rider(rider_id)
    
    if not success:
        return 404, {"message": error}
    
    return rider


# ========== Rider Account Endpoints ==========

@router.post("/rider-accounts", response={201: RiderAccountSchema}, tags=["Rider Accounts"])
def create_rider_account(request, data: RiderAccountCreateSchema):
    """Create a new rider account"""
    success, account, error = RiderAccountService.create_rider_account(data.dict())
    
    if not success:
        return 400, {"message": error}
    
    return 201, account


@router.patch("/rider-accounts/{account_id}", response=RiderAccountSchema, tags=["Rider Accounts"])
def update_rider_account(request, account_id: UUID, data: RiderAccountUpdateSchema):
    """Update a rider account"""
    success, account, error = RiderAccountService.update_rider_account(account_id, data.dict(exclude_none=True))
    
    if not success:
        return 400, {"message": error}
    
    return account


@router.get("/riders/{rider_id}/accounts", response=List[RiderAccountSchema], tags=["Rider Accounts"])
def get_rider_accounts(request, rider_id: UUID):
    """Get all accounts for a rider"""
    success, accounts, error = RiderAccountService.get_rider_accounts_by_rider(rider_id)
    
    if not success:
        return 500, {"message": error}
    
    return accounts


@router.get("/riders/{rider_id}/accounts/year/{year_id}", response=RiderAccountSchema, tags=["Rider Accounts"])
def get_rider_account_for_year(request, rider_id: UUID, year_id: UUID):
    """Get a rider's account for a specific year"""
    success, account, error = RiderAccountService.get_rider_account_for_year(rider_id, year_id)

    if not success:
        return 404, {"message": error}

    return account


# ========== Registration & Renewal Endpoints ==========

@router.post("/riders/register", response={201: dict}, tags=["Registration"])
def register_rider(request, data: RiderRegistrationSchema):
    """
    Register a new rider with initial subscription.

    This endpoint:
    1. Creates a rider profile
    2. Creates a rider account for the selected year
    3. Links the selected subscription

    Payment confirmation should be handled separately.
    """
    success, result, error = RiderRegistrationService.register_rider(data.dict(exclude_none=True))

    if not success:
        return 400, {"message": error}

    return 201, {
        "message": "Rider registered successfully",
        "rider_id": str(result['rider'].id),
        "account_id": str(result['account'].id)
    }


@router.post("/riders/renew", response={201: RiderAccountSchema}, tags=["Registration"])
def renew_membership(request, data: RenewalSchema):
    """
    Renew a rider's membership for a new year.

    Creates a new rider account for the specified year with the selected subscription.
    Payment confirmation should be handled separately.
    """
    success, account, error = RiderRegistrationService.renew_membership(data.dict())

    if not success:
        return 400, {"message": error}

    return 201, account


# ========== SAEF Membership Endpoints ==========

@router.post("/saef-memberships", response={201: SaefMembershipSchema}, tags=["SAEF Memberships"])
def create_saef_membership(request, data: SaefMembershipCreateSchema):
    """Create a new SAEF membership record"""
    success, membership, error = SaefMembershipService.create_saef_membership(data.dict(exclude_none=True))

    if not success:
        return 400, {"message": error}

    return 201, membership


@router.patch("/saef-memberships/{membership_id}", response=SaefMembershipSchema, tags=["SAEF Memberships"])
def update_saef_membership(request, membership_id: UUID, data: SaefMembershipUpdateSchema):
    """Update a SAEF membership"""
    success, membership, error = SaefMembershipService.update_saef_membership(membership_id, data.dict(exclude_none=True))

    if not success:
        return 400, {"message": error}

    return membership


@router.get("/riders/{rider_id}/saef-membership/year/{year_id}", response=SaefMembershipSchema, tags=["SAEF Memberships"])
def get_saef_membership_for_year(request, rider_id: UUID, year_id: UUID):
    """Get a rider's SAEF membership for a specific year"""
    success, membership, error = SaefMembershipService.get_saef_membership_for_year(rider_id, year_id)

    if not success:
        return 404, {"message": error}

    return membership


@router.get("/riders/{rider_id}/eligibility/year/{year_id}", response=dict, tags=["SAEF Memberships"])
def check_competition_eligibility(request, rider_id: UUID, year_id: UUID):
    """
    Check if a rider is eligible to enter competitions for a specific year.

    A rider is eligible if they have:
    - An active RiderAccount for the year
    - A valid (active and not expired) SAEF membership for the year
    """
    success, result, error = SaefMembershipService.check_competition_eligibility(rider_id, year_id)

    if not success:
        return 500, {"message": error}

    return result

