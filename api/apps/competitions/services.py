from django.utils import timezone
from .models import Competition, CompetitionDate, CompetitionClass
import random


class CompetitionService:
    """Service class for Competition-related business logic."""
    
    @staticmethod
    def get_active_competitions():
        """Get all active competitions."""
        return Competition.objects.filter(is_active=True)
    
    @staticmethod
    def get_upcoming_competitions():
        """Get upcoming competitions that haven't closed yet."""
        now = timezone.now()
        return Competition.objects.filter(
            is_active=True,
            entry_close__gte=now
        ).order_by('entry_close')
    
    @staticmethod
    def is_entry_open(competition):
        """Check if entries are still open for a competition."""
        return timezone.now() < competition.entry_close
    
    @staticmethod
    def calculate_total_entry_fee(competition, classes, extras=None):
        """Calculate total entry fee for a competition entry."""
        total = sum(cls.fee for cls in classes)
        
        if extras:
            total += sum(extra.price * quantity for extra, quantity in extras)
        
        # Add competition fees
        fees = competition.fees.filter(is_active=True, is_included_in_entry_fee=False)
        total += sum(fee.fee for fee in fees)
        
        return total
    
    @staticmethod
    def get_competition_by_slug(slug):
        """Get competition by slug."""
        return Competition.objects.filter(slug=slug, is_active=True).first()


class CompetitionClassService:
    """Service class for CompetitionClass-related business logic."""
    
    @staticmethod
    def get_classes_by_competition(competition):
        """Get all classes for a competition."""
        return CompetitionClass.objects.filter(
            competition=competition,
            is_active=True
        ).order_by('approximate_start_time')
    
    @staticmethod
    def get_classes_by_grade(grade):
        """Get all classes for a specific grade."""
        return CompetitionClass.objects.filter(
            grade=grade,
            is_active=True
        )


class RidingOrderService:
    """Service class for generating and managing riding orders."""
    
    @staticmethod
    def generate_riding_order(competition_date):
        """Generate riding order for a competition date."""
        from apps.entries.models import Entry, RidingOrder
        
        # Get all entries for this competition
        entries = Entry.objects.filter(
            competition=competition_date.competition,
            is_active=True
        ).select_related('rider', 'horse')
        
        # Group entries by class
        class_entries = {}
        for entry in entries:
            for entry_class in entry.entry_classes.all():
                if entry_class.competition_class.id not in class_entries:
                    class_entries[entry_class.competition_class.id] = []
                class_entries[entry_class.competition_class.id].append(entry)
        
        # Generate riding orders for each class
        riding_orders = []
        for class_id, class_entry_list in class_entries.items():
            # Randomize order
            random.shuffle(class_entry_list)
            
            for order, entry in enumerate(class_entry_list, start=1):
                riding_order, created = RidingOrder.objects.get_or_create(
                    entry=entry,
                    competition_class_id=class_id,
                    defaults={'order': order}
                )
                if not created:
                    riding_order.order = order
                    riding_order.save()
                riding_orders.append(riding_order)
        
        return riding_orders
    
    @staticmethod
    def get_riding_order_by_class(competition_class):
        """Get riding order for a specific class."""
        from apps.entries.models import RidingOrder
        return RidingOrder.objects.filter(
            competition_class=competition_class
        ).order_by('order')

