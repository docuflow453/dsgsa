from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for custom User model"""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff', 'is_superuser', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    # Add custom fields to the fieldsets
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role & Status', {
            'fields': ('role', 'banned_at', 'activated_at', 'email_verified_at')
        }),
    )
    
    # Add custom fields to the add form
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'first_name', 'last_name', 'role')
        }),
    )
    
    # Make timestamp fields readonly in admin
    readonly_fields = ['date_joined', 'last_login']

