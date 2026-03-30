from typing import Optional, Dict, Any
from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError
from .models import Membership, Subscription
from backend.apps.years.models import Year


class MembershipService:
    """Service class for Membership-related business logic."""
    
    @staticmethod
    def create_membership(data: Dict[str, Any]) -> tuple[bool, Optional[Membership], Optional[str]]:
        """
        Create a new membership type.
        
        Args:
            data: Dictionary containing membership data
            
        Returns:
            Tuple of (success, membership_instance, error_message)
        """
        try:
            with transaction.atomic():
                membership = Membership.objects.create(**data)
                return True, membership, None
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"A membership with this name already exists"
            return False, None, str(e)
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error creating membership: {str(e)}"
    
    @staticmethod
    def update_membership(membership_id: int, data: Dict[str, Any]) -> tuple[bool, Optional[Membership], Optional[str]]:
        """
        Update an existing membership type.
        
        Args:
            membership_id: ID of the membership to update
            data: Dictionary containing updated fields
            
        Returns:
            Tuple of (success, membership_instance, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            
            # Update fields
            for field, value in data.items():
                if hasattr(membership, field):
                    setattr(membership, field, value)
            
            membership.save()
            return True, membership, None
            
        except Membership.DoesNotExist:
            return False, None, "Membership not found"
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"A membership with this name already exists"
            return False, None, str(e)
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error updating membership: {str(e)}"
    
    @staticmethod
    def delete_membership(membership_id: int) -> tuple[bool, Optional[str]]:
        """
        Delete a membership type.
        
        Args:
            membership_id: ID of the membership to delete
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.delete()
            return True, None
        except Membership.DoesNotExist:
            return False, "Membership not found"
        except Exception as e:
            return False, f"Error deleting membership: {str(e)}"
    
    @staticmethod
    def get_active_memberships():
        """
        Get all active membership types.
        
        Returns:
            QuerySet of active memberships
        """
        return Membership.objects.filter(is_active=True)
    
    @staticmethod
    def activate_membership(membership_id: int) -> tuple[bool, Optional[str]]:
        """
        Activate a membership type.
        
        Args:
            membership_id: ID of the membership
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.is_active = True
            membership.save()
            return True, None
        except Membership.DoesNotExist:
            return False, "Membership not found"
        except Exception as e:
            return False, f"Error activating membership: {str(e)}"
    
    @staticmethod
    def deactivate_membership(membership_id: int) -> tuple[bool, Optional[str]]:
        """
        Deactivate a membership type.
        
        Args:
            membership_id: ID of the membership
            
        Returns:
            Tuple of (success, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.is_active = False
            membership.save()
            return True, None
        except Membership.DoesNotExist:
            return False, "Membership not found"
        except Exception as e:
            return False, f"Error deactivating membership: {str(e)}"


class SubscriptionService:
    """Service class for Subscription-related business logic."""

    @staticmethod
    def create_subscription(data: Dict[str, Any]) -> tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Create a new subscription.

        Args:
            data: Dictionary containing subscription data

        Returns:
            Tuple of (success, subscription_instance, error_message)
        """
        try:
            # Validate that Year exists
            if 'year_id' in data:
                try:
                    Year.objects.get(id=data['year_id'])
                except Year.DoesNotExist:
                    return False, None, "Year not found"
            elif 'year' in data:
                # If year object is passed directly
                pass
            else:
                return False, None, "Year is required"

            # Validate that Membership exists
            if 'membership_id' in data:
                try:
                    Membership.objects.get(id=data['membership_id'])
                except Membership.DoesNotExist:
                    return False, None, "Membership not found"
            elif 'membership' in data:
                # If membership object is passed directly
                pass
            else:
                return False, None, "Membership is required"

            with transaction.atomic():
                subscription = Subscription.objects.create(**data)
                return True, subscription, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error creating subscription: {str(e)}"

    @staticmethod
    def update_subscription(subscription_id: int, data: Dict[str, Any]) -> tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Update an existing subscription.

        Args:
            subscription_id: ID of the subscription to update
            data: Dictionary containing updated fields

        Returns:
            Tuple of (success, subscription_instance, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)

            # Validate Year if being updated
            if 'year_id' in data:
                try:
                    Year.objects.get(id=data['year_id'])
                except Year.DoesNotExist:
                    return False, None, "Year not found"

            # Validate Membership if being updated
            if 'membership_id' in data:
                try:
                    Membership.objects.get(id=data['membership_id'])
                except Membership.DoesNotExist:
                    return False, None, "Membership not found"

            # Update fields
            for field, value in data.items():
                if hasattr(subscription, field):
                    setattr(subscription, field, value)

            subscription.save()
            return True, subscription, None

        except Subscription.DoesNotExist:
            return False, None, "Subscription not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Error updating subscription: {str(e)}"

    @staticmethod
    def delete_subscription(subscription_id: int) -> tuple[bool, Optional[str]]:
        """
        Delete a subscription.

        Args:
            subscription_id: ID of the subscription to delete

        Returns:
            Tuple of (success, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.delete()
            return True, None
        except Subscription.DoesNotExist:
            return False, "Subscription not found"
        except Exception as e:
            return False, f"Error deleting subscription: {str(e)}"

    @staticmethod
    def get_active_subscriptions():
        """
        Get all active subscriptions.

        Returns:
            QuerySet of active subscriptions
        """
        return Subscription.objects.filter(is_active=True).select_related('year', 'membership')

    @staticmethod
    def get_subscriptions_by_year(year_id: int):
        """
        Get all subscriptions for a specific year.

        Args:
            year_id: ID of the year

        Returns:
            QuerySet of subscriptions
        """
        return Subscription.objects.filter(year_id=year_id).select_related('year', 'membership')

    @staticmethod
    def get_subscriptions_by_membership(membership_id: int):
        """
        Get all subscriptions for a specific membership type.

        Args:
            membership_id: ID of the membership

        Returns:
            QuerySet of subscriptions
        """
        return Subscription.objects.filter(membership_id=membership_id).select_related('year', 'membership')

