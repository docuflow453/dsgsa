import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError
from apps.clubs.models import Club, ClubStatus, AccountType
from apps.clubs.services import ClubService
from apps.common.models import Province


@pytest.mark.django_db
class TestClubModel:
    """Test Club model validation and properties"""

    def test_create_club_success(self):
        """Test creating a valid club"""
        province = Province.objects.create(name="Western Cape", country="ZA")

        club = Club.objects.create(
            name="Cape Town Equestrian Club",
            registration_number="CTEC2024",
            email="info@ctec.shyft.com",
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

        assert club.id is not None
        assert club.name == "Cape Town Equestrian Club"
        assert club.province == province
        assert club.status == ClubStatus.ACTIVE
        assert club.is_active is True

    def test_club_with_bank_details(self):
        """Test creating club with complete bank details"""
        province = Province.objects.create(name="Gauteng", country="ZA")

        club = Club.objects.create(
            name="Johannesburg Riding Club",
            email="contact@jrc.byteorbit.com",
            phone="+27115551234",
            address_line_1="456 Horse Lane",
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
            account_holder_name="Johannesburg Riding Club"
        )

        assert club.has_bank_details is True
        assert club.account_type == AccountType.BUSINESS

    def test_club_full_address(self):
        """Test full address property"""
        province = Province.objects.create(name="KwaZulu-Natal", country="ZA")

        club = Club.objects.create(
            name="Durban Equestrian Club",
            email="info@dec.shyft.com",
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

        full_address = club.full_address
        assert "789 Coastal Road" in full_address
        assert "Unit 5" in full_address
        assert "Durban" in full_address
        assert "4001" in full_address
        assert "South Africa" in full_address

    def test_club_status_choices(self):
        """Test different status values"""
        province = Province.objects.create(name="Eastern Cape", country="ZA")

        club_pending = Club.objects.create(
            name="Port Elizabeth Riding Club",
            email="info@perc.shyft.com",
            phone="+27411234567",
            address_line_1="123 Club Street",
            city="Port Elizabeth",
            province=province,
            postal_code="6001",
            country="ZA",
            primary_contact_name="Emma Davis",
            primary_contact_email="emma.davis@shyft.com",
            primary_contact_phone="+27411234567",
            status=ClubStatus.PENDING
        )

        assert club_pending.status == ClubStatus.PENDING
        assert club_pending.is_active is False

    def test_name_uniqueness(self):
        """Test that club names must be unique"""
        province = Province.objects.create(name="Free State", country="ZA")

        Club.objects.create(
            name="Unique Riding Club",
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
            Club.objects.create(
                name="Unique Riding Club",
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
            club = Club(
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
            club.clean()

        assert 'name' in exc_info.value.message_dict

    def test_incomplete_bank_details_validation(self):
        """Test that incomplete bank details raise validation error"""
        province = Province.objects.create(name="Test Province", country="ZA")

        with pytest.raises(ValidationError) as exc_info:
            club = Club(
                name="Test Club",
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
            club.clean()

        assert 'bank_name' in exc_info.value.message_dict

    def test_str_representation(self):
        """Test string representation includes name and status"""
        province = Province.objects.create(name="Test Province", country="ZA")

        club = Club.objects.create(
            name="Test Riding Club",
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
            status=ClubStatus.PENDING
        )

        assert "Test Riding Club" in str(club)
        assert "Pending" in str(club)


@pytest.mark.django_db
class TestClubService:
    """Test ClubService methods"""

    def test_create_club_success(self):
        """Test successful club creation through service"""
        province = Province.objects.create(name="Test Province", country="ZA")

        success, club, error = ClubService.create_club({
            "name": "Service Test Club",
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
        assert club is not None
        assert club.name == "Service Test Club"
        assert error is None

    def test_create_with_invalid_province(self):
        """Test creating club with non-existent province"""
        success, club, error = ClubService.create_club({
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
        assert club is None
        assert error is not None

    def test_get_club_success(self):
        """Test retrieving a club by ID"""
        province = Province.objects.create(name="Test Province", country="ZA")

        club = Club.objects.create(
            name="Get Test Club",
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

        success, result, error = ClubService.get_club(str(club.id))

        assert success is True
        assert result == club
        assert error is None

    def test_get_club_not_found(self):
        """Test retrieving non-existent club"""
        success, result, error = ClubService.get_club("non-existent-id")

        assert success is False
        assert result is None
        assert error is not None

    def test_update_club_success(self):
        """Test updating a club"""
        province = Province.objects.create(name="Original Province", country="ZA")

        club = Club.objects.create(
            name="Update Test Club",
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

        success, updated, error = ClubService.update_club(
            str(club.id),
            {"name": "Updated Club Name"}
        )

        assert success is True
        assert updated.name == "Updated Club Name"
        assert error is None

    def test_delete_club_soft_delete(self):
        """Test soft deleting a club"""
        province = Province.objects.create(name="Delete Province", country="ZA")

        club = Club.objects.create(
            name="Delete Test Club",
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
            status=ClubStatus.ACTIVE
        )

        success, result, error = ClubService.delete_club(str(club.id))

        assert success is True
        result.refresh_from_db()
        assert result.status == ClubStatus.INACTIVE
        assert result.is_active is False

    def test_get_clubs_with_filters(self):
        """Test listing clubs with filters"""
        province1 = Province.objects.create(name="Province 1", country="ZA")
        province2 = Province.objects.create(name="Province 2", country="GB")

        Club.objects.create(
            name="Active Club ZA",
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
            status=ClubStatus.ACTIVE
        )

        Club.objects.create(
            name="Inactive Club GB",
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
            status=ClubStatus.INACTIVE
        )

        # Test filter by country
        success, result, error = ClubService.get_clubs(country="ZA")
        assert success is True
        assert result['count'] == 1

        # Test filter by is_active
        success, result, error = ClubService.get_clubs(is_active=True)
        assert success is True
        assert result['count'] == 1

        # Test search
        success, result, error = ClubService.get_clubs(search="Active")
        assert success is True
        assert result['count'] >= 1
