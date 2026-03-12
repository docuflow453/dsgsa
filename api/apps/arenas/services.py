from django.utils import timezone
from datetime import timedelta
from .models import Arena, Appointment, BookingSetting


class ArenaService:
    """Service class for Arena-related business logic."""
    
    @staticmethod
    def get_active_arenas():
        """Get all active arenas."""
        return Arena.objects.filter(is_active=True)
    
    @staticmethod
    def get_available_slots(arena, date):
        """Get available time slots for an arena on a specific date."""
        # Get business hours for the weekday
        weekday = date.weekday()
        business_hours = arena.business_hours.filter(weekday=weekday, is_active=True)
        
        if not business_hours.exists():
            return []
        
        # Get existing appointments for the date
        appointments = Appointment.objects.filter(
            arena=arena,
            start_datetime__date=date,
            status__in=['pending', 'confirmed']
        )
        
        # Calculate available slots (simplified logic)
        available_slots = []
        # Implementation would calculate slots based on business hours and existing appointments
        
        return available_slots


class AppointmentService:
    """Service class for Appointment-related business logic."""
    
    @staticmethod
    def create_appointment(arena, appointment_type, user, start_datetime):
        """Create a new appointment."""
        end_datetime = start_datetime + timedelta(minutes=appointment_type.duration_minutes)
        
        return Appointment.objects.create(
            arena=arena,
            appointment_type=appointment_type,
            user=user,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            status='pending'
        )
    
    @staticmethod
    def confirm_appointment(appointment):
        """Confirm an appointment."""
        appointment.status = 'confirmed'
        appointment.save()
        return appointment
    
    @staticmethod
    def cancel_appointment(appointment):
        """Cancel an appointment."""
        appointment.status = 'cancelled'
        appointment.save()
        return appointment
    
    @staticmethod
    def can_cancel_appointment(appointment):
        """Check if an appointment can be cancelled."""
        try:
            booking_setting = appointment.arena.booking_setting
            if not booking_setting.allow_cancellation:
                return False
            
            hours_until_appointment = (appointment.start_datetime - timezone.now()).total_seconds() / 3600
            return hours_until_appointment >= booking_setting.cancellation_notice_hours
        except BookingSetting.DoesNotExist:
            return True

