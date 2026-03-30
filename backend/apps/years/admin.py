from django.contrib import admin
from .models import Year


@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    """Admin interface for Year model"""
    
    list_display = [
        'name',
        'year',
        'start_date',
        'end_date',
        'status',
        'is_registration_open',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'is_registration_open',
        'year',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'year',
        'notes'
    ]
    
    ordering = ['-year', '-start_date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'year')
        }),
        ('Date Range', {
            'fields': ('start_date', 'end_date')
        }),
        ('Status & Settings', {
            'fields': ('status', 'is_registration_open')
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
    
    date_hierarchy = 'start_date'
    
    # Enable actions
    actions = ['activate_years', 'open_registration', 'close_registration']
    
    def activate_years(self, request, queryset):
        """Admin action to activate selected years"""
        count = queryset.update(status='ACTIVE')
        self.message_user(request, f'{count} year(s) activated.')
    activate_years.short_description = 'Activate selected years'
    
    def open_registration(self, request, queryset):
        """Admin action to open registration for selected years"""
        count = queryset.update(is_registration_open=True)
        self.message_user(request, f'Registration opened for {count} year(s).')
    open_registration.short_description = 'Open registration'
    
    def close_registration(self, request, queryset):
        """Admin action to close registration for selected years"""
        count = queryset.update(is_registration_open=False)
        self.message_user(request, f'Registration closed for {count} year(s).')
    close_registration.short_description = 'Close registration'

