from typing import Optional, List, Tuple, Dict, Any
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Year, YearStatus


class YearService:
    """Service class for Year CRUD operations and business logic"""

    @classmethod
    def create_year(cls, data: Dict[str, Any]) -> Tuple[bool, Optional[Year], Optional[str]]:
        """
        Create a new year with validation.

        Args:
            data: Dictionary containing year data

        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            # Validate date constraint
            if data.get('end_date') and data.get('start_date'):
                if data['end_date'] < data['start_date']:
                    return False, None, "End date must be on or after the start date"

            # Check for duplicate year number
            if Year.objects.filter(year=data['year']).exists():
                existing_year = Year.objects.filter(year=data['year']).first()
                # Allow if it's archived
                if existing_year.status != YearStatus.ARCHIVED:
                    return False, None, f"A year for {data['year']} already exists"

            # Create year
            with transaction.atomic():
                year = Year.objects.create(
                    name=data['name'],
                    year=data['year'],
                    start_date=data['start_date'],
                    end_date=data['end_date'],
                    is_registration_open=data.get('is_registration_open', False),
                    status=data.get('status', 'PENDING'),
                    notes=data.get('notes', ''),
                )

            return True, year, None

        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def update_year(cls, year_id: str, data: Dict[str, Any]) -> Tuple[bool, Optional[Year], Optional[str]]:
        """
        Update an existing year.

        Args:
            year_id: UUID of the year to update
            data: Dictionary containing fields to update

        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)

            # Validate date constraint if dates are being updated
            start_date = data.get('start_date', year.start_date)
            end_date = data.get('end_date', year.end_date)

            if end_date < start_date:
                return False, None, "End date must be on or after the start date"

            # Update simple fields
            for field in ['name', 'year', 'start_date', 'end_date',
                         'is_registration_open', 'status', 'notes']:
                if field in data:
                    setattr(year, field, data[field])

            year.save()
            return True, year, None

        except Year.DoesNotExist:
            return False, None, "Year not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def delete_year(cls, year_id: str) -> Tuple[bool, Optional[str]]:
        """
        Delete a year.

        Args:
            year_id: UUID of the year to delete

        Returns:
            Tuple of (success, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year.delete()
            return True, None
        except Year.DoesNotExist:
            return False, "Year not found"
        except Exception as e:
            return False, str(e)

    @classmethod
    def get_year(cls, year_id: str) -> Optional[Year]:
        """Get a year by ID"""
        try:
            return Year.objects.get(id=year_id)
        except Year.DoesNotExist:
            return None

    @classmethod
    def get_years(cls, filters: Dict[str, Any] = None, limit: int = 100, offset: int = 0) -> Tuple[int, List[Year]]:
        """
        Get all years with optional filtering and pagination.

        Args:
            filters: Optional filters to apply
            limit: Maximum number of results
            offset: Pagination offset

        Returns:
            Tuple of (total_count, year_list)
        """
        queryset = Year.objects.all()

        if filters:
            if 'status' in filters and filters['status']:
                queryset = queryset.filter(status=filters['status'])
            if 'year' in filters and filters['year']:
                queryset = queryset.filter(year=filters['year'])
            if 'is_registration_open' in filters and filters['is_registration_open'] is not None:
                queryset = queryset.filter(is_registration_open=filters['is_registration_open'])

        total_count = queryset.count()
        results = list(queryset[offset:offset + limit])

        return total_count, results




    @classmethod
    def get_active_year(cls) -> Optional[Year]:
        """
        Get the currently active year.

        Returns:
            The active year or None if no year is active
        """
        try:
            return Year.objects.get(status=YearStatus.ACTIVE)
        except Year.DoesNotExist:
            return None
        except Year.MultipleObjectsReturned:
            # If multiple active years exist (shouldn't happen), return the first
            return Year.objects.filter(status=YearStatus.ACTIVE).first()

    @classmethod
    def set_year_active(cls, year_id: str) -> Tuple[bool, Optional[Year], Optional[str]]:
        """
        Activate a specific year and deactivate all others.

        Args:
            year_id: UUID of the year to activate

        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)

            with transaction.atomic():
                # Deactivate all other years
                Year.objects.exclude(id=year_id).update(status=YearStatus.COMPLETE)

                # Activate the selected year
                year.status = YearStatus.ACTIVE
                year.save()

            return True, year, None

        except Year.DoesNotExist:
            return False, None, "Year not found"
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def open_registration(cls, year_id: str) -> Tuple[bool, Optional[Year], Optional[str]]:
        """
        Open registration for a specific year.

        Args:
            year_id: UUID of the year

        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year.is_registration_open = True
            year.save()
            return True, year, None

        except Year.DoesNotExist:
            return False, None, "Year not found"
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def close_registration(cls, year_id: str) -> Tuple[bool, Optional[Year], Optional[str]]:
        """
        Close registration for a specific year.

        Args:
            year_id: UUID of the year

        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year.is_registration_open = False
            year.save()
            return True, year, None

        except Year.DoesNotExist:
            return False, None, "Year not found"
        except Exception as e:
            return False, None, str(e)
