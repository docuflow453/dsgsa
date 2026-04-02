import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError
from apps.showholdingbody.models import (
    ShowHoldingBody,
    ShowHoldingBodyStatus,
    AccountType
)
from apps.showholdingbody.services import ShowHoldingBodyService
from apps.common.models import Province


@pytest.mark.django_db
class TestShowHoldingBodyModel:
    """Test ShowHoldingBody model validation and properties"""

    def test_create_show_holding_body_success(self):
        """Test creating a valid show holding body"""
        province = Province.objects.create(name="Western Cape", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Cape Dressage Association",
            registration_number="CDA2024",
            email="info@capedressage.shyft.com",
            phone="+27211234567",
            address_line_1="123 Equestrian Drive",
            city="Cape Town",
            province=province,
            postal_code="8001",
            country="ZA",
            primary_contact_name="Sarah Parker",
            primary_contact_email="sarah.parker@shyft.com",
            primary_contact_phone="+27211234567"
        )

        assert shb.id is not None
        assert shb.name == "Cape Dressage Association"
        assert shb.province == province
        assert shb.status == ShowHoldingBodyStatus.ACTIVE
        assert shb.is_active is True

    def test_show_holding_body_with_bank_details(self):
        """Test creating show holding body with complete bank details"""
        province = Province.objects.create(name="Gauteng", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Johannesburg Show Association",
            email="contact@jhbshows.byteorbit.com",
            phone="+27115551234",
            address_line_1="456 Show Grounds Rd",
            city="Johannesburg",
            province=province,
            postal_code="2000",
            country="ZA",
            primary_contact_name="Alex Johnson",
            primary_contact_email="alex.johnson@byteorbit.com",
            primary_contact_phone="+27115551234",
            bank_name="First National Bank",
            account_number="62001234567",
            branch_code="250655",
            account_type=AccountType.BUSINESS,
            account_holder_name="Johannesburg Show Association"
        )

        assert shb.has_bank_details is True
        assert shb.account_type == AccountType.BUSINESS

    def test_show_holding_body_full_address(self):
        """Test full address property"""
        province = Province.objects.create(name="KwaZulu-Natal", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Durban Equestrian Centre",
            email="info@durbanequestrian.shyft.com",
            phone="+27311234567",
            address_line_1="789 Coastal Road",
            address_line_2="Unit 5",
            city="Durban",
            province=province,
            postal_code="4001",
            country="ZA",
            primary_contact_name="Michael Chen",
            primary_contact_email="michael.chen@shyft.com",
            primary_contact_phone="+27311234567"
        )

        full_address = shb.full_address
        assert "789 Coastal Road" in full_address
        assert "Unit 5" in full_address
        assert "Durban" in full_address
        assert "4001" in full_address
        assert "South Africa" in full_address

    def test_show_holding_body_status_choices(self):
        """Test different status values"""
        province = Province.objects.create(name="Eastern Cape", country="ZA")

        shb_pending = ShowHoldingBody.objects.create(
            name="Port Elizabeth Shows",
            email="info@peshows.shyft.com",
            phone="+27411234567",
            address_line_1="123 Show Street",
            city="Port Elizabeth",
            province=province,
            postal_code="6001",
            country="ZA",
            primary_contact_name="Emma Davis",
            primary_contact_email="emma.davis@shyft.com",
            primary_contact_phone="+27411234567",
            status=ShowHoldingBodyStatus.PENDING
        )

        assert shb_pending.status == ShowHoldingBodyStatus.PENDING
        assert shb_pending.is_active is False

    def test_name_uniqueness(self):
        """Test that show holding body names must be unique"""
        province = Province.objects.create(name="Free State", country="ZA")

        ShowHoldingBody.objects.create(
            name="Unique Show Body",
            email="info@unique.shyft.com",
            phone="+27511234567",
            address_line_1="123 Main St",
            city="Bloemfontein",
            province=province,
            postal_code="9300",
            country="ZA",
            primary_contact_name="John Smith",
            primary_contact_email="john.smith@shyft.com",
            primary_contact_phone="+27511234567"
        )

        with pytest.raises(ValidationError):
            ShowHoldingBody.objects.create(
                name="Unique Show Body",
                email="different@shyft.com",
                phone="+27511234568",
                address_line_1="456 Other St",
                city="Bloemfontein",
                province=province,
                postal_code="9301",
                country="ZA",
                primary_contact_name="Jane Doe",
                primary_contact_email="jane.doe@shyft.com",
                primary_contact_phone="+27511234568"
            )



    def test_name_whitespace_validation(self):
        """Test that name cannot be only whitespace"""
        province = Province.objects.create(name="Test Province", country="ZA")

        with pytest.raises(ValidationError) as exc_info:
            shb = ShowHoldingBody(
                name="   ",
                email="info@test.shyft.com",
                phone="+27211234567",
                address_line_1="123 Test St",
                city="Test City",
                province=province,
                postal_code="1234",
                country="ZA",
                primary_contact_name="Test Contact",
                primary_contact_email="contact@test.shyft.com",
                primary_contact_phone="+27211234567"
            )
            shb.clean()

        assert 'name' in exc_info.value.message_dict

    def test_incomplete_bank_details_validation(self):
        """Test that incomplete bank details raise validation error"""
        province = Province.objects.create(name="Test Province", country="ZA")

        with pytest.raises(ValidationError) as exc_info:
            shb = ShowHoldingBody(
                name="Test Show Body",
                email="info@test.shyft.com",
                phone="+27211234567",
                address_line_1="123 Test St",
                city="Test City",
                province=province,
                postal_code="1234",
                country="ZA",
                primary_contact_name="Test Contact",
                primary_contact_email="contact@test.shyft.com",
                primary_contact_phone="+27211234567",
                bank_name="Test Bank",
                # Missing account_number and account_holder_name
            )
            shb.clean()

        assert 'bank_name' in exc_info.value.message_dict

    def test_str_representation(self):
        """Test string representation includes name and status"""
        province = Province.objects.create(name="Test Province", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Test Show Association",
            email="info@test.shyft.com",
            phone="+27211234567",
            address_line_1="123 Test St",
            city="Test City",
            province=province,
            postal_code="1234",
            country="ZA",
            primary_contact_name="Test Contact",
            primary_contact_email="contact@test.shyft.com",
            primary_contact_phone="+27211234567",
            status=ShowHoldingBodyStatus.PENDING
        )

        assert "Test Show Association" in str(shb)
        assert "Pending" in str(shb)


