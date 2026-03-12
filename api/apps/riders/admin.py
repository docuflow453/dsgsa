from django.contrib import admin
from .models import Rider, SaefMembership


@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    """Admin configuration for Rider model."""
    
    list_display = ['get_full_name', 'saef_number', 'gender', 'province', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_international', 'is_test', 'gender', 'province', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'saef_number', 'id_number']
    ordering = ['user__last_name', 'user__first_name']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Personal Information', {
            'fields': ('saef_number', 'id_number', 'date_of_birth', 'gender', 'ethnicity')
        }),
        ('Passport Information', {
            'fields': ('passport_number', 'passport_expiry', 'nationality')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'suburb', 'city', 'province', 'postal_code', 'country')
        }),
        ('Banking Details', {
            'fields': ('account_type', 'account_name', 'branch_code', 'account_number', 'bank_name')
        }),
        ('Status', {
            'fields': ('is_active', 'is_international', 'is_test')
        }),
    )
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Name'


@admin.register(SaefMembership)
class SaefMembershipAdmin(admin.ModelAdmin):
    """Admin configuration for SaefMembership model."""
    
    list_display = ['rider', 'year', 'approved_at', 'approved_by', 'created_at']
    list_filter = ['year', 'approved_at', 'created_at']
    search_fields = ['rider__user__email', 'rider__user__first_name', 'rider__user__last_name']
    ordering = ['-year', 'rider']


