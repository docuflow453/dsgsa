from typing import Tuple, Optional, Dict, Any
from django.core.exceptions import ValidationError
from django.db.models import Q
from apps.clubs.models import Club, ClubStatus
from apps.common.models import Province


class ClubService:
    """Service class for Club business logic"""
    
    @staticmethod
    def create_club(data: Dict[str, Any]) -> Tuple[bool, Optional[Club], Optional[str]]:
        """
        Create a new Club
        
        Args:
            data: Dictionary containing club data
            
        Returns:
            Tuple of (success, club, error_message)
        """
        try:
            # Validate province exists
            province_id = data.get('province_id')
            if not province_id:
                return False, None, "Province is required"
            
            try:
                province = Province.objects.get(id=province_id)
            except Province.DoesNotExist:
                return False, None, f"Province with ID {province_id} not found"
            
            # Create the club
            club_data = {**data}
            club_data.pop('province_id', None)
            
            club = Club.objects.create(
                province=province,
                **club_data
            )
            
            return True, club, None
            
        except ValidationError as e:
            if hasattr(e, 'message_dict'):
                error_msg = "; ".join([f"{k}: {', '.join(v)}" for k, v in e.message_dict.items()])
                return False, None, f"Validation error: {error_msg}"
            else:
                return False, None, f"Validation error: {str(e)}"
        except Exception as e:
            return False, None, f"Failed to create club: {str(e)}"
    
    @staticmethod
    def get_club(club_id: str) -> Tuple[bool, Optional[Club], Optional[str]]:
        """
        Get a Club by ID
        
        Args:
            club_id: UUID of the club
            
        Returns:
            Tuple of (success, club, error_message)
        """
        try:
            club = Club.objects.select_related('province').get(id=club_id)
            return True, club, None
        except Club.DoesNotExist:
            return False, None, f"Club with ID {club_id} not found"
        except Exception as e:
            return False, None, f"Failed to get club: {str(e)}"
    
    @staticmethod
    def update_club(
        club_id: str,
        data: Dict[str, Any]
    ) -> Tuple[bool, Optional[Club], Optional[str]]:
        """
        Update a Club
        
        Args:
            club_id: UUID of the club
            data: Dictionary containing updated fields
            
        Returns:
            Tuple of (success, club, error_message)
        """
        try:
            club = Club.objects.get(id=club_id)
            
            # Handle province update if provided
            if 'province_id' in data:
                province_id = data.pop('province_id')
                try:
                    province = Province.objects.get(id=province_id)
                    club.province = province
                except Province.DoesNotExist:
                    return False, None, f"Province with ID {province_id} not found"
            
            # Update other fields
            for field, value in data.items():
                if hasattr(club, field):
                    setattr(club, field, value)
            
            club.save()
            club.refresh_from_db()
            
            return True, club, None
            
        except Club.DoesNotExist:
            return False, None, f"Club with ID {club_id} not found"
        except ValidationError as e:
            if hasattr(e, 'message_dict'):
                error_msg = "; ".join([f"{k}: {', '.join(v)}" for k, v in e.message_dict.items()])
                return False, None, f"Validation error: {error_msg}"
            else:
                return False, None, f"Validation error: {str(e)}"
        except Exception as e:
            return False, None, f"Failed to update club: {str(e)}"
    
    @staticmethod
    def delete_club(club_id: str) -> Tuple[bool, Optional[Club], Optional[str]]:
        """
        Soft delete a Club by setting status to INACTIVE
        
        Args:
            club_id: UUID of the club
            
        Returns:
            Tuple of (success, club, error_message)
        """
        try:
            club = Club.objects.get(id=club_id)
            club.status = ClubStatus.INACTIVE
            club.save()
            
            return True, club, None
            
        except Club.DoesNotExist:
            return False, None, f"Club with ID {club_id} not found"
        except Exception as e:
            return False, None, f"Failed to delete club: {str(e)}"
    
    @staticmethod
    def get_clubs(
        name: Optional[str] = None,
        status: Optional[str] = None,
        is_active: Optional[bool] = None,
        province_id: Optional[str] = None,
        country: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
        """
        Get a list of Clubs with optional filters
        
        Returns:
            Tuple of (success, result_dict, error_message)
        """
        try:
            queryset = Club.objects.select_related('province').all()

            # Apply filters
            if name:
                queryset = queryset.filter(name__icontains=name)

            if status:
                queryset = queryset.filter(status=status)

            if is_active is not None:
                target_status = ClubStatus.ACTIVE if is_active else ClubStatus.INACTIVE
                queryset = queryset.filter(status=target_status)

            if province_id:
                queryset = queryset.filter(province_id=province_id)

            if country:
                queryset = queryset.filter(country=country)

            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) |
                    Q(email__icontains=search) |
                    Q(city__icontains=search) |
                    Q(registration_number__icontains=search)
                )

            # Get total count
            total_count = queryset.count()

            # Apply pagination
            clubs = list(queryset[skip:skip + limit])

            return True, {
                'items': clubs,
                'total': total_count,
                'skip': skip,
                'limit': limit,
                'count': len(clubs)
            }, None

        except Exception as e:
            return False, None, f"Failed to get clubs: {str(e)}"

