from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, RiderAccountViewSet, HorseAccountViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'rider-accounts', RiderAccountViewSet, basename='rider-account')
router.register(r'horse-accounts', HorseAccountViewSet, basename='horse-account')

urlpatterns = [
    path('', include(router.urls)),
]

