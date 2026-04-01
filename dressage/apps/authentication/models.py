import uuid
from datetime import timedelta
from django.conf import settings
from django.db import models
from django.utils import timezone


class RefreshToken(models.Model):
    """
    Model to store JWT refresh tokens for tracking and revocation.

    This allows invalidating refresh tokens on logout and provides
    security auditing through IP address tracking.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the refresh token'
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='auth_refresh_tokens',
        help_text='User who owns this refresh token'
    )

    token = models.TextField(
        unique=True,
        db_index=True,
        help_text='The JWT refresh token string'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When the refresh token was created'
    )

    expires_at = models.DateTimeField(
        help_text='When the refresh token expires'
    )

    is_revoked = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Whether the token has been revoked'
    )

    revoked_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the token was revoked'
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address from which the token was created'
    )

    class Meta:
        db_table = 'auth_refresh_tokens'
        verbose_name = 'Refresh Token'
        verbose_name_plural = 'Refresh Tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'is_revoked']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"Refresh token for {self.user.username} (expires {self.expires_at})"

    @property
    def is_expired(self):
        """Check if the token has expired."""
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        """Check if the token is still valid (not expired and not revoked)."""
        return not self.is_expired and not self.is_revoked

    def revoke(self):
        """Revoke the token."""
        if not self.is_revoked:
            self.is_revoked = True
            self.revoked_at = timezone.now()
            self.save(update_fields=['is_revoked', 'revoked_at'])
