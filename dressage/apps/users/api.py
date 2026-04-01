from typing import List
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password, check_password
from ninja import Router, Query

from .models import User, UserRole
from .schemas import (
    UserCreateSchema,
    UserUpdateSchema,
    UserPasswordUpdateSchema,
    UserResponseSchema,
    UserListResponseSchema,
    MessageResponseSchema,
    ErrorResponseSchema,
    UserRoleSchema,
    UserFilterSchema,
)


router = Router(tags=["Users"])


@router.get("roles", response=List[UserRoleSchema], summary="Get available user roles")
def list_roles(request):
    """
    Retrieve all available user roles.

    Returns a list of role choices with their values and labels.
    """
    roles = [
        {"value": role[0], "label": role[1]}
        for role in UserRole.choices
    ]
    return roles


@router.get("", response={200: UserListResponseSchema, 400: dict}, summary="List all users")
def list_users(request, filters: UserFilterSchema = Query(...)):
    """
    Retrieve a paginated list of users with optional filtering.

    - **search**: Search by username, email, first name, or last name
    - **role**: Filter by user role (ADMIN, STAFF, MEMBER)
    - **is_active**: Filter by active status
    - **limit**: Number of results to return (default: 100, max: 1000)
    - **offset**: Number of results to skip (for pagination)
    """
    # Validate role if provided
    if filters.role and filters.role not in [r[0] for r in UserRole.choices]:
        return 400, {"message": f"Invalid role: {filters.role}"}

    # Get base queryset
    queryset = User.objects.all()

    # Apply filters using FilterSchema
    queryset = filters.filter(queryset)

    # Get total count
    count = queryset.count()

    # Apply pagination
    users = list(queryset[filters.offset:filters.offset + filters.limit])

    return 200, {
        "count": count,
        "results": users
    }


@router.get("/{user_id}", response=UserResponseSchema, summary="Get user by ID")
def get_user(request, user_id: int):
    """
    Retrieve a specific user by their ID.

    - **user_id**: The unique identifier of the user
    """
    user = get_object_or_404(User, id=user_id)
    return user


@router.post("", response={201: UserResponseSchema, 400: dict}, summary="Create a new user")
def create_user(request, payload: UserCreateSchema):
    """
    Create a new user account.

    - **username**: Unique username (3-150 characters)
    - **email**: Valid email address
    - **password**: Password (minimum 8 characters)
    - **first_name**: User's first name (optional)
    - **last_name**: User's last name (optional)
    - **role**: User role - ADMIN, STAFF, or MEMBER (default: MEMBER)
    """
    # Validate role
    if payload.role and payload.role not in [r[0] for r in UserRole.choices]:
        return 400, {"message": f"Invalid role: {payload.role}"}

    # Check if username already exists
    if User.objects.filter(username=payload.username).exists():
        return 400, {"message": "Username already exists"}

    # Check if email already exists
    if User.objects.filter(email=payload.email).exists():
        return 400, {"message": "Email already exists"}

    # Create user
    user = User.objects.create(
        username=payload.username,
        email=payload.email,
        password=make_password(payload.password),
        first_name=payload.first_name or '',
        last_name=payload.last_name or '',
        role=payload.role or UserRole.MEMBER,
    )

    return 201, user




@router.put("/{user_id}", response={200: UserResponseSchema, 400: dict}, summary="Update user information")
def update_user(request, user_id: int, payload: UserUpdateSchema):
    """
    Update an existing user's information.

    - **user_id**: The unique identifier of the user to update
    - **email**: New email address (optional)
    - **first_name**: New first name (optional)
    - **last_name**: New last name (optional)
    - **role**: New role (optional)
    - **is_active**: Active status (optional)
    """
    user = get_object_or_404(User, id=user_id)

    # Validate role if provided
    if payload.role and payload.role not in [r[0] for r in UserRole.choices]:
        return 400, {"message": f"Invalid role: {payload.role}"}

    # Check if email already exists (excluding current user)
    if payload.email and User.objects.filter(email=payload.email).exclude(id=user_id).exists():
        return 400, {"message": "Email already exists"}

    # Update fields
    if payload.email is not None:
        user.email = payload.email
    if payload.first_name is not None:
        user.first_name = payload.first_name
    if payload.last_name is not None:
        user.last_name = payload.last_name
    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active

    user.save()
    return 200, user


@router.patch("/{user_id}/password", response={200: MessageResponseSchema, 400: dict}, summary="Update user password")
def update_password(request, user_id: int, payload: UserPasswordUpdateSchema):
    """
    Update a user's password.

    - **user_id**: The unique identifier of the user
    - **current_password**: The user's current password
    - **new_password**: The new password (minimum 8 characters)
    """
    user = get_object_or_404(User, id=user_id)

    # Verify current password
    if not check_password(payload.current_password, user.password):
        return 400, {"message": "Current password is incorrect"}

    # Update password
    user.password = make_password(payload.new_password)
    user.save()

    return 200, {"message": "Password updated successfully"}


@router.delete("/{user_id}", response=MessageResponseSchema, summary="Delete a user")
def delete_user(request, user_id: int):
    """
    Delete a user account.

    - **user_id**: The unique identifier of the user to delete
    """
    user = get_object_or_404(User, id=user_id)
    username = user.username
    user.delete()

    return {"message": f"User '{username}' deleted successfully"}


@router.post("/{user_id}/ban", response={200: UserResponseSchema, 400: dict}, summary="Ban a user")
def ban_user(request, user_id: int):
    """
    Ban a user account by setting the banned_at timestamp.

    - **user_id**: The unique identifier of the user to ban
    """
    from django.utils import timezone

    user = get_object_or_404(User, id=user_id)

    if user.banned_at:
        return 400, {"message": "User is already banned"}

    user.banned_at = timezone.now()
    user.is_active = False
    user.save()

    return 200, user


@router.post("/{user_id}/unban", response={200: UserResponseSchema, 400: dict}, summary="Unban a user")
def unban_user(request, user_id: int):
    """
    Unban a user account by clearing the banned_at timestamp.

    - **user_id**: The unique identifier of the user to unban
    """
    user = get_object_or_404(User, id=user_id)

    if not user.banned_at:
        return 400, {"message": "User is not banned"}

    user.banned_at = None
    user.is_active = True
    user.save()

    return 200, user


@router.post("/{user_id}/activate", response={200: UserResponseSchema, 400: dict}, summary="Activate a user account")
def activate_user(request, user_id: int):
    """
    Activate a user account by setting the activated_at timestamp.

    - **user_id**: The unique identifier of the user to activate
    """
    from django.utils import timezone

    user = get_object_or_404(User, id=user_id)

    if user.activated_at:
        return 400, {"message": "User is already activated"}

    user.activated_at = timezone.now()
    user.is_active = True
    user.save()

    return 200, user


@router.post("/{user_id}/verify-email", response={200: UserResponseSchema, 400: dict}, summary="Verify user email")
def verify_email(request, user_id: int):
    """
    Mark a user's email as verified by setting the email_verified_at timestamp.

    - **user_id**: The unique identifier of the user
    """
    from django.utils import timezone

    user = get_object_or_404(User, id=user_id)

    if user.email_verified_at:
        return 400, {"message": "Email is already verified"}

    user.email_verified_at = timezone.now()
    user.save()

    return 200, user
