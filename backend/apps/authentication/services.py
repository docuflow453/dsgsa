import secrets
import jwt
from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from django.db import transaction

from .models import PasswordResetToken, RefreshToken
from .email_service import EmailService

User = get_user_model()


class AuthenticationService:
    """Service class for authentication-related business logic."""
    
    # JWT Configuration
    ACCESS_TOKEN_LIFETIME = timedelta(minutes=30)  # 30 minutes
    REFRESH_TOKEN_LIFETIME = timedelta(days=7)  # 7 days
    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = 'HS256'
    
    @classmethod
    def login(cls, email: str, password: str, ip_address: Optional[str] = None) -> Optional[Dict]:
        """
        Authenticate user and generate JWT tokens.
        
        Args:
            email: User's email address
            password: User's password
            ip_address: IP address of the requester
        
        Returns:
            Dictionary containing user info and tokens, or None if authentication fails
        """
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if not user:
            return None
        
        # Check if user is active
        if not user.is_active:
            return None
        
        # Generate tokens
        access_token = cls._generate_access_token(user)
        refresh_token_str = cls._generate_refresh_token(user, ip_address)
        
        return {
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token_str,
            'expires_in': int(cls.ACCESS_TOKEN_LIFETIME.total_seconds())
        }
    
    @classmethod
    def _generate_access_token(cls, user) -> str:
        """Generate JWT access token."""
        payload = {
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.utcnow() + cls.ACCESS_TOKEN_LIFETIME,
            'iat': datetime.utcnow(),
            'type': 'access'
        }
        return jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
    
    @classmethod
    def _generate_refresh_token(cls, user, ip_address: Optional[str] = None) -> str:
        """Generate and store JWT refresh token."""
        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + cls.REFRESH_TOKEN_LIFETIME,
            'iat': datetime.utcnow(),
            'type': 'refresh',
            'jti': secrets.token_urlsafe(32)  # Unique token identifier
        }
        
        token_str = jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        
        # Store refresh token in database
        RefreshToken.objects.create(
            user=user,
            token=token_str,
            expires_at=timezone.now() + cls.REFRESH_TOKEN_LIFETIME,
            ip_address=ip_address
        )
        
        return token_str
    
    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> Optional[Dict]:
        """
        Generate new access token from refresh token.
        
        Args:
            refresh_token: The refresh token
        
        Returns:
            Dictionary with new access token, or None if refresh token is invalid
        """
        try:
            # Verify refresh token
            payload = jwt.decode(refresh_token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            
            # Check token type
            if payload.get('type') != 'refresh':
                return None
            
            # Check if token exists in database and is valid
            stored_token = RefreshToken.objects.filter(token=refresh_token).first()
            if not stored_token or not stored_token.is_valid:
                return None
            
            # Get user
            user = User.objects.filter(id=payload['user_id']).first()
            if not user or not user.is_active:
                return None
            
            # Generate new access token
            access_token = cls._generate_access_token(user)
            
            return {
                'access_token': access_token,
                'expires_in': int(cls.ACCESS_TOKEN_LIFETIME.total_seconds())
            }
            
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @classmethod
    def verify_access_token(cls, token: str) -> Optional[Dict]:
        """
        Verify and decode access token.

        Args:
            token: The access token to verify

        Returns:
            Decoded token payload, or None if invalid
        """
        try:
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            if payload.get('type') != 'access':
                return None
            return payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

    @classmethod
    def logout(cls, refresh_token: str) -> bool:
        """
        Logout user by revoking refresh token.

        Args:
            refresh_token: The refresh token to revoke

        Returns:
            True if successful, False otherwise
        """
        try:
            token = RefreshToken.objects.filter(token=refresh_token).first()
            if token:
                token.revoke()
                return True
            return False
        except Exception:
            return False


class PasswordResetService:
    """Service class for password reset functionality."""

    @staticmethod
    def initiate_password_reset(email: str, ip_address: Optional[str] = None) -> bool:
        """
        Initiate password reset process by generating token and sending email.

        Args:
            email: User's email address
            ip_address: IP address of the requester

        Returns:
            True if email was sent successfully, False otherwise
        """
        try:
            # Find user by email
            user = User.objects.filter(email=email).first()

            # Always return True to prevent email enumeration
            # but only send email if user exists
            if not user:
                return True

            # Generate secure token
            token = secrets.token_urlsafe(32)

            # Create password reset token record
            with transaction.atomic():
                # Invalidate any existing tokens for this user
                PasswordResetToken.objects.filter(
                    user=user,
                    used_at__isnull=True
                ).update(used_at=timezone.now())

                # Create new token
                reset_token = PasswordResetToken.objects.create(
                    user=user,
                    token=token,
                    ip_address=ip_address
                )

            # Send password reset email
            user_name = f"{user.first_name} {user.last_name}".strip() or user.email
            success = EmailService.send_password_reset_email(
                user_email=user.email,
                reset_token=token,
                user_name=user_name
            )

            return success

        except Exception as e:
            # Log error but return True to prevent enumeration
            import logging
            logging.error(f"Error initiating password reset: {str(e)}")
            return True

    @staticmethod
    def reset_password(token: str, new_password: str) -> Tuple[bool, Optional[str]]:
        """
        Reset user password using reset token.

        Args:
            token: Password reset token
            new_password: New password to set

        Returns:
            Tuple of (success: bool, error_message: Optional[str])
        """
        try:
            # Find the reset token
            reset_token = PasswordResetToken.objects.filter(token=token).first()

            if not reset_token:
                return False, "Invalid reset token"

            if not reset_token.is_valid:
                if reset_token.is_expired:
                    return False, "Reset token has expired"
                if reset_token.is_used:
                    return False, "Reset token has already been used"

            # Get user and update password
            user = reset_token.user

            with transaction.atomic():
                # Set new password
                user.set_password(new_password)
                user.save()

                # Mark token as used
                reset_token.mark_as_used()

                # Revoke all existing refresh tokens for security
                RefreshToken.objects.filter(
                    user=user,
                    revoked_at__isnull=True
                ).update(revoked_at=timezone.now())

            return True, None

        except Exception as e:
            import logging
            logging.error(f"Error resetting password: {str(e)}")
            return False, "An error occurred while resetting password"

    @staticmethod
    def validate_reset_token(token: str) -> Tuple[bool, Optional[str]]:
        """
        Validate a password reset token.

        Args:
            token: Password reset token

        Returns:
            Tuple of (is_valid: bool, error_message: Optional[str])
        """
        reset_token = PasswordResetToken.objects.filter(token=token).first()

        if not reset_token:
            return False, "Invalid reset token"

        if reset_token.is_expired:
            return False, "Reset token has expired"

        if reset_token.is_used:
            return False, "Reset token has already been used"

        return True, None


