import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserTitle(models.TextChoices):
    """User title enumeration"""
    MR = 'MR', 'Mr'
    MRS = 'MRS', 'Mrs'
    MS = 'MS', 'Ms'
    MISS = 'MISS', 'Miss'
    DR = 'DR', 'Dr'
    PROF = 'PROF', 'Prof'


class UserRole(models.TextChoices):
    """User role enumeration - matches TypeScript UserRole enum"""
    PUBLIC = 'PUBLIC', 'Public'
    RIDER = 'RIDER', 'Rider'
    CLUB = 'CLUB', 'Club'
    PROVINCIAL = 'PROVINCIAL', 'Provincial'
    SAEF = 'SAEF', 'SAEF'
    SHOW_HOLDING_BODY = 'SHOW_HOLDING_BODY', 'Show Holding Body'
    ADMIN = 'ADMIN', 'Administrator'
    OFFICIAL = 'OFFICIAL', 'Official'


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.

        Args:
            email: User's email address (used as username)
            password: User's password
            **extra_fields: Additional fields for the user model

        Returns:
            User instance

        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.

        Args:
            email: User's email address
            password: User's password
            **extra_fields: Additional fields for the user model

        Returns:
            User instance (superuser)

        Raises:
            ValueError: If is_staff or is_superuser is not True
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model using email for authentication.

    Extends AbstractBaseUser and PermissionsMixin to provide a custom user model
    with email-based authentication and role-based access control.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the user'
    )

    email = models.EmailField(
        unique=True,
        max_length=255,
        help_text='Email address (used as username for authentication)'
    )

    title = models.CharField(
        max_length=10,
        choices=UserTitle.choices,
        blank=True,
        null=True,
        help_text='User title (Mr, Mrs, Ms, Dr, Prof, etc.)'
    )

    first_name = models.CharField(
        max_length=150,
        help_text='User first name'
    )

    maiden_name = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text='User maiden name (optional)'
    )

    last_name = models.CharField(
        max_length=150,
        help_text='User last name'
    )

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.RIDER,
        help_text='User role determining permissions and access level'
    )

    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user should be treated as active'
    )

    is_staff = models.BooleanField(
        default=False,
        help_text='Designates whether the user can log into the admin site'
    )

    # Note: is_superuser comes from PermissionsMixin

    email_confirmed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user email was confirmed'
    )

    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user account was banned'
    )

    activated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the user account was activated'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when the user was created'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Timestamp when the user was last updated'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        """Return string representation of the user."""
        return self.email

    def get_full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        """Return the user's first name."""
        return self.first_name

    @property
    def is_banned(self):
        """Check if user is currently banned."""
        return self.banned_at is not None

    @property
    def is_email_confirmed(self):
        """Check if user email is confirmed."""
        return self.email_confirmed_at is not None

    @property
    def is_activated(self):
        """Check if user account is activated."""
        return self.activated_at is not None

