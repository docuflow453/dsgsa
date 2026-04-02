import pytest
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from decimal import Decimal

from apps.memberships.models import Membership, Subscription
from apps.memberships.services import MembershipService, SubscriptionService
from apps.years.models import Year


@pytest.mark.django_db
class TestMembershipModel:
    """Test Membership model validation and properties"""

    def test_create_membership_success(self):
        """Test creating a valid membership"""
        membership = Membership.objects.create(
            name="Rider Membership",
            description="Full membership for riders",
            is_active=True
        )
        assert membership.id is not None
        assert membership.name == "Rider Membership"
        assert membership.is_active is True

    def test_membership_status_property(self):
        """Test status property returns correct values"""
        active = Membership.objects.create(
            name="Active Membership",
            description="Test",
            is_active=True
        )
        assert active.status == "Active"

        inactive = Membership.objects.create(
            name="Inactive Membership",
            description="Test",
            is_active=False
        )
        assert inactive.status == "Inactive"

    def test_name_uniqueness(self):
        """Test that membership names must be unique"""
        Membership.objects.create(
            name="Unique Name",
            description="Test description"
        )

        # Since we override save() to call full_clean(), this will raise ValidationError
        with pytest.raises((ValidationError, IntegrityError)):
            Membership.objects.create(
                name="Unique Name",
                description="Different description"
            )

    def test_name_whitespace_validation(self):
        """Test that name cannot be only whitespace"""
        with pytest.raises(ValidationError) as exc_info:
            membership = Membership(
                name="   ",
                description="Valid description"
            )
            membership.clean()

        assert 'name' in exc_info.value.message_dict

    def test_description_whitespace_validation(self):
        """Test that description cannot be only whitespace"""
        with pytest.raises(ValidationError) as exc_info:
            membership = Membership(
                name="Valid Name",
                description="   "
            )
            membership.clean()

        assert 'description' in exc_info.value.message_dict

    def test_default_is_active_false(self):
        """Test that is_active defaults to False"""
        membership = Membership.objects.create(
            name="Test Membership",
            description="Test description"
        )
        assert membership.is_active is False

    def test_str_representation(self):
        """Test string representation"""
        membership = Membership.objects.create(
            name="Test Membership",
            description="Test",
            is_active=True
        )
        assert str(membership) == "Test Membership (Active)"


