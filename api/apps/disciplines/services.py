from .models import Discipline


class DisciplineService:
    """Service class for Discipline-related business logic."""
    
    @staticmethod
    def get_active_disciplines():
        """Get all active disciplines."""
        return Discipline.objects.filter(is_active=True)
    
    @staticmethod
    def get_discipline_by_code(code):
        """Get discipline by code."""
        return Discipline.objects.filter(code=code, is_active=True).first()

