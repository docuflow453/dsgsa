from django.db import models
from django.conf import settings


class Club(models.Model):
    """Club model based on ERD specifications."""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='club'
    )
    name = models.CharField(max_length=255)
    saef_number = models.CharField(max_length=100, blank=True)
    
    # Address fields
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    province = models.ForeignKey(
        'authentication.Province',
        on_delete=models.SET_NULL,
        null=True,
        related_name='clubs'
    )
    suburb = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='South Africa')
    
    is_active = models.BooleanField(default=True)
    is_test = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'clubs'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ShowHoldingBody(models.Model):
    """Show Holding Body model based on ERD specifications."""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='show_holding_body'
    )
    name = models.CharField(max_length=255)
    saef_number = models.CharField(max_length=100, blank=True)
    established_at = models.DateField(null=True, blank=True)
    website = models.URLField(blank=True)
    
    # Address fields
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    province = models.ForeignKey(
        'authentication.Province',
        on_delete=models.SET_NULL,
        null=True,
        related_name='show_holding_bodies'
    )
    suburb = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='South Africa')
    
    # Banking details
    account_type = models.CharField(max_length=50, blank=True)
    account_name = models.CharField(max_length=255, blank=True)
    branch_code = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_test = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'show_holding_bodies'
        ordering = ['name']
        verbose_name_plural = 'Show Holding Bodies'
    
    def __str__(self):
        return self.name


class PaymentMethod(models.Model):
    """Payment method model."""

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Processing fee (percentage or fixed amount)")
    allow_for_entries = models.BooleanField(default=True, help_text="Allow this payment method for competition entries")
    allow_for_renewals = models.BooleanField(default=True, help_text="Allow this payment method for membership renewals")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_methods'
        ordering = ['name']

    def __str__(self):
        return self.name


class Extra(models.Model):
    """Extra items/services that can be added to entries."""
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'extras'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - R{self.price}"

