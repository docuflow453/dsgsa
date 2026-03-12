from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Year, Membership, Classification, Province, YearClassificationFee, Levy


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('title', 'first_name', 'maiden_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('email_confirmed_at', 'banned_at', 'activated_at', 'last_login')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    """Admin configuration for Year model."""
    
    list_display = ['title', 'start_date', 'end_date', 'is_active', 'created_at']
    list_filter = ['is_active', 'start_date']
    search_fields = ['title']
    ordering = ['-start_date']


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    """Admin configuration for Membership model."""
    
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Classification)
class ClassificationAdmin(admin.ModelAdmin):
    """Admin configuration for Classification model."""
    
    list_display = ['name', 'is_pony', 'is_recreational', 'is_admin', 'is_active']
    list_filter = ['is_pony', 'is_recreational', 'is_admin', 'is_active']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    """Admin configuration for Province model."""
    
    list_display = ['name', 'country_id', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(YearClassificationFee)
class YearClassificationFeeAdmin(admin.ModelAdmin):
    """Admin configuration for YearClassificationFee model."""
    
    list_display = ['classification', 'year', 'fee', 'created_at']
    list_filter = ['year', 'classification']
    ordering = ['-year', 'classification']


@admin.register(Levy)
class LevyAdmin(admin.ModelAdmin):
    """Admin configuration for Levy model."""
    
    list_display = ['name', 'fee', 'fee_exclusive', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    ordering = ['name']

