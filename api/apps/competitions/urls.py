from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompetitionViewSet, CompetitionDateViewSet, CompetitionClassViewSet,
    CompetitionExtraViewSet, CompetitionFeeViewSet, CompetitionDocumentViewSet,
    GradeViewSet, ClassTypeViewSet, ClassRuleViewSet
)

router = DefaultRouter()
router.register(r'competitions', CompetitionViewSet, basename='competition')
router.register(r'competition-dates', CompetitionDateViewSet, basename='competition-date')
router.register(r'competition-classes', CompetitionClassViewSet, basename='competition-class')
router.register(r'competition-extras', CompetitionExtraViewSet, basename='competition-extra')
router.register(r'competition-fees', CompetitionFeeViewSet, basename='competition-fee')
router.register(r'competition-documents', CompetitionDocumentViewSet, basename='competition-document')
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'class-types', ClassTypeViewSet, basename='class-type')
router.register(r'class-rules', ClassRuleViewSet, basename='class-rule')

urlpatterns = [
    path('', include(router.urls)),
]

