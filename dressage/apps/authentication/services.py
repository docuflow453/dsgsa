import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import RefreshToken

User = get_user_model()


class AuthService:
    """Service class for JWT-based authentication."""

    # JWT Configuration
    ACCESS_TOKEN_LIFETIME = timedelta(minutes=30)  # 30 minutes
    REFRESH_TOKEN_LIFETIME_NORMAL = timedelta(days=7)  # 7 days
    REFRESH_TOKEN_LIFETIME_REMEMBER = timedelta(days=30)  # 30 days for remember_me
    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = 'HS256'

    @classmethod
    def login(
        cls,
        email: str,
        password: str,
        remember_me: bool = False,
        ip_address: Optional[str] = None
    ) -> Optional[Dict]:
        """
        Authenticate user and generate JWT tokens.

        Args:
            email: Email address (username)
            password: User's password
            remember_me: Whether to extend refresh token lifetime
            ip_address: IP address of the requester

        Returns:
            Dictionary containing user info and tokens, or None if authentication fails
        """
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        # Verify password
        if not check_password(password, user.password):
            return None

        # Check if user is active
        if not user.is_active:
            return None

        # Check if user is banned
        if user.is_banned:
            return None

        # Generate tokens
        access_token = cls._generate_access_token(user)
        refresh_token_lifetime = (
            cls.REFRESH_TOKEN_LIFETIME_REMEMBER if remember_me
            else cls.REFRESH_TOKEN_LIFETIME_NORMAL
        )
        refresh_token_str = cls._generate_refresh_token(
            user,
            refresh_token_lifetime,
            ip_address
        )

        return {
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token_str,
            'expires_in': int(cls.ACCESS_TOKEN_LIFETIME.total_seconds()),
        }

    @classmethod
    def _generate_access_token(cls, user: User) -> str:
        """Generate JWT access token."""
        now = datetime.utcnow()
        payload = {
            'user_id': str(user.id),  # Convert UUID to string
            'email': user.email,
            'role': user.role,
            'exp': now + cls.ACCESS_TOKEN_LIFETIME,
            'iat': now,
            'type': 'access',
        }
        return jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

    @classmethod
    def _generate_refresh_token(
        cls,
        user: User,
        lifetime: timedelta,
        ip_address: Optional[str] = None
    ) -> str:
        """Generate and store JWT refresh token."""
        now = datetime.utcnow()
        expires_at = timezone.now() + lifetime

        payload = {
            'user_id': str(user.id),  # Convert UUID to string
            'exp': now + lifetime,
            'iat': now,
            'type': 'refresh',
        }

        token_str = jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

        # Store in database
        RefreshToken.objects.create(
            user=user,
            token=token_str,
            expires_at=expires_at,
            ip_address=ip_address
        )

        return token_str

    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> Optional[Dict]:
        """
        Generate new access token from refresh token.

        Args:
            refresh_token: JWT refresh token

        Returns:
            Dictionary with new access token, or None if invalid
        """
        try:
            # Verify JWT signature and decode
            payload = jwt.decode(
                refresh_token,
                cls.SECRET_KEY,
                algorithms=[cls.ALGORITHM]
            )

            # Check token type
            if payload.get('type') != 'refresh':
                return None

            # Get token from database
            token_obj = RefreshToken.objects.filter(
                token=refresh_token,
                is_revoked=False
            ).select_related('user').first()

            if not token_obj or not token_obj.is_valid:
                return None

            # Get user
            user = token_obj.user

            # Check if user is still active
            if not user.is_active or user.is_banned:
                return None

            # Generate new access token
            access_token = cls._generate_access_token(user)

            return {
                'access_token': access_token,
                'expires_in': int(cls.ACCESS_TOKEN_LIFETIME.total_seconds()),
            }

        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        except Exception:
            return None

    @classmethod
    def logout(cls, refresh_token: str) -> bool:
        """
        Revoke a refresh token to logout user.

        Args:
            refresh_token: JWT refresh token to revoke

        Returns:
            True if token was revoked, False otherwise
        """
        try:
            token_obj = RefreshToken.objects.filter(
                token=refresh_token,
                is_revoked=False
            ).first()

            if token_obj:
                token_obj.revoke()
                return True

            return False

        except Exception:
            return False

    @classmethod
    def verify_access_token(cls, access_token: str) -> Optional[Dict]:
        """
        Verify and decode an access token.

        Args:
            access_token: JWT access token

        Returns:
            Decoded payload if valid, None otherwise
        """
        try:
            payload = jwt.decode(
                access_token,
                cls.SECRET_KEY,
                algorithms=[cls.ALGORITHM]
            )

            # Check token type
            if payload.get('type') != 'access':
                return None

            return payload

        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        except Exception:
            return None

    @classmethod
    def cleanup_expired_tokens(cls):
        """Clean up expired refresh tokens from database."""
        expired_tokens = RefreshToken.objects.filter(
            expires_at__lt=timezone.now()
        )
        count = expired_tokens.count()
        expired_tokens.delete()
        return count

    @classmethod
    def register_user(
        cls,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        role: str,
        title: Optional[str] = None,
        maiden_name: Optional[str] = None,
        date_of_birth: Optional[str] = None,
        gender: Optional[str] = None,
        nationality: Optional[str] = None,
        id_number: Optional[str] = None,
        passport_number: Optional[str] = None,
        ethnicity: Optional[str] = None,
        address_line_1: Optional[str] = None,
        address_line_2: Optional[str] = None,
        suburb: Optional[str] = None,
        city: Optional[str] = None,
        province: Optional[str] = None,
        postal_code: Optional[str] = None,
        country: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """
        Register a new user and create associated profile (Rider or Official).

        Args:
            email: User's email address (unique)
            password: User's password
            first_name: User's first name
            last_name: User's last name
            role: User role (RIDER, OFFICIAL, CLUB, etc.)
            title: User title (optional)
            maiden_name: Maiden name (optional)
            date_of_birth: Date of birth (required for RIDER and OFFICIAL)
            gender: Gender (required for RIDER and OFFICIAL)
            nationality: Nationality (required for RIDER and OFFICIAL)
            id_number: SA ID number (optional)
            passport_number: Passport number (optional)
            ethnicity: Ethnicity (optional)
            address_line_1: Address line 1 (optional)
            address_line_2: Address line 2 (optional)
            suburb: Suburb (optional)
            city: City (optional)
            province: Province (optional)
            postal_code: Postal code (optional)
            country: Country (optional)
            ip_address: IP address of requester (optional)

        Returns:
            Tuple of (success, result_dict, error_message)
            - success: Boolean indicating if registration was successful
            - result_dict: Contains user, tokens if successful
            - error_message: Error description if failed
        """
        try:
            with transaction.atomic():
                # Check if email already exists
                if User.objects.filter(email=email).exists():
                    return False, None, "Email address is already registered"

                # Validate role-specific requirements
                if role in ['RIDER', 'OFFICIAL']:
                    if not date_of_birth:
                        return False, None, f"Date of birth is required for {role} role"
                    if not gender:
                        return False, None, f"Gender is required for {role} role"
                    if not nationality:
                        return False, None, f"Nationality is required for {role} role"
                    if not id_number and not passport_number:
                        return False, None, "Either ID number or passport number must be provided"

                # Create user
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    role=role,
                    title=title,
                    maiden_name=maiden_name,
                    is_active=True
                )

                # Set activation timestamp
                user.activated_at = timezone.now()
                user.save()

                # Create Rider profile if role is RIDER or OFFICIAL
                if role in ['RIDER', 'OFFICIAL']:
                    from apps.riders.models import Rider

                    rider_data = {
                        'user': user,
                        'date_of_birth': date_of_birth,
                        'gender': gender,
                        'nationality': nationality,
                    }

                    # Add optional fields if provided
                    if id_number:
                        rider_data['id_number'] = id_number
                    if passport_number:
                        rider_data['passport_number'] = passport_number
                    if ethnicity:
                        rider_data['ethnicity'] = ethnicity
                    if address_line_1:
                        rider_data['address_line_1'] = address_line_1
                    if address_line_2:
                        rider_data['address_line_2'] = address_line_2
                    if suburb:
                        rider_data['suburb'] = suburb
                    if city:
                        rider_data['city'] = city
                    if province:
                        rider_data['province'] = province
                    if postal_code:
                        rider_data['postal_code'] = postal_code
                    if country:
                        rider_data['country'] = country

                    # Create Rider instance
                    rider = Rider.objects.create(**rider_data)

                # Generate tokens for automatic login after registration
                access_token = cls._generate_access_token(user)
                refresh_token_str = cls._generate_refresh_token(
                    user,
                    cls.REFRESH_TOKEN_LIFETIME_NORMAL,
                    ip_address
                )

                return True, {
                    'user': user,
                    'access_token': access_token,
                    'refresh_token': refresh_token_str,
                    'expires_in': int(cls.ACCESS_TOKEN_LIFETIME.total_seconds()),
                }, None

        except ValidationError as e:
            # Handle Django model validation errors
            if hasattr(e, 'message_dict'):
                error_msg = "; ".join([f"{k}: {', '.join(v)}" for k, v in e.message_dict.items()])
                return False, None, f"Validation error: {error_msg}"
            else:
                return False, None, f"Validation error: {str(e)}"
        except Exception as e:
            return False, None, f"Registration failed: {str(e)}"
