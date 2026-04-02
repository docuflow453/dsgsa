import pytest
from django.core.exceptions import ValidationError
from decimal import Decimal

from apps.common.models import Province, VatCode, School, PaymentMethod, SchoolStatus
from apps.common.services import ProvinceService, VatCodeService, SchoolService, PaymentMethodService


@pytest.mark.django_db
class TestProvinceModel:
    """Test Province model validation and properties"""

    def test_create_province_success(self):
        """Test creating a valid province"""
        province = Province.objects.create(
            name="Western Cape",
            country="ZA",
            is_active=True
        )
        assert province.id is not None
        assert province.name == "Western Cape"
        assert province.country.code == "ZA"
        assert province.is_active is True

    def test_province_status_property(self):
        """Test status property returns correct values"""
        active = Province.objects.create(
            name="Gauteng",
            country="ZA",
            is_active=True
        )
        assert active.status == "Active"

        inactive = Province.objects.create(
            name="KwaZulu-Natal",
            country="ZA",
            is_active=False
        )
        assert inactive.status == "Inactive"

    def test_province_str_representation(self):
        """Test string representation includes country name"""
        province = Province.objects.create(
            name="London",
            country="GB"
        )
        assert "London" in str(province)
        assert "United Kingdom" in str(province)

    def test_name_uniqueness(self):
        """Test that province names must be unique"""
        Province.objects.create(name="Unique Province", country="ZA")

        with pytest.raises(ValidationError):
            Province.objects.create(name="Unique Province", country="GB")

    def test_name_whitespace_validation(self):
        """Test that name cannot be only whitespace"""
        with pytest.raises(ValidationError) as exc_info:
            province = Province(name="   ", country="ZA")
            province.clean()

        assert 'name' in exc_info.value.message_dict


@pytest.mark.django_db
class TestVatCodeModel:
    """Test VatCode model validation and properties"""

    def test_create_vat_code_success(self):
        """Test creating a valid VAT code"""
        vat_code = VatCode.objects.create(
            name="Standard VAT",
            code="VAT_15",
            percentage=Decimal("15.00"),
            is_active=True
        )
        assert vat_code.id is not None
        assert vat_code.name == "Standard VAT"
        assert vat_code.percentage == Decimal("15.00")

    def test_vat_code_status_property(self):
        """Test status property returns correct values"""
        active = VatCode.objects.create(
            name="Active VAT",
            code="VAT_A",
            percentage=Decimal("15.00"),
            is_active=True
        )
        assert active.status == "Active"

    def test_vat_code_str_representation(self):
        """Test string representation includes name and percentage"""
        vat_code = VatCode.objects.create(
            name="Zero-rated",
            code="VAT_0",
            percentage=Decimal("0.00")
        )
        assert "Zero-rated" in str(vat_code)
        assert "0.00%" in str(vat_code)

    def test_code_uniqueness(self):
        """Test that VAT codes must be unique"""
        VatCode.objects.create(name="VAT 1", code="UNIQUE_CODE", percentage=Decimal("15.00"))

        with pytest.raises(ValidationError):
            VatCode.objects.create(name="VAT 2", code="UNIQUE_CODE", percentage=Decimal("10.00"))

    def test_percentage_validation_negative(self):
        """Test that percentage cannot be negative"""
        with pytest.raises(ValidationError) as exc_info:
            vat_code = VatCode(name="Negative VAT", code="NEG", percentage=Decimal("-5.00"))
            vat_code.clean()

        assert 'percentage' in exc_info.value.message_dict

    def test_percentage_validation_over_100(self):
        """Test that percentage cannot exceed 100"""
        with pytest.raises(ValidationError) as exc_info:
            vat_code = VatCode(name="Over 100", code="OVER", percentage=Decimal("150.00"))
            vat_code.clean()

        assert 'percentage' in exc_info.value.message_dict

    def test_default_vat_code_logic(self):
        """Test that setting a VAT code as default unsets other defaults"""
        vat1 = VatCode.objects.create(
            name="VAT 1", code="V1", percentage=Decimal("15.00"), is_default=True
        )
        assert vat1.is_default is True

        vat2 = VatCode.objects.create(
            name="VAT 2", code="V2", percentage=Decimal("10.00"), is_default=True
        )

        # Refresh vat1 from database
        vat1.refresh_from_db()
        assert vat1.is_default is False
        assert vat2.is_default is True

    def test_default_applicability_flags(self):
        """Test default values for applicability flags"""
        vat_code = VatCode.objects.create(
            name="Test VAT",
            code="TEST",
            percentage=Decimal("15.00")
        )
        assert vat_code.is_applicable_to_membership is True
        assert vat_code.is_applicable_to_competitions is True


