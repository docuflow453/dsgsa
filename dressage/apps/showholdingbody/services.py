from typing import Tuple, Optional, Dict, Any
from django.core.exceptions import ValidationError
from django.db.models import Q
from apps.showholdingbody.models import ShowHoldingBody, ShowHoldingBodyStatus
from apps.common.models import Province


class ShowHoldingBodyService:
    """Service class for Show Holding Body business logic"""
    
    @staticmethod
    def create_show_holding_body(data: Dict[str, Any]) -> Tuple[bool, Optional[ShowHoldingBody], Optional[str]]:
        """
        Create a new Show Holding Body
        
        Args:
            data: Dictionary containing show holding body data
            
        Returns:
            Tuple of (success, show_holding_body, error_message)
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
            
            # Create the show holding body
            show_holding_body_data = {**data}
            show_holding_body_data.pop('province_id', None)
            
            show_holding_body = ShowHoldingBody.objects.create(
                province=province,
                **show_holding_body_data
            )
            
            return True, show_holding_body, None
            
        except ValidationError as e:
            if hasattr(e, 'message_dict'):
                error_msg = "; ".join([f"{k}: {', '.join(v)}" for k, v in e.message_dict.items()])
                return False, None, f"Validation error: {error_msg}"
            else:
                return False, None, f"Validation error: {str(e)}"
        except Exception as e:
            return False, None, f"Failed to create show holding body: {str(e)}"
    
    @staticmethod
    def get_show_holding_body(show_holding_body_id: str) -> Tuple[bool, Optional[ShowHoldingBody], Optional[str]]:
        """
        Get a Show Holding Body by ID
        
        Args:
            show_holding_body_id: UUID of the show holding body
            
        Returns:
            Tuple of (success, show_holding_body, error_message)
        """
        try:
            show_holding_body = ShowHoldingBody.objects.select_related('province').get(id=show_holding_body_id)
            return True, show_holding_body, None
        except ShowHoldingBody.DoesNotExist:
            return False, None, f"Show Holding Body with ID {show_holding_body_id} not found"
        except Exception as e:
            return False, None, f"Failed to get show holding body: {str(e)}"
    
    @staticmethod
    def update_show_holding_body(
        show_holding_body_id: str,
        data: Dict[str, Any]
    ) -> Tuple[bool, Optional[ShowHoldingBody], Optional[str]]:
        """
        Update a Show Holding Body
        
        Args:
            show_holding_body_id: UUID of the show holding body
            data: Dictionary containing updated fields
            
        Returns:
            Tuple of (success, show_holding_body, error_message)
        """
        try:
            show_holding_body = ShowHoldingBody.objects.get(id=show_holding_body_id)
            
            # Handle province update if provided
            if 'province_id' in data:
                province_id = data.pop('province_id')
                try:
                    province = Province.objects.get(id=province_id)
                    show_holding_body.province = province
                except Province.DoesNotExist:
                    return False, None, f"Province with ID {province_id} not found"
            
            # Update other fields
            for field, value in data.items():
                if hasattr(show_holding_body, field):
                    setattr(show_holding_body, field, value)
            
            show_holding_body.save()
            show_holding_body.refresh_from_db()
            
            return True, show_holding_body, None
            
        except ShowHoldingBody.DoesNotExist:
            return False, None, f"Show Holding Body with ID {show_holding_body_id} not found"
        except ValidationError as e:
            if hasattr(e, 'message_dict'):
                error_msg = "; ".join([f"{k}: {', '.join(v)}" for k, v in e.message_dict.items()])
                return False, None, f"Validation error: {error_msg}"
            else:
                return False, None, f"Validation error: {str(e)}"
        except Exception as e:
            return False, None, f"Failed to update show holding body: {str(e)}"
    
    @staticmethod
    def delete_show_holding_body(show_holding_body_id: str) -> Tuple[bool, Optional[ShowHoldingBody], Optional[str]]:
        """
        Soft delete a Show Holding Body by setting status to INACTIVE
        
        Args:
            show_holding_body_id: UUID of the show holding body
            
        Returns:
            Tuple of (success, show_holding_body, error_message)
        """
        try:
            show_holding_body = ShowHoldingBody.objects.get(id=show_holding_body_id)
            show_holding_body.status = ShowHoldingBodyStatus.INACTIVE
            show_holding_body.save()
            
            return True, show_holding_body, None
            
        except ShowHoldingBody.DoesNotExist:
            return False, None, f"Show Holding Body with ID {show_holding_body_id} not found"
        except Exception as e:
            return False, None, f"Failed to delete show holding body: {str(e)}"
    
    @staticmethod
    def get_show_holding_bodies(
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
        Get a list of Show Holding Bodies with optional filters
        
        Returns:
            Tuple of (success, result_dict, error_message)
        """
        try:
            queryset = ShowHoldingBody.objects.select_related('province').all()

            # Apply filters
            if name:
                queryset = queryset.filter(name__icontains=name)

            if status:
                queryset = queryset.filter(status=status)

            if is_active is not None:
                target_status = ShowHoldingBodyStatus.ACTIVE if is_active else ShowHoldingBodyStatus.INACTIVE
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
            show_holding_bodies = list(queryset[skip:skip + limit])

            return True, {
                'items': show_holding_bodies,
                'total': total_count,
                'skip': skip,
                'limit': limit,
                'count': len(show_holding_bodies)
            }, None

        except Exception as e:
            return False, None, f"Failed to get show holding bodies: {str(e)}"

