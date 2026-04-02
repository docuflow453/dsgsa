import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class YearStatus(models.TextChoices):
    """Year status choices"""
    PENDING = 'PENDING', 'Pending'
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETE = 'COMPLETE', 'Complete'
    ARCHIVED = 'ARCHIVED', 'Archived'


class Year(models.Model):
    """Competition year/period model"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the year'
    )

    name = models.CharField(
        max_length=200,
        help_text='Name of the competition year (e.g., "2024 Season")'
    )

    year = models.PositiveIntegerField(
        db_index=True,
        help_text='Year number (e.g., 2024)'
    )

    start_date = models.DateField(
        help_text='Start date of the competition year'
    )

    end_date = models.DateField(
        help_text='End date of the competition year'
    )

    is_registration_open = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Whether registration is currently open'
    )

    status = models.CharField(
        max_length=20,
        choices=YearStatus.choices,
        default=YearStatus.PENDING,
        db_index=True,
        help_text='Year status'
    )

    notes = models.TextField(
        blank=True,
        help_text='Additional notes about this year'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competition_years'
        verbose_name = 'Competition Year'
        verbose_name_plural = 'Competition Years'
        ordering = ['-year', '-start_date']
        indexes = [
            models.Index(fields=['year']),
            models.Index(fields=['status']),
            models.Index(fields=['is_registration_open']),
            models.Index(fields=['-start_date']),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F('start_date')),
                name='end_date_gte_start_date'
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.year})"

    def clean(self):
        """Model-level validation"""
        super().clean()
        
        # Validate end_date >= start_date
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError({
                'end_date': 'End date must be on or after the start date.'
            })

    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.clean()
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        """Check if this year is currently active"""
        return self.status == YearStatus.ACTIVE

    @property
    def is_current(self):
        """Check if today's date falls within this year's period"""
        from datetime import date
        today = date.today()
        return self.start_date <= today <= self.end_date

    @property
    def days_remaining(self):
        """Calculate days remaining in the year"""
        from datetime import date
        today = date.today()
        if today > self.end_date:
            return 0
        if today < self.start_date:
            return (self.end_date - self.start_date).days
        return (self.end_date - today).days

    @property
    def duration_days(self):
        """Total duration of the year in days"""
        return (self.end_date - self.start_date).days + 1

