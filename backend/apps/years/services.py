from typing import Optional, Dict, Any
from django.core.exceptions import ValidationError
from django.db import transaction
from .models import Year, YearStatus


class YearService:
    """Service class for Year-related business logic."""
    
    @staticmethod
    def create_year(data: Dict[str, Any]) -> tuple[bool, Optional[Year], Optional[str]]:
        """
        Create a new competition year.
        
        Args:
            data: Dictionary containing year data
            
        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            with transaction.atomic():
                year = Year.objects.create(**data)
                return True, year, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error creating year: {str(e)}"
    
    @staticmethod
    def update_year(year_id: int, data: Dict[str, Any]) -> tuple[bool, Optional[Year], Optional[str]]:
        """
        Update an existing competition year.
        
        Args:
            year_id: ID of the year to update
            data: Dictionary containing updated fields
            
        Returns:
            Tuple of (success, year_instance, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            
            # Update fields
            for field, value in data.items():
                if hasattr(year, field):
                    setattr(year, field, value)
            
            year.save()
            return True, year, None
            
        except Year.DoesNotExist:
            return False, None, "Year not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error updating year: {str(e)}"
    
    @staticmethod
    def delete_year(year_id: int) -> tuple[bool, Optional[str]]:
        """
        Delete a competition year.
        
        Args:
            year_id: ID of the year to delete
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year_name = year.name
            year.delete()
            return True, None
        except Year.DoesNotExist:
            return False, "Year not found"
        except Exception as e:
            return False, f"Error deleting year: {str(e)}"
    
    @staticmethod
    def get_active_year() -> Optional[Year]:
        """
        Get the currently active competition year.
        
        Returns:
            Active Year instance or None
        """
        return Year.objects.filter(status=YearStatus.ACTIVE).first()
    
    @staticmethod
    def set_year_active(year_id: int, deactivate_others: bool = True) -> tuple[bool, Optional[str]]:
        """
        Set a year as active, optionally deactivating all other years.
        
        Args:
            year_id: ID of the year to activate
            deactivate_others: Whether to deactivate other years
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            with transaction.atomic():
                year = Year.objects.get(id=year_id)
                
                if deactivate_others:
                    # Deactivate all other years
                    Year.objects.filter(status=YearStatus.ACTIVE).exclude(id=year_id).update(
                        status=YearStatus.COMPLETE
                    )
                
                year.status = YearStatus.ACTIVE
                year.save()
                
                return True, None
                
        except Year.DoesNotExist:
            return False, "Year not found"
        except Exception as e:
            return False, f"Error activating year: {str(e)}"
    
    @staticmethod
    def open_registration(year_id: int) -> tuple[bool, Optional[str]]:
        """
        Open registration for a year.
        
        Args:
            year_id: ID of the year
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year.is_registration_open = True
            year.save()
            return True, None
        except Year.DoesNotExist:
            return False, "Year not found"
        except Exception as e:
            return False, f"Error opening registration: {str(e)}"
    
    @staticmethod
    def close_registration(year_id: int) -> tuple[bool, Optional[str]]:
        """
        Close registration for a year.
        
        Args:
            year_id: ID of the year
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            year = Year.objects.get(id=year_id)
            year.is_registration_open = False
            year.save()
            return True, None
        except Year.DoesNotExist:
            return False, "Year not found"
        except Exception as e:
            return False, f"Error closing registration: {str(e)}"

