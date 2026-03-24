from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .models import Year, Membership, Classification, Province, YearClassificationFee, Levy
from .serializers import (
    UserSerializer, UserCreateSerializer, YearSerializer, MembershipSerializer,
    ClassificationSerializer, ProvinceSerializer, YearClassificationFeeSerializer,
    LevySerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['role', 'is_active', 'email']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'last_name']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Register a new user."""
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Authenticate user and return token."""
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is inactive'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, created = Token.objects.get_or_create(user=user)

        # Return response in the format expected by frontend
        return Response({
            'token': token.key,
            'user': {
                'id': str(user.id),  # Convert UUID to string
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'name': user.get_full_name(),
                'role': user.role
            }
        })


class YearViewSet(viewsets.ModelViewSet):
    """ViewSet for Year model."""
    
    queryset = Year.objects.all()
    serializer_class = YearSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    ordering_fields = ['start_date', 'created_at']


class MembershipViewSet(viewsets.ModelViewSet):
    """ViewSet for Membership model."""
    
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'code']
    search_fields = ['name', 'code']


class ClassificationViewSet(viewsets.ModelViewSet):
    """ViewSet for Classification model."""
    
    queryset = Classification.objects.all()
    serializer_class = ClassificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_pony', 'is_recreational', 'is_admin', 'is_active']
    search_fields = ['name']


class ProvinceViewSet(viewsets.ModelViewSet):
    """ViewSet for Province model."""
    
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name']


class YearClassificationFeeViewSet(viewsets.ModelViewSet):
    """ViewSet for YearClassificationFee model."""
    
    queryset = YearClassificationFee.objects.select_related('classification', 'year')
    serializer_class = YearClassificationFeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['classification', 'year']


class LevyViewSet(viewsets.ModelViewSet):
    """ViewSet for Levy model."""
    
    queryset = Levy.objects.all()
    serializer_class = LevySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']

