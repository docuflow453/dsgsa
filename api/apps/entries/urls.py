from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EntryViewSet, EntryClassViewSet, TransactionViewSet,
    EntryExtraViewSet, RidingOrderViewSet
)

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'entry-classes', EntryClassViewSet, basename='entry-class')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'entry-extras', EntryExtraViewSet, basename='entry-extra')
router.register(r'riding-orders', RidingOrderViewSet, basename='riding-order')

urlpatterns = [
    path('', include(router.urls)),
]

