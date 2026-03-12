from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Horse, HorseBreed, HorseColour, BreedType, StudFarm, VaccinationType, HorseVaccination
from .serializers import (
    HorseSerializer, HorseDetailSerializer, HorseBreedSerializer,
    HorseColourSerializer, BreedTypeSerializer, StudFarmSerializer,
    VaccinationTypeSerializer, HorseVaccinationSerializer
)


class HorseViewSet(viewsets.ModelViewSet):
    """ViewSet for Horse model."""
    
    queryset = Horse.objects.select_related('breed', 'breed_type', 'colour').prefetch_related('vaccinations')
    serializer_class = HorseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['gender', 'breed', 'colour', 'is_test']
    search_fields = ['name', 'passport_number', 'microchip_number']
    ordering_fields = ['name', 'date_of_birth', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return HorseDetailSerializer
        return HorseSerializer
    
    @action(detail=False, methods=['get'])
    def horse_search(self, request):
        """Search horses by name or passport number."""
        query = request.query_params.get('q', '')
        if query:
            horses = self.get_queryset().filter(
                name__icontains=query
            ) | self.get_queryset().filter(
                passport_number__icontains=query
            )
        else:
            horses = self.get_queryset()[:20]
        
        serializer = self.get_serializer(horses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def horses_details(self, request):
        """Get detailed list of horses."""
        horses = self.get_queryset()
        serializer = HorseDetailSerializer(horses, many=True)
        return Response(serializer.data)


class HorseBreedViewSet(viewsets.ModelViewSet):
    """ViewSet for HorseBreed model."""
    
    queryset = HorseBreed.objects.all()
    serializer_class = HorseBreedSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name']


class BreedTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for BreedType model."""
    
    queryset = BreedType.objects.all()
    serializer_class = BreedTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name']


class HorseColourViewSet(viewsets.ModelViewSet):
    """ViewSet for HorseColour model."""
    
    queryset = HorseColour.objects.all()
    serializer_class = HorseColourSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code']


class StudFarmViewSet(viewsets.ModelViewSet):
    """ViewSet for StudFarm model."""
    
    queryset = StudFarm.objects.all()
    serializer_class = StudFarmSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name', 'registration_number']


class VaccinationTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for VaccinationType model."""
    
    queryset = VaccinationType.objects.all()
    serializer_class = VaccinationTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name']


class HorseVaccinationViewSet(viewsets.ModelViewSet):
    """ViewSet for HorseVaccination model."""
    
    queryset = HorseVaccination.objects.select_related('horse', 'vaccination_type')
    serializer_class = HorseVaccinationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['horse', 'vaccination_type']
    ordering_fields = ['date', 'created_at']

