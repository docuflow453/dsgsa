from typing import Tuple, Optional, List
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models import Q

from apps.memberships.models import Membership, Subscription
from apps.years.models import Year


class MembershipService:
    """Service class for membership business logic"""

    @staticmethod
    def create_membership(data: dict) -> Tuple[bool, Optional[Membership], Optional[str]]:
        """
        Create a new membership type.

        Args:
            data: Dictionary containing membership data

        Returns:
            Tuple of (success, membership, error_message)
        """
        try:
            membership = Membership(
                name=data.get('name'),
                description=data.get('description'),
                is_active=data.get('is_active', False),
                notes=data.get('notes', '')
            )
            membership.save()
            return True, membership, None
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"Membership with name '{data.get('name')}' already exists"
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def update_membership(membership_id: str, data: dict) -> Tuple[bool, Optional[Membership], Optional[str]]:
        """
        Update a membership type.

        Args:
            membership_id: UUID of the membership to update
            data: Dictionary containing fields to update

        Returns:
            Tuple of (success, membership, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)

            # Update fields if provided
            if 'name' in data and data['name'] is not None:
                membership.name = data['name']
            if 'description' in data and data['description'] is not None:
                membership.description = data['description']
            if 'is_active' in data and data['is_active'] is not None:
                membership.is_active = data['is_active']
            if 'notes' in data and data['notes'] is not None:
                membership.notes = data['notes']

            membership.save()
            return True, membership, None
        except Membership.DoesNotExist:
            return False, None, f"Membership with id {membership_id} not found"
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"Membership with name '{data.get('name')}' already exists"
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def delete_membership(membership_id: str) -> Tuple[bool, Optional[str]]:
        """
        Delete a membership type.

        Args:
            membership_id: UUID of the membership to delete

        Returns:
            Tuple of (success, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.delete()
            return True, None
        except Membership.DoesNotExist:
            return False, f"Membership with id {membership_id} not found"
        except Exception as e:
            return False, str(e)

    @staticmethod
    def get_membership(membership_id: str) -> Optional[Membership]:
        """
        Get a single membership by ID.

        Args:
            membership_id: UUID of the membership

        Returns:
            Membership instance or None
        """
        try:
            return Membership.objects.get(id=membership_id)
        except Membership.DoesNotExist:
            return None

    @staticmethod
    def get_memberships(
        filters: Optional[dict] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Tuple[int, List[Membership]]:
        """
        Get a list of memberships with optional filtering.

        Args:
            filters: Optional dictionary of filters (name, is_active)
            limit: Maximum number of results
            offset: Pagination offset

        Returns:
            Tuple of (total_count, memberships_list)
        """
        queryset = Membership.objects.all()

        if filters:
            # Filter by name (case-insensitive contains)
            if 'name' in filters and filters['name']:
                queryset = queryset.filter(name__icontains=filters['name'])

            # Filter by active status
            if 'is_active' in filters and filters['is_active'] is not None:
                queryset = queryset.filter(is_active=filters['is_active'])

        total_count = queryset.count()
        memberships = list(queryset[offset:offset + limit])

        return total_count, memberships

    @staticmethod
    def get_active_memberships() -> List[Membership]:
        """
        Get all active memberships.

        Returns:
            List of active Membership instances
        """
        return list(Membership.objects.filter(is_active=True))

    @staticmethod
    def activate_membership(membership_id: str) -> Tuple[bool, Optional[Membership], Optional[str]]:
        """
        Activate a membership type.

        Args:
            membership_id: UUID of the membership to activate

        Returns:
            Tuple of (success, membership, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.is_active = True
            membership.save()
            return True, membership, None
        except Membership.DoesNotExist:
            return False, None, f"Membership with id {membership_id} not found"
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def deactivate_membership(membership_id: str) -> Tuple[bool, Optional[Membership], Optional[str]]:
        """
        Deactivate a membership type.

        Args:
            membership_id: UUID of the membership to deactivate

        Returns:
            Tuple of (success, membership, error_message)
        """
        try:
            membership = Membership.objects.get(id=membership_id)
            membership.is_active = False
            membership.save()
            return True, membership, None
        except Membership.DoesNotExist:
            return False, None, f"Membership with id {membership_id} not found"
        except Exception as e:
            return False, None, str(e)



class SubscriptionService:
    """Service class for subscription business logic"""

    @staticmethod
    def create_subscription(data: dict) -> Tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Create a new subscription.

        Args:
            data: Dictionary containing subscription data

        Returns:
            Tuple of (success, subscription, error_message)
        """
        try:
            # Validate membership exists
            try:
                membership = Membership.objects.get(id=data.get('membership_id'))
            except Membership.DoesNotExist:
                return False, None, f"Membership with id {data.get('membership_id')} not found"

            # Validate year exists
            try:
                year = Year.objects.get(id=data.get('year_id'))
            except Year.DoesNotExist:
                return False, None, f"Year with id {data.get('year_id')} not found"

            subscription = Subscription(
                name=data.get('name'),
                description=data.get('description'),
                membership=membership,
                year=year,
                fee=data.get('fee'),
                is_recreational=data.get('is_recreational', False),
                is_active=data.get('is_active', False),
                notes=data.get('notes', '')
            )
            subscription.save()
            return True, subscription, None
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"Subscription for this membership, year, and type already exists"
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def update_subscription(subscription_id: str, data: dict) -> Tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Update a subscription.

        Args:
            subscription_id: UUID of the subscription to update
            data: Dictionary containing fields to update

        Returns:
            Tuple of (success, subscription, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)

            # Update fields if provided
            if 'name' in data and data['name'] is not None:
                subscription.name = data['name']
            if 'description' in data and data['description'] is not None:
                subscription.description = data['description']
            if 'membership_id' in data and data['membership_id'] is not None:
                try:
                    membership = Membership.objects.get(id=data['membership_id'])
                    subscription.membership = membership
                except Membership.DoesNotExist:
                    return False, None, f"Membership with id {data['membership_id']} not found"
            if 'year_id' in data and data['year_id'] is not None:
                try:
                    year = Year.objects.get(id=data['year_id'])
                    subscription.year = year
                except Year.DoesNotExist:
                    return False, None, f"Year with id {data['year_id']} not found"
            if 'fee' in data and data['fee'] is not None:
                subscription.fee = data['fee']
            if 'is_recreational' in data and data['is_recreational'] is not None:
                subscription.is_recreational = data['is_recreational']
            if 'is_active' in data and data['is_active'] is not None:
                subscription.is_active = data['is_active']
            if 'notes' in data and data['notes'] is not None:
                subscription.notes = data['notes']

            subscription.save()
            return True, subscription, None
        except Subscription.DoesNotExist:
            return False, None, f"Subscription with id {subscription_id} not found"
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, f"Subscription for this membership, year, and type already exists"
            return False, None, str(e)
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def delete_subscription(subscription_id: str) -> Tuple[bool, Optional[str]]:
        """
        Delete a subscription.

        Args:
            subscription_id: UUID of the subscription to delete

        Returns:
            Tuple of (success, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.delete()
            return True, None
        except Subscription.DoesNotExist:
            return False, f"Subscription with id {subscription_id} not found"
        except Exception as e:
            return False, str(e)

    @staticmethod
    def get_subscription(subscription_id: str) -> Optional[Subscription]:
        """
        Get a single subscription by ID.

        Args:
            subscription_id: UUID of the subscription

        Returns:
            Subscription instance or None
        """
        try:
            return Subscription.objects.select_related('membership', 'year').get(id=subscription_id)
        except Subscription.DoesNotExist:
            return None

    @staticmethod
    def get_subscriptions(
        filters: Optional[dict] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Tuple[int, List[Subscription]]:
        """
        Get a list of subscriptions with optional filtering.

        Args:
            filters: Optional dictionary of filters
            limit: Maximum number of results
            offset: Pagination offset

        Returns:
            Tuple of (total_count, subscriptions_list)
        """
        queryset = Subscription.objects.select_related('membership', 'year').all()

        if filters:
            # Filter by name (case-insensitive contains)
            if 'name' in filters and filters['name']:
                queryset = queryset.filter(name__icontains=filters['name'])

            # Filter by membership
            if 'membership_id' in filters and filters['membership_id']:
                queryset = queryset.filter(membership_id=filters['membership_id'])

            # Filter by year
            if 'year_id' in filters and filters['year_id']:
                queryset = queryset.filter(year_id=filters['year_id'])

            # Filter by active status
            if 'is_active' in filters and filters['is_active'] is not None:
                queryset = queryset.filter(is_active=filters['is_active'])

            # Filter by recreational status
            if 'is_recreational' in filters and filters['is_recreational'] is not None:
                queryset = queryset.filter(is_recreational=filters['is_recreational'])

        total_count = queryset.count()
        subscriptions = list(queryset[offset:offset + limit])

        return total_count, subscriptions

    @staticmethod
    def get_active_subscriptions() -> List[Subscription]:
        """
        Get all active subscriptions.

        Returns:
            List of active Subscription instances
        """
        return list(Subscription.objects.select_related('membership', 'year').filter(is_active=True))

    @staticmethod
    def activate_subscription(subscription_id: str) -> Tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Activate a subscription.

        Args:
            subscription_id: UUID of the subscription to activate

        Returns:
            Tuple of (success, subscription, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.is_active = True
            subscription.save()
            return True, subscription, None
        except Subscription.DoesNotExist:
            return False, None, f"Subscription with id {subscription_id} not found"
        except Exception as e:
            return False, None, str(e)

    @staticmethod
    def deactivate_subscription(subscription_id: str) -> Tuple[bool, Optional[Subscription], Optional[str]]:
        """
        Deactivate a subscription.

        Args:
            subscription_id: UUID of the subscription to deactivate

        Returns:
            Tuple of (success, subscription, error_message)
        """
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.is_active = False
            subscription.save()
            return True, subscription, None
        except Subscription.DoesNotExist:
            return False, None, f"Subscription with id {subscription_id} not found"
        except Exception as e:
            return False, None, str(e)

