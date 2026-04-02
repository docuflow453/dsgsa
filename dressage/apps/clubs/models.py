import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django_countries.fields import CountryField


class AccountType(models.TextChoices):
    """Account type choices for bank accounts"""
    CURRENT = 'CURRENT', 'Current Account'
    SAVINGS = 'SAVINGS', 'Savings Account'
    BUSINESS = 'BUSINESS', 'Business Account'
    TRANSMISSION = 'TRANSMISSION', 'Transmission Account'


class ClubStatus(models.TextChoices):
    """Status choices for Club"""
    ACTIVE = 'ACTIVE', 'Active'
    PENDING = 'PENDING', 'Pending Approval'
    SUSPENDED = 'SUSPENDED', 'Suspended'
    BANNED = 'BANNED', 'Banned'
    INACTIVE = 'INACTIVE', 'Inactive'


class Club(models.Model):
    """
    Model representing a Club organization.
    
    A Club is an organization that riders can join. Riders can be linked to 
    one or more clubs each year when they register or renew their membership.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    name = models.CharField(max_length=255, unique=True)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    logo = models.FileField(upload_to='clubs/logos/', blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    
    # Address Information
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    province = models.ForeignKey(
        'common.Province',
        on_delete=models.PROTECT,
        related_name='clubs'
    )
    postal_code = models.CharField(max_length=20)
    country = CountryField()
    
    # Primary Contact Information
    primary_contact_name = models.CharField(max_length=255)
    primary_contact_email = models.EmailField()
    primary_contact_phone = models.CharField(max_length=20)
    
    # Bank Account Details
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    branch_code = models.CharField(max_length=20, blank=True, null=True)
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
        blank=True,
        null=True
    )
    account_holder_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Status and Metadata
    status = models.CharField(
        max_length=20,
        choices=ClubStatus.choices,
        default=ClubStatus.ACTIVE
    )
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Club"
        verbose_name_plural = "Clubs"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
    
    @property
    def is_active(self):
        """Check if the club is active"""
        return self.status == ClubStatus.ACTIVE
    
    @property
    def full_address(self):
        """Return formatted full address"""
        parts = [self.address_line_1]
        if self.address_line_2:
            parts.append(self.address_line_2)
        parts.extend([self.city, self.postal_code])
        if self.country:
            parts.append(self.country.name)
        return ", ".join(parts)
    
    @property
    def has_bank_details(self):
        """Check if bank account details are complete"""
        return all([
            self.bank_name,
            self.account_number,
            self.branch_code,
            self.account_type,
            self.account_holder_name
        ])
    
    @property
    def has_logo(self):
        """Check if club has a logo"""
        return bool(self.logo)
    
    def clean(self):
        """Custom validation"""
        super().clean()
        
        # Validate name is not just whitespace
        if self.name and not self.name.strip():
            raise ValidationError({'name': 'Name cannot be only whitespace.'})
        
        # If any bank details are provided, ensure critical ones are present
        bank_fields = [self.bank_name, self.account_number, self.account_holder_name]
        if any(bank_fields) and not all(bank_fields):
            raise ValidationError({
                'bank_name': 'Bank name, account number, and account holder name are all required if providing bank details.'
            })
    
    def save(self, *args, **kwargs):
        """Override save to call full_clean"""
        self.full_clean()
        super().save(*args, **kwargs)

