from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Year, Membership, Classification

User = get_user_model()


class UserService:
    """Service class for User-related business logic."""
    
    @staticmethod
    def activate_user(user):
        """Activate a user account."""
        user.is_active = True
        user.activated_at = timezone.now()
        user.save()
        return user
    
    @staticmethod
    def ban_user(user):
        """Ban a user account."""
        user.is_active = False
        user.banned_at = timezone.now()
        user.save()
        return user
    
    @staticmethod
    def confirm_email(user):
        """Confirm user's email address."""
        user.email_confirmed_at = timezone.now()
        user.save()
        return user
    
    @staticmethod
    def get_users_by_role(role):
        """Get all users with a specific role."""
        return User.objects.filter(role=role, is_active=True)


class YearService:
    """Service class for Year-related business logic."""
    
    @staticmethod
    def get_active_year():
        """Get the currently active year."""
        return Year.objects.filter(is_active=True).first()
    
    @staticmethod
    def get_current_year():
        """Get the year that includes today's date."""
        today = timezone.now().date()
        return Year.objects.filter(
            start_date__lte=today,
            end_date__gte=today
        ).first()
    
    @staticmethod
    def is_year_open(year):
        """Check if a year is open for registrations."""
        if not year.open_at:
            return False
        return timezone.now() >= year.open_at


class MembershipService:
    """Service class for Membership-related business logic."""
    
    @staticmethod
    def get_active_memberships():
        """Get all active memberships."""
        return Membership.objects.filter(is_active=True)
    
    @staticmethod
    def get_membership_by_code(code):
        """Get membership by code."""
        return Membership.objects.filter(code=code, is_active=True).first()


class ClassificationService:
    """Service class for Classification-related business logic."""
    
    @staticmethod
    def get_active_classifications():
        """Get all active classifications."""
        return Classification.objects.filter(is_active=True)
    
    @staticmethod
    def get_pony_classifications():
        """Get all pony classifications."""
        return Classification.objects.filter(is_pony=True, is_active=True)
    
    @staticmethod
    def get_recreational_classifications():
        """Get all recreational classifications."""
        return Classification.objects.filter(is_recreational=True, is_active=True)
    
    @staticmethod
    def get_classification_fee(classification, year):
        """Get the fee for a classification in a specific year."""
        from .models import YearClassificationFee
        fee_obj = YearClassificationFee.objects.filter(
            classification=classification,
            year=year
        ).first()
        return fee_obj.fee if fee_obj else 0

