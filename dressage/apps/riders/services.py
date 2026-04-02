"""
Service layer for Rider business logic.

All service methods return tuples: (success: bool, result: any, error: str|None)
"""
from typing import Tuple, Any, Optional
from uuid import UUID
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.db.models import Q

from apps.riders.models import (
    Rider, RiderAccount, SaefMembership, RiderClub, RiderShowHoldingBody
)
from apps.users.models import User
from apps.years.models import Year
from apps.memberships.models import Subscription


class RiderService:
    """Service for managing rider profiles and operations"""
    
    @staticmethod
    def create_rider(data: dict) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Create a new rider profile.
        
        Args:
            data: Dictionary containing rider data including user_id
            
        Returns:
            (success, rider, error_message)
        """
        try:
            # Validate user exists
            user_id = data.get('user_id')
            if not user_id:
                return False, None, "User ID is required"
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return False, None, f"User with ID {user_id} not found"
            
            # Check if user already has a rider profile
            if hasattr(user, 'rider'):
                return False, None, "User already has a rider profile"
            
            # Validate ID or passport
            if not data.get('id_number') and not data.get('passport_number'):
                return False, None, "Either ID number or passport number must be provided"
            
            # Create rider (user_id will be replaced with user instance)
            rider_data = data.copy()
            rider_data['user'] = user
            rider_data.pop('user_id', None)
            
            rider = Rider(**rider_data)
            rider.save()
            
            return True, rider, None
            
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'user' in str(e):
                return False, None, "User already has a rider profile"
            elif 'id_number' in str(e):
                return False, None, "ID number already exists"
            elif 'passport_number' in str(e):
                return False, None, "Passport number already exists"
            elif 'saef_number' in str(e):
                return False, None, "SAEF number already exists"
            return False, None, f"Database error: {str(e)}"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"
    
    @staticmethod
    def update_rider(rider_id: UUID, data: dict) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Update an existing rider.
        
        Args:
            rider_id: UUID of the rider to update
            data: Dictionary containing fields to update
            
        Returns:
            (success, rider, error_message)
        """
        try:
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"
            
            # Update fields
            for key, value in data.items():
                if hasattr(rider, key):
                    setattr(rider, key, value)
            
            rider.save()
            return True, rider, None
            
        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'id_number' in str(e):
                return False, None, "ID number already exists"
            elif 'passport_number' in str(e):
                return False, None, "Passport number already exists"
            elif 'saef_number' in str(e):
                return False, None, "SAEF number already exists"
            return False, None, f"Database error: {str(e)}"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"
    
    @staticmethod
    def delete_rider(rider_id: UUID) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Soft delete a rider (set is_active=False).
        
        Args:
            rider_id: UUID of the rider to delete
            
        Returns:
            (success, rider, error_message)
        """
        try:
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"
            
            rider.is_active = False
            rider.save()
            return True, rider, None
            
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"
    
    @staticmethod
    def get_rider(rider_id: UUID) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Get a single rider by ID.

        Args:
            rider_id: UUID of the rider

        Returns:
            (success, rider, error_message)
        """
        try:
            rider = Rider.objects.select_related('user').get(id=rider_id)
            return True, rider, None
        except Rider.DoesNotExist:
            return False, None, f"Rider with ID {rider_id} not found"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def get_riders(filters: Optional[dict] = None, limit: int = 100, offset: int = 0) -> Tuple[bool, dict, Optional[str]]:
        """
        Get a paginated list of riders with optional filtering.

        Args:
            filters: Optional dictionary with filter parameters
            limit: Maximum number of results to return
            offset: Number of results to skip

        Returns:
            (success, {total, riders}, error_message)
        """
        try:
            queryset = Rider.objects.select_related('user').all()

            if filters:
                # Search across user name, email, and SAEF number
                if search := filters.get('search'):
                    queryset = queryset.filter(
                        Q(user__first_name__icontains=search) |
                        Q(user__last_name__icontains=search) |
                        Q(user__email__icontains=search) |
                        Q(saef_number__icontains=search)
                    )

                if (is_active := filters.get('is_active')) is not None:
                    queryset = queryset.filter(is_active=is_active)

                if nationality := filters.get('nationality'):
                    queryset = queryset.filter(nationality__icontains=nationality)

                if (is_test := filters.get('is_test')) is not None:
                    queryset = queryset.filter(is_test=is_test)

            total = queryset.count()
            riders = list(queryset[offset:offset + limit])

            return True, {'total': total, 'riders': riders}, None

        except Exception as e:
            return False, {}, f"Unexpected error: {str(e)}"

    @staticmethod
    def get_active_riders() -> Tuple[bool, list[Rider], Optional[str]]:
        """
        Get all active riders.

        Returns:
            (success, riders, error_message)
        """
        try:
            riders = list(Rider.objects.filter(is_active=True).select_related('user'))
            return True, riders, None
        except Exception as e:
            return False, [], f"Unexpected error: {str(e)}"

    @staticmethod
    def activate_rider(rider_id: UUID) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Activate a rider.

        Args:
            rider_id: UUID of the rider to activate

        Returns:
            (success, rider, error_message)
        """
        try:
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"

            rider.is_active = True
            rider.save()
            return True, rider, None

        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def deactivate_rider(rider_id: UUID) -> Tuple[bool, Optional[Rider], Optional[str]]:
        """
        Deactivate a rider.

        Args:
            rider_id: UUID of the rider to deactivate

        Returns:
            (success, rider, error_message)
        """
        try:
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"

            rider.is_active = False
            rider.save()
            return True, rider, None

        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"


class RiderAccountService:
    """Service for managing rider accounts and subscriptions"""

    @staticmethod
    def create_rider_account(data: dict) -> Tuple[bool, Optional[RiderAccount], Optional[str]]:
        """
        Create a new rider account for a specific year.

        Args:
            data: Dictionary containing rider_id, year_id, and optional subscription_id

        Returns:
            (success, rider_account, error_message)
        """
        try:
            # Validate rider exists
            rider_id = data.get('rider_id')
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"

            # Validate year exists
            year_id = data.get('year_id')
            try:
                year = Year.objects.get(id=year_id)
            except Year.DoesNotExist:
                return False, None, f"Year with ID {year_id} not found"

            # Validate subscription if provided
            subscription = None
            if subscription_id := data.get('subscription_id'):
                try:
                    subscription = Subscription.objects.get(id=subscription_id)
                    # Validate subscription is for the correct year
                    if subscription.year_id != year_id:
                        return False, None, "Subscription does not match the selected year"
                except Subscription.DoesNotExist:
                    return False, None, f"Subscription with ID {subscription_id} not found"

            # Create rider account
            rider_account = RiderAccount(
                rider=rider,
                year=year,
                subscription=subscription
            )
            rider_account.save()

            return True, rider_account, None

        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, "Rider already has an account for this year"
            return False, None, f"Database error: {str(e)}"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def update_rider_account(account_id: UUID, data: dict) -> Tuple[bool, Optional[RiderAccount], Optional[str]]:
        """
        Update a rider account.

        Args:
            account_id: UUID of the account to update
            data: Dictionary containing fields to update

        Returns:
            (success, rider_account, error_message)
        """
        try:
            try:
                account = RiderAccount.objects.get(id=account_id)
            except RiderAccount.DoesNotExist:
                return False, None, f"Rider account with ID {account_id} not found"

            # Validate subscription if updating
            if subscription_id := data.get('subscription_id'):
                try:
                    subscription = Subscription.objects.get(id=subscription_id)
                    # Validate subscription is for the correct year
                    if subscription.year_id != account.year_id:
                        return False, None, "Subscription does not match the account's year"
                    account.subscription = subscription
                except Subscription.DoesNotExist:
                    return False, None, f"Subscription with ID {subscription_id} not found"

            if (is_active := data.get('is_active')) is not None:
                account.is_active = is_active

            account.save()
            return True, account, None

        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def get_rider_accounts_by_rider(rider_id: UUID) -> Tuple[bool, list[RiderAccount], Optional[str]]:
        """
        Get all accounts for a rider.

        Args:
            rider_id: UUID of the rider

        Returns:
            (success, accounts, error_message)
        """
        try:
            accounts = list(
                RiderAccount.objects
                .filter(rider_id=rider_id)
                .select_related('rider', 'year', 'subscription')
            )
            return True, accounts, None
        except Exception as e:
            return False, [], f"Unexpected error: {str(e)}"

    @staticmethod
    def get_rider_account_for_year(rider_id: UUID, year_id: UUID) -> Tuple[bool, Optional[RiderAccount], Optional[str]]:
        """
        Get a rider's account for a specific year.

        Args:
            rider_id: UUID of the rider
            year_id: UUID of the year

        Returns:
            (success, account, error_message)
        """
        try:
            account = RiderAccount.objects.select_related('rider', 'year', 'subscription').get(
                rider_id=rider_id,
                year_id=year_id
            )
            return True, account, None
        except RiderAccount.DoesNotExist:
            return False, None, "No account found for this rider and year"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"


class RiderRegistrationService:
    """Service for handling rider registration and renewal workflows"""

    @staticmethod
    def register_rider(data: dict) -> Tuple[bool, dict, Optional[str]]:
        """
        Register a new rider with initial subscription.

        This creates:
        1. A Rider profile
        2. A RiderAccount for the selected year
        3. Links the selected subscription

        Args:
            data: Dictionary containing all registration data including user_id, rider info, and subscription_id

        Returns:
            (success, {rider, account}, error_message)
        """
        try:
            # Validate subscription and year
            subscription_id = data.get('subscription_id')
            year_id = data.get('year_id')

            if not subscription_id or not year_id:
                return False, {}, "Subscription and year are required"

            try:
                subscription = Subscription.objects.get(id=subscription_id)
            except Subscription.DoesNotExist:
                return False, {}, f"Subscription with ID {subscription_id} not found"

            try:
                year = Year.objects.get(id=year_id)
            except Year.DoesNotExist:
                return False, {}, f"Year with ID {year_id} not found"

            # Validate subscription matches year
            if subscription.year_id != year_id:
                return False, {}, "Subscription does not match the selected year"

            # Validate subscription is active
            if not subscription.is_active:
                return False, {}, "Selected subscription is not active"

            # Create rider profile
            rider_data = {
                'user_id': data.get('user_id'),
                'id_number': data.get('id_number'),
                'passport_number': data.get('passport_number'),
                'date_of_birth': data.get('date_of_birth'),
                'gender': data.get('gender'),
                'ethnicity': data.get('ethnicity'),
                'nationality': data.get('nationality'),
                'saef_number': data.get('saef_number'),
                'address_line_1': data.get('address_line_1'),
                'address_line_2': data.get('address_line_2'),
                'suburb': data.get('suburb'),
                'city': data.get('city'),
                'province': data.get('province'),
                'postal_code': data.get('postal_code'),
                'country': data.get('country'),
            }

            success, rider, error = RiderService.create_rider(rider_data)
            if not success:
                return False, {}, error

            # Create rider account with subscription
            account_data = {
                'rider_id': rider.id,
                'year_id': year_id,
                'subscription_id': subscription_id
            }

            success, account, error = RiderAccountService.create_rider_account(account_data)
            if not success:
                # Rollback: delete the rider we just created
                rider.delete()
                return False, {}, error

            return True, {'rider': rider, 'account': account}, None

        except Exception as e:
            return False, {}, f"Unexpected error: {str(e)}"

    @staticmethod
    def renew_membership(data: dict) -> Tuple[bool, Optional[RiderAccount], Optional[str]]:
        """
        Renew a rider's membership for a new year.

        Creates a new RiderAccount for the specified year with the selected subscription.

        Args:
            data: Dictionary containing rider_id, year_id, and subscription_id

        Returns:
            (success, rider_account, error_message)
        """
        try:
            rider_id = data.get('rider_id')
            year_id = data.get('year_id')
            subscription_id = data.get('subscription_id')

            if not all([rider_id, year_id, subscription_id]):
                return False, None, "Rider ID, Year ID, and Subscription ID are required"

            # Validate rider exists
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"

            # Validate subscription
            try:
                subscription = Subscription.objects.get(id=subscription_id)
            except Subscription.DoesNotExist:
                return False, None, f"Subscription with ID {subscription_id} not found"

            # Validate subscription matches year
            if subscription.year_id != year_id:
                return False, None, "Subscription does not match the selected year"

            # Validate subscription is active
            if not subscription.is_active:
                return False, None, "Selected subscription is not active"

            # Create new rider account for the year
            account_data = {
                'rider_id': rider_id,
                'year_id': year_id,
                'subscription_id': subscription_id
            }

            return RiderAccountService.create_rider_account(account_data)

        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"


class SaefMembershipService:
    """Service for managing SAEF memberships and external synchronization"""

    @staticmethod
    def create_saef_membership(data: dict) -> Tuple[bool, Optional[SaefMembership], Optional[str]]:
        """
        Create a new SAEF membership record.

        Args:
            data: Dictionary containing rider_id, membership_number, year_id, and optional expiry_date

        Returns:
            (success, saef_membership, error_message)
        """
        try:
            # Validate rider exists
            rider_id = data.get('rider_id')
            try:
                rider = Rider.objects.get(id=rider_id)
            except Rider.DoesNotExist:
                return False, None, f"Rider with ID {rider_id} not found"

            # Validate year exists
            year_id = data.get('year_id')
            try:
                year = Year.objects.get(id=year_id)
            except Year.DoesNotExist:
                return False, None, f"Year with ID {year_id} not found"

            # Create SAEF membership
            saef_membership = SaefMembership(
                rider=rider,
                membership_number=data.get('membership_number'),
                year=year,
                expiry_date=data.get('expiry_date')
            )
            saef_membership.save()

            return True, saef_membership, None

        except ValidationError as e:
            return False, None, str(e)
        except IntegrityError as e:
            if 'unique' in str(e).lower():
                return False, None, "Rider already has a SAEF membership for this year"
            return False, None, f"Database error: {str(e)}"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def update_saef_membership(membership_id: UUID, data: dict) -> Tuple[bool, Optional[SaefMembership], Optional[str]]:
        """
        Update a SAEF membership.

        Args:
            membership_id: UUID of the membership to update
            data: Dictionary containing fields to update

        Returns:
            (success, saef_membership, error_message)
        """
        try:
            try:
                membership = SaefMembership.objects.get(id=membership_id)
            except SaefMembership.DoesNotExist:
                return False, None, f"SAEF membership with ID {membership_id} not found"

            # Update fields
            for key, value in data.items():
                if hasattr(membership, key) and key not in ['id', 'rider', 'year', 'created_at']:
                    setattr(membership, key, value)

            membership.save()
            return True, membership, None

        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def get_saef_membership_for_year(rider_id: UUID, year_id: UUID) -> Tuple[bool, Optional[SaefMembership], Optional[str]]:
        """
        Get a rider's SAEF membership for a specific year.

        Args:
            rider_id: UUID of the rider
            year_id: UUID of the year

        Returns:
            (success, saef_membership, error_message)
        """
        try:
            membership = SaefMembership.objects.select_related('rider', 'year').get(
                rider_id=rider_id,
                year_id=year_id
            )
            return True, membership, None
        except SaefMembership.DoesNotExist:
            return False, None, "No SAEF membership found for this rider and year"
        except Exception as e:
            return False, None, f"Unexpected error: {str(e)}"

    @staticmethod
    def check_competition_eligibility(rider_id: UUID, year_id: UUID) -> Tuple[bool, dict, Optional[str]]:
        """
        Check if a rider is eligible to enter competitions for a specific year.

        A rider is eligible if they have:
        1. An active RiderAccount for the year
        2. A valid (active and not expired) SAEF membership for the year

        Args:
            rider_id: UUID of the rider
            year_id: UUID of the year

        Returns:
            (success, {eligible, reasons}, error_message)
        """
        try:
            reasons = []
            eligible = True

            # Check for active rider account
            try:
                account = RiderAccount.objects.get(rider_id=rider_id, year_id=year_id)
                if not account.is_active:
                    eligible = False
                    reasons.append("Rider account is not active for this year")
            except RiderAccount.DoesNotExist:
                eligible = False
                reasons.append("No rider account found for this year")

            # Check for valid SAEF membership
            try:
                saef_membership = SaefMembership.objects.get(rider_id=rider_id, year_id=year_id)
                if not saef_membership.is_active:
                    eligible = False
                    reasons.append("SAEF membership is not active")
                if saef_membership.is_expired:
                    eligible = False
                    reasons.append("SAEF membership has expired")
            except SaefMembership.DoesNotExist:
                eligible = False
                reasons.append("No SAEF membership found for this year")

            return True, {'eligible': eligible, 'reasons': reasons}, None

        except Exception as e:
            return False, {}, f"Unexpected error: {str(e)}"

    @staticmethod
    def sync_from_external_saef_system(rider_saef_number: str, year_id: UUID) -> Tuple[bool, Optional[SaefMembership], Optional[str]]:
        """
        Synchronize SAEF membership data from external SAEF system.

        This is a placeholder for future integration with the external SAEF API.
        In production, this would:
        1. Connect to the SAEF API
        2. Retrieve the rider's membership data
        3. Create or update the SaefMembership record

        Args:
            rider_saef_number: The rider's SAEF number
            year_id: UUID of the year to sync

        Returns:
            (success, saef_membership, error_message)
        """
        # TODO: Implement actual SAEF API integration
        return False, None, "SAEF API integration not yet implemented"

