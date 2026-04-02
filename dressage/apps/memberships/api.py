from typing import List
from ninja import Router, Query
from apps.memberships.schemas import (
    MembershipSchema,
    MembershipCreateSchema,
    MembershipUpdateSchema,
    MembershipFilterSchema,
    MembershipListResponseSchema,
    SubscriptionSchema,
    SubscriptionCreateSchema,
    SubscriptionUpdateSchema,
    SubscriptionFilterSchema,
    SubscriptionListResponseSchema
)
from apps.memberships.services import MembershipService, SubscriptionService

router = Router(tags=["Memberships"])


@router.get("memberships", response={200: MembershipListResponseSchema}, summary="List all memberships")
def list_memberships(
    request,
    filters: MembershipFilterSchema = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    List all memberships with optional filtering and pagination.

    Query parameters:
    - name: Filter by name (case-insensitive)
    - is_active: Filter by active status
    - limit: Maximum number of results (1-1000, default: 100)
    - offset: Pagination offset (default: 0)
    """
    filter_dict = filters.dict(exclude_none=True)
    count, memberships = MembershipService.get_memberships(
        filters=filter_dict,
        limit=limit,
        offset=offset
    )

    return 200, {
        "count": count,
        "results": memberships
    }


@router.post("memberships", response={201: MembershipSchema, 400: dict}, summary="Create a new membership")
def create_membership(request, payload: MembershipCreateSchema):
    """
    Create a new membership type.

    Required fields:
    - name: Membership name (unique)
    - description: Detailed description

    Optional fields:
    - is_active: Active status (default: false)
    - notes: Additional notes
    """
    success, membership, error = MembershipService.create_membership(payload.dict())

    if not success:
        return 400, {"message": error}

    return 201, membership


@router.get("memberships/{membership_id}", response={200: MembershipSchema, 404: dict}, summary="Get membership details")
def get_membership(request, membership_id: str):
    """
    Get details of a specific membership by ID.
    """
    membership = MembershipService.get_membership(membership_id)

    if not membership:
        return 404, {"message": f"Membership with id {membership_id} not found"}

    return 200, membership


@router.patch("memberships/{membership_id}", response={200: MembershipSchema, 400: dict, 404: dict}, summary="Update membership")
def update_membership(request, membership_id: str, payload: MembershipUpdateSchema):
    """
    Update a membership type.

    All fields are optional:
    - name: Membership name
    - description: Detailed description
    - is_active: Active status
    - notes: Additional notes
    """
    success, membership, error = MembershipService.update_membership(
        membership_id,
        payload.dict(exclude_none=True)
    )

    if not success:
        if "not found" in error:
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, membership


@router.delete("memberships/{membership_id}", response={200: dict, 404: dict}, summary="Delete membership")
def delete_membership(request, membership_id: str):
    """
    Delete a membership type.
    """
    success, error = MembershipService.delete_membership(membership_id)

    if not success:
        return 404, {"message": error}

    return 200, {"message": "Membership deleted successfully"}


@router.post("memberships/{membership_id}/activate", response={200: MembershipSchema, 404: dict}, summary="Activate membership")
def activate_membership(request, membership_id: str):
    """
    Activate a membership type.
    """
    success, membership, error = MembershipService.activate_membership(membership_id)

    if not success:
        return 404, {"message": error}

    return 200, membership


@router.post("memberships/{membership_id}/deactivate", response={200: MembershipSchema, 404: dict}, summary="Deactivate membership")
def deactivate_membership(request, membership_id: str):
    """
    Deactivate a membership type.
    """
    success, membership, error = MembershipService.deactivate_membership(membership_id)

    if not success:
        return 404, {"message": error}

    return 200, membership



# Subscription Endpoints
@router.get("subscriptions", response={200: SubscriptionListResponseSchema}, summary="List all subscriptions")
def list_subscriptions(
    request,
    filters: SubscriptionFilterSchema = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    List all subscriptions with optional filtering and pagination.

    Query parameters:
    - name: Filter by name (case-insensitive)
    - membership_id: Filter by membership ID
    - year_id: Filter by year ID
    - is_active: Filter by active status
    - is_recreational: Filter by recreational status
    - limit: Maximum number of results (1-1000, default: 100)
    - offset: Pagination offset (default: 0)
    """
    filter_dict = filters.dict(exclude_none=True)
    count, subscriptions = SubscriptionService.get_subscriptions(
        filters=filter_dict,
        limit=limit,
        offset=offset
    )

    return 200, {
        "count": count,
        "results": subscriptions
    }


@router.post("subscriptions", response={201: SubscriptionSchema, 400: dict}, summary="Create a new subscription")
def create_subscription(request, payload: SubscriptionCreateSchema):
    """
    Create a new subscription.

    Required fields:
    - name: Subscription name
    - description: Detailed description
    - membership_id: UUID of associated membership
    - year_id: UUID of associated year
    - fee: Subscription fee (non-negative)

    Optional fields:
    - is_recreational: Recreational subscription flag (default: false)
    - is_active: Active status (default: false)
    - notes: Additional notes
    """
    success, subscription, error = SubscriptionService.create_subscription(payload.dict())

    if not success:
        return 400, {"message": error}

    return 201, subscription


@router.get("subscriptions/{subscription_id}", response={200: SubscriptionSchema, 404: dict}, summary="Get subscription details")
def get_subscription(request, subscription_id: str):
    """
    Get details of a specific subscription by ID.
    """
    subscription = SubscriptionService.get_subscription(subscription_id)

    if not subscription:
        return 404, {"message": f"Subscription with id {subscription_id} not found"}

    return 200, subscription


@router.patch("subscriptions/{subscription_id}", response={200: SubscriptionSchema, 400: dict, 404: dict}, summary="Update subscription")
def update_subscription(request, subscription_id: str, payload: SubscriptionUpdateSchema):
    """
    Update a subscription.

    All fields are optional:
    - name: Subscription name
    - description: Detailed description
    - membership_id: UUID of associated membership
    - year_id: UUID of associated year
    - fee: Subscription fee
    - is_recreational: Recreational subscription flag
    - is_active: Active status
    - notes: Additional notes
    """
    success, subscription, error = SubscriptionService.update_subscription(
        subscription_id,
        payload.dict(exclude_none=True)
    )

    if not success:
        if "not found" in error:
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, subscription


@router.delete("subscriptions/{subscription_id}", response={200: dict, 404: dict}, summary="Delete subscription")
def delete_subscription(request, subscription_id: str):
    """
    Delete a subscription.
    """
    success, error = SubscriptionService.delete_subscription(subscription_id)

    if not success:
        return 404, {"message": error}

    return 200, {"message": "Subscription deleted successfully"}


@router.post("subscriptions/{subscription_id}/activate", response={200: SubscriptionSchema, 404: dict}, summary="Activate subscription")
def activate_subscription(request, subscription_id: str):
    """
    Activate a subscription.
    """
    success, subscription, error = SubscriptionService.activate_subscription(subscription_id)

    if not success:
        return 404, {"message": error}

    return 200, subscription


@router.post("subscriptions/{subscription_id}/deactivate", response={200: SubscriptionSchema, 404: dict}, summary="Deactivate subscription")
def deactivate_subscription(request, subscription_id: str):
    """
    Deactivate a subscription.
    """
    success, subscription, error = SubscriptionService.deactivate_subscription(subscription_id)

    if not success:
        return 404, {"message": error}

    return 200, subscription

