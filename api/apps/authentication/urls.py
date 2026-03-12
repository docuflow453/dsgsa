from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, YearViewSet, MembershipViewSet, ClassificationViewSet,
    ProvinceViewSet, YearClassificationFeeViewSet, LevyViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'years', YearViewSet, basename='year')
router.register(r'memberships', MembershipViewSet, basename='membership')
router.register(r'classifications', ClassificationViewSet, basename='classification')
router.register(r'provinces', ProvinceViewSet, basename='province')
router.register(r'year-classification-fees', YearClassificationFeeViewSet, basename='year-classification-fee')
router.register(r'levies', LevyViewSet, basename='levy')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', UserViewSet.as_view({'post': 'login'}), name='auth-login'),
    path('register/', UserViewSet.as_view({'post': 'register'}), name='auth-register'),
]