@pytest.mark.django_db
class TestShowHoldingBodyService:
    """Test ShowHoldingBodyService methods"""

    def test_create_show_holding_body_success(self):
        """Test successful show holding body creation through service"""
        province = Province.objects.create(name="Test Province", country="ZA")

        success, shb, error = ShowHoldingBodyService.create_show_holding_body({
            "name": "Service Test Association",
            "email": "service@test.shyft.com",
            "phone": "+27211234567",
            "address_line_1": "789 Service Road",
            "city": "Service City",
            "province_id": str(province.id),
            "postal_code": "5678",
            "country": "ZA",
            "primary_contact_name": "Service Contact",
            "primary_contact_email": "contact@service.shyft.com",
            "primary_contact_phone": "+27211234567"
        })

        assert success is True
        assert shb is not None
        assert shb.name == "Service Test Association"
        assert error is None

    def test_create_with_invalid_province(self):
        """Test creating show holding body with non-existent province"""
        success, shb, error = ShowHoldingBodyService.create_show_holding_body({
            "name": "Invalid Province Test",
            "email": "test@invalid.shyft.com",
            "phone": "+27211234567",
            "address_line_1": "123 Invalid St",
            "city": "Invalid City",
            "province_id": "non-existent-id",
            "postal_code": "9999",
            "country": "ZA",
            "primary_contact_name": "Invalid Contact",
            "primary_contact_email": "contact@invalid.shyft.com",
            "primary_contact_phone": "+27211234567"
        })

        assert success is False
        assert shb is None
        assert error is not None  # Any error is fine (could be UUID validation or not found)

    def test_get_show_holding_body_success(self):
        """Test retrieving a show holding body by ID"""
        province = Province.objects.create(name="Test Province", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Get Test Association",
            email="get@test.shyft.com",
            phone="+27211234567",
            address_line_1="123 Get St",
            city="Get City",
            province=province,
            postal_code="1111",
            country="ZA",
            primary_contact_name="Get Contact",
            primary_contact_email="contact@get.shyft.com",
            primary_contact_phone="+27211234567"
        )

        success, result, error = ShowHoldingBodyService.get_show_holding_body(str(shb.id))

        assert success is True
        assert result == shb
        assert error is None

    def test_get_show_holding_body_not_found(self):
        """Test retrieving non-existent show holding body"""
        success, result, error = ShowHoldingBodyService.get_show_holding_body("non-existent-id")

        assert success is False
        assert result is None
        assert error is not None

    def test_update_show_holding_body_success(self):
        """Test updating a show holding body"""
        province = Province.objects.create(name="Original Province", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Update Test Association",
            email="update@test.shyft.com",
            phone="+27211234567",
            address_line_1="123 Update St",
            city="Update City",
            province=province,
            postal_code="2222",
            country="ZA",
            primary_contact_name="Update Contact",
            primary_contact_email="contact@update.shyft.com",
            primary_contact_phone="+27211234567"
        )

        success, updated, error = ShowHoldingBodyService.update_show_holding_body(
            str(shb.id),
            {"name": "Updated Association Name"}
        )

        assert success is True
        assert updated.name == "Updated Association Name"
        assert error is None

    def test_delete_show_holding_body_soft_delete(self):
        """Test soft deleting a show holding body"""
        province = Province.objects.create(name="Delete Province", country="ZA")

        shb = ShowHoldingBody.objects.create(
            name="Delete Test Association",
            email="delete@test.shyft.com",
            phone="+27211234567",
            address_line_1="123 Delete St",
            city="Delete City",
            province=province,
            postal_code="3333",
            country="ZA",
            primary_contact_name="Delete Contact",
            primary_contact_email="contact@delete.shyft.com",
            primary_contact_phone="+27211234567",
            status=ShowHoldingBodyStatus.ACTIVE
        )

        success, result, error = ShowHoldingBodyService.delete_show_holding_body(str(shb.id))

        assert success is True
        result.refresh_from_db()
        assert result.status == ShowHoldingBodyStatus.INACTIVE
        assert result.is_active is False

    def test_get_show_holding_bodies_with_filters(self):
        """Test listing show holding bodies with filters"""
        province1 = Province.objects.create(name="Province 1", country="ZA")
        province2 = Province.objects.create(name="Province 2", country="GB")

        ShowHoldingBody.objects.create(
            name="Active Association ZA",
            email="active@za.shyft.com",
            phone="+27211111111",
            address_line_1="111 Active St",
            city="City 1",
            province=province1,
            postal_code="1111",
            country="ZA",
            primary_contact_name="Active Contact",
            primary_contact_email="contact@active.shyft.com",
            primary_contact_phone="+27211111111",
            status=ShowHoldingBodyStatus.ACTIVE
        )

        ShowHoldingBody.objects.create(
            name="Inactive Association GB",
            email="inactive@gb.byteorbit.com",
            phone="+44201111111",
            address_line_1="222 Inactive St",
            city="City 2",
            province=province2,
            postal_code="2222",
            country="GB",
            primary_contact_name="Inactive Contact",
            primary_contact_email="contact@inactive.byteorbit.com",
            primary_contact_phone="+44201111111",
            status=ShowHoldingBodyStatus.INACTIVE
        )

        # Test filter by country
        success, result, error = ShowHoldingBodyService.get_show_holding_bodies(country="ZA")
        assert success is True
        assert result['count'] == 1

        # Test filter by is_active
        success, result, error = ShowHoldingBodyService.get_show_holding_bodies(is_active=True)
        assert success is True
        assert result['count'] == 1

        # Test search
        success, result, error = ShowHoldingBodyService.get_show_holding_bodies(search="Active")
        assert success is True
        assert result['count'] >= 1