@pytest.mark.django_db
class TestMembershipService:
    """Test MembershipService business logic"""

    def test_create_membership_success(self):
        """Test successful membership creation via service"""
        data = {
            'name': 'Rider Membership',
            'description': 'Full membership for riders participating in competitions',
            'is_active': True,
            'notes': 'Includes competition access'
        }
        success, membership, error = MembershipService.create_membership(data)

        assert success is True
        assert membership is not None
        assert error is None
        assert membership.name == 'Rider Membership'
        assert membership.is_active is True

    def test_create_membership_duplicate_name(self):
        """Test creating membership with duplicate name fails"""
        data = {
            'name': 'Duplicate Name',
            'description': 'First membership'
        }
        MembershipService.create_membership(data)

        # Try to create another with same name
        data2 = {
            'name': 'Duplicate Name',
            'description': 'Second membership'
        }
        success, membership, error = MembershipService.create_membership(data2)

        assert success is False
        assert membership is None
        assert error is not None
        assert 'already exists' in error.lower()

    def test_update_membership_success(self):
        """Test successful membership update"""
        membership = Membership.objects.create(
            name="Original Name",
            description="Original description",
            is_active=False
        )

        success, updated, error = MembershipService.update_membership(
            str(membership.id),
            {'name': 'Updated Name', 'is_active': True}
        )

        assert success is True
        assert updated.name == 'Updated Name'
        assert updated.is_active is True

    def test_update_nonexistent_membership(self):
        """Test updating non-existent membership fails"""
        success, membership, error = MembershipService.update_membership(
            "00000000-0000-0000-0000-000000000000",
            {'name': 'New Name'}
        )

        assert success is False
        assert membership is None
        assert 'not found' in error.lower()

    def test_get_membership_success(self):
        """Test getting a membership by ID"""
        membership = Membership.objects.create(
            name="Test Membership",
            description="Test description"
        )

        result = MembershipService.get_membership(str(membership.id))
        assert result is not None
        assert result.id == membership.id

    def test_get_nonexistent_membership(self):
        """Test getting non-existent membership returns None"""
        result = MembershipService.get_membership("00000000-0000-0000-0000-000000000000")
        assert result is None

    def test_get_memberships_with_filters(self):
        """Test getting memberships with filters"""
        # Create test data
        Membership.objects.create(
            name="Active Rider",
            description="Active rider membership",
            is_active=True
        )
        Membership.objects.create(
            name="Inactive Rider",
            description="Inactive rider membership",
            is_active=False
        )
        Membership.objects.create(
            name="Club Membership",
            description="Club membership",
            is_active=True
        )

        # Filter by active status
        count, results = MembershipService.get_memberships(filters={'is_active': True})
        assert count == 2
        assert all(m.is_active for m in results)

        # Filter by name
        count, results = MembershipService.get_memberships(filters={'name': 'rider'})
        assert count == 2
        assert all('rider' in m.name.lower() for m in results)

    def test_get_memberships_pagination(self):
        """Test pagination works correctly"""
        # Create 5 memberships
        for i in range(5):
            Membership.objects.create(
                name=f"Membership {i}",
                description=f"Description {i}"
            )

        # Get first 2
        count, results = MembershipService.get_memberships(limit=2, offset=0)
        assert count == 5
        assert len(results) == 2

        # Get next 2
        count, results = MembershipService.get_memberships(limit=2, offset=2)
        assert count == 5
        assert len(results) == 2

    def test_get_active_memberships(self):
        """Test getting only active memberships"""
        Membership.objects.create(
            name="Active 1",
            description="Test",
            is_active=True
        )
        Membership.objects.create(
            name="Inactive",
            description="Test",
            is_active=False
        )
        Membership.objects.create(
            name="Active 2",
            description="Test",
            is_active=True
        )

        active_memberships = MembershipService.get_active_memberships()
        assert len(active_memberships) == 2
        assert all(m.is_active for m in active_memberships)

    def test_activate_membership(self):
        """Test activating a membership"""
        membership = Membership.objects.create(
            name="Test",
            description="Test",
            is_active=False
        )

        success, updated, error = MembershipService.activate_membership(str(membership.id))
        assert success is True
        assert updated.is_active is True

    def test_deactivate_membership(self):
        """Test deactivating a membership"""
        membership = Membership.objects.create(
            name="Test",
            description="Test",
            is_active=True
        )

        success, updated, error = MembershipService.deactivate_membership(str(membership.id))
        assert success is True
        assert updated.is_active is False

    def test_activate_nonexistent_membership(self):
        """Test activating non-existent membership fails"""
        success, membership, error = MembershipService.activate_membership(
            "00000000-0000-0000-0000-000000000000"
        )
        assert success is False
        assert 'not found' in error.lower()

    def test_deactivate_nonexistent_membership(self):
        """Test deactivating non-existent membership fails"""
        success, membership, error = MembershipService.deactivate_membership(
            "00000000-0000-0000-0000-000000000000"
        )
        assert success is False
        assert 'not found' in error.lower()




