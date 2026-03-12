from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HorseViewSet, HorseBreedViewSet, HorseColourViewSet,
    BreedTypeViewSet, StudFarmViewSet, VaccinationTypeViewSet,
    HorseVaccinationViewSet
)

router = DefaultRouter()
router.register(r'horses', HorseViewSet, basename='horse')
router.register(r'breeds', HorseBreedViewSet, basename='breed')
router.register(r'breed-types', BreedTypeViewSet, basename='breed-type')
router.register(r'horse-colors', HorseColourViewSet, basename='horse-color')
router.register(r'stud-farms', StudFarmViewSet, basename='stud-farm')
router.register(r'vaccination-types', VaccinationTypeViewSet, basename='vaccination-type')
router.register(r'horse-vaccinations', HorseVaccinationViewSet, basename='horse-vaccination')

urlpatterns = [
    path('', include(router.urls)),
]

