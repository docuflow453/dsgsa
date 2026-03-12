from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Rider, SaefMembership
from .serializers import RiderSerializer, RiderDetailSerializer, SaefMembershipSerializer


class RiderViewSet(viewsets.ModelViewSet):
    """ViewSet for Rider model."""
    
    queryset = Rider.objects.select_related('user', 'province').prefetch_related('saef_memberships')
    serializer_class = RiderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'is_international', 'is_test', 'gender', 'province']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'saef_number', 'id_number']
    ordering_fields = ['created_at', 'user__last_name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RiderDetailSerializer
        return RiderSerializer
    
    @action(detail=False, methods=['get'])
    def riders_detail(self, request):
        """Get detailed list of riders."""
        riders = self.get_queryset()
        serializer = RiderDetailSerializer(riders, many=True)
        return Response(serializer.data)


class SaefMembershipViewSet(viewsets.ModelViewSet):
    """ViewSet for SaefMembership model."""
    
    queryset = SaefMembership.objects.select_related('rider__user', 'year', 'approved_by')
    serializer_class = SaefMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['rider', 'year', 'approved_at']
    ordering_fields = ['created_at', 'approved_at']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a SAEF membership."""
        from django.utils import timezone
        
        membership = self.get_object()
        membership.approved_at = timezone.now()
        membership.approved_by = request.user
        membership.save()
        
        serializer = self.get_serializer(membership)
        return Response(serializer.data)


