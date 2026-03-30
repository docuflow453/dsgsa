from django.db import models
from django.core.exceptions import ValidationError


class YearStatus(models.TextChoices):
    """Year status enumeration"""
    PENDING = 'PENDING', 'Pending'
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETE = 'COMPLETE', 'Complete'
    ARCHIVED = 'ARCHIVED', 'Archived'


class Year(models.Model):
    """
    Model representing a competition year/period.
    
    Defines competition periods and subscription windows for the system.
    Each year has a defined start and end date, status, and registration controls.
    """
    
    name = models.CharField(
        max_length=100,
        help_text='Name of the competition year (e.g., "2024 Season")'
    )
    
    year = models.PositiveIntegerField(
        help_text='Year number (e.g., 2024)',
        db_index=True
    )
    
    start_date = models.DateField(
        help_text='Start date of the competition year'
    )
    
    end_date = models.DateField(
        help_text='End date of the competition year'
    )
    
    is_registration_open = models.BooleanField(
        default=False,
        help_text='Whether registration is currently open for this year'
    )
    
    status = models.CharField(
        max_length=20,
        choices=YearStatus.choices,
        default=YearStatus.PENDING,
        help_text='Current status of the competition year'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        help_text='Additional notes or information about this year'
    )
    
    # Audit fields
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when the year was created'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Timestamp when the year was last updated'
    )
    
    class Meta:
        db_table = 'years'
        verbose_name = 'Competition Year'
        verbose_name_plural = 'Competition Years'
        ordering = ['-year', '-start_date']
        indexes = [
            models.Index(fields=['year', 'status']),
            models.Index(fields=['start_date', 'end_date']),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F('start_date')),
                name='end_date_after_start_date',
                violation_error_message='End date must be on or after start date'
            ),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.year})"
    
    def clean(self):
        """Validate model data."""
        super().clean()
        
        # Ensure end_date is not before start_date
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError({
                'end_date': 'End date cannot be before start date.'
            })
    
    def save(self, *args, **kwargs):
        """Override save to run full_clean."""
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def is_active(self):
        """Check if the year is currently active."""
        return self.status == YearStatus.ACTIVE
    
    @property
    def is_pending(self):
        """Check if the year is pending."""
        return self.status == YearStatus.PENDING
    
    @property
    def is_complete(self):
        """Check if the year is complete."""
        return self.status == YearStatus.COMPLETE
    
    @property
    def is_archived(self):
        """Check if the year is archived."""
        return self.status == YearStatus.ARCHIVED
    
    @property
    def duration_days(self):
        """Calculate the duration of the year in days."""
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return 0

