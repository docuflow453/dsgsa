from rest_framework import serializers
from .models import Arena, BusinessHour, AppointmentType, Appointment, BookingSetting


class ArenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arena
        fields = ['id', 'name', 'description', 'capacity', 'location', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BusinessHourSerializer(serializers.ModelSerializer):
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)
    
    class Meta:
        model = BusinessHour
        fields = [
            'id', 'arena', 'weekday', 'weekday_display', 'start_time', 'end_time',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentType
        fields = [
            'id', 'name', 'description', 'duration_minutes', 'price',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentSerializer(serializers.ModelSerializer):
    arena_name = serializers.CharField(source='arena.name', read_only=True)
    appointment_type_name = serializers.CharField(source='appointment_type.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'arena', 'arena_name', 'appointment_type', 'appointment_type_name',
            'user', 'user_email', 'start_datetime', 'end_datetime', 'status',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookingSettingSerializer(serializers.ModelSerializer):
    arena_name = serializers.CharField(source='arena.name', read_only=True)
    
    class Meta:
        model = BookingSetting
        fields = [
            'id', 'arena', 'arena_name', 'advance_booking_days', 'min_booking_notice_hours',
            'max_bookings_per_user', 'allow_cancellation', 'cancellation_notice_hours',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

