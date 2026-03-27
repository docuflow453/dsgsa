from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Entry, EntryClass, Transaction, EntryExtra, RidingOrder
from .serializers import (
    EntrySerializer, EntryDetailSerializer, EntryClassSerializer,
    TransactionSerializer, EntryExtraSerializer, RidingOrderSerializer
)


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.select_related('rider__user', 'horse', 'competition').prefetch_related('entry_classes')
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['rider', 'horse', 'competition', 'is_active']
    search_fields = ['rider__user__first_name', 'rider__user__last_name', 'horse__name']
    ordering_fields = ['created_at', 'amount']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EntryDetailSerializer
        return EntrySerializer
    
    @action(detail=False, methods=['get'])
    def entries_list(self, request):
        """Get simplified list of entries."""
        entries = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def entries_details(self, request):
        """Get detailed list of entries."""
        entries = self.get_queryset()
        serializer = EntryDetailSerializer(entries, many=True)
        return Response(serializer.data)


class EntryClassViewSet(viewsets.ModelViewSet):
    queryset = EntryClass.objects.select_related('entry', 'competition_class')
    serializer_class = EntryClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['entry', 'competition_class']


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.select_related('entry', 'approved_by').prefetch_related('transaction_extras')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['entry', 'payment_status', 'payment_method']
    ordering_fields = ['created_at', 'amount']
    
    @action(detail=False, methods=['get'])
    def competition_transactions(self, request):
        """Get transactions for a specific competition."""
        competition_id = request.query_params.get('competition')
        if competition_id:
            transactions = self.get_queryset().filter(entry__competition_id=competition_id)
        else:
            transactions = self.get_queryset()
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)


class EntryExtraViewSet(viewsets.ModelViewSet):
    queryset = EntryExtra.objects.select_related('entry', 'competition_extra')
    serializer_class = EntryExtraSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['entry', 'competition_extra']


class RidingOrderViewSet(viewsets.ModelViewSet):
    queryset = RidingOrder.objects.select_related('entry__rider__user', 'entry__horse', 'competition_class')
    serializer_class = RidingOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['entry', 'competition_class']
    ordering_fields = ['order', 'created_at']

