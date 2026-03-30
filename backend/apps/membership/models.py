from django.db import models
from django.core.exceptions import ValidationError


class Membership(models.Model):
    """
    Model representing a membership type.
    
    Defines membership types such as "Rider Membership", "Non-Rider Membership", etc.
    Each membership type has a name, description, and active status.
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Name of the membership type (e.g., "Rider Membership")'
    )
    
    description = models.TextField(
        help_text='Detailed description of the membership type'
    )
    
    is_active = models.BooleanField(
        default=False,
        help_text='Whether this membership type is currently active'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        help_text='Additional notes or information about this membership type'
    )
    
    # Audit fields
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when the membership type was created'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Timestamp when the membership type was last updated'
    )
    
    class Meta:
        db_table = 'memberships'
        verbose_name = 'Membership Type'
        verbose_name_plural = 'Membership Types'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    def clean(self):
        """Validate model data."""
        super().clean()
        
        # Ensure name is not empty or only whitespace
        if self.name and not self.name.strip():
            raise ValidationError({
                'name': 'Name cannot be empty or only whitespace.'
            })
    
    def save(self, *args, **kwargs):
        """Override save to run full_clean."""
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def status(self):
        """Return a user-friendly status string."""
        return "Active" if self.is_active else "Inactive"


class Subscription(models.Model):
    """
    Model representing a subscription type for a specific year and membership.

    Defines specific subscription types that users can purchase
    (e.g., "Senior Adult Competitive", "Junior Recreational") for a competition year.
    """

    name = models.CharField(
        max_length=100,
        help_text='Name of the subscription type (e.g., "Senior Adult Competitive")'
    )

    description = models.TextField(
        help_text='Detailed description of the subscription type'
    )

    year = models.ForeignKey(
        'years.Year',
        on_delete=models.CASCADE,
        related_name='subscriptions',
        help_text='Competition year this subscription applies to'
    )

    membership = models.ForeignKey(
        'Membership',
        on_delete=models.CASCADE,
        related_name='subscriptions',
        help_text='Membership type this subscription belongs to'
    )

    fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Subscription fee (excluding VAT)'
    )

    fee_including_vat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Subscription fee including VAT'
    )

    is_active = models.BooleanField(
        default=False,
        help_text='Whether this subscription type is currently active'
    )

    is_recreational = models.BooleanField(
        default=False,
        help_text='Whether this is a recreational subscription type'
    )

    notes = models.TextField(
        null=True,
        blank=True,
        help_text='Additional notes or information about this subscription'
    )

    # Audit fields
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when the subscription was created'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Timestamp when the subscription was last updated'
    )

    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        ordering = ['year', 'membership', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['year']),
            models.Index(fields=['membership']),
            models.Index(fields=['is_active']),
            models.Index(fields=['year', 'membership']),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(fee__gte=0),
                name='fee_non_negative',
                violation_error_message='Fee must be non-negative'
            ),
            models.CheckConstraint(
                condition=models.Q(fee_including_vat__gte=models.F('fee')),
                name='fee_vat_gte_fee',
                violation_error_message='Fee including VAT must be greater than or equal to fee'
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.year.name} - {self.membership.name})"

    def clean(self):
        """Validate model data."""
        super().clean()

        # Ensure name is not empty or only whitespace
        if self.name and not self.name.strip():
            raise ValidationError({
                'name': 'Name cannot be empty or only whitespace.'
            })

        # Validate fee relationships
        if self.fee and self.fee < 0:
            raise ValidationError({
                'fee': 'Fee must be non-negative.'
            })

        if self.fee_including_vat and self.fee and self.fee_including_vat < self.fee:
            raise ValidationError({
                'fee_including_vat': 'Fee including VAT must be greater than or equal to base fee.'
            })

    def save(self, *args, **kwargs):
        """Override save to run full_clean."""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def status(self):
        """Return a user-friendly status string."""
        return "Active" if self.is_active else "Inactive"

    @property
    def vat_amount(self):
        """Calculate the VAT amount."""
        if self.fee_including_vat and self.fee:
            return self.fee_including_vat - self.fee
        return 0

    @property
    def subscription_type(self):
        """Return subscription type description."""
        return "Recreational" if self.is_recreational else "Competitive"

