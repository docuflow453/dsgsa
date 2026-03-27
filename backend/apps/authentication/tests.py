import pytest
from django.core import mail
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import PasswordResetToken, RefreshToken
from .services import AuthenticationService, PasswordResetService

User = get_user_model()


@pytest.fixture
def test_user(db):
    """Create a test user."""
    return User.objects.create_user(
        username='sarah.parker@shyft.com',
        email='sarah.parker@shyft.com',
        password='TestPass123!',
        first_name='Sarah',
        last_name='Parker'
    )


@pytest.fixture
def inactive_user(db):
    """Create an inactive test user."""
    user = User.objects.create_user(
        username='inactive.user@byteorbit.com',
        email='inactive.user@byteorbit.com',
        password='TestPass123!',
        first_name='Inactive',
        last_name='User'
    )
    user.is_active = False
    user.save()
    return user


@pytest.mark.django_db
class TestAuthenticationService:
    """Test cases for AuthenticationService."""
    
    def test_login_success(self, test_user):
        """Test successful login."""
        result = AuthenticationService.login(
            email='sarah.parker@shyft.com',
            password='TestPass123!'
        )
        
        assert result is not None
        assert result['user'] == test_user
        assert 'access_token' in result
        assert 'refresh_token' in result
        assert result['expires_in'] > 0
    
    def test_login_invalid_credentials(self, test_user):
        """Test login with invalid password."""
        result = AuthenticationService.login(
            email='sarah.parker@shyft.com',
            password='WrongPassword123!'
        )
        
        assert result is None
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent email."""
        result = AuthenticationService.login(
            email='nonexistent@shyft.com',
            password='TestPass123!'
        )
        
        assert result is None
    
    def test_login_inactive_user(self, inactive_user):
        """Test login with inactive user account."""
        result = AuthenticationService.login(
            email='inactive.user@byteorbit.com',
            password='TestPass123!'
        )
        
        assert result is None
    
    def test_refresh_token_success(self, test_user):
        """Test successful token refresh."""
        # First login to get tokens
        login_result = AuthenticationService.login(
            email='sarah.parker@shyft.com',
            password='TestPass123!'
        )
        
        refresh_token = login_result['refresh_token']
        
        # Now refresh the access token
        result = AuthenticationService.refresh_access_token(refresh_token)
        
        assert result is not None
        assert 'access_token' in result
        assert result['expires_in'] > 0
    
    def test_refresh_token_invalid(self):
        """Test refresh with invalid token."""
        result = AuthenticationService.refresh_access_token('invalid_token_string')
        
        assert result is None
    
    def test_logout_success(self, test_user):
        """Test successful logout."""
        # Login first
        login_result = AuthenticationService.login(
            email='sarah.parker@shyft.com',
            password='TestPass123!'
        )
        
        refresh_token = login_result['refresh_token']
        
        # Logout
        success = AuthenticationService.logout(refresh_token)
        
        assert success is True
        
        # Try to use revoked token
        result = AuthenticationService.refresh_access_token(refresh_token)
        assert result is None
    
    def test_verify_access_token(self, test_user):
        """Test access token verification."""
        login_result = AuthenticationService.login(
            email='sarah.parker@shyft.com',
            password='TestPass123!'
        )
        
        access_token = login_result['access_token']
        
        payload = AuthenticationService.verify_access_token(access_token)
        
        assert payload is not None
        assert payload['user_id'] == test_user.id
        assert payload['email'] == test_user.email
        assert payload['type'] == 'access'


@pytest.mark.django_db
class TestPasswordResetService:
    """Test cases for PasswordResetService."""

    def test_initiate_password_reset_success(self, test_user):
        """Test successful password reset initiation."""
        # Clear any existing emails
        mail.outbox = []

        success = PasswordResetService.initiate_password_reset(
            email='sarah.parker@shyft.com',
            ip_address='127.0.0.1'
        )

        assert success is True

        # Verify email was sent
        assert len(mail.outbox) == 1
        assert mail.outbox[0].subject == 'Password Reset Request - Dressage Riding System'
        assert 'sarah.parker@shyft.com' in mail.outbox[0].to

        # Verify token was created
        token = PasswordResetToken.objects.filter(user=test_user).first()
        assert token is not None
        assert token.is_valid

    def test_initiate_password_reset_nonexistent_user(self):
        """Test password reset for non-existent user."""
        mail.outbox = []

        # Should still return True to prevent email enumeration
        success = PasswordResetService.initiate_password_reset(
            email='nonexistent@shyft.com',
            ip_address='127.0.0.1'
        )

        assert success is True

        # But no email should be sent
        assert len(mail.outbox) == 0

    def test_reset_password_success(self, test_user):
        """Test successful password reset."""
        # Create a reset token
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='test_reset_token_123'
        )

        old_password_hash = test_user.password

        # Reset password
        success, error_message = PasswordResetService.reset_password(
            token='test_reset_token_123',
            new_password='NewPassword123!'
        )

        assert success is True
        assert error_message is None

        # Verify password was changed
        test_user.refresh_from_db()
        assert test_user.password != old_password_hash
        assert test_user.check_password('NewPassword123!')

        # Verify token was marked as used
        token.refresh_from_db()
        assert token.is_used

    def test_reset_password_invalid_token(self):
        """Test password reset with invalid token."""
        success, error_message = PasswordResetService.reset_password(
            token='invalid_token',
            new_password='NewPassword123!'
        )

        assert success is False
        assert error_message == "Invalid reset token"

    def test_reset_password_expired_token(self, test_user):
        """Test password reset with expired token."""
        # Create an expired token
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='expired_token_123',
            expires_at=timezone.now() - timedelta(hours=2)
        )

        success, error_message = PasswordResetService.reset_password(
            token='expired_token_123',
            new_password='NewPassword123!'
        )

        assert success is False
        assert error_message == "Reset token has expired"

    def test_reset_password_used_token(self, test_user):
        """Test password reset with already used token."""
        # Create a used token
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='used_token_123',
            used_at=timezone.now()
        )

        success, error_message = PasswordResetService.reset_password(
            token='used_token_123',
            new_password='NewPassword123!'
        )

        assert success is False
        assert error_message == "Reset token has already been used"

    def test_validate_reset_token_valid(self, test_user):
        """Test validation of valid reset token."""
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='valid_token_123'
        )

        is_valid, error_message = PasswordResetService.validate_reset_token('valid_token_123')

        assert is_valid is True
        assert error_message is None

    def test_validate_reset_token_invalid(self):
        """Test validation of invalid reset token."""
        is_valid, error_message = PasswordResetService.validate_reset_token('invalid_token')

        assert is_valid is False
        assert error_message == "Invalid reset token"


@pytest.mark.django_db
class TestPasswordResetTokenModel:
    """Test cases for PasswordResetToken model."""

    def test_token_creation(self, test_user):
        """Test creating a password reset token."""
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='test_token_123',
            ip_address='127.0.0.1'
        )

        assert token.user == test_user
        assert token.token == 'test_token_123'
        assert token.ip_address == '127.0.0.1'
        assert token.expires_at is not None
        assert token.is_valid

    def test_token_expiry_default(self, test_user):
        """Test token expiry is set to 1 hour by default."""
        token = PasswordResetToken.objects.create(
            user=test_user,
            token='test_token_456'
        )

        expected_expiry = timezone.now() + timedelta(hours=1)
        # Allow 1 minute tolerance for test execution time
        assert abs((token.expires_at - expected_expiry).total_seconds()) < 60


@pytest.mark.django_db
class TestRefreshTokenModel:
    """Test cases for RefreshToken model."""

    def test_refresh_token_creation(self, test_user):
        """Test creating a refresh token."""
        token = RefreshToken.objects.create(
            user=test_user,
            token='refresh_token_123',
            expires_at=timezone.now() + timedelta(days=7),
            ip_address='127.0.0.1'
        )

        assert token.user == test_user
        assert token.token == 'refresh_token_123'
        assert token.is_valid
        assert not token.is_expired
        assert not token.is_revoked

    def test_revoke_token(self, test_user):
        """Test revoking a refresh token."""
        token = RefreshToken.objects.create(
            user=test_user,
            token='refresh_token_456',
            expires_at=timezone.now() + timedelta(days=7)
        )

        assert token.is_valid

        token.revoke()

        assert not token.is_valid
        assert token.is_revoked
        assert token.revoked_at is not None

