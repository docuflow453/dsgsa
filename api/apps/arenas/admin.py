from django.contrib import admin
from .models import Arena, BusinessHour, AppointmentType, Appointment, BookingSetting


@admin.register(Arena)
class ArenaAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'capacity', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'location']


@admin.register(BusinessHour)
class BusinessHourAdmin(admin.ModelAdmin):
    list_display = ['arena', 'weekday', 'start_time', 'end_time', 'is_active']
    list_filter = ['arena', 'weekday', 'is_active']


@admin.register(AppointmentType)
class AppointmentTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'duration_minutes', 'price', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['arena', 'user', 'appointment_type', 'start_datetime', 'status', 'created_at']
    list_filter = ['arena', 'appointment_type', 'status', 'start_datetime']
    search_fields = ['user__email', 'notes']


@admin.register(BookingSetting)
class BookingSettingAdmin(admin.ModelAdmin):
    list_display = ['arena', 'advance_booking_days', 'min_booking_notice_hours', 'allow_cancellation']
    list_filter = ['allow_cancellation']

