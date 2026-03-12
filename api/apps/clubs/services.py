from .models import Club, ShowHoldingBody, PaymentMethod, Extra


class ClubService:
    """Service class for Club-related business logic."""
    
    @staticmethod
    def get_active_clubs():
        """Get all active clubs."""
        return Club.objects.filter(is_active=True)
    
    @staticmethod
    def get_club_by_saef_number(saef_number):
        """Get club by SAEF number."""
        return Club.objects.filter(saef_number=saef_number, is_active=True).first()
    
    @staticmethod
    def get_clubs_by_province(province):
        """Get all clubs in a specific province."""
        return Club.objects.filter(province=province, is_active=True)


class ShowHoldingBodyService:
    """Service class for ShowHoldingBody-related business logic."""
    
    @staticmethod
    def get_active_show_holding_bodies():
        """Get all active show holding bodies."""
        return ShowHoldingBody.objects.filter(is_active=True)
    
    @staticmethod
    def get_show_holding_body_by_saef_number(saef_number):
        """Get show holding body by SAEF number."""
        return ShowHoldingBody.objects.filter(saef_number=saef_number, is_active=True).first()


class PaymentMethodService:
    """Service class for PaymentMethod-related business logic."""
    
    @staticmethod
    def get_active_payment_methods():
        """Get all active payment methods."""
        return PaymentMethod.objects.filter(is_active=True)
    
    @staticmethod
    def get_payment_method_by_code(code):
        """Get payment method by code."""
        return PaymentMethod.objects.filter(code=code, is_active=True).first()


class ExtraService:
    """Service class for Extra-related business logic."""
    
    @staticmethod
    def get_available_extras():
        """Get all available extras."""
        return Extra.objects.filter(is_active=True)
    
    @staticmethod
    def check_extra_availability(extra, quantity):
        """Check if an extra has sufficient quantity available."""
        if extra.quantity_available is None:
            return True  # Unlimited quantity
        return extra.quantity_available >= quantity
    
    @staticmethod
    def reduce_extra_quantity(extra, quantity):
        """Reduce the available quantity of an extra."""
        if extra.quantity_available is not None:
            extra.quantity_available -= quantity
            extra.save()
        return extra