@pytest.mark.django_db
class TestSchoolModel:
    """Test School model validation and properties"""

    def test_create_school_success(self):
        """Test creating a valid school"""
        province = Province.objects.create(name="Test Province", country="ZA")
        school = School.objects.create(
            name="Equestrian Academy",
            province=province,
            status=SchoolStatus.ACTIVE,
            email="contact@academy.shyft.com",
            phone="+27123456789"
        )
        assert school.id is not None
        assert school.name == "Equestrian Academy"
        assert school.province == province
        assert school.status == SchoolStatus.ACTIVE

    def test_school_is_active_property(self):
        """Test is_active property based on status"""
        school_active = School.objects.create(
            name="Active School",
            status=SchoolStatus.ACTIVE
        )
        assert school_active.is_active is True

        school_inactive = School.objects.create(
            name="Inactive School",
            status=SchoolStatus.INACTIVE
        )
        assert school_inactive.is_active is False

    def test_school_str_representation(self):
        """Test string representation includes name and status"""
        school = School.objects.create(
            name="Test School",
            status=SchoolStatus.PENDING
        )
        assert "Test School" in str(school)
        assert "Pending" in str(school)

    def test_name_uniqueness(self):
        """Test that school names must be unique"""
        School.objects.create(name="Unique School")

        with pytest.raises(ValidationError):
            School.objects.create(name="Unique School")

    def test_name_whitespace_validation(self):
        """Test that name cannot be only whitespace"""
        with pytest.raises(ValidationError) as exc_info:
            school = School(name="   ", status=SchoolStatus.ACTIVE)
            school.clean()

        assert 'name' in exc_info.value.message_dict

    def test_default_status(self):
        """Test that status defaults to ACTIVE"""
        school = School.objects.create(name="Default Status School")
        assert school.status == SchoolStatus.ACTIVE


@pytest.mark.django_db
class TestPaymentMethodModel:
    """Test PaymentMethod model validation and properties"""

    def test_create_payment_method_success(self):
        """Test creating a valid payment method"""
        payment_method = PaymentMethod.objects.create(
            name="Credit Card",
            code="credit-card",
            description="Visa, Mastercard, Amex",
            is_active=True
        )
        assert payment_method.id is not None
        assert payment_method.name == "Credit Card"
        assert payment_method.code == "credit-card"

    def test_payment_method_status_property(self):
        """Test status property returns correct values"""
        active = PaymentMethod.objects.create(
            name="EFT",
            code="eft",
            is_active=True
        )
        assert active.status == "Active"

    def test_payment_method_str_representation(self):
        """Test string representation includes name and code"""
        payment_method = PaymentMethod.objects.create(
            name="Cash",
            code="cash"
        )
        assert "Cash" in str(payment_method)
        assert "cash" in str(payment_method)

    def test_code_uniqueness(self):
        """Test that payment method codes must be unique"""
        PaymentMethod.objects.create(name="Method 1", code="unique-code")

        with pytest.raises(ValidationError):
            PaymentMethod.objects.create(name="Method 2", code="unique-code")

    def test_auto_slug_generation(self):
        """Test that code is auto-generated from name if not provided"""
        payment_method = PaymentMethod.objects.create(
            name="Bank Transfer"
        )
        assert payment_method.code == "bank-transfer"

    def test_default_allow_flags(self):
        """Test default values for allow flags"""
        payment_method = PaymentMethod.objects.create(
            name="Test Payment",
            code="test"
        )
        assert payment_method.allow_for_entries is True
        assert payment_method.allow_for_renewals is True


@pytest.mark.django_db
class TestProvinceService:
    """Test ProvinceService methods"""

    def test_create_province_success(self):
        """Test successful province creation through service"""
        success, province, error = ProvinceService.create_province({
            "name": "Eastern Cape",
            "country": "ZA",
            "is_active": True
        })
        assert success is True
        assert province is not None
        assert province.name == "Eastern Cape"
        assert error is None

    def test_get_province_success(self):
        """Test retrieving a province by ID"""
        province = Province.objects.create(name="Test Province", country="ZA")
        success, result, error = ProvinceService.get_province(str(province.id))
        assert success is True
        assert result == province

    def test_get_province_not_found(self):
        """Test retrieving non-existent province"""
        success, result, error = ProvinceService.get_province("non-existent-id")
        assert success is False
        assert result is None
        assert error is not None  # Any error message is fine

    def test_update_province_success(self):
        """Test updating a province"""
        province = Province.objects.create(name="Old Name", country="ZA")
        success, updated, error = ProvinceService.update_province(
            str(province.id),
            {"name": "New Name"}
        )
        assert success is True
        assert updated.name == "New Name"

    def test_delete_province_soft_delete(self):
        """Test soft deleting a province"""
        province = Province.objects.create(name="To Delete", country="ZA", is_active=True)
        success, result, error = ProvinceService.delete_province(str(province.id))
        assert success is True
        result.refresh_from_db()
        assert result.is_active is False

    def test_get_provinces_with_filters(self):
        """Test listing provinces with filters"""
        Province.objects.create(name="Province 1", country="ZA", is_active=True)
        Province.objects.create(name="Province 2", country="GB", is_active=False)

        success, result, error = ProvinceService.get_provinces(country="ZA", is_active=True)
        assert success is True
        assert result['count'] == 1

