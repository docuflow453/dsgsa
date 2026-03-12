from django.db import models


class Subscription(models.Model):
    """Subscription model based on ERD specifications."""
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    memberships = models.ManyToManyField(
        'authentication.Membership',
        related_name='subscriptions',
        blank=True
    )
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    year = models.ForeignKey(
        'authentication.Year',
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    
    is_official = models.BooleanField(default=False)
    is_recreational = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.year.title}"

