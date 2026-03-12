from django.contrib import admin
from .models import Account, RiderAccount, HorseAccount


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    """Admin configuration for Account model."""
    
    list_display = ['id', 'user', 'year', 'amount', 'payment_method', 'approved_at', 'created_at']
    list_filter = ['payment_method', 'approved_at', 'year', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Account Information', {
            'fields': ('user', 'year', 'amount', 'payment_method')
        }),
        ('Approval', {
            'fields': ('approved_by', 'approved_at')
        }),
        ('Additional Data', {
            'fields': ('data',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RiderAccount)
class RiderAccountAdmin(admin.ModelAdmin):
    """Admin configuration for RiderAccount model."""
    
    list_display = ['id', 'rider', 'account', 'subscription', 'amount', 'created_at']
    list_filter = ['subscription', 'created_at']
    search_fields = ['rider__user__email', 'rider__user__first_name', 'rider__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Rider Account Information', {
            'fields': ('rider', 'account', 'subscription', 'amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HorseAccount)
class HorseAccountAdmin(admin.ModelAdmin):
    """Admin configuration for HorseAccount model."""
    
    list_display = ['id', 'horse', 'account', 'classification_type', 'amount', 'created_at']
    list_filter = ['classification_type', 'created_at']
    search_fields = ['horse__name', 'horse__registration_number']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Horse Account Information', {
            'fields': ('horse', 'account', 'classification_type', 'amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

