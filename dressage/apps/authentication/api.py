from ninja import Router
from django.http import HttpRequest
from typing import Optional

from .schemas import (
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshTokenRequestSchema,
    RefreshTokenResponseSchema,
    LogoutRequestSchema,
    LogoutResponseSchema,
    ErrorResponseSchema,
    RegistrationRequestSchema,
    RegistrationResponseSchema,
)
from .services import AuthService


router = Router(tags=["Authentication"])


def get_client_ip(request: HttpRequest) -> Optional[str]:
    """Get client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@router.post(
    "/login",
    response={200: LoginResponseSchema, 401: dict},
    summary="User Login",
    description="Authenticate user credentials and return JWT access and refresh tokens"
)
def login(request: HttpRequest, payload: LoginRequestSchema):
    """
    Authenticate user and generate JWT tokens.

    **Request Body:**
    - email: User's email address
    - password: User's password
    - remember_me: Optional boolean to extend refresh token lifetime (default: false)

    **Response:**
    - 200: Login successful with user info and tokens
    - 401: Invalid credentials, inactive account, or banned account
    """
    ip_address = get_client_ip(request)

    result = AuthService.login(
        email=payload.email,
        password=payload.password,
        remember_me=payload.remember_me,
        ip_address=ip_address
    )

    if not result:
        return 401, {
            "message": "Invalid credentials"
        }

    return 200, {
        "user": result['user'],
        "access_token": result['access_token'],
        "refresh_token": result['refresh_token'],
        "token_type": "Bearer",
        "expires_in": result['expires_in'],
        "message": "Login successful"
    }


@router.post(
    "/auth/refresh",
    response={200: RefreshTokenResponseSchema, 401: dict},
    summary="Refresh Access Token",
    description="Generate a new access token using a valid refresh token"
)
def refresh_token(request: HttpRequest, payload: RefreshTokenRequestSchema):
    """
    Generate new access token from refresh token.

    **Request Body:**
    - refresh_token: Valid JWT refresh token

    **Response:**
    - 200: New access token generated
    - 401: Invalid, expired, or revoked refresh token
    """
    result = AuthService.refresh_access_token(payload.refresh_token)

    if not result:
        return 401, {
            "message": "Invalid or expired refresh token"
        }

    return 200, {
        "access_token": result['access_token'],
        "token_type": "Bearer",
        "expires_in": result['expires_in'],
        "message": "Token refreshed successfully"
    }


@router.post(
    "/auth/logout",
    response={200: LogoutResponseSchema, 400: dict},
    summary="User Logout",
    description="Revoke refresh token to logout user"
)
def logout(request: HttpRequest, payload: LogoutRequestSchema):
    """
    Logout user by revoking refresh token.

    **Request Body:**
    - refresh_token: Refresh token to revoke

    **Response:**
    - 200: Logout successful
    - 400: Failed to logout (token not found or already revoked)
    """
    success = AuthService.logout(payload.refresh_token)

    if not success:
        return 400, {
            "message": "Unable to revoke the refresh token"
        }

    return 200, {
        "message": "Logout successful"
    }


@router.post(
    "/register",
    response={201: RegistrationResponseSchema, 400: dict},
    summary="User Registration",
    description="Register a new user account (riders, officials, clubs, etc.)"
)
def register(request: HttpRequest, payload: RegistrationRequestSchema):
    """
    Register a new user and create associated profile.

    **Request Body:**
    - email: Email address (unique)
    - password: Password (minimum 8 characters)
    - first_name: First name (required)
    - last_name: Last name (required)
    - role: User role - RIDER, OFFICIAL, CLUB, PROVINCIAL, SHOW_HOLDING_BODY, PUBLIC
    - title: User title (optional) - MR, MRS, MS, MISS, DR, PROF
    - maiden_name: Maiden name (optional)

    **For RIDER and OFFICIAL roles (required):**
    - date_of_birth: Date of birth
    - gender: Gender (MALE, FEMALE, OTHER)
    - nationality: Nationality (ISO 3166-1 alpha-2 code)
    - id_number OR passport_number: At least one must be provided

    **Optional fields:**
    - ethnicity: Ethnicity
    - address_line_1, address_line_2, suburb, city, province, postal_code, country

    **Response:**
    - 201: Registration successful with user info and JWT tokens
    - 400: Validation error or email already exists

    **Note:** Upon successful registration, the user is automatically logged in
    and receives access and refresh tokens.
    """
    ip_address = get_client_ip(request)

    # Convert payload to dict for the service
    payload_dict = payload.dict(exclude_none=True)

    success, result, error = AuthService.register_user(
        ip_address=ip_address,
        **payload_dict
    )

    if not success:
        return 400, {
            "message": error
        }

    return 201, {
        "user": result['user'],
        "access_token": result['access_token'],
        "refresh_token": result['refresh_token'],
        "token_type": "Bearer",
        "expires_in": result['expires_in'],
        "message": "Registration successful"
    }