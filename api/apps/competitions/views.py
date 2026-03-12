from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Competition, CompetitionDate, CompetitionClass, CompetitionExtra,
    CompetitionFee, CompetitionDocument, Grade, ClassType, ClassRule
)
from .serializers import (
    CompetitionSerializer, CompetitionDetailSerializer, CompetitionDateSerializer,
    CompetitionClassSerializer, CompetitionExtraSerializer, CompetitionFeeSerializer,
    CompetitionDocumentSerializer, GradeSerializer, ClassTypeSerializer, ClassRuleSerializer
)
from .services import CompetitionService, RidingOrderService


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.select_related('show_holding_body').prefetch_related('dates', 'classes')
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition_type', 'show_holding_body', 'is_active', 'is_test']
    search_fields = ['name', 'venue']
    ordering_fields = ['entry_close', 'created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CompetitionDetailSerializer
        return CompetitionSerializer


class CompetitionDateViewSet(viewsets.ModelViewSet):
    queryset = CompetitionDate.objects.select_related('competition')
    serializer_class = CompetitionDateSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition', 'is_active', 'start_date']
    ordering_fields = ['start_date', 'start_time']
    
    @action(detail=True, methods=['post'])
    def generate_riding_order(self, request, pk=None):
        """Generate riding order for a competition date."""
        competition_date = self.get_object()
        riding_orders = RidingOrderService.generate_riding_order(competition_date)
        return Response({'message': f'Generated {len(riding_orders)} riding orders'})


class CompetitionClassViewSet(viewsets.ModelViewSet):
    queryset = CompetitionClass.objects.select_related('competition', 'grade', 'class_type', 'class_rule')
    serializer_class = CompetitionClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition', 'grade', 'class_type', 'is_active']
    ordering_fields = ['approximate_start_time', 'created_at']
    
    @action(detail=False, methods=['get'])
    def classes_riding_orders(self, request):
        """Get classes with their riding orders."""
        competition_id = request.query_params.get('competition')
        if competition_id:
            classes = self.get_queryset().filter(competition_id=competition_id)
        else:
            classes = self.get_queryset()
        serializer = self.get_serializer(classes, many=True)
        return Response(serializer.data)


class CompetitionExtraViewSet(viewsets.ModelViewSet):
    queryset = CompetitionExtra.objects.select_related('competition')
    serializer_class = CompetitionExtraSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition', 'is_stable', 'is_active']


class CompetitionFeeViewSet(viewsets.ModelViewSet):
    queryset = CompetitionFee.objects.select_related('competition')
    serializer_class = CompetitionFeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition', 'is_active']


class CompetitionDocumentViewSet(viewsets.ModelViewSet):
    queryset = CompetitionDocument.objects.select_related('competition')
    serializer_class = CompetitionDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['competition', 'document_type', 'is_active']


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']


class ClassTypeViewSet(viewsets.ModelViewSet):
    queryset = ClassType.objects.all()
    serializer_class = ClassTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']


class ClassRuleViewSet(viewsets.ModelViewSet):
    queryset = ClassRule.objects.all()
    serializer_class = ClassRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']

