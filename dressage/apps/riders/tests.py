import pytest
from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from apps.riders.models import Rider, RiderAccount, SaefMembership, RiderClub, RiderShowHoldingBody
from apps.riders.services import (
    RiderService, RiderAccountService, RiderRegistrationService, SaefMembershipService
)
from apps.users.models import User
from apps.years.models import Year
from apps.memberships.models import Membership, Subscription
from decimal import Decimal


@pytest.fixture
def test_user():
    """Create a test user"""
    user = User.objects.create_user(
        email='emma.wilson@shyft.com',
        password='testpass123',
        first_name='Emma',
        last_name='Wilson'
    )
    return user


@pytest.fixture
def test_user_2():
    """Create a second test user"""
    user = User.objects.create_user(
        email='lucas.martinez@byteorbit.com',
        password='testpass123',
        first_name='Lucas',
        last_name='Martinez'
    )
    return user


@pytest.fixture
def test_year():
    """Create a test year"""
    year = Year.objects.create(
        year=2024,
        name='2024 Competition Year',
        start_date=date(2024, 1, 1),
        end_date=date(2024, 12, 31),
        is_registration_open=True
    )
    return year


@pytest.fixture
def test_membership():
    """Create a test membership"""
    membership = Membership.objects.create(
        name='Test Rider Membership',
        description='Test membership for riders',
        is_active=True
    )
    return membership


@pytest.fixture
def test_subscription(test_membership, test_year):
    """Create a test subscription"""
    subscription = Subscription.objects.create(
        name='2024 Test Rider - Competitive',
        description='Test competitive subscription',
        membership=test_membership,
        year=test_year,
        fee=Decimal('500.00'),
        is_recreational=False,
        is_active=True
    )
    return subscription


@pytest.mark.django_db
class TestRiderModel:
    """Test Rider model validation and properties"""
    
    def test_create_rider_with_id_number(self, test_user):
        """Test creating a valid rider with SA ID number"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )
        assert rider.id is not None
        assert rider.user == test_user
        assert rider.id_number == '9001015009087'
        assert rider.is_active is True

    def test_create_rider_with_passport(self, test_user):
        """Test creating a valid rider with passport number"""
        rider = Rider.objects.create(
            user=test_user,
            passport_number='AB123456',
            date_of_birth=date(1985, 5, 15),
            gender='FEMALE',
            nationality='GB'  # Great Britain
        )
        assert rider.id is not None
        assert rider.passport_number == 'AB123456'

    def test_rider_requires_id_or_passport(self, test_user):
        """Test that either ID or passport must be provided"""
        with pytest.raises(ValidationError):
            rider = Rider(
                user=test_user,
                date_of_birth=date(1990, 1, 1),
                gender='FEMALE',
                nationality='ZA'  # South Africa
            )
            rider.save()
    
    def test_id_number_must_be_13_digits(self, test_user):
        """Test that SA ID number must be exactly 13 digits"""
        with pytest.raises(ValidationError):
            rider = Rider(
                user=test_user,
                id_number='12345',  # Too short
                date_of_birth=date(1990, 1, 1),
                gender='FEMALE',
                nationality='ZA'  # South Africa
            )
            rider.save()

    def test_id_number_must_be_numeric(self, test_user):
        """Test that SA ID number must contain only digits"""
        with pytest.raises(ValidationError):
            rider = Rider(
                user=test_user,
                id_number='900101500908A',  # Contains letter
                date_of_birth=date(1990, 1, 1),
                gender='FEMALE',
                nationality='ZA'  # South Africa
            )
            rider.save()

    def test_user_one_to_one_relationship(self, test_user, test_user_2):
        """Test that a user can only have one rider profile"""
        # Create first rider
        Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Try to create another rider for the same user
        with pytest.raises(ValidationError):
            Rider.objects.create(
                user=test_user,
                passport_number='AB123456',
                date_of_birth=date(1990, 1, 1),
                gender='FEMALE',
                nationality='ZA'  # South Africa
            )

    def test_full_name_property(self, test_user):
        """Test full_name property returns user's full name"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )
        assert rider.full_name == 'Emma Wilson'

    def test_age_property(self, test_user):
        """Test age property calculates correct age"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )
        expected_age = date.today().year - 1990
        assert rider.age in [expected_age - 1, expected_age]  # Handle birthday edge cases

    def test_full_address_property(self, test_user):
        """Test full_address property formats address correctly"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA',  # South Africa
            address_line_1='123 Main Street',
            city='Cape Town',
            province='Western Cape',
            postal_code='8001',
            country='ZA'  # South Africa
        )
        assert '123 Main Street' in rider.full_address
        assert 'Cape Town' in rider.full_address
        assert 'South Africa' in rider.full_address

    def test_status_property(self, test_user):
        """Test status property returns correct status"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA',  # South Africa
            is_active=True
        )
        assert rider.status == 'Active'

        rider.is_active = False
        rider.save()
        assert rider.status == 'Inactive'

    def test_str_representation(self, test_user):
        """Test string representation of rider"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )
        assert str(rider) == f"Emma Wilson (emma.wilson@shyft.com)"


