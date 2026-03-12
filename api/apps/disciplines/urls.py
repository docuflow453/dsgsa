from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisciplineViewSet

router = DefaultRouter()
router.register(r'disciplines', DisciplineViewSet, basename='discipline')

urlpatterns = [
    path('', include(router.urls)),
]

