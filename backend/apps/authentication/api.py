from ninja import Router
from django.http import HttpRequest
from typing import Optional

from .schemas import (
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshTokenRequestSchema,
    RefreshTokenResponseSchema,
    ForgotPasswordRequestSchema,
    ForgotPasswordResponseSchema,
    ResetPasswordRequestSchema,
    ResetPasswordResponseSchema,
    LogoutRequestSchema,
    LogoutResponseSchema,
    UserSchema,
    TokenResponseSchema,
)
from .services import AuthenticationService, PasswordResetService


router = Router(tags=["Authentication"])


def get_client_ip(request: HttpRequest) -> Optional[str]:
    """Get client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@router.post(
    "/auth/login",
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

    **Response:**
    - 200: Login successful with user info and tokens
    - 401: Invalid credentials or inactive account
    """
    ip_address = get_client_ip(request)
    result = AuthenticationService.login(
        email=payload.email,
        password=payload.password,
        ip_address=ip_address
    )

    if not result:
        return 401, {
            "message": "The email or password you entered is incorrect, or your account is inactive."
        }

    return 200, {
        "user": UserSchema.from_orm(result['user']),
        "tokens": TokenResponseSchema(
            access_token=result['access_token'],
            refresh_token=result['refresh_token'],
            expires_in=result['expires_in']
        ),
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
    - 401: Invalid or expired refresh token
    """
    result = AuthenticationService.refresh_access_token(payload.refresh_token)

    if not result:
        return 401, {
            "message": "The refresh token is invalid, expired, or has been revoked."
        }

    return 200, RefreshTokenResponseSchema(
        access_token=result['access_token'],
        expires_in=result['expires_in']
    )


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
    - 400: Failed to logout
    """
    success = AuthenticationService.logout(payload.refresh_token)

    if not success:
        return 400, {
            "message": "Unable to revoke the refresh token."
        }

    return 200, LogoutResponseSchema(message="Logout successful")


@router.post(
    "/auth/forgot-password",
    response={200: ForgotPasswordResponseSchema},
    summary="Forgot Password",
    description="Initiate password reset process by sending reset email"
)
def forgot_password(request: HttpRequest, payload: ForgotPasswordRequestSchema):
    """
    Initiate password reset process.

    **Request Body:**
    - email: User's email address

    **Response:**
    - 200: Password reset email sent (always returns 200 to prevent email enumeration)
    """
    ip_address = get_client_ip(request)
    success = PasswordResetService.initiate_password_reset(
        email=payload.email,
        ip_address=ip_address
    )

    # Always return success to prevent email enumeration
    return 200, ForgotPasswordResponseSchema(
        message="If an account exists with this email, a password reset link has been sent.",
        email=payload.email
    )


@router.post(
    "/auth/reset-password",
    response={200: ResetPasswordResponseSchema, 400: dict},
    summary="Reset Password",
    description="Reset user password using the token from reset email"
)
def reset_password(request: HttpRequest, payload: ResetPasswordRequestSchema):
    """
    Reset user password using reset token.

    **Request Body:**
    - token: Password reset token from email
    - new_password: New password (min 8 characters)
    - confirm_password: Password confirmation (must match new_password)

    **Response:**
    - 200: Password reset successful
    - 400: Invalid token, expired token, or passwords don't match
    """
    success, error_message = PasswordResetService.reset_password(
        token=payload.token,
        new_password=payload.new_password
    )

    if not success:
        return 400, {
            "message": error_message
        }

    return 200, ResetPasswordResponseSchema(
        message="Your password has been reset successfully. You can now login with your new password.",
        success=True
    )


@router.get(
    "/auth/validate-reset-token/{token}",
    response={200: dict, 400: dict},
    summary="Validate Reset Token",
    description="Check if a password reset token is valid"
)
def validate_reset_token(request: HttpRequest, token: str):
    """
    Validate a password reset token.

    **Path Parameters:**
    - token: Password reset token to validate

    **Response:**
    - 200: Token is valid
    - 400: Token is invalid, expired, or already used
    """
    is_valid, error_message = PasswordResetService.validate_reset_token(token)

    if not is_valid:
        return 400, {
            "message": error_message
        }

    return 200, {
        "valid": True,
        "message": "Token is valid"
    }

