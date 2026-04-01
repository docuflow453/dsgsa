from django.contrib import admin
from .models import RefreshToken


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    """Admin interface for RefreshToken model."""

    list_display = [
        'user',
        'created_at',
        'expires_at',
        'is_valid_display',
        'is_revoked',
        'ip_address'
    ]

    list_filter = [
        'is_revoked',
        'created_at',
        'expires_at',
    ]

    search_fields = [
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
        'ip_address',
    ]

    readonly_fields = [
        'id',
        'user',
        'token',
        'created_at',
        'expires_at',
        'is_revoked',
        'revoked_at',
        'ip_address',
        'is_valid_display',
        'is_expired',
    ]

    fieldsets = (
        ('Token Information', {
            'fields': ('id', 'user', 'created_at', 'expires_at')
        }),
        ('Token', {
            'fields': ('token',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_valid_display', 'is_expired', 'is_revoked', 'revoked_at')
        }),
        ('Security', {
            'fields': ('ip_address',)
        }),
    )

    actions = ['revoke_tokens', 'delete_expired_tokens']

    def is_valid_display(self, obj):
        """Display whether token is valid."""
        return obj.is_valid
    is_valid_display.short_description = 'Is Valid'
    is_valid_display.boolean = True

    def revoke_tokens(self, request, queryset):
        """Action to revoke selected refresh tokens."""
        count = 0
        for token in queryset.filter(is_revoked=False):
            token.revoke()
            count += 1

        self.message_user(request, f'{count} token(s) were revoked.')
    revoke_tokens.short_description = 'Revoke selected tokens'

    def delete_expired_tokens(self, request, queryset):
        """Action to delete expired tokens."""
        expired = queryset.filter(is_revoked=False)
        count = sum(1 for token in expired if token.is_expired)
        expired.filter(id__in=[
            token.id for token in expired if token.is_expired
        ]).delete()

        self.message_user(request, f'{count} expired token(s) were deleted.')
    delete_expired_tokens.short_description = 'Delete expired tokens'

    def has_add_permission(self, request):
        """Disable manual creation of refresh tokens."""
        return False

    def has_change_permission(self, request, obj=None):
        """Make tokens read-only."""
        return False
