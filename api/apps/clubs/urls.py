from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClubViewSet, ShowHoldingBodyViewSet, PaymentMethodViewSet, ExtraViewSet

router = DefaultRouter()
router.register(r'clubs', ClubViewSet, basename='club')
router.register(r'show-holding-bodies', ShowHoldingBodyViewSet, basename='show-holding-body')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')
router.register(r'extras', ExtraViewSet, basename='extra')

urlpatterns = [
    path('', include(router.urls)),
]

