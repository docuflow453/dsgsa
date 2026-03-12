from rest_framework import viewsets, permissions
from .models import Account, RiderAccount, HorseAccount
from .serializers import AccountSerializer, RiderAccountSerializer, HorseAccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    """ViewSet for Account model."""
    
    queryset = Account.objects.select_related('user', 'year', 'approved_by')
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['user', 'year', 'payment_method', 'approved_at']
    ordering_fields = ['created_at', 'amount']


class RiderAccountViewSet(viewsets.ModelViewSet):
    """ViewSet for RiderAccount model."""
    
    queryset = RiderAccount.objects.select_related('rider__user', 'account', 'subscription')
    serializer_class = RiderAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['rider', 'account', 'subscription']
    ordering_fields = ['created_at']


class HorseAccountViewSet(viewsets.ModelViewSet):
    """ViewSet for HorseAccount model."""
    
    queryset = HorseAccount.objects.select_related('horse', 'account', 'classification_type')
    serializer_class = HorseAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['horse', 'account', 'classification_type']
    ordering_fields = ['created_at']

