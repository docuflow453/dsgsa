from django.db import models
from django.conf import settings


class Transaction(models.Model):
    """Transaction model based on ERD specifications."""

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    competition = models.ForeignKey(
        'competitions.Competition',
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    purchased_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_transactions'
    )
    reference = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.ForeignKey(
        'payments.PaymentMethod',
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_transactions'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Transaction {self.id} - R{self.amount} ({self.payment_status})"


class Entry(models.Model):
    """Entry model based on ERD specifications."""

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='entries'
    )
    rider = models.ForeignKey(
        'riders.Rider',
        on_delete=models.CASCADE,
        related_name='entries'
    )
    horse = models.ForeignKey(
        'horses.Horse',
        on_delete=models.CASCADE,
        related_name='entries'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'entries'
        ordering = ['-created_at']
        verbose_name_plural = 'Entries'
    
    def __str__(self):
        return f"{self.rider.user.get_full_name()} - {self.horse.name}"


class EntryClass(models.Model):
    """Entry class linking entries to competition classes."""
    
    entry = models.ForeignKey(
        Entry,
        on_delete=models.CASCADE,
        related_name='entry_classes'
    )
    competition_class = models.ForeignKey(
        'competitions.CompetitionClass',
        on_delete=models.CASCADE,
        related_name='entry_classes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'entry_classes'
        unique_together = ['entry', 'competition_class']
        verbose_name_plural = 'Entry Classes'
    
    def __str__(self):
        return f"{self.entry} - {self.competition_class}"


class EntryExtra(models.Model):
    """Entry extra linking entries to competition extras."""
    
    entry = models.ForeignKey(
        Entry,
        on_delete=models.CASCADE,
        related_name='extras'
    )
    competition_extra = models.ForeignKey(
        'competitions.CompetitionExtra',
        on_delete=models.CASCADE,
        related_name='entries'
    )
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_extras'
    
    def __str__(self):
        return f"{self.entry} - {self.competition_extra.name} x{self.quantity}"


class RidingOrder(models.Model):
    """Riding order model for managing competition class orders."""
    
    entry_class = models.ForeignKey(
        EntryClass,
        on_delete=models.CASCADE,
        related_name='riding_orders'
    )
    order = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'riding_orders'
        ordering = ['competition_class', 'order']
        unique_together = ['entry', 'competition_class']
    
    def __str__(self):
        return f"{self.entry_class} - Order {self.order}: {self.entry_class.entry.rider.user.get_full_name()}"

