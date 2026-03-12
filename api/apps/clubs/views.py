from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Club, ShowHoldingBody, PaymentMethod, Extra
from .serializers import (
    ClubSerializer, ShowHoldingBodySerializer,
    PaymentMethodSerializer, ExtraSerializer
)


class ClubViewSet(viewsets.ModelViewSet):
    """ViewSet for Club model."""
    
    queryset = Club.objects.select_related('user', 'province').all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'is_test', 'province']
    search_fields = ['name', 'saef_number', 'city']
    ordering_fields = ['name', 'created_at']
    
    @action(detail=False, methods=['get'])
    def clubs_list(self, request):
        """Get a simplified list of clubs."""
        clubs = self.get_queryset().filter(is_active=True)
        data = [{'id': club.id, 'name': club.name} for club in clubs]
        return Response(data)


class ShowHoldingBodyViewSet(viewsets.ModelViewSet):
    """ViewSet for ShowHoldingBody model."""
    
    queryset = ShowHoldingBody.objects.select_related('user', 'province').all()
    serializer_class = ShowHoldingBodySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'is_test', 'province']
    search_fields = ['name', 'saef_number', 'city']
    ordering_fields = ['name', 'created_at']


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """ViewSet for PaymentMethod model."""
    
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']


class ExtraViewSet(viewsets.ModelViewSet):
    """ViewSet for Extra model."""
    
    queryset = Extra.objects.all()
    serializer_class = ExtraSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price']
    
    @action(detail=False, methods=['get'])
    def extras_report(self, request):
        """Get extras report with usage statistics."""
        extras = self.get_queryset().filter(is_active=True)
        data = []
        for extra in extras:
            data.append({
                'id': extra.id,
                'name': extra.name,
                'price': extra.price,
                'quantity_available': extra.quantity_available,
            })
        return Response(data)

