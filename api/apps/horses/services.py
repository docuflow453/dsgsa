from django.utils import timezone
from .models import Horse, HorseBreed, HorseVaccination


class HorseService:
    """Service class for Horse-related business logic."""
    
    @staticmethod
    def search_horses(query):
        """Search horses by name or passport number."""
        return Horse.objects.filter(
            name__icontains=query
        ) | Horse.objects.filter(
            passport_number__icontains=query
        )
    
    @staticmethod
    def get_horses_by_breed(breed):
        """Get all horses of a specific breed."""
        return Horse.objects.filter(breed=breed)
    
    @staticmethod
    def get_horses_by_gender(gender):
        """Get all horses of a specific gender."""
        return Horse.objects.filter(gender=gender)
    
    @staticmethod
    def is_passport_valid(horse):
        """Check if a horse's passport is still valid."""
        if not horse.passport_expiry:
            return False
        return horse.passport_expiry >= timezone.now().date()
    
    @staticmethod
    def get_horse_age(horse):
        """Calculate the age of a horse."""
        if not horse.date_of_birth:
            return None
        today = timezone.now().date()
        age = today.year - horse.date_of_birth.year
        if today.month < horse.date_of_birth.month or (
            today.month == horse.date_of_birth.month and today.day < horse.date_of_birth.day
        ):
            age -= 1
        return age


class HorseVaccinationService:
    """Service class for HorseVaccination-related business logic."""
    
    @staticmethod
    def get_horse_vaccinations(horse):
        """Get all vaccinations for a specific horse."""
        return HorseVaccination.objects.filter(horse=horse).order_by('-date')
    
    @staticmethod
    def get_latest_vaccination(horse, vaccination_type):
        """Get the latest vaccination of a specific type for a horse."""
        return HorseVaccination.objects.filter(
            horse=horse,
            vaccination_type=vaccination_type
        ).order_by('-date').first()
    
    @staticmethod
    def is_vaccination_current(horse, vaccination_type, validity_months=12):
        """Check if a horse's vaccination is current."""
        latest = HorseVaccinationService.get_latest_vaccination(horse, vaccination_type)
        if not latest:
            return False
        
        from dateutil.relativedelta import relativedelta
        expiry_date = latest.date + relativedelta(months=validity_months)
        return expiry_date >= timezone.now().date()
    
    @staticmethod
    def add_vaccination(horse, vaccination_type, date):
        """Add a vaccination record for a horse."""
        return HorseVaccination.objects.create(
            horse=horse,
            vaccination_type=vaccination_type,
            date=date
        )

