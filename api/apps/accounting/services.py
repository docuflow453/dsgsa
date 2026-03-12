from django.utils import timezone
from .models import Account, RiderAccount, HorseAccount


class AccountService:
    """Service class for Account-related business logic."""
    
    @staticmethod
    def create_account(user, year, amount, payment_method, data=None):
        """Create a new account."""
        return Account.objects.create(
            user=user,
            year=year,
            amount=amount,
            payment_method=payment_method,
            data=data or {}
        )
    
    @staticmethod
    def approve_account(account, approved_by):
        """Approve an account."""
        account.approved_at = timezone.now()
        account.approved_by = approved_by
        account.save()
        return account
    
    @staticmethod
    def get_user_accounts(user, year=None):
        """Get all accounts for a user, optionally filtered by year."""
        queryset = Account.objects.filter(user=user)
        if year:
            queryset = queryset.filter(year=year)
        return queryset
    
    @staticmethod
    def create_rider_account(rider, account, subscription, amount):
        """Create a rider account linking rider to account and subscription."""
        return RiderAccount.objects.create(
            rider=rider,
            account=account,
            subscription=subscription,
            amount=amount
        )
    
    @staticmethod
    def create_horse_account(horse, account, classification_type, amount):
        """Create a horse account linking horse to account and classification."""
        return HorseAccount.objects.create(
            horse=horse,
            account=account,
            classification_type=classification_type,
            amount=amount
        )

