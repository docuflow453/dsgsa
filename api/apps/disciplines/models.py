from django.db import models


class Discipline(models.Model):
    """Discipline model for equestrian disciplines."""
    
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'disciplines'
        ordering = ['name']
    
    def __str__(self):
        return self.name

