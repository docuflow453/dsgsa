import pytest
from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from apps.years.models import Year, YearStatus
from apps.years.services import YearService


@pytest.mark.django_db
class TestYearModel:
    """Test Year model validation and properties"""

    def test_create_year_success(self):
        """Test creating a valid year"""
        year = Year.objects.create(
            name="2024 Season",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.PENDING
        )
        assert year.id is not None
        assert year.name == "2024 Season"
        assert year.year == 2024

    def test_end_date_validation_model_level(self):
        """Test that end_date must be >= start_date (model level)"""
        with pytest.raises(ValidationError) as exc_info:
            year = Year(
                name="Invalid Year",
                year=2024,
                start_date=date(2024, 12, 31),
                end_date=date(2024, 1, 1),  # Before start_date
                status=YearStatus.PENDING
            )
            year.clean()  # Trigger model validation

        assert 'end_date' in exc_info.value.message_dict

    def test_end_date_validation_database_level(self):
        """Test that end_date constraint is enforced at database level"""
        # This should raise IntegrityError due to database constraint
        with pytest.raises((ValidationError, IntegrityError)):
            Year.objects.create(
                name="Invalid Year",
                year=2024,
                start_date=date(2024, 12, 31),
                end_date=date(2024, 1, 1),
                status=YearStatus.PENDING
            )

    def test_is_active_property(self):
        """Test is_active property"""
        year = Year.objects.create(
            name="Active Year",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.ACTIVE
        )
        assert year.is_active is True

        year.status = YearStatus.PENDING
        year.save()
        assert year.is_active is False

    def test_is_current_property(self):
        """Test is_current property (checks if today is within the year's date range)"""
        today = date.today()
        year = Year.objects.create(
            name="Current Year",
            year=today.year,
            start_date=today - timedelta(days=30),
            end_date=today + timedelta(days=30),
            status=YearStatus.ACTIVE
        )
        assert year.is_current is True

        # Year in the past
        past_year = Year.objects.create(
            name="Past Year",
            year=today.year - 1,
            start_date=today - timedelta(days=400),
            end_date=today - timedelta(days=100),
            status=YearStatus.COMPLETE
        )
        assert past_year.is_current is False

    def test_days_remaining_property(self):
        """Test days_remaining calculation"""
        today = date.today()
        year = Year.objects.create(
            name="Test Year",
            year=today.year,
            start_date=today,
            end_date=today + timedelta(days=10),
            status=YearStatus.ACTIVE
        )
        assert year.days_remaining == 10

    def test_duration_days_property(self):
        """Test duration_days calculation"""
        year = Year.objects.create(
            name="Test Year",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.PENDING
        )
        # 366 days in 2024 (leap year)
        assert year.duration_days == 366


@pytest.mark.django_db
class TestYearService:
    """Test YearService business logic"""

    def test_create_year_success(self):
        """Test successful year creation via service"""
        data = {
            'name': '2024 Competition Season',
            'year': 2024,
            'start_date': date(2024, 1, 1),
            'end_date': date(2024, 12, 31),
            'status': 'PENDING',
            'notes': 'Main season'
        }
        success, year, error = YearService.create_year(data)

        assert success is True
        assert year is not None
        assert error is None
        assert year.name == '2024 Competition Season'

    def test_create_year_invalid_dates(self):
        """Test year creation with invalid date range"""
        data = {
            'name': 'Invalid Year',
            'year': 2024,
            'start_date': date(2024, 12, 31),
            'end_date': date(2024, 1, 1),  # Before start
            'status': 'PENDING'
        }
        success, year, error = YearService.create_year(data)

        assert success is False
        assert year is None
        assert error is not None

        assert 'end date' in error.lower()

    def test_update_year_success(self):
        """Test successful year update"""
        year = Year.objects.create(
            name="Original Name",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.PENDING
        )

        success, updated_year, error = YearService.update_year(
            str(year.id),
            {'name': 'Updated Name', 'status': 'ACTIVE'}
        )

        assert success is True
        assert updated_year.name == 'Updated Name'
        assert updated_year.status == YearStatus.ACTIVE

    def test_get_active_year(self):
        """Test retrieving the active year"""
        # Create multiple years, one active
        Year.objects.create(
            name="Pending Year",
            year=2023,
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            status=YearStatus.PENDING
        )

        active_year = Year.objects.create(
            name="Active Year",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.ACTIVE
        )

        result = YearService.get_active_year()
        assert result is not None
        assert result.id == active_year.id

    def test_set_year_active(self):
        """Test activating a year (should deactivate others)"""
        year1 = Year.objects.create(
            name="Year 1",
            year=2023,
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            status=YearStatus.ACTIVE
        )

        year2 = Year.objects.create(
            name="Year 2",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.PENDING
        )

        # Activate year2
        success, activated_year, error = YearService.set_year_active(str(year2.id))

        assert success is True
        assert activated_year.status == YearStatus.ACTIVE

        # Verify year1 was deactivated
        year1.refresh_from_db()
        assert year1.status == YearStatus.COMPLETE

    def test_open_close_registration(self):
        """Test opening and closing registration"""
        year = Year.objects.create(
            name="Test Year",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            is_registration_open=False
        )

        # Open registration
        success, updated_year, error = YearService.open_registration(str(year.id))
        assert success is True
        assert updated_year.is_registration_open is True

        # Close registration
        success, updated_year, error = YearService.close_registration(str(year.id))
        assert success is True
        assert updated_year.is_registration_open is False

    def test_delete_year(self):
        """Test deleting a year"""
        year = Year.objects.create(
            name="To Delete",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31)
        )

        year_id = str(year.id)
        success, error = YearService.delete_year(year_id)

        assert success is True
        assert error is None
        assert not Year.objects.filter(id=year_id).exists()

    def test_get_years_with_filters(self):
        """Test getting years with filters"""
        # Create test data
        Year.objects.create(
            name="Active 2024",
            year=2024,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status=YearStatus.ACTIVE,
            is_registration_open=True
        )

        Year.objects.create(
            name="Pending 2025",
            year=2025,
            start_date=date(2025, 1, 1),
            end_date=date(2025, 12, 31),
            status=YearStatus.PENDING,
            is_registration_open=False
        )

        # Filter by status
        count, results = YearService.get_years(filters={'status': 'ACTIVE'})
        assert count == 1
        assert results[0].status == YearStatus.ACTIVE

        # Filter by year
        count, results = YearService.get_years(filters={'year': 2025})
        assert count == 1
        assert results[0].year == 2025

        # Filter by registration status
        count, results = YearService.get_years(filters={'is_registration_open': True})
        assert count == 1
        assert results[0].is_registration_open is True