@pytest.mark.django_db
class TestSubscriptionModel:
    """Test Subscription model validation and properties"""

    @pytest.fixture
    def membership(self):
        """Create a test membership"""
        return Membership.objects.create(
            name="Test Membership",
            description="Test membership description",
            is_active=True
        )

    @pytest.fixture
    def year(self):
        """Create a test year"""
        return Year.objects.create(
            name="2024 Season",
            year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31",
            is_registration_open=True,
            status="ACTIVE"
        )

    def test_create_subscription_success(self, membership, year):
        """Test creating a valid subscription"""
        subscription = Subscription.objects.create(
            name="2024 Rider - Competitive",
            description="Competitive rider subscription for 2024",
            membership=membership,
            year=year,
            fee=Decimal("500.00"),
            is_recreational=False,
            is_active=True
        )
        assert subscription.id is not None
        assert subscription.name == "2024 Rider - Competitive"
        assert subscription.fee == Decimal("500.00")
        assert subscription.is_active is True
        assert subscription.is_recreational is False

    def test_subscription_status_property(self, membership, year):
        """Test status property returns correct values"""
        active = Subscription.objects.create(
            name="Active Subscription",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("100.00"),
            is_active=True,
            is_recreational=False
        )
        assert active.status == "Active"

        inactive = Subscription.objects.create(
            name="Inactive Subscription",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("100.00"),
            is_active=False,
            is_recreational=True  # Different type to avoid unique constraint violation
        )
        assert inactive.status == "Inactive"

    def test_subscription_type_property(self, membership, year):
        """Test subscription_type property returns correct values"""
        recreational = Subscription.objects.create(
            name="Recreational Sub",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("100.00"),
            is_recreational=True
        )
        assert recreational.subscription_type == "Recreational"

        competitive = Subscription.objects.create(
            name="Competitive Sub",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("200.00"),
            is_recreational=False
        )
        assert competitive.subscription_type == "Competitive"

    def test_unique_constraint_membership_year_type(self, membership, year):
        """Test that combination of membership, year, and type must be unique"""
        Subscription.objects.create(
            name="First Subscription",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("100.00"),
            is_recreational=False
        )

        with pytest.raises((ValidationError, IntegrityError)):
            Subscription.objects.create(
                name="Duplicate Subscription",
                description="Test",
                membership=membership,
                year=year,
                fee=Decimal("150.00"),
                is_recreational=False  # Same membership, year, and type
            )

    def test_whitespace_name_validation(self, membership, year):
        """Test that name cannot be only whitespace"""
        with pytest.raises(ValidationError):
            sub = Subscription(
                name="   ",
                description="Test",
                membership=membership,
                year=year,
                fee=Decimal("100.00")
            )
            sub.save()

    def test_whitespace_description_validation(self, membership, year):
        """Test that description cannot be only whitespace"""
        with pytest.raises(ValidationError):
            sub = Subscription(
                name="Valid Name",
                description="   ",
                membership=membership,
                year=year,
                fee=Decimal("100.00")
            )
            sub.save()

    def test_negative_fee_validation(self, membership, year):
        """Test that fee cannot be negative"""
        with pytest.raises(ValidationError):
            sub = Subscription(
                name="Test Subscription",
                description="Test",
                membership=membership,
                year=year,
                fee=Decimal("-50.00")
            )
            sub.save()

    def test_zero_fee_allowed(self, membership, year):
        """Test that zero fee is allowed (e.g., for free subscriptions)"""
        subscription = Subscription.objects.create(
            name="Free Subscription",
            description="Test free subscription",
            membership=membership,
            year=year,
            fee=Decimal("0.00")
        )
        assert subscription.fee == Decimal("0.00")

    def test_subscription_str_method(self, membership, year):
        """Test string representation of subscription"""
        subscription = Subscription.objects.create(
            name="2024 Rider - Competitive",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("500.00"),
            is_recreational=False
        )
        expected = "Test Membership - 2024 Season (Competitive)"
        assert str(subscription) == expected

        recreational_sub = Subscription.objects.create(
            name="2024 Rider - Recreational",
            description="Test",
            membership=membership,
            year=year,
            fee=Decimal("200.00"),
            is_recreational=True
        )
        expected_rec = "Test Membership - 2024 Season (Recreational)"
        assert str(recreational_sub) == expected_rec



