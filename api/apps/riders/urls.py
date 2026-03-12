from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RiderViewSet, SaefMembershipViewSet

router = DefaultRouter()
router.register(r'riders', RiderViewSet, basename='rider')
router.register(r'saef-memberships', SaefMembershipViewSet, basename='saef-membership')

urlpatterns = [
    path('', include(router.urls)),
]

