from django.db import models
from django.conf import settings


class Rider(models.Model):
    """Rider model based on ERD specifications."""
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    ETHNICITY_CHOICES = [
        ('african', 'African'),
        ('coloured', 'Coloured'),
        ('indian', 'Indian'),
        ('white', 'White'),
        ('other', 'Other'),
    ]
    
    ACCOUNT_TYPE_CHOICES = [
        ('savings', 'Savings'),
        ('cheque', 'Cheque'),
        ('current', 'Current'),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='rider'
    )
    
    saef_number = models.CharField(max_length=100, blank=True)
    id_number = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    ethnicity = models.CharField(max_length=50, choices=ETHNICITY_CHOICES, blank=True)
    
    # Passport information
    passport_number = models.CharField(max_length=100, blank=True)
    passport_expiry = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, default='South Africa')
    
    # Address fields
    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)
    province = models.ForeignKey(
        'authentication.Province',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='riders'
    )
    suburb = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='South Africa')
    
    # Banking details
    account_type = models.CharField(max_length=50, choices=ACCOUNT_TYPE_CHOICES, blank=True)
    account_name = models.CharField(max_length=255, blank=True)
    branch_code = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_international = models.BooleanField(default=False)
    is_test = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'riders'
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.saef_number})"


class SaefMembership(models.Model):
    """SAEF Membership model based on ERD specifications."""
    
    rider = models.ForeignKey(
        Rider,
        on_delete=models.CASCADE,
        related_name='saef_memberships'
    )
    year = models.ForeignKey(
        'authentication.Year',
        on_delete=models.CASCADE,
        related_name='saef_memberships'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_saef_memberships'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'saef_memberships'
        unique_together = ['rider', 'year']
        ordering = ['-year', 'rider']
    
    def __str__(self):
        return f"{self.rider.user.get_full_name()} - {self.year.title}"



