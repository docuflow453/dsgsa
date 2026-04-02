import uuid
from datetime import date
from django.db import models
from django.core.exceptions import ValidationError
from django_countries.fields import CountryField
from apps.users.models import User
from apps.years.models import Year
from apps.memberships.models import Subscription


class Gender(models.TextChoices):
    """Gender enumeration"""
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'
    OTHER = 'OTHER', 'Other'


class Ethnicity(models.TextChoices):
    """Ethnicity enumeration"""
    BLACK_AFRICAN = 'BLACK_AFRICAN', 'Black African'
    COLOURED = 'COLOURED', 'Coloured'
    INDIAN = 'INDIAN', 'Indian'
    WHITE = 'WHITE', 'White'
    OTHER = 'OTHER', 'Other'


class AccountType(models.TextChoices):
    """Bank account type enumeration"""
    SAVINGS = 'SAVINGS', 'Savings'
    CURRENT = 'CURRENT', 'Current'
    CHEQUE = 'CHEQUE', 'Cheque'


class Rider(models.Model):
    """
    Rider profile model containing personal and contact information.
    
    A rider is linked 1:1 with a User account and contains all competition-related
    personal details, address information, and banking details.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='rider')
    
    # SAEF and identification
    saef_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    id_number = models.CharField(max_length=13, unique=True, null=True, blank=True,
                                 help_text="South African ID number (13 digits)")
    passport_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    
    # Personal information
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    ethnicity = models.CharField(max_length=20, choices=Ethnicity.choices, null=True, blank=True)
    nationality = CountryField()

    # Address fields
    address_line_1 = models.CharField(max_length=255, null=True, blank=True)
    address_line_2 = models.CharField(max_length=255, null=True, blank=True)
    suburb = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    province = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    country = CountryField(blank=True, null=True)
    
    # Banking details (optional)
    account_type = models.CharField(max_length=10, choices=AccountType.choices, null=True, blank=True)
    account_name = models.CharField(max_length=255, null=True, blank=True)
    bank_name = models.CharField(max_length=100, null=True, blank=True)
    
    # Status fields
    is_active = models.BooleanField(default=True)
    is_test = models.BooleanField(default=False, help_text="Mark as test profile")
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'riders'
        verbose_name = 'Rider'
        verbose_name_plural = 'Riders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['saef_number']),
            models.Index(fields=['id_number']),
            models.Index(fields=['passport_number']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]
    
    def clean(self):
        """Model-level validation"""
        # Either id_number or passport_number must be provided
        if not self.id_number and not self.passport_number:
            raise ValidationError("Either ID number or passport number must be provided")
        
        # Validate ID number format (13 digits)
        if self.id_number:
            if len(self.id_number) != 13:
                raise ValidationError("SA ID number must be exactly 13 digits")
            if not self.id_number.isdigit():
                raise ValidationError("SA ID number must contain only digits")
    
    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        """Returns rider's full name from associated user"""
        return f"{self.user.first_name} {self.user.last_name}".strip()
    
    @property
    def age(self):
        """Calculates current age from date of birth"""
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    @property
    def full_address(self):
        """Returns formatted full address"""
        parts = [
            self.address_line_1,
            self.address_line_2,
            self.suburb,
            self.city,
            self.province,
            self.postal_code,
            self.country.name if self.country else None
        ]
        return ', '.join(filter(None, parts))
    
    @property
    def status(self):
        """Returns active status as string"""
        return "Active" if self.is_active else "Inactive"
    
    def __str__(self):
        return f"{self.full_name} ({self.user.email})"


class RiderAccount(models.Model):
    """
    Links riders to competition years with subscription information.

    Represents a rider's membership for a specific year. Each year, a rider
    must have an active RiderAccount to participate in competitions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='accounts')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='rider_accounts')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='rider_accounts')
    is_active = models.BooleanField(default=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rider_accounts'
        verbose_name = 'Rider Account'
        verbose_name_plural = 'Rider Accounts'
        unique_together = [['rider', 'year']]
        ordering = ['-year__year', '-created_at']
        indexes = [
            models.Index(fields=['rider', 'year']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]

    @property
    def status(self):
        """Returns active status as string"""
        return "Active" if self.is_active else "Inactive"

    def __str__(self):
        return f"{self.rider.full_name} - {self.year.name}"


class SaefMembership(models.Model):
    """
    Manages SAEF membership records for riders.

    Each year, a rider needs a valid SAEF membership to enter competitions.
    SAEF membership data is synchronized with an external SAEF system.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='saef_memberships')
    membership_number = models.CharField(max_length=50)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='saef_memberships')
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateField(null=True, blank=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'saef_memberships'
        verbose_name = 'SAEF Membership'
        verbose_name_plural = 'SAEF Memberships'
        unique_together = [['rider', 'year']]
        ordering = ['-year__year', '-created_at']
        indexes = [
            models.Index(fields=['rider', 'year']),
            models.Index(fields=['membership_number']),
            models.Index(fields=['is_active']),
            models.Index(fields=['expiry_date']),
            models.Index(fields=['created_at']),
        ]

    def clean(self):
        """Model-level validation"""
        if self.membership_number and not self.membership_number.strip():
            raise ValidationError("Membership number cannot be empty or whitespace")

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def status(self):
        """Returns active status as string"""
        return "Active" if self.is_active else "Inactive"

    @property
    def is_expired(self):
        """Check if membership has expired"""
        if not self.expiry_date:
            return False
        return date.today() > self.expiry_date

    def __str__(self):
        return f"{self.rider.full_name} - {self.year.name} ({self.membership_number})"


class RiderClub(models.Model):
    """
    Tracks rider club affiliations per year.

    A rider can be affiliated with a club for each competition year.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='clubs')
    name = models.CharField(max_length=255)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='rider_clubs')
    is_active = models.BooleanField(default=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rider_clubs'
        verbose_name = 'Rider Club'
        verbose_name_plural = 'Rider Clubs'
        unique_together = [['rider', 'year']]
        ordering = ['-year__year', '-created_at']
        indexes = [
            models.Index(fields=['rider', 'year']),
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]

    def clean(self):
        """Model-level validation"""
        if self.name and not self.name.strip():
            raise ValidationError("Club name cannot be empty or whitespace")

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def status(self):
        """Returns active status as string"""
        return "Active" if self.is_active else "Inactive"

    def __str__(self):
        return f"{self.rider.full_name} - {self.name} ({self.year.name})"


class RiderShowHoldingBody(models.Model):
    """
    Tracks rider show holding body affiliations.

    A rider can be affiliated with a show holding body for each competition year.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE, related_name='show_holding_bodies')
    name = models.CharField(max_length=255)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='rider_show_holding_bodies')
    is_active = models.BooleanField(default=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rider_show_holding_bodies'
        verbose_name = 'Rider Show Holding Body'
        verbose_name_plural = 'Rider Show Holding Bodies'
        unique_together = [['rider', 'year']]
        ordering = ['-year__year', '-created_at']
        indexes = [
            models.Index(fields=['rider', 'year']),
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]

    def clean(self):
        """Model-level validation"""
        if self.name and not self.name.strip():
            raise ValidationError("Show holding body name cannot be empty or whitespace")

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def status(self):
        """Returns active status as string"""
        return "Active" if self.is_active else "Inactive"

    def __str__(self):
        return f"{self.rider.full_name} - {self.name} ({self.year.name})"

