from django.contrib import admin
from .models import Year, YearStatus


@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    """Admin for Year model"""
    list_display = [
        'name', 'year', 'start_date', 'end_date',
        'status', 'is_registration_open', 'is_current',
        'days_remaining', 'created_at'
    ]
    list_filter = ['status', 'is_registration_open', 'year', 'created_at']
    search_fields = ['name', 'year', 'notes']
    ordering = ['-year', '-start_date']
    readonly_fields = [
        'id', 'is_active', 'is_current', 'days_remaining',
        'duration_days', 'created_at', 'updated_at'
    ]

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'year', 'status', 'is_registration_open')
        }),
        ('Date Range', {
            'fields': ('start_date', 'end_date', 'duration_days')
        }),
        ('Computed Properties', {
            'fields': ('is_active', 'is_current', 'days_remaining'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_years', 'open_registration', 'close_registration', 'archive_years']

    def activate_years(self, request, queryset):
        """Activate selected year (deactivates all others)"""
        if queryset.count() > 1:
            self.message_user(
                request,
                "Can only activate one year at a time. Please select only one year.",
                level='error'
            )
            return

        year = queryset.first()
        # Deactivate all other years
        Year.objects.exclude(id=year.id).update(status=YearStatus.COMPLETE)
        # Activate selected year
        year.status = YearStatus.ACTIVE
        year.save()

        self.message_user(request, f"{year.name} has been activated (all others deactivated).")
    activate_years.short_description = "Activate selected year (deactivates others)"

    def open_registration(self, request, queryset):
        """Open registration for selected years"""
        updated = queryset.update(is_registration_open=True)
        self.message_user(request, f"Registration opened for {updated} year(s).")
    open_registration.short_description = "Open registration for selected years"

    def close_registration(self, request, queryset):
        """Close registration for selected years"""
        updated = queryset.update(is_registration_open=False)
        self.message_user(request, f"Registration closed for {updated} year(s).")
    close_registration.short_description = "Close registration for selected years"

    def archive_years(self, request, queryset):
        """Archive selected years"""
        updated = queryset.update(status=YearStatus.ARCHIVED, is_registration_open=False)
        self.message_user(request, f"{updated} year(s) have been archived.")
    archive_years.short_description = "Archive selected years"

    def is_current(self, obj):
        """Display whether the year is current"""
        return obj.is_current
    is_current.boolean = True
    is_current.short_description = 'Is Current'

    def days_remaining(self, obj):
        """Display days remaining"""
        return obj.days_remaining
    days_remaining.short_description = 'Days Remaining'

