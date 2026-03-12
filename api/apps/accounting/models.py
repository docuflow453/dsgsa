from django.db import models
from django.conf import settings


class Account(models.Model):
    """Account model for tracking payments."""
    
    PAYMENT_METHOD_CHOICES = [
        ('eft', 'EFT'),
        ('payfast', 'PayFast'),
        ('cash', 'Cash'),
        ('card', 'Card'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='accounts'
    )
    year = models.ForeignKey(
        'authentication.Year',
        on_delete=models.CASCADE,
        related_name='accounts'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_accounts'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - R{self.amount} ({self.year.title})"


class RiderAccount(models.Model):
    """Rider account linking riders to accounts and subscriptions."""
    
    rider = models.ForeignKey(
        'riders.Rider',
        on_delete=models.CASCADE,
        related_name='rider_accounts'
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='rider_accounts'
    )
    subscription = models.ForeignKey(
        'subscriptions.Subscription',
        on_delete=models.CASCADE,
        related_name='rider_accounts'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rider_accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rider} - {self.subscription.name}"


class HorseAccount(models.Model):
    """Horse account linking horses to accounts and classifications."""
    
    horse = models.ForeignKey(
        'horses.Horse',
        on_delete=models.CASCADE,
        related_name='horse_accounts'
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='horse_accounts'
    )
    classification_type = models.ForeignKey(
        'authentication.Classification',
        on_delete=models.CASCADE,
        related_name='horse_accounts'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'horse_accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.horse.name} - {self.classification_type.name}"

