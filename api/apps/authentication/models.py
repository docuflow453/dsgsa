from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model based on ERD specifications."""
    
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('rider', 'Rider'),
        ('club', 'Club'),
        ('show_holding_body', 'Show Holding Body'),
        ('saef_admin', 'SAEF Administrator'),
        ('official', 'Official'),
    ]
    
    TITLE_CHOICES = [
        ('mr', 'Mr'),
        ('mrs', 'Mrs'),
        ('ms', 'Ms'),
        ('dr', 'Dr'),
        ('prof', 'Prof'),
    ]
    
    email = models.EmailField(unique=True, db_index=True)
    title = models.CharField(max_length=10, choices=TITLE_CHOICES, blank=True)
    first_name = models.CharField(max_length=150)
    maiden_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='rider')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    email_confirmed_at = models.DateTimeField(null=True, blank=True)
    banned_at = models.DateTimeField(null=True, blank=True)
    activated_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Return the user's short name."""
        return self.first_name


class Year(models.Model):
    """Year model for managing competition years."""
    
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    open_at = models.DateTimeField(null=True, blank=True)
    password = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'years'
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title


class Membership(models.Model):
    """Membership types for riders."""
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'memberships'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Classification(models.Model):
    """Horse classification types."""
    
    name = models.CharField(max_length=255)
    is_pony = models.BooleanField(default=False)
    is_recreational = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'classifications'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Province(models.Model):
    """Province/State model."""

    name = models.CharField(max_length=255)
    country_id = models.IntegerField(default=1)  # Default to South Africa

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'provinces'
        ordering = ['name']

    def __str__(self):
        return self.name


class YearClassificationFee(models.Model):
    """Fee structure for classifications per year."""

    classification = models.ForeignKey(
        Classification,
        on_delete=models.CASCADE,
        related_name='year_fees'
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='classification_fees'
    )
    fee = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'year_classification_fees'
        unique_together = ['classification', 'year']

    def __str__(self):
        return f"{self.classification.name} - {self.year.title}: R{self.fee}"


class Levy(models.Model):
    """Levy model for additional fees."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    fee_exclusive = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'levies'
        ordering = ['name']

    def __str__(self):
        return self.name

