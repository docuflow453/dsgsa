from django.utils import timezone
from .models import Rider, SaefMembership


class RiderService:
    """Service class for Rider-related business logic."""
    
    @staticmethod
    def get_active_riders():
        """Get all active riders."""
        return Rider.objects.filter(is_active=True)
    
    @staticmethod
    def get_rider_by_saef_number(saef_number):
        """Get rider by SAEF number."""
        return Rider.objects.filter(saef_number=saef_number, is_active=True).first()
    
    @staticmethod
    def get_riders_by_province(province):
        """Get all riders in a specific province."""
        return Rider.objects.filter(province=province, is_active=True)
    
    @staticmethod
    def is_rider_eligible(rider, year):
        """Check if a rider is eligible to compete in a specific year."""
        # Check if rider has active SAEF membership for the year
        membership = SaefMembership.objects.filter(
            rider=rider,
            year=year,
            approved_at__isnull=False
        ).first()
        return membership is not None
    
    @staticmethod
    def get_rider_age(rider):
        """Calculate the age of a rider."""
        if not rider.date_of_birth:
            return None
        today = timezone.now().date()
        age = today.year - rider.date_of_birth.year
        if today.month < rider.date_of_birth.month or (
            today.month == rider.date_of_birth.month and today.day < rider.date_of_birth.day
        ):
            age -= 1
        return age


class SaefMembershipService:
    """Service class for SaefMembership-related business logic."""
    
    @staticmethod
    def get_rider_membership(rider, year):
        """Get a rider's SAEF membership for a specific year."""
        return SaefMembership.objects.filter(rider=rider, year=year).first()
    
    @staticmethod
    def approve_membership(membership, approved_by):
        """Approve a SAEF membership."""
        membership.approved_at = timezone.now()
        membership.approved_by = approved_by
        membership.save()
        return membership
    
    @staticmethod
    def is_membership_approved(rider, year):
        """Check if a rider's membership is approved for a specific year."""
        membership = SaefMembership.objects.filter(
            rider=rider,
            year=year,
            approved_at__isnull=False
        ).first()
        return membership is not None
    
    @staticmethod
    def create_membership(rider, year):
        """Create a new SAEF membership for a rider."""
        membership, created = SaefMembership.objects.get_or_create(
            rider=rider,
            year=year
        )
        return membership