@pytest.mark.django_db
class TestRiderService:
    """Test RiderService business logic"""

    def test_create_rider_success(self, test_user):
        """Test successful rider creation"""
        data = {
            'user_id': test_user.id,
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA'  # South Africa
        }

        success, rider, error = RiderService.create_rider(data)

        assert success is True
        assert rider is not None
        assert rider.user == test_user
        assert error is None

    def test_create_rider_without_user_id(self):
        """Test creating rider without user_id fails"""
        data = {
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA'  # South Africa
        }

        success, rider, error = RiderService.create_rider(data)

        assert success is False
        assert rider is None
        assert 'required' in error.lower()

    def test_create_rider_with_invalid_user_id(self):
        """Test creating rider with non-existent user fails"""
        from uuid import uuid4
        data = {
            'user_id': uuid4(),
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA'  # South Africa
        }

        success, rider, error = RiderService.create_rider(data)

        assert success is False
        assert rider is None
        assert 'not found' in error.lower()

    def test_create_rider_duplicate_user(self, test_user):
        """Test creating duplicate rider for same user fails"""
        # Create first rider
        data = {
            'user_id': test_user.id,
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA'  # South Africa
        }
        RiderService.create_rider(data)

        # Try to create another rider for same user
        data2 = {
            'user_id': test_user.id,
            'passport_number': 'AB123456',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'GB'  # Great Britain
        }
        success, rider, error = RiderService.create_rider(data2)

        assert success is False
        assert rider is None
        assert 'already has' in error.lower()

    def test_update_rider_success(self, test_user):
        """Test successful rider update"""
        # Create rider
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Update rider
        data = {'nationality': 'GB'}  # Great Britain
        success, updated_rider, error = RiderService.update_rider(rider.id, data)

        assert success is True
        assert updated_rider.nationality == 'GB'
        assert error is None

    def test_delete_rider_success(self, test_user):
        """Test successful rider soft delete"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        success, deleted_rider, error = RiderService.delete_rider(rider.id)

        assert success is True
        assert deleted_rider.is_active is False
        assert error is None

    def test_get_rider_success(self, test_user):
        """Test successful rider retrieval"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        success, retrieved_rider, error = RiderService.get_rider(rider.id)

        assert success is True
        assert retrieved_rider.id == rider.id
        assert error is None

    def test_get_riders_with_filters(self, test_user, test_user_2):
        """Test getting riders with filters"""
        # Create two riders
        Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA',  # South Africa
            is_active=True
        )
        Rider.objects.create(
            user=test_user_2,
            id_number='8505125009088',
            date_of_birth=date(1985, 5, 12),
            gender='MALE',
            nationality='GB',  # Great Britain
            is_active=False
        )

        # Filter by active status
        success, result, error = RiderService.get_riders({'is_active': True})
        assert success is True
        assert result['total'] == 1

        # Filter by nationality
        success, result, error = RiderService.get_riders({'nationality': 'GB'})
        assert success is True
        assert result['total'] == 1

        # Search by name
        success, result, error = RiderService.get_riders({'search': 'Emma'})
        assert success is True
        assert result['total'] == 1


