import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django_countries.fields import CountryField


class Province(models.Model):
    """
    Represents a province or state within a country.

    Used for organizing schools, clubs, and rider locations.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="Province name")
    country = CountryField(help_text="Country this province belongs to")
    is_active = models.BooleanField(default=True, help_text="Whether this province is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'provinces'
        verbose_name = 'Province'
        verbose_name_plural = 'Provinces'
        ordering = ['country', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['country']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name}, {self.country.name}"

    @property
    def status(self):
        """Returns 'Active' or 'Inactive' based on is_active field"""
        return "Active" if self.is_active else "Inactive"

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "Province name cannot be empty or only whitespace"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)


class VatCode(models.Model):
    """
    Represents VAT/Tax codes applicable to memberships and competitions.

    Manages different tax rates and their applicability to various system components.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, help_text="VAT code name (e.g., 'Standard VAT', 'Zero-rated')")
    code = models.CharField(max_length=50, unique=True, help_text="Unique VAT code identifier")
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="VAT percentage (e.g., 15.00 for 15%)"
    )
    is_applicable_to_membership = models.BooleanField(
        default=True,
        help_text="Whether this VAT code applies to membership fees"
    )
    is_applicable_to_competitions = models.BooleanField(
        default=True,
        help_text="Whether this VAT code applies to competition entries"
    )
    is_default = models.BooleanField(
        default=False,
        help_text="Whether this is the default VAT code"
    )
    is_active = models.BooleanField(default=True, help_text="Whether this VAT code is active")
    notes = models.TextField(blank=True, help_text="Additional notes about this VAT code")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vat_codes'
        verbose_name = 'VAT Code'
        verbose_name_plural = 'VAT Codes'
        ordering = ['-is_default', 'name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_default']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.percentage}%)"

    @property
    def status(self):
        """Returns 'Active' or 'Inactive' based on is_active field"""
        return "Active" if self.is_active else "Inactive"

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "VAT code name cannot be empty or only whitespace"

        # Validate code is not empty or whitespace
        if self.code and not self.code.strip():
            errors['code'] = "VAT code cannot be empty or only whitespace"

        # Validate percentage is non-negative
        if self.percentage is not None and self.percentage < 0:
            errors['percentage'] = "VAT percentage cannot be negative"

        # Validate percentage is not more than 100
        if self.percentage is not None and self.percentage > 100:
            errors['percentage'] = "VAT percentage cannot exceed 100"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation and handle default logic"""
        self.full_clean()

        # If this is set as default, unset other defaults
        if self.is_default:
            VatCode.objects.exclude(id=self.id).update(is_default=False)

        super().save(*args, **kwargs)


class SchoolStatus(models.TextChoices):
    """School status enumeration"""
    ACTIVE = 'ACTIVE', 'Active'
    INACTIVE = 'INACTIVE', 'Inactive'
    PENDING = 'PENDING', 'Pending'
    SUSPENDED = 'SUSPENDED', 'Suspended'





class School(models.Model):
    """
    Represents a riding school or training facility.

    Schools can be associated with riders and used for organizing training sessions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, help_text="School name")
    province = models.ForeignKey(
        Province,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='schools',
        help_text="Province where the school is located"
    )

    # Contact information
    contact_person = models.CharField(max_length=255, blank=True, help_text="Primary contact person")
    email = models.EmailField(blank=True, help_text="Contact email address")
    phone = models.CharField(max_length=50, blank=True, help_text="Contact phone number")

    # Address information
    address = models.TextField(blank=True, help_text="Physical address")
    city = models.CharField(max_length=100, blank=True, help_text="City")

    # Status and details
    status = models.CharField(
        max_length=20,
        choices=SchoolStatus.choices,
        default=SchoolStatus.ACTIVE,
        help_text="Current status of the school"
    )
    website = models.URLField(blank=True, help_text="School website URL")
    description = models.TextField(blank=True, help_text="School description")
    logo = models.FileField(upload_to='school_logos/', blank=True, null=True, help_text="School logo")

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'schools'
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['status']),
            models.Index(fields=['province']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

    @property
    def is_active(self):
        """Returns True if school status is ACTIVE"""
        return self.status == SchoolStatus.ACTIVE

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "School name cannot be empty or only whitespace"

        # Validate email format if provided
        if self.email and not self.email.strip():
            errors['email'] = "Email cannot be empty or only whitespace"

        # Validate phone if provided
        if self.phone and not self.phone.strip():
            errors['phone'] = "Phone cannot be empty or only whitespace"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)


class PaymentMethod(models.Model):
    """
    Represents a payment method available in the system.

    Payment methods can be enabled for specific purposes like entries or renewals.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="Payment method name")
    code = models.SlugField(max_length=50, unique=True, help_text="Unique slug code for the payment method")
    description = models.TextField(blank=True, help_text="Description of the payment method")
    is_active = models.BooleanField(default=True, help_text="Whether this payment method is active")
    allow_for_entries = models.BooleanField(
        default=True,
        help_text="Whether this payment method can be used for competition entries"
    )
    allow_for_renewals = models.BooleanField(
        default=True,
        help_text="Whether this payment method can be used for membership renewals"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def status(self):
        """Returns 'Active' or 'Inactive' based on is_active field"""
        return "Active" if self.is_active else "Inactive"

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "Payment method name cannot be empty or only whitespace"

        # Validate code is not empty or whitespace
        if self.code and not self.code.strip():
            errors['code'] = "Payment method code cannot be empty or only whitespace"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation and auto-generate slug if needed"""
        # Auto-generate slug from name if not provided
        if not self.code and self.name:
            self.code = slugify(self.name)

        self.full_clean()
        super().save(*args, **kwargs)
