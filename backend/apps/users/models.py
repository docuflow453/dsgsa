from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    """User role enumeration"""
    ADMIN = 'ADMIN', 'Administrator'
    STAFF = 'STAFF', 'Staff Member'
    RIDER = 'RIDER', 'Rider'
    SHOW_HOLDING_BODY = 'SHOW_HOLDING_BODY', 'Show Holding Body'
    CLUB = 'CLUB', 'Club'


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    
    Adds role-based access control and additional timestamp fields
    for tracking user account states.
    """
    
    # Role field - each user has exactly one role
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.RIDER,
        help_text='User role determining permissions and access level'
    )
    
    # Timestamp fields for account state tracking
    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user account was banned'
    )
    
    activated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user account was activated'
    )
    
    email_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user email was verified'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_banned(self):
        """Check if user is currently banned"""
        return self.banned_at is not None
    
    @property
    def is_activated(self):
        """Check if user account is activated"""
        return self.activated_at is not None
    
    @property
    def is_email_verified(self):
        """Check if user email is verified"""
        return self.email_verified_at is not None
    
    @property
    def is_admin(self):
        """Check if user has admin role"""
        return self.role == UserRole.ADMIN
    
    @property
    def is_staff_member(self):
        """Check if user has staff role"""
        return self.role == UserRole.STAFF

