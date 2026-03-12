from django.contrib import admin
from .models import Club, ShowHoldingBody, PaymentMethod, Extra


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    """Admin configuration for Club model."""
    
    list_display = ['name', 'saef_number', 'city', 'province', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_test', 'province', 'created_at']
    search_fields = ['name', 'saef_number', 'city']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'saef_number')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'suburb', 'city', 'province', 'postal_code', 'country')
        }),
        ('Status', {
            'fields': ('is_active', 'is_test')
        }),
    )


@admin.register(ShowHoldingBody)
class ShowHoldingBodyAdmin(admin.ModelAdmin):
    """Admin configuration for ShowHoldingBody model."""
    
    list_display = ['name', 'saef_number', 'city', 'province', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_test', 'province', 'created_at']
    search_fields = ['name', 'saef_number', 'city']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'saef_number', 'established_at', 'website')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'suburb', 'city', 'province', 'postal_code', 'country')
        }),
        ('Banking Details', {
            'fields': ('account_type', 'account_name', 'branch_code', 'account_number', 'bank_name')
        }),
        ('Status', {
            'fields': ('is_active', 'is_test')
        }),
    )


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentMethod model."""
    
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Extra)
class ExtraAdmin(admin.ModelAdmin):
    """Admin configuration for Extra model."""
    
    list_display = ['name', 'price', 'quantity_available', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    ordering = ['name']

