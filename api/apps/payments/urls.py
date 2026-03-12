from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentGatewayViewSet, PayFastPaymentViewSet, EFTPaymentViewSet

router = DefaultRouter()
router.register(r'payment-gateways', PaymentGatewayViewSet, basename='payment-gateway')
router.register(r'payfast-payments', PayFastPaymentViewSet, basename='payfast-payment')
router.register(r'eft-payments', EFTPaymentViewSet, basename='eft-payment')

urlpatterns = [
    path('', include(router.urls)),
]

