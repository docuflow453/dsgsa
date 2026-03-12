from django.db import models
from django.conf import settings


class Arena(models.Model):
    """Arena model for managing competition arenas."""
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'arenas'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BusinessHour(models.Model):
    """Business hours for arenas."""
    
    WEEKDAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    arena = models.ForeignKey(
        Arena,
        on_delete=models.CASCADE,
        related_name='business_hours'
    )
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'business_hours'
        ordering = ['arena', 'weekday', 'start_time']
    
    def __str__(self):
        return f"{self.arena.name} - {self.get_weekday_display()}: {self.start_time}-{self.end_time}"


class AppointmentType(models.Model):
    """Appointment type model."""
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField(default=60)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointment_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Appointment(models.Model):
    """Appointment model for arena bookings."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    arena = models.ForeignKey(
        Arena,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    appointment_type = models.ForeignKey(
        AppointmentType,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['start_datetime']
    
    def __str__(self):
        return f"{self.arena.name} - {self.user.email} ({self.start_datetime})"


class BookingSetting(models.Model):
    """Booking settings for arenas."""
    
    arena = models.OneToOneField(
        Arena,
        on_delete=models.CASCADE,
        related_name='booking_setting'
    )
    advance_booking_days = models.IntegerField(default=30)
    min_booking_notice_hours = models.IntegerField(default=24)
    max_bookings_per_user = models.IntegerField(default=5)
    allow_cancellation = models.BooleanField(default=True)
    cancellation_notice_hours = models.IntegerField(default=24)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'booking_settings'
    
    def __str__(self):
        return f"Booking Settings for {self.arena.name}"

