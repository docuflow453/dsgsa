from django.contrib import admin
from apps.memberships.models import Membership, Subscription


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    """Admin interface for Membership model"""

    list_display = [
        'name',
        'status',
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

    readonly_fields = [
        'id',
        'status',
        'created_at',
        'updated_at'
    ]

    fieldsets = [
        ('Basic Information', {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Computed Properties', {
            'fields': ('status',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    ]

    actions = ['activate_memberships', 'deactivate_memberships']

    def activate_memberships(self, request, queryset):
        """Bulk action to activate selected memberships"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} membership(s) activated successfully")
    activate_memberships.short_description = "Activate selected memberships"

    def deactivate_memberships(self, request, queryset):
        """Bulk action to deactivate selected memberships"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} membership(s) deactivated successfully")
    deactivate_memberships.short_description = "Deactivate selected memberships"

    def get_queryset(self, request):
        """Optimize queryset"""
        qs = super().get_queryset(request)
        return qs.select_related()



@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Subscription model"""

    list_display = [
        'name',
        'membership',
        'year',
        'fee',
        'subscription_type',
        'status',
        'is_active',
        'created_at'
    ]

    list_filter = [
        'is_active',
        'is_recreational',
        'membership',
        'year',
        'created_at',
        'updated_at'
    ]

    search_fields = [
        'name',
        'description',
        'notes',
        'membership__name',
        'year__name'
    ]

    readonly_fields = [
        'id',
        'status',
        'subscription_type',
        'created_at',
        'updated_at'
    ]

    fieldsets = [
        ('Basic Information', {
            'fields': ('name', 'description', 'membership', 'year')
        }),
        ('Pricing & Type', {
            'fields': ('fee', 'is_recreational', 'is_active')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Computed Properties', {
            'fields': ('status', 'subscription_type'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    ]

    actions = ['activate_subscriptions', 'deactivate_subscriptions', 'mark_as_recreational', 'mark_as_competitive']

    def activate_subscriptions(self, request, queryset):
        """Bulk action to activate selected subscriptions"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} subscription(s) activated successfully")
    activate_subscriptions.short_description = "Activate selected subscriptions"

    def deactivate_subscriptions(self, request, queryset):
        """Bulk action to deactivate selected subscriptions"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} subscription(s) deactivated successfully")
    deactivate_subscriptions.short_description = "Deactivate selected subscriptions"

    def mark_as_recreational(self, request, queryset):
        """Bulk action to mark selected subscriptions as recreational"""
        updated = queryset.update(is_recreational=True)
        self.message_user(request, f"{updated} subscription(s) marked as recreational")
    mark_as_recreational.short_description = "Mark as recreational"

    def mark_as_competitive(self, request, queryset):
        """Bulk action to mark selected subscriptions as competitive"""
        updated = queryset.update(is_recreational=False)
        self.message_user(request, f"{updated} subscription(s) marked as competitive")
    mark_as_competitive.short_description = "Mark as competitive"

    def get_queryset(self, request):
        """Optimize queryset with related objects"""
        qs = super().get_queryset(request)
        return qs.select_related('membership', 'year')


