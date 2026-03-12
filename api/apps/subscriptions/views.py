from rest_framework import viewsets, permissions
from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.prefetch_related('memberships').select_related('year')
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['year', 'is_official', 'is_recreational', 'is_admin', 'is_active']
    search_fields = ['name', 'description']

