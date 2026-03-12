from .models import Subscription


class SubscriptionService:
    """Service class for Subscription-related business logic."""
    
    @staticmethod
    def get_active_subscriptions(year=None):
        """Get all active subscriptions, optionally filtered by year."""
        queryset = Subscription.objects.filter(is_active=True)
        if year:
            queryset = queryset.filter(year=year)
        return queryset
    
    @staticmethod
    def get_official_subscriptions(year):
        """Get official subscriptions for a year."""
        return Subscription.objects.filter(year=year, is_official=True, is_active=True)
    
    @staticmethod
    def get_recreational_subscriptions(year):
        """Get recreational subscriptions for a year."""
        return Subscription.objects.filter(year=year, is_recreational=True, is_active=True)