@pytest.mark.django_db
class TestRiderAccountService:
    """Test RiderAccountService business logic"""

    def test_create_rider_account_success(self, test_user, test_year, test_subscription):
        """Test successful rider account creation"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        data = {
            'rider_id': rider.id,
            'year_id': test_year.id,
            'subscription_id': test_subscription.id
        }

        success, account, error = RiderAccountService.create_rider_account(data)

        assert success is True
        assert account.rider == rider
        assert account.year == test_year
        assert account.subscription == test_subscription
        assert error is None

    def test_create_rider_account_duplicate_fails(self, test_user, test_year):
        """Test creating duplicate account for same rider/year fails"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Create first account
        data = {
            'rider_id': rider.id,
            'year_id': test_year.id
        }
        RiderAccountService.create_rider_account(data)

        # Try to create duplicate
        success, account, error = RiderAccountService.create_rider_account(data)

        assert success is False
        assert account is None
        assert 'already has' in error.lower()

    def test_get_rider_accounts_by_rider(self, test_user, test_year):
        """Test getting all accounts for a rider"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Create account
        RiderAccount.objects.create(rider=rider, year=test_year)

        success, accounts, error = RiderAccountService.get_rider_accounts_by_rider(rider.id)

        assert success is True
        assert len(accounts) == 1
        assert accounts[0].rider == rider


@pytest.mark.django_db
class TestRiderRegistrationService:
    """Test RiderRegistrationService for registration and renewal workflows"""

    def test_register_rider_success(self, test_user, test_year, test_subscription):
        """Test successful rider registration with subscription"""
        data = {
            'user_id': test_user.id,
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA',  # South Africa
            'subscription_id': test_subscription.id,
            'year_id': test_year.id
        }

        success, result, error = RiderRegistrationService.register_rider(data)

        assert success is True
        assert result['rider'] is not None
        assert result['account'] is not None
        assert result['account'].subscription == test_subscription
        assert error is None

    def test_register_rider_without_subscription_fails(self, test_user, test_year):
        """Test registering rider without subscription fails"""
        data = {
            'user_id': test_user.id,
            'id_number': '9001015009087',
            'date_of_birth': date(1990, 1, 1),
            'gender': 'FEMALE',
            'nationality': 'ZA',  # South Africa
            'year_id': test_year.id
        }

        success, result, error = RiderRegistrationService.register_rider(data)

        assert success is False
        assert 'required' in error.lower()

    def test_renew_membership_success(self, test_user, test_year, test_subscription):
        """Test successful membership renewal"""
        # Create rider first
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Renew membership
        data = {
            'rider_id': rider.id,
            'year_id': test_year.id,
            'subscription_id': test_subscription.id
        }

        success, account, error = RiderRegistrationService.renew_membership(data)

        assert success is True
        assert account.rider == rider
        assert account.subscription == test_subscription
        assert error is None


@pytest.mark.django_db
class TestSaefMembershipService:
    """Test SaefMembershipService business logic"""

    def test_create_saef_membership_success(self, test_user, test_year):
        """Test successful SAEF membership creation"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        data = {
            'rider_id': rider.id,
            'membership_number': 'SAEF2024001',
            'year_id': test_year.id,
            'expiry_date': date(2024, 12, 31)
        }

        success, membership, error = SaefMembershipService.create_saef_membership(data)

        assert success is True
        assert membership.rider == rider
        assert membership.membership_number == 'SAEF2024001'
        assert error is None

    def test_check_competition_eligibility_eligible(self, test_user, test_year):
        """Test eligibility check for eligible rider"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # Create active account
        RiderAccount.objects.create(rider=rider, year=test_year, is_active=True)

        # Create active SAEF membership
        SaefMembership.objects.create(
            rider=rider,
            membership_number='SAEF2024001',
            year=test_year,
            is_active=True,
            expiry_date=date.today() + timedelta(days=30)
        )

        success, result, error = SaefMembershipService.check_competition_eligibility(rider.id, test_year.id)

        assert success is True
        assert result['eligible'] is True
        assert len(result['reasons']) == 0

    def test_check_competition_eligibility_not_eligible(self, test_user, test_year):
        """Test eligibility check for ineligible rider"""
        rider = Rider.objects.create(
            user=test_user,
            id_number='9001015009087',
            date_of_birth=date(1990, 1, 1),
            gender='FEMALE',
            nationality='ZA'  # South Africa
        )

        # No account or SAEF membership created
        success, result, error = SaefMembershipService.check_competition_eligibility(rider.id, test_year.id)

        assert success is True
        assert result['eligible'] is False
        assert len(result['reasons']) > 0

