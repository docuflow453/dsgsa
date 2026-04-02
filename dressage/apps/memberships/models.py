import uuid
from django.db import models
from django.core.exceptions import ValidationError


class Membership(models.Model):
    """
    Represents a membership type in the dressage riding system.
    
    Examples: "Rider Membership", "Non-Rider Membership", "Club Membership"
    """
    name = models.CharField(max_length=100, unique=True, help_text="Name of the membership type")
    description = models.TextField(help_text="Detailed description of the membership type")
    is_active = models.BooleanField(
        default=False,
        help_text="Whether this membership type is currently active"
    )
    notes = models.TextField(blank=True, help_text="Additional notes about the membership")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Membership'
        verbose_name_plural = 'Memberships'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"

    @property
    def status(self):
        """Returns 'Active' or 'Inactive' based on is_active field"""
        return "Active" if self.is_active else "Inactive"

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "Name cannot be empty or only whitespace"

        # Validate description is not empty or whitespace
        if self.description and not self.description.strip():
            errors['description'] = "Description cannot be empty or only whitespace"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)


class Subscription(models.Model):
    """
    Represents a subscription offering combining a membership type with a year and pricing.

    Examples: "Rider Membership 2024 - Competitive", "Club Membership 2024 - Recreational"
    """
    name = models.CharField(max_length=200, help_text="Name of the subscription")
    description = models.TextField(help_text="Detailed description of the subscription")
    membership = models.ForeignKey(
        'Membership',
        on_delete=models.CASCADE,
        related_name='subscriptions',
        help_text="Associated membership type"
    )
    year = models.ForeignKey(
        'years.Year',
        on_delete=models.CASCADE,
        related_name='subscriptions',
        help_text="Associated competition year"
    )
    fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Subscription fee amount"
    )
    is_recreational = models.BooleanField(
        default=False,
        help_text="Whether this is a recreational (non-competitive) subscription"
    )
    is_active = models.BooleanField(
        default=False,
        help_text="Whether this subscription is currently available"
    )
    notes = models.TextField(blank=True, help_text="Additional notes about the subscription")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        unique_together = [['membership', 'year', 'is_recreational']]
        indexes = [
            models.Index(fields=['membership', 'year']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_recreational']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        rec_label = " (Recreational)" if self.is_recreational else " (Competitive)"
        return f"{self.membership.name} - {self.year.name}{rec_label}"

    @property
    def status(self):
        """Returns 'Active' or 'Inactive' based on is_active field"""
        return "Active" if self.is_active else "Inactive"

    @property
    def subscription_type(self):
        """Returns 'Recreational' or 'Competitive' based on is_recreational field"""
        return "Recreational" if self.is_recreational else "Competitive"

    def clean(self):
        """Validate model fields"""
        errors = {}

        # Validate name is not empty or whitespace
        if self.name and not self.name.strip():
            errors['name'] = "Name cannot be empty or only whitespace"

        # Validate description is not empty or whitespace
        if self.description and not self.description.strip():
            errors['description'] = "Description cannot be empty or only whitespace"

        # Validate fee is positive
        if self.fee is not None and self.fee < 0:
            errors['fee'] = "Fee cannot be negative"

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)
