from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ArenaViewSet, BusinessHourViewSet, AppointmentTypeViewSet,
    AppointmentViewSet, BookingSettingViewSet
)

router = DefaultRouter()
router.register(r'arenas', ArenaViewSet, basename='arena')
router.register(r'business-hours', BusinessHourViewSet, basename='business-hour')
router.register(r'appointment-types', AppointmentTypeViewSet, basename='appointment-type')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'booking-settings', BookingSettingViewSet, basename='booking-setting')

urlpatterns = [
    path('', include(router.urls)),
]

