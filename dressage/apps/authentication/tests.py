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



@pytest.mark.django_db
class TestUserRegistration:
    """Test cases for user registration."""

    def test_register_rider_success(self):
        """Test successful rider registration."""
        success, result, error = AuthService.register_user(
            email='new.rider@shyft.com',
            password='SecurePass123!',
            first_name='Emma',
            last_name='Davis',
            role='RIDER',
            date_of_birth='1995-05-15',
            gender='FEMALE',
            nationality='ZA',
            id_number='9505155009087',
            city='Cape Town',
            province='Western Cape',
        )

        assert success is True
        assert error is None
        assert result is not None
        assert 'user' in result
        assert 'access_token' in result
        assert 'refresh_token' in result

        # Verify user was created
        user = result['user']
        assert user.email == 'new.rider@shyft.com'
        assert user.first_name == 'Emma'
        assert user.last_name == 'Davis'
        assert user.role == 'RIDER'
        assert user.is_active is True

        # Verify rider profile was created
        from apps.riders.models import Rider
        rider = Rider.objects.get(user=user)
        assert rider.date_of_birth.strftime('%Y-%m-%d') == '1995-05-15'
        assert rider.gender == 'FEMALE'
        assert rider.nationality == 'ZA'
        assert rider.id_number == '9505155009087'

    def test_register_official_with_passport(self):
        """Test successful official registration with passport number."""
        success, result, error = AuthService.register_user(
            email='official@shyft.com',
            password='SecurePass123!',
            first_name='Michael',
            last_name='Chen',
            role='OFFICIAL',
            date_of_birth='1988-03-20',
            gender='MALE',
            nationality='GB',
            passport_number='GB123456789',
            address_line_1='123 Official Street',
            city='London',
            country='GB',
        )

        assert success is True
        assert error is None

        # Verify rider profile with passport
        from apps.riders.models import Rider
        user = result['user']
        rider = Rider.objects.get(user=user)
        assert rider.passport_number == 'GB123456789'
        assert rider.id_number is None

    def test_register_duplicate_email(self):
        """Test registration with duplicate email."""
        # Create first user
        User.objects.create_user(
            email='existing@shyft.com',
            password='Pass123!',
            first_name='Existing',
            last_name='User'
        )

        # Try to register with same email
        success, result, error = AuthService.register_user(
            email='existing@shyft.com',
            password='SecurePass123!',
            first_name='New',
            last_name='User',
            role='PUBLIC',
        )

        assert success is False
        assert result is None
        assert 'already registered' in error.lower()

    def test_register_rider_missing_dob(self):
        """Test rider registration without date of birth."""
        success, result, error = AuthService.register_user(
            email='missing.dob@shyft.com',
            password='SecurePass123!',
            first_name='Missing',
            last_name='DOB',
            role='RIDER',
            gender='MALE',
            nationality='ZA',
            id_number='9001015009087',
        )

        assert success is False
        assert result is None
        assert 'date of birth' in error.lower()

    def test_register_rider_missing_gender(self):
        """Test rider registration without gender."""
        success, result, error = AuthService.register_user(
            email='missing.gender@shyft.com',
            password='SecurePass123!',
            first_name='Missing',
            last_name='Gender',
            role='RIDER',
            date_of_birth='1990-01-01',
            nationality='ZA',
            id_number='9001015009087',
        )

        assert success is False
        assert result is None
        assert 'gender' in error.lower()

    def test_register_rider_missing_nationality(self):
        """Test rider registration without nationality."""
        success, result, error = AuthService.register_user(
            email='missing.nationality@shyft.com',
            password='SecurePass123!',
            first_name='Missing',
            last_name='Nationality',
            role='RIDER',
            date_of_birth='1990-01-01',
            gender='MALE',
            id_number='9001015009087',
        )

        assert success is False
        assert result is None
        assert 'nationality' in error.lower()

    def test_register_rider_missing_id_and_passport(self):
        """Test rider registration without ID or passport."""
        success, result, error = AuthService.register_user(
            email='missing.id@shyft.com',
            password='SecurePass123!',
            first_name='Missing',
            last_name='ID',
            role='RIDER',
            date_of_birth='1990-01-01',
            gender='MALE',
            nationality='ZA',
        )

        assert success is False
        assert result is None
        assert 'id number' in error.lower() or 'passport' in error.lower()

    def test_register_public_user(self):
        """Test registration of public user (no profile needed)."""
        success, result, error = AuthService.register_user(
            email='public@shyft.com',
            password='SecurePass123!',
            first_name='Public',
            last_name='User',
            role='PUBLIC',
        )

        assert success is True
        assert error is None
        user = result['user']
        assert user.role == 'PUBLIC'

        # Verify no rider profile was created
        from apps.riders.models import Rider
        assert not Rider.objects.filter(user=user).exists()

    def test_register_with_full_address(self):
        """Test registration with complete address information."""
        success, result, error = AuthService.register_user(
            email='full.address@shyft.com',
            password='SecurePass123!',
            first_name='Full',
            last_name='Address',
            role='RIDER',
            date_of_birth='1992-08-12',
            gender='FEMALE',
            nationality='ZA',
            id_number='9208125009087',
            address_line_1='456 Full Street',
            address_line_2='Apt 10',
            suburb='Suburb Name',
            city='Johannesburg',
            province='Gauteng',
            postal_code='2000',
            country='ZA',
        )

        assert success is True
        from apps.riders.models import Rider
        user = result['user']
        rider = Rider.objects.get(user=user)
        assert rider.address_line_1 == '456 Full Street'
        assert rider.address_line_2 == 'Apt 10'
        assert rider.suburb == 'Suburb Name'
        assert rider.city == 'Johannesburg'
        assert rider.province == 'Gauteng'
        assert rider.postal_code == '2000'
        assert rider.country == 'ZA'

    def test_register_with_title_and_maiden_name(self):
        """Test registration with optional title and maiden name."""
        success, result, error = AuthService.register_user(
            email='titled@shyft.com',
            password='SecurePass123!',
            title='DR',
            first_name='Jane',
            maiden_name='Smith',
            last_name='Williams',
            role='RIDER',
            date_of_birth='1990-01-01',
            gender='FEMALE',
            nationality='ZA',
            id_number='9001015009087',
        )

        assert success is True
        user = result['user']
        assert user.title == 'DR'
        assert user.maiden_name == 'Smith'

    def test_register_generates_tokens(self):
        """Test that registration generates valid tokens."""
        success, result, error = AuthService.register_user(
            email='token.test@shyft.com',
            password='SecurePass123!',
            first_name='Token',
            last_name='Test',
            role='PUBLIC',
        )

        assert success is True
        assert 'access_token' in result
        assert 'refresh_token' in result
        assert 'expires_in' in result

        # Verify access token is valid JWT
        access_token = result['access_token']
        payload = jwt.decode(
            access_token,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
        assert payload['email'] == 'token.test@shyft.com'
        assert payload['type'] == 'access'

        # Verify refresh token is stored in database
        refresh_token = result['refresh_token']
        assert RefreshToken.objects.filter(token=refresh_token).exists()