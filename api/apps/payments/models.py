from django.db import models


class PaymentGateway(models.Model):
    """Payment gateway model."""
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    api_key = models.CharField(max_length=255, blank=True)
    api_secret = models.CharField(max_length=255, blank=True)
    merchant_id = models.CharField(max_length=255, blank=True)
    merchant_key = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_test_mode = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_gateways'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class PayFastPayment(models.Model):
    """PayFast payment model."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('complete', 'Complete'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    transaction = models.ForeignKey(
        'entries.Transaction',
        on_delete=models.CASCADE,
        related_name='payfast_payments'
    )
    merchant_id = models.CharField(max_length=255)
    merchant_key = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    item_name = models.CharField(max_length=255)
    payment_id = models.CharField(max_length=255, blank=True)
    pf_payment_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payfast_payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"PayFast {self.payment_id} - R{self.amount}"


class EFTPayment(models.Model):
    """EFT payment model."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    transaction = models.ForeignKey(
        'entries.Transaction',
        on_delete=models.CASCADE,
        related_name='eft_payments'
    )
    reference_number = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bank_name = models.CharField(max_length=255)
    account_holder = models.CharField(max_length=255)
    payment_date = models.DateField()
    proof_of_payment = models.FileField(upload_to='eft_proofs/', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'eft_payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"EFT {self.reference_number} - R{self.amount}"

