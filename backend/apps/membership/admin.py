from django.contrib import admin
from .models import Membership, Subscription


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    """Admin interface for Membership model"""
    
    list_display = [
        'name',
        'is_active',
        'created_at',
        'updated_at'
    ]
    
    list_filter = [
        'is_active',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'name',
        'description',
        'notes'
    ]
    
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    # Enable actions
    actions = ['activate_memberships', 'deactivate_memberships']
    
    def activate_memberships(self, request, queryset):
        """Admin action to activate selected memberships"""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} membership(s) activated.')
    activate_memberships.short_description = 'Activate selected memberships'
    
    def deactivate_memberships(self, request, queryset):
        """Admin action to deactivate selected memberships"""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} membership(s) deactivated.')
    deactivate_memberships.short_description = 'Deactivate selected memberships'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Subscription model"""

    list_display = [
        'name',
        'year',
        'membership',
        'fee',
        'fee_including_vat',
        'is_active',
        'is_recreational',
        'created_at'
    ]

    list_filter = [
        'year',
        'membership',
        'is_active',
        'is_recreational',
        'created_at',
        'updated_at'
    ]

    search_fields = [
        'name',
        'description',
        'notes',
        'year__name',
        'membership__name'
    ]

    ordering = ['year', 'membership', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Relationships', {
            'fields': ('year', 'membership')
        }),
        ('Pricing', {
            'fields': ('fee', 'fee_including_vat')
        }),
        ('Status', {
            'fields': ('is_active', 'is_recreational')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

    # Enable select_related for better query performance
    list_select_related = ['year', 'membership']

    # Enable actions
    actions = ['activate_subscriptions', 'deactivate_subscriptions']

    def activate_subscriptions(self, request, queryset):
        """Admin action to activate selected subscriptions"""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} subscription(s) activated.')
    activate_subscriptions.short_description = 'Activate selected subscriptions'

    def deactivate_subscriptions(self, request, queryset):
        """Admin action to deactivate selected subscriptions"""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} subscription(s) deactivated.')
    deactivate_subscriptions.short_description = 'Deactivate selected subscriptions'

