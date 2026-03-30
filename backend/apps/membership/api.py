from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, Query

from .models import Membership, Subscription
from .schemas import (
    MembershipSchema,
    MembershipCreateSchema,
    MembershipUpdateSchema,
    MembershipListResponseSchema,
    MembershipFilterSchema,
    MessageResponseSchema,
    SubscriptionSchema,
    SubscriptionCreateSchema,
    SubscriptionUpdateSchema,
    SubscriptionListResponseSchema,
    SubscriptionFilterSchema,
)
from .services import MembershipService, SubscriptionService


router = Router(tags=["Memberships"])


@router.get("/memberships", response={200: MembershipListResponseSchema, 400: dict}, summary="List all memberships")
def list_memberships(request, filters: MembershipFilterSchema = Query(...)):
    """
    Retrieve a paginated list of membership types with optional filtering.
    
    - **name**: Filter by name (case-insensitive lookup)
    - **is_active**: Filter by active status
    - **limit**: Number of results to return (default: 100, max: 1000)
    - **offset**: Number of results to skip (for pagination)
    """
    # Get base queryset
    queryset = Membership.objects.all()
    
    # Apply filters using FilterSchema
    queryset = filters.filter(queryset)
    
    # Get total count
    count = queryset.count()
    
    # Apply pagination
    memberships = list(queryset[filters.offset:filters.offset + filters.limit])
    
    return 200, {
        "count": count,
        "results": memberships
    }


@router.get("/memberships/{membership_id}", response={200: MembershipSchema, 404: dict}, summary="Get membership by ID")
def get_membership(request, membership_id: int):
    """
    Retrieve a specific membership type by its ID.
    
    - **membership_id**: The unique identifier of the membership
    """
    membership = get_object_or_404(Membership, id=membership_id)
    return 200, membership


@router.post("/memberships", response={201: MembershipSchema, 400: dict}, summary="Create a new membership")
def create_membership(request, payload: MembershipCreateSchema):
    """
    Create a new membership type.
    
    - **name**: Name of the membership type (e.g., "Rider Membership")
    - **description**: Detailed description of the membership type
    - **is_active**: Whether this membership is active (default: False)
    - **notes**: Additional notes (optional)
    """
    # Convert Pydantic model to dict
    data = payload.model_dump()
    
    # Use service to create membership
    success, membership, error = MembershipService.create_membership(data)
    
    if not success:
        return 400, {"message": error}
    
    return 201, membership


@router.patch("/memberships/{membership_id}", response={200: MembershipSchema, 400: dict, 404: dict}, summary="Update membership")
def update_membership(request, membership_id: int, payload: MembershipUpdateSchema):
    """
    Update an existing membership type.
    
    - **membership_id**: The unique identifier of the membership to update
    - **name**: New name (optional)
    - **description**: New description (optional)
    - **is_active**: New active status (optional)
    - **notes**: New notes (optional)
    """
    # Convert Pydantic model to dict, excluding unset values
    data = payload.model_dump(exclude_unset=True)
    
    if not data:
        return 400, {"message": "No fields provided for update"}
    
    # Use service to update membership
    success, membership, error = MembershipService.update_membership(membership_id, data)
    
    if not success:
        if error == "Membership not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    return 200, membership


@router.delete("/memberships/{membership_id}", response={200: MessageResponseSchema, 404: dict, 400: dict}, summary="Delete a membership")
def delete_membership(request, membership_id: int):
    """
    Delete a membership type.
    
    - **membership_id**: The unique identifier of the membership to delete
    """
    # Use service to delete membership
    success, error = MembershipService.delete_membership(membership_id)
    
    if not success:
        if error == "Membership not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    return 200, {"message": "Membership deleted successfully"}


@router.post("/memberships/{membership_id}/activate", response={200: MembershipSchema, 404: dict, 400: dict}, summary="Activate a membership")
def activate_membership(request, membership_id: int):
    """
    Activate a membership type.
    
    - **membership_id**: The unique identifier of the membership to activate
    """
    success, error = MembershipService.activate_membership(membership_id)
    
    if not success:
        if error == "Membership not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    membership = get_object_or_404(Membership, id=membership_id)
    return 200, membership


@router.post("/memberships/{membership_id}/deactivate", response={200: MembershipSchema, 404: dict, 400: dict}, summary="Deactivate a membership")
def deactivate_membership(request, membership_id: int):
    """
    Deactivate a membership type.
    
    - **membership_id**: The unique identifier of the membership to deactivate
    """
    success, error = MembershipService.deactivate_membership(membership_id)
    
    if not success:
        if error == "Membership not found":
            return 404, {"message": error}
        return 400, {"message": error}
    
    membership = get_object_or_404(Membership, id=membership_id)
    return 200, membership


# ============================================
# SUBSCRIPTION ENDPOINTS
# ============================================

@router.get("/subscriptions", response={200: SubscriptionListResponseSchema, 400: dict}, summary="List all subscriptions")
def list_subscriptions(request, filters: SubscriptionFilterSchema = Query(...)):
    """
    Retrieve a paginated list of subscription types with optional filtering.

    **Query Parameters:**
    - **name**: Filter by name (case-insensitive lookup)
    - **is_active**: Filter by active status
    - **year_id**: Filter by year ID
    - **membership_id**: Filter by membership ID
    - **is_recreational**: Filter by recreational status
    - **limit**: Number of results (default: 100, max: 1000)
    - **offset**: Pagination offset
    """
    # Get base queryset with related fields
    queryset = Subscription.objects.select_related('year', 'membership').all()

    # Apply filters
    queryset = filters.filter(queryset)

    # Get total count
    total_count = queryset.count()

    # Apply pagination
    subscriptions = list(queryset[filters.offset:filters.offset + filters.limit])

    # Transform to schema format
    subscription_data = []
    for sub in subscriptions:
        subscription_data.append({
            'id': sub.id,
            'name': sub.name,
            'description': sub.description,
            'year_id': sub.year_id,
            'year.name': sub.year.name,
            'membership_id': sub.membership_id,
            'membership.name': sub.membership.name,
            'fee': sub.fee,
            'fee_including_vat': sub.fee_including_vat,
            'is_active': sub.is_active,
            'is_recreational': sub.is_recreational,
            'notes': sub.notes,
            'created_at': sub.created_at.isoformat(),
            'updated_at': sub.updated_at.isoformat(),
        })

    return 200, {
        "count": total_count,
        "results": subscription_data
    }


