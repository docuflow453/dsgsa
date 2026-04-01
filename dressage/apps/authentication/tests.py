import pytest
import jwt
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.conf import settings

from .models import RefreshToken
from .services import AuthService

User = get_user_model()


@pytest.fixture
def test_user(db):
    """Create a test user."""
    return User.objects.create(
        username='sarah.parker',
        email='sarah.parker@shyft.com',
        password=make_password('SecurePass123!'),
        first_name='Sarah',
        last_name='Parker',
        role='RIDER',
        is_active=True,
    )


@pytest.fixture
def inactive_user(db):
    """Create an inactive test user."""
    return User.objects.create(
        username='alex.johnson',
        email='alex.johnson@byteorbit.com',
        password=make_password('SecurePass123!'),
        first_name='Alex',
        last_name='Johnson',
        role='RIDER',
        is_active=False,
    )


@pytest.mark.django_db
class TestAuthService:
    """Test cases for AuthService."""

    def test_login_with_username(self, test_user):
        """Test successful login with username."""
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
            ip_address='127.0.0.1'
        )

        assert result is not None
        assert result['user'].id == test_user.id
        assert 'access_token' in result
        assert 'refresh_token' in result
        assert result['expires_in'] == 1800  # 30 minutes

    def test_login_with_email(self, test_user):
        """Test successful login with email."""
        result = AuthService.login(
            username='sarah.parker@shyft.com',
            password='SecurePass123!',
            ip_address='127.0.0.1'
        )

        assert result is not None
        assert result['user'].email == test_user.email

    def test_login_with_remember_me(self, test_user):
        """Test login with remember_me extends token lifetime."""
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
            remember_me=True,
            ip_address='127.0.0.1'
        )

        assert result is not None

        # Check that refresh token has 30-day expiry
        token = RefreshToken.objects.get(token=result['refresh_token'])
        expected_expiry = token.created_at + timedelta(days=30)
        assert abs((token.expires_at - expected_expiry).total_seconds()) < 5

    def test_login_with_invalid_password(self, test_user):
        """Test login fails with incorrect password."""
        result = AuthService.login(
            username='sarah.parker',
            password='WrongPassword',
            ip_address='127.0.0.1'
        )

        assert result is None

    def test_login_with_nonexistent_user(self):
        """Test login fails with non-existent user."""
        result = AuthService.login(
            username='nonexistent@shyft.com',
            password='SecurePass123!',
            ip_address='127.0.0.1'
        )

        assert result is None

    def test_login_with_inactive_user(self, inactive_user):
        """Test login fails for inactive user."""
        result = AuthService.login(
            username='alex.johnson',
            password='SecurePass123!',
            ip_address='127.0.0.1'
        )

        assert result is None

    def test_access_token_structure(self, test_user):
        """Test access token contains correct payload."""
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
        )

        # Decode token without verification (for testing)
        payload = jwt.decode(
            result['access_token'],
            settings.SECRET_KEY,
            algorithms=['HS256']
        )

        assert payload['user_id'] == test_user.id
        assert payload['username'] == test_user.username
        assert payload['email'] == test_user.email
        assert payload['role'] == test_user.role
        assert payload['type'] == 'access'

    def test_refresh_token_stored_in_database(self, test_user):
        """Test refresh token is stored in database."""
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
            ip_address='192.168.1.1'
        )

        token = RefreshToken.objects.get(token=result['refresh_token'])
        assert token.user_id == test_user.id
        assert token.ip_address == '192.168.1.1'
        assert token.is_valid
        assert not token.is_revoked

    def test_refresh_access_token(self, test_user):
        """Test refreshing access token."""
        # Login first
        login_result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
        )

        # Refresh token
        refresh_result = AuthService.refresh_access_token(
            login_result['refresh_token']
        )

        assert refresh_result is not None
        assert 'access_token' in refresh_result
        assert refresh_result['expires_in'] == 1800

    def test_refresh_with_invalid_token(self):
        """Test refresh fails with invalid token."""
        result = AuthService.refresh_access_token('invalid_token')
        assert result is None

    def test_refresh_with_revoked_token(self, test_user):
        """Test refresh fails with revoked token."""
        # Login and get refresh token
        login_result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
        )

        # Revoke the token
        token = RefreshToken.objects.get(token=login_result['refresh_token'])
        token.revoke()

        # Try to refresh
        refresh_result = AuthService.refresh_access_token(
            login_result['refresh_token']
        )

        assert refresh_result is None

    def test_logout(self, test_user):
        """Test logout revokes refresh token."""
        # Login first
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
        )

        # Logout
        success = AuthService.logout(result['refresh_token'])
        assert success is True

        # Verify token is revoked
        token = RefreshToken.objects.get(token=result['refresh_token'])
        assert token.is_revoked is True
        assert token.revoked_at is not None

    def test_logout_with_invalid_token(self):
        """Test logout with invalid token."""
        success = AuthService.logout('invalid_token')
        assert success is False

    def test_verify_access_token(self, test_user):
        """Test verifying access token."""
        # Login and get access token
        result = AuthService.login(
            username='sarah.parker',
            password='SecurePass123!',
        )

        # Verify token
        payload = AuthService.verify_access_token(result['access_token'])

        assert payload is not None
        assert payload['user_id'] == test_user.id
        assert payload['type'] == 'access'

    def test_verify_invalid_access_token(self):
        """Test verify fails with invalid token."""
        payload = AuthService.verify_access_token('invalid_token')
        assert payload is None

    def test_cleanup_expired_tokens(self, test_user):
        """Test cleanup of expired tokens."""
        # Create an expired token
        from django.utils import timezone
        expired_token = RefreshToken.objects.create(
            user=test_user,
            token='expired_token_123',
            expires_at=timezone.now() - timedelta(days=1)
        )

        # Run cleanup
        count = AuthService.cleanup_expired_tokens()

        assert count >= 1
        assert not RefreshToken.objects.filter(id=expired_token.id).exists()