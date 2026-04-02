from django.contrib import admin
from apps.showholdingbody.models import ShowHoldingBody, ShowHoldingBodyStatus


@admin.register(ShowHoldingBody)
class ShowHoldingBodyAdmin(admin.ModelAdmin):
    """Admin interface for Show Holding Body model"""
    
    list_display = [
        'name',
        'registration_number',
        'email',
        'city',
        'province',
        'status',
        'is_active',
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
    
    readonly_fields = ['id', 'created_at', 'updated_at', 'is_active', 'full_address', 'has_bank_details']
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'id',
                'name',
                'registration_number',
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
        """Bulk action to activate show holding bodies"""
        updated = queryset.update(status=ShowHoldingBodyStatus.ACTIVE)
        self.message_user(request, f"{updated} show holding bodies were successfully activated.")
    activate.short_description = "Activate selected show holding bodies"
    
    def deactivate(self, request, queryset):
        """Bulk action to deactivate show holding bodies"""
        updated = queryset.update(status=ShowHoldingBodyStatus.INACTIVE)
        self.message_user(request, f"{updated} show holding bodies were successfully deactivated.")
    deactivate.short_description = "Deactivate selected show holding bodies"
    
    def suspend(self, request, queryset):
        """Bulk action to suspend show holding bodies"""
        updated = queryset.update(status=ShowHoldingBodyStatus.SUSPENDED)
        self.message_user(request, f"{updated} show holding bodies were successfully suspended.")
    suspend.short_description = "Suspend selected show holding bodies"
    
    def ban(self, request, queryset):
        """Bulk action to ban show holding bodies"""
        updated = queryset.update(status=ShowHoldingBodyStatus.BANNED)
        self.message_user(request, f"{updated} show holding bodies were successfully banned.")
    ban.short_description = "Ban selected show holding bodies"

