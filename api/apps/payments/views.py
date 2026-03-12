from rest_framework import viewsets, permissions
from .models import PaymentGateway, PayFastPayment, EFTPayment
from .serializers import PaymentGatewaySerializer, PayFastPaymentSerializer, EFTPaymentSerializer


class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'is_test_mode', 'code']


class PayFastPaymentViewSet(viewsets.ModelViewSet):
    queryset = PayFastPayment.objects.select_related('transaction')
    serializer_class = PayFastPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['transaction', 'status']


class EFTPaymentViewSet(viewsets.ModelViewSet):
    queryset = EFTPayment.objects.select_related('transaction')
    serializer_class = EFTPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['transaction', 'status']

