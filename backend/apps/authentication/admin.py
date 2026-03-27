from django.contrib import admin
from .models import PasswordResetToken, RefreshToken


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Admin interface for PasswordResetToken model."""
    
    list_display = [
        'user',
        'created_at',
        'expires_at',
        'is_valid_display',
        'is_used',
        'ip_address'
    ]
    
    list_filter = [
        'created_at',
        'expires_at',
        'used_at'
    ]
    
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'token',
        'ip_address'
    ]
    
    readonly_fields = [
        'id',
        'token',
        'created_at',
        'expires_at',
        'used_at',
        'is_valid_display',
        'is_expired',
        'is_used'
    ]
    
    fieldsets = (
        ('Token Information', {
            'fields': ('id', 'token', 'user')
        }),
        ('Status', {
            'fields': ('is_valid_display', 'is_expired', 'is_used')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at', 'used_at')
        }),
        ('Security', {
            'fields': ('ip_address',)
        }),
    )
    
    def is_valid_display(self, obj):
        """Display whether token is valid."""
        return obj.is_valid
    is_valid_display.short_description = 'Is Valid'
    is_valid_display.boolean = True
    
    def has_add_permission(self, request):
        """Disable manual creation of reset tokens."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Make tokens read-only."""
        return False


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
        'created_at',
        'expires_at',
        'revoked_at'
    ]
    
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'ip_address'
    ]
    
    readonly_fields = [
        'id',
        'token',
        'user',
        'created_at',
        'expires_at',
        'revoked_at',
        'is_valid_display',
        'is_expired',
        'is_revoked',
        'ip_address'
    ]
    
    fieldsets = (
        ('Token Information', {
            'fields': ('id', 'user')
        }),
        ('Token', {
            'fields': ('token',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_valid_display', 'is_expired', 'is_revoked')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at', 'revoked_at')
        }),
        ('Security', {
            'fields': ('ip_address',)
        }),
    )
    
    def is_valid_display(self, obj):
        """Display whether token is valid."""
        return obj.is_valid
    is_valid_display.short_description = 'Is Valid'
    is_valid_display.boolean = True
    
    def has_add_permission(self, request):
        """Disable manual creation of refresh tokens."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Make tokens read-only except for revoking."""
        return False
    
    actions = ['revoke_tokens']
    
    def revoke_tokens(self, request, queryset):
        """Action to revoke selected refresh tokens."""
        count = 0
        for token in queryset:
            if not token.is_revoked:
                token.revoke()
                count += 1
        
        self.message_user(request, f'{count} token(s) were revoked.')
    revoke_tokens.short_description = 'Revoke selected tokens'

