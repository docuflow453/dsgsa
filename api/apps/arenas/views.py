from rest_framework import viewsets, permissions
from .models import Arena, BusinessHour, AppointmentType, Appointment, BookingSetting
from .serializers import (
    ArenaSerializer, BusinessHourSerializer, AppointmentTypeSerializer,
    AppointmentSerializer, BookingSettingSerializer
)


class ArenaViewSet(viewsets.ModelViewSet):
    queryset = Arena.objects.all()
    serializer_class = ArenaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name', 'location']


class BusinessHourViewSet(viewsets.ModelViewSet):
    queryset = BusinessHour.objects.select_related('arena')
    serializer_class = BusinessHourSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['arena', 'weekday', 'is_active']


class AppointmentTypeViewSet(viewsets.ModelViewSet):
    queryset = AppointmentType.objects.all()
    serializer_class = AppointmentTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name']


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('arena', 'appointment_type', 'user')
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['arena', 'appointment_type', 'user', 'status']
    ordering_fields = ['start_datetime', 'created_at']


class BookingSettingViewSet(viewsets.ModelViewSet):
    queryset = BookingSetting.objects.select_related('arena')
    serializer_class = BookingSettingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['arena']

