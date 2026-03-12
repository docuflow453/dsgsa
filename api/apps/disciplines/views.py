from rest_framework import viewsets, permissions
from .models import Discipline
from .serializers import DisciplineSerializer


class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']

