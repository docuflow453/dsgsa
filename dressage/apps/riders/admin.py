"""
Django Admin configuration for Riders app.
"""
from django.contrib import admin
from apps.riders.models import Rider, RiderAccount, SaefMembership, RiderClub, RiderShowHoldingBody


@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    """Admin interface for Rider model"""
    
    list_display = [
        'full_name', 'user_email', 'saef_number', 'nationality', 
        'age', 'gender', 'status', 'is_test', 'created_at'
    ]
    list_filter = ['is_active', 'is_test', 'gender', 'ethnicity', 'nationality', 'created_at', 'updated_at']
    search_fields = [
        'user__first_name', 'user__last_name', 'user__email',
        'saef_number', 'id_number', 'passport_number', 'nationality'
    ]
    readonly_fields = ['id', 'full_name', 'age', 'full_address', 'status', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'full_name')
        }),
        ('Identification', {
            'fields': ('saef_number', 'id_number', 'passport_number')
        }),
        ('Personal Information', {
            'fields': ('date_of_birth', 'age', 'gender', 'ethnicity', 'nationality')
        }),
        ('Address', {
            'fields': (
                'address_line_1', 'address_line_2', 'suburb', 
                'city', 'province', 'postal_code', 'country', 'full_address'
            ),
            'classes': ('collapse',)
        }),
        ('Banking Details', {
            'fields': ('account_type', 'account_name', 'bank_name'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_test', 'status')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_riders', 'deactivate_riders', 'mark_as_test', 'unmark_as_test']
    
    def user_email(self, obj):
        """Display user email"""
        return obj.user.email
    user_email.short_description = 'Email'
    user_email.admin_order_field = 'user__email'
    
    def activate_riders(self, request, queryset):
        """Bulk action to activate riders"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} rider(s) activated successfully.')
    activate_riders.short_description = 'Activate selected riders'
    
    def deactivate_riders(self, request, queryset):
        """Bulk action to deactivate riders"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} rider(s) deactivated successfully.')
    deactivate_riders.short_description = 'Deactivate selected riders'
    
    def mark_as_test(self, request, queryset):
        """Bulk action to mark riders as test"""
        updated = queryset.update(is_test=True)
        self.message_user(request, f'{updated} rider(s) marked as test.')
    mark_as_test.short_description = 'Mark as test profiles'
    
    def unmark_as_test(self, request, queryset):
        """Bulk action to unmark riders as test"""
        updated = queryset.update(is_test=False)
        self.message_user(request, f'{updated} rider(s) unmarked as test.')
    unmark_as_test.short_description = 'Unmark as test profiles'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('user')


@admin.register(RiderAccount)
class RiderAccountAdmin(admin.ModelAdmin):
    """Admin interface for RiderAccount model"""
    
    list_display = ['rider_name', 'year_name', 'subscription_name', 'status', 'created_at']
    list_filter = ['is_active', 'year', 'created_at', 'updated_at']
    search_fields = [
        'rider__user__first_name', 'rider__user__last_name', 
        'rider__user__email', 'year__name'
    ]
    readonly_fields = ['id', 'status', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('rider', 'year', 'subscription', 'is_active', 'status')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_accounts', 'deactivate_accounts']
    
    def rider_name(self, obj):
        """Display rider name"""
        return obj.rider.full_name
    rider_name.short_description = 'Rider'
    rider_name.admin_order_field = 'rider__user__last_name'
    
    def year_name(self, obj):
        """Display year"""
        return obj.year.name
    year_name.short_description = 'Year'
    year_name.admin_order_field = 'year__year'
    
    def subscription_name(self, obj):
        """Display subscription"""
        return obj.subscription.name if obj.subscription else 'N/A'
    subscription_name.short_description = 'Subscription'
    
    def activate_accounts(self, request, queryset):
        """Bulk action to activate accounts"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} account(s) activated successfully.')
    activate_accounts.short_description = 'Activate selected accounts'
    
    def deactivate_accounts(self, request, queryset):
        """Bulk action to deactivate accounts"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} account(s) deactivated successfully.')
    deactivate_accounts.short_description = 'Deactivate selected accounts'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('rider__user', 'year', 'subscription')


@admin.register(SaefMembership)
class SaefMembershipAdmin(admin.ModelAdmin):
    """Admin interface for SaefMembership model"""

    list_display = ['rider_name', 'membership_number', 'year_name', 'status', 'expiry_date', 'is_expired', 'created_at']
    list_filter = ['is_active', 'year', 'expiry_date', 'created_at', 'updated_at']
    search_fields = [
        'rider__user__first_name', 'rider__user__last_name',
        'rider__user__email', 'membership_number', 'year__name'
    ]
    readonly_fields = ['id', 'status', 'is_expired', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('rider', 'membership_number', 'year', 'expiry_date', 'is_active')
        }),
        ('Computed Fields', {
            'fields': ('status', 'is_expired'),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_memberships', 'deactivate_memberships']

    def rider_name(self, obj):
        """Display rider name"""
        return obj.rider.full_name
    rider_name.short_description = 'Rider'
    rider_name.admin_order_field = 'rider__user__last_name'

    def year_name(self, obj):
        """Display year"""
        return obj.year.name
    year_name.short_description = 'Year'
    year_name.admin_order_field = 'year__year'

    def activate_memberships(self, request, queryset):
        """Bulk action to activate memberships"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} membership(s) activated successfully.')
    activate_memberships.short_description = 'Activate selected memberships'

    def deactivate_memberships(self, request, queryset):
        """Bulk action to deactivate memberships"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} membership(s) deactivated successfully.')
    deactivate_memberships.short_description = 'Deactivate selected memberships'

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('rider__user', 'year')


@admin.register(RiderClub)
class RiderClubAdmin(admin.ModelAdmin):
    """Admin interface for RiderClub model"""

    list_display = ['rider_name', 'name', 'year_name', 'status', 'created_at']
    list_filter = ['is_active', 'year', 'created_at', 'updated_at']
    search_fields = [
        'rider__user__first_name', 'rider__user__last_name',
        'rider__user__email', 'name', 'year__name'
    ]
    readonly_fields = ['id', 'status', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('rider', 'name', 'year', 'is_active', 'status')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_clubs', 'deactivate_clubs']

    def rider_name(self, obj):
        """Display rider name"""
        return obj.rider.full_name
    rider_name.short_description = 'Rider'
    rider_name.admin_order_field = 'rider__user__last_name'

    def year_name(self, obj):
        """Display year"""
        return obj.year.name
    year_name.short_description = 'Year'
    year_name.admin_order_field = 'year__year'

    def activate_clubs(self, request, queryset):
        """Bulk action to activate clubs"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} club(s) activated successfully.')
    activate_clubs.short_description = 'Activate selected clubs'

    def deactivate_clubs(self, request, queryset):
        """Bulk action to deactivate clubs"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} club(s) deactivated successfully.')
    deactivate_clubs.short_description = 'Deactivate selected clubs'

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('rider__user', 'year')


@admin.register(RiderShowHoldingBody)
class RiderShowHoldingBodyAdmin(admin.ModelAdmin):
    """Admin interface for RiderShowHoldingBody model"""

    list_display = ['rider_name', 'name', 'year_name', 'status', 'created_at']
    list_filter = ['is_active', 'year', 'created_at', 'updated_at']
    search_fields = [
        'rider__user__first_name', 'rider__user__last_name',
        'rider__user__email', 'name', 'year__name'
    ]
    readonly_fields = ['id', 'status', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('rider', 'name', 'year', 'is_active', 'status')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_bodies', 'deactivate_bodies']

    def rider_name(self, obj):
        """Display rider name"""
        return obj.rider.full_name
    rider_name.short_description = 'Rider'
    rider_name.admin_order_field = 'rider__user__last_name'

    def year_name(self, obj):
        """Display year"""
        return obj.year.name
    year_name.short_description = 'Year'
    year_name.admin_order_field = 'year__year'

    def activate_bodies(self, request, queryset):
        """Bulk action to activate show holding bodies"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} show holding body(ies) activated successfully.')
    activate_bodies.short_description = 'Activate selected show holding bodies'

    def deactivate_bodies(self, request, queryset):
        """Bulk action to deactivate show holding bodies"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} show holding body(ies) deactivated successfully.')
    deactivate_bodies.short_description = 'Deactivate selected show holding bodies'

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        queryset = super().get_queryset(request)
        return queryset.select_related('rider__user', 'year')

