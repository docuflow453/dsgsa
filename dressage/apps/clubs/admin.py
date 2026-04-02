from django.contrib import admin
from apps.clubs.models import Club, ClubStatus


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    """Admin interface for Club model"""
    
    list_display = [
        'name',
        'registration_number',
        'email',
        'city',
        'province',
        'status',
        'is_active',
        'has_logo',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'country',
        'province',
        'account_type',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'name',
        'registration_number',
        'email',
        'phone',
        'city',
        'primary_contact_name',
        'primary_contact_email'
    ]
    
    readonly_fields = ['id', 'created_at', 'updated_at', 'is_active', 'full_address', 'has_bank_details', 'has_logo']
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'id',
                'name',
                'registration_number',
                'logo',
                'has_logo',
                'email',
                'phone',
                'website',
                'status'
            )
        }),
        ('Address Information', {
            'fields': (
                'address_line_1',
                'address_line_2',
                'city',
                'province',
                'postal_code',
                'country',
                'full_address'
            )
        }),
        ('Primary Contact', {
            'fields': (
                'primary_contact_name',
                'primary_contact_email',
                'primary_contact_phone'
            )
        }),
        ('Bank Account Details', {
            'fields': (
                'bank_name',
                'account_number',
                'branch_code',
                'account_type',
                'account_holder_name',
                'has_bank_details'
            ),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    actions = ['activate', 'deactivate', 'suspend', 'ban']
    
    def activate(self, request, queryset):
        """Bulk action to activate clubs"""
        updated = queryset.update(status=ClubStatus.ACTIVE)
        self.message_user(request, f"{updated} clubs were successfully activated.")
    activate.short_description = "Activate selected clubs"
    
    def deactivate(self, request, queryset):
        """Bulk action to deactivate clubs"""
        updated = queryset.update(status=ClubStatus.INACTIVE)
        self.message_user(request, f"{updated} clubs were successfully deactivated.")
    deactivate.short_description = "Deactivate selected clubs"
    
    def suspend(self, request, queryset):
        """Bulk action to suspend clubs"""
        updated = queryset.update(status=ClubStatus.SUSPENDED)
        self.message_user(request, f"{updated} clubs were successfully suspended.")
    suspend.short_description = "Suspend selected clubs"
    
    def ban(self, request, queryset):
        """Bulk action to ban clubs"""
        updated = queryset.update(status=ClubStatus.BANNED)
        self.message_user(request, f"{updated} clubs were successfully banned.")
    ban.short_description = "Ban selected clubs"

