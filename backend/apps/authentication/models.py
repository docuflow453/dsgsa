import uuid
from datetime import timedelta
from django.conf import settings
from django.db import models
from django.utils import timezone


class PasswordResetToken(models.Model):
    """
    Model to store password reset tokens with expiry.
    
    This model tracks password reset requests and ensures tokens are:
    - Unique and secure (using UUID)
    - Time-limited (expire after a set duration)
    - Single-use (can be marked as used)
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the reset token'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens',
        help_text='User who requested the password reset'
    )
    
    token = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text='The actual reset token sent to user'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When the reset token was created'
    )
    
    expires_at = models.DateTimeField(
        help_text='When the reset token expires'
    )
    
    used_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the reset token was used (null if not used)'
    )
    
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address from which reset was requested'
    )
    
    class Meta:
        db_table = 'password_reset_tokens'
        verbose_name = 'Password Reset Token'
        verbose_name_plural = 'Password Reset Tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'expires_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Reset token for {self.user.email} - {self.created_at}"
    
    def save(self, *args, **kwargs):
        """Set expiry time on creation if not already set."""
        if not self.expires_at:
            # Token expires after 1 hour by default
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Check if the token has expired."""
        return timezone.now() > self.expires_at
    
    @property
    def is_used(self):
        """Check if the token has been used."""
        return self.used_at is not None
    
    @property
    def is_valid(self):
        """Check if the token is still valid (not expired and not used)."""
        return not self.is_expired and not self.is_used
    
    def mark_as_used(self):
        """Mark the token as used."""
        self.used_at = timezone.now()
        self.save()


class RefreshToken(models.Model):
    """
    Model to store JWT refresh tokens.
    
    This allows tracking and revoking refresh tokens if needed.
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='refresh_tokens'
    )
    
    token = models.TextField(
        unique=True,
        help_text='The JWT refresh token'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    expires_at = models.DateTimeField(
        help_text='When the refresh token expires'
    )
    
    revoked_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the token was revoked'
    )
    
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address from which token was created'
    )
    
    class Meta:
        db_table = 'refresh_tokens'
        verbose_name = 'Refresh Token'
        verbose_name_plural = 'Refresh Tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Refresh token for {self.user.email}"
    
    @property
    def is_expired(self):
        """Check if the token has expired."""
        return timezone.now() > self.expires_at
    
    @property
    def is_revoked(self):
        """Check if the token has been revoked."""
        return self.revoked_at is not None
    
    @property
    def is_valid(self):
        """Check if the token is still valid."""
        return not self.is_expired and not self.is_revoked
    
    def revoke(self):
        """Revoke the token."""
        self.revoked_at = timezone.now()
        self.save()