@pytest.mark.django_db
class TestSubscriptionService:
    """Test SubscriptionService business logic"""

    @pytest.fixture
    def membership(self):
        """Create a test membership"""
        return Membership.objects.create(
            name="Test Membership",
            description="Test membership description",
            is_active=True
        )

    @pytest.fixture
    def year(self):
        """Create a test year"""
        return Year.objects.create(
            name="2024 Season",
            year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31",
            is_registration_open=True,
            status="ACTIVE"
        )

    def test_create_subscription_success(self, membership, year):
        """Test successful subscription creation"""
        data = {
            'name': '2024 Rider - Competitive',
            'description': 'Competitive rider subscription',
            'membership_id': str(membership.id),
            'year_id': str(year.id),
            'fee': Decimal('500.00'),
            'is_recreational': False,
            'is_active': True,
            'notes': 'Early bird pricing'
        }

        success, subscription, error = SubscriptionService.create_subscription(data)

        assert success is True
        assert subscription is not None
        assert error is None
        assert subscription.name == '2024 Rider - Competitive'
        assert subscription.fee == Decimal('500.00')
        assert subscription.is_recreational is False

    def test_create_subscription_with_invalid_membership(self, year):
        """Test creating subscription with non-existent membership fails"""
        data = {
            'name': 'Test Subscription',
            'description': 'Test',
            'membership_id': '00000000-0000-0000-0000-000000000000',
            'year_id': str(year.id),
            'fee': Decimal('100.00')
        }

        success, subscription, error = SubscriptionService.create_subscription(data)

        assert success is False
        assert subscription is None
        assert 'not found' in error.lower()

    def test_create_subscription_with_invalid_year(self, membership):
        """Test creating subscription with non-existent year fails"""
        data = {
            'name': 'Test Subscription',
            'description': 'Test',
            'membership_id': str(membership.id),
            'year_id': '00000000-0000-0000-0000-000000000000',
            'fee': Decimal('100.00')
        }

        success, subscription, error = SubscriptionService.create_subscription(data)

        assert success is False
        assert subscription is None
        assert 'not found' in error.lower()

    def test_create_subscription_with_whitespace_name(self, membership, year):
        """Test creating subscription with whitespace name fails"""
        data = {
            'name': '   ',
            'description': 'Test',
            'membership_id': str(membership.id),
            'year_id': str(year.id),
            'fee': Decimal('100.00')
        }

        success, subscription, error = SubscriptionService.create_subscription(data)

        assert success is False
        assert subscription is None
        assert error is not None

    def test_create_duplicate_subscription(self, membership, year):
        """Test creating duplicate subscription fails"""
        data = {
            'name': 'First Subscription',
            'description': 'Test',
            'membership_id': str(membership.id),
            'year_id': str(year.id),
            'fee': Decimal('100.00'),
            'is_recreational': False
        }

        # Create first subscription
        success1, sub1, error1 = SubscriptionService.create_subscription(data)
        assert success1 is True

        # Try to create duplicate
        data['name'] = 'Different Name'  # Name can be different
        success2, sub2, error2 = SubscriptionService.create_subscription(data)

        assert success2 is False
        assert 'already exists' in error2.lower()

    def test_get_subscription_success(self, membership, year):
        """Test retrieving a subscription by ID"""
        subscription = Subscription.objects.create(
            name='Test Subscription',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00')
        )

        retrieved = SubscriptionService.get_subscription(str(subscription.id))

        assert retrieved is not None
        assert retrieved.id == subscription.id
        assert retrieved.name == 'Test Subscription'

    def test_get_nonexistent_subscription(self):
        """Test retrieving non-existent subscription returns None"""
        subscription = SubscriptionService.get_subscription('00000000-0000-0000-0000-000000000000')
        assert subscription is None

    def test_update_subscription_success(self, membership, year):
        """Test successful subscription update"""
        subscription = Subscription.objects.create(
            name='Original Name',
            description='Original description',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_active=False
        )

        update_data = {
            'name': 'Updated Name',
            'fee': Decimal('150.00'),
            'is_active': True
        }

        success, updated, error = SubscriptionService.update_subscription(
            str(subscription.id),
            update_data
        )

        assert success is True
        assert updated is not None
        assert error is None
        assert updated.name == 'Updated Name'
        assert updated.fee == Decimal('150.00')
        assert updated.is_active is True


    def test_update_nonexistent_subscription(self):
        """Test updating non-existent subscription fails"""
        success, updated, error = SubscriptionService.update_subscription(
            '00000000-0000-0000-0000-000000000000',
            {'name': 'New Name'}
        )

        assert success is False
        assert updated is None
        assert 'not found' in error.lower()

    def test_update_with_invalid_membership(self, membership, year):
        """Test updating with invalid membership ID fails"""
        subscription = Subscription.objects.create(
            name='Test Subscription',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00')
        )

        success, updated, error = SubscriptionService.update_subscription(
            str(subscription.id),
            {'membership_id': '00000000-0000-0000-0000-000000000000'}
        )

        assert success is False
        assert 'not found' in error.lower()

    def test_delete_subscription_success(self, membership, year):
        """Test successful subscription deletion"""
        subscription = Subscription.objects.create(
            name='To Delete',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00')
        )

        success, error = SubscriptionService.delete_subscription(str(subscription.id))

        assert success is True
        assert error is None
        assert not Subscription.objects.filter(id=subscription.id).exists()

    def test_delete_nonexistent_subscription(self):
        """Test deleting non-existent subscription fails"""
        success, error = SubscriptionService.delete_subscription('00000000-0000-0000-0000-000000000000')

        assert success is False
        assert 'not found' in error.lower()

    def test_get_subscriptions_no_filters(self, membership, year):
        """Test getting all subscriptions without filters"""
        Subscription.objects.create(
            name='Sub 1',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00')
        )
        Subscription.objects.create(
            name='Sub 2',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('200.00'),
            is_recreational=True
        )

        count, subscriptions = SubscriptionService.get_subscriptions()

        assert count == 2
        assert len(subscriptions) == 2

    def test_filter_subscriptions_by_name(self, membership, year):
        """Test filtering subscriptions by name"""
        Subscription.objects.create(
            name='Rider Subscription',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00')
        )
        Subscription.objects.create(
            name='Non-Rider Subscription',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('50.00'),
            is_recreational=True
        )

        count, subscriptions = SubscriptionService.get_subscriptions(
            filters={'name': 'rider'}
        )

        assert count == 2  # Both contain 'rider'

        count, subscriptions = SubscriptionService.get_subscriptions(
            filters={'name': 'Non-Rider'}
        )

        assert count == 1

    def test_filter_subscriptions_by_active_status(self, membership, year):
        """Test filtering subscriptions by active status"""
        Subscription.objects.create(
            name='Active Sub',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_active=True
        )
        Subscription.objects.create(
            name='Inactive Sub',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_active=False,
            is_recreational=True
        )

        count, subscriptions = SubscriptionService.get_subscriptions(
            filters={'is_active': True}
        )

        assert count == 1
        assert subscriptions[0].name == 'Active Sub'

    def test_filter_subscriptions_by_recreational(self, membership, year):
        """Test filtering subscriptions by recreational status"""
        Subscription.objects.create(
            name='Competitive',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('500.00'),
            is_recreational=False
        )
        Subscription.objects.create(
            name='Recreational',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_recreational=True
        )

        count, subscriptions = SubscriptionService.get_subscriptions(
            filters={'is_recreational': True}
        )

        assert count == 1
        assert subscriptions[0].name == 'Recreational'

    def test_filter_subscriptions_by_membership(self, year):
        """Test filtering subscriptions by membership"""
        membership1 = Membership.objects.create(
            name='Membership 1',
            description='Test'
        )
        membership2 = Membership.objects.create(
            name='Membership 2',
            description='Test'
        )

        Subscription.objects.create(
            name='Sub 1',
            description='Test',
            membership=membership1,
            year=year,
            fee=Decimal('100.00')
        )
        Subscription.objects.create(
            name='Sub 2',
            description='Test',
            membership=membership2,
            year=year,
            fee=Decimal('200.00')
        )

        count, subscriptions = SubscriptionService.get_subscriptions(
            filters={'membership_id': str(membership1.id)}
        )

        assert count == 1
        assert subscriptions[0].name == 'Sub 1'

    def test_activate_subscription(self, membership, year):
        """Test activating a subscription"""
        subscription = Subscription.objects.create(
            name='Test Sub',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_active=False
        )

        success, updated, error = SubscriptionService.activate_subscription(str(subscription.id))

        assert success is True
        assert updated is not None
        assert error is None
        assert updated.is_active is True

    def test_activate_nonexistent_subscription(self):
        """Test activating non-existent subscription fails"""
        success, subscription, error = SubscriptionService.activate_subscription(
            '00000000-0000-0000-0000-000000000000'
        )
        assert success is False
        assert 'not found' in error.lower()

    def test_deactivate_subscription(self, membership, year):
        """Test deactivating a subscription"""
        subscription = Subscription.objects.create(
            name='Test Sub',
            description='Test',
            membership=membership,
            year=year,
            fee=Decimal('100.00'),
            is_active=True
        )

        success, updated, error = SubscriptionService.deactivate_subscription(str(subscription.id))

        assert success is True
        assert updated is not None
        assert error is None
        assert updated.is_active is False

    def test_deactivate_nonexistent_subscription(self):
        """Test deactivating non-existent subscription fails"""
        success, subscription, error = SubscriptionService.deactivate_subscription(
            '00000000-0000-0000-0000-000000000000'
        )
        assert success is False
        assert 'not found' in error.lower()

    def test_get_active_subscriptions(self, year):
        """Test getting all active subscriptions"""
        # Create multiple memberships and years to test properly
        membership1 = Membership.objects.create(
            name='Membership 1',
            description='Test'
        )
        membership2 = Membership.objects.create(
            name='Membership 2',
            description='Test'
        )

        Subscription.objects.create(
            name='Active 1',
            description='Test',
            membership=membership1,
            year=year,
            fee=Decimal('100.00'),
            is_active=True,
            is_recreational=False
        )
        Subscription.objects.create(
            name='Inactive',
            description='Test',
            membership=membership1,
            year=year,
            fee=Decimal('100.00'),
            is_active=False,
            is_recreational=True
        )
        Subscription.objects.create(
            name='Active 2',
            description='Test',
            membership=membership2,
            year=year,
            fee=Decimal('200.00'),
            is_active=True,
            is_recreational=False
        )

        active_subs = SubscriptionService.get_active_subscriptions()

        assert len(active_subs) == 2
        assert all(sub.is_active for sub in active_subs)

    def test_pagination(self):
        """Test pagination of subscription results"""
        # Create multiple memberships and years to avoid unique constraint issues
        year_list = []
        for y in range(2024, 2032):
            year_list.append(Year.objects.create(
                name=f"{y} Season",
                year=y,
                start_date=f"{y}-01-01",
                end_date=f"{y}-12-31",
                is_registration_open=True,
                status="ACTIVE"
            ))

        membership_list = []
        for m in range(2):
            membership_list.append(Membership.objects.create(
                name=f'Membership {m}',
                description='Test'
            ))

        # Create 15 subscriptions with different combinations
        count = 0
        for year in year_list[:8]:  # 8 years
            for membership in membership_list:  # 2 memberships each
                if count >= 15:
                    break
                Subscription.objects.create(
                    name=f'Sub {count}',
                    description='Test',
                    membership=membership,
                    year=year,
                    fee=Decimal('100.00'),
                    is_recreational=False
                )
                count += 1

        # Get first page
        count, page1 = SubscriptionService.get_subscriptions(limit=10, offset=0)
        assert count == 15
        assert len(page1) == 10

        # Get second page
        count, page2 = SubscriptionService.get_subscriptions(limit=10, offset=10)
        assert count == 15
        assert len(page2) == 5
