from django.apps import AppConfig


class HorseConfig(AppConfig):
    """Configuration for the Horse application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.horse'
    verbose_name = 'Horse Management'
    
    def ready(self):
        """Import any signal handlers or perform app initialization."""
        pass