@router.post("/subscriptions", response={201: SubscriptionSchema, 400: dict, 404: dict}, summary="Create a new subscription")
def create_subscription(request, payload: SubscriptionCreateSchema):
    """
    Create a new subscription type.

    **Request Body:**
    - **name**: Name of the subscription type
    - **description**: Detailed description
    - **year_id**: ID of the competition year
    - **membership_id**: ID of the membership type
    - **fee**: Subscription fee (excluding VAT)
    - **fee_including_vat**: Subscription fee including VAT
    - **is_active**: Whether the subscription is active (default: false)
    - **is_recreational**: Whether this is recreational (default: false)
    - **notes**: Additional notes (optional)
    """
    data = payload.model_dump()
    success, subscription, error = SubscriptionService.create_subscription(data)

    if not success:
        if error and ("Year not found" in error or "Membership not found" in error):
            return 404, {"message": error}
        return 400, {"message": error or "Failed to create subscription"}

    # Transform to schema format
    subscription_data = {
        'id': subscription.id,
        'name': subscription.name,
        'description': subscription.description,
        'year_id': subscription.year_id,
        'year.name': subscription.year.name,
        'membership_id': subscription.membership_id,
        'membership.name': subscription.membership.name,
        'fee': subscription.fee,
        'fee_including_vat': subscription.fee_including_vat,
        'is_active': subscription.is_active,
        'is_recreational': subscription.is_recreational,
        'notes': subscription.notes,
        'created_at': subscription.created_at.isoformat(),
        'updated_at': subscription.updated_at.isoformat(),
    }

    return 201, subscription_data


@router.get("/subscriptions/{subscription_id}", response={200: SubscriptionSchema, 404: dict}, summary="Get subscription details")
def get_subscription(request, subscription_id: int):
    """
    Retrieve details for a specific subscription.

    **Path Parameters:**
    - **subscription_id**: The unique identifier of the subscription
    """
    subscription = get_object_or_404(Subscription.objects.select_related('year', 'membership'), id=subscription_id)

    # Transform to schema format
    subscription_data = {
        'id': subscription.id,
        'name': subscription.name,
        'description': subscription.description,
        'year_id': subscription.year_id,
        'year.name': subscription.year.name,
        'membership_id': subscription.membership_id,
        'membership.name': subscription.membership.name,
        'fee': subscription.fee,
        'fee_including_vat': subscription.fee_including_vat,
        'is_active': subscription.is_active,
        'is_recreational': subscription.is_recreational,
        'notes': subscription.notes,
        'created_at': subscription.created_at.isoformat(),
        'updated_at': subscription.updated_at.isoformat(),
    }

    return 200, subscription_data


@router.patch("/subscriptions/{subscription_id}", response={200: SubscriptionSchema, 400: dict, 404: dict}, summary="Update subscription")
def update_subscription(request, subscription_id: int, payload: SubscriptionUpdateSchema):
    """
    Update an existing subscription.

    **Path Parameters:**
    - **subscription_id**: The unique identifier of the subscription to update

    **Request Body:** (all fields optional)
    - **name**: Updated name
    - **description**: Updated description
    - **year_id**: Updated year ID
    - **membership_id**: Updated membership ID
    - **fee**: Updated fee (excluding VAT)
    - **fee_including_vat**: Updated fee including VAT
    - **is_active**: Updated active status
    - **is_recreational**: Updated recreational status
    - **notes**: Updated notes
    """
    data = payload.model_dump(exclude_unset=True)
    success, subscription, error = SubscriptionService.update_subscription(subscription_id, data)

    if not success:
        if error == "Subscription not found":
            return 404, {"message": error}
        if error and ("Year not found" in error or "Membership not found" in error):
            return 404, {"message": error}
        return 400, {"message": error or "Failed to update subscription"}

    # Transform to schema format
    subscription_data = {
        'id': subscription.id,
        'name': subscription.name,
        'description': subscription.description,
        'year_id': subscription.year_id,
        'year.name': subscription.year.name,
        'membership_id': subscription.membership_id,
        'membership.name': subscription.membership.name,
        'fee': subscription.fee,
        'fee_including_vat': subscription.fee_including_vat,
        'is_active': subscription.is_active,
        'is_recreational': subscription.is_recreational,
        'notes': subscription.notes,
        'created_at': subscription.created_at.isoformat(),
        'updated_at': subscription.updated_at.isoformat(),
    }

    return 200, subscription_data


@router.delete("/subscriptions/{subscription_id}", response={200: MessageResponseSchema, 404: dict, 400: dict}, summary="Delete subscription")
def delete_subscription(request, subscription_id: int):
    """
    Delete a subscription.

    **Path Parameters:**
    - **subscription_id**: The unique identifier of the subscription to delete
    """
    success, error = SubscriptionService.delete_subscription(subscription_id)

    if not success:
        if error == "Subscription not found":
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, {"message": "Subscription deleted successfully"}

