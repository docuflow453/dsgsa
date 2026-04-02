from django.contrib import admin
from apps.common.models import Province, VatCode, School, PaymentMethod


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    """Admin interface for Province model"""
    list_display = ['name', 'country', 'is_active', 'created_at']
    list_filter = ['is_active', 'country', 'created_at']
    search_fields = ['name', 'country']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['country', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'country', 'is_active')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_provinces', 'deactivate_provinces']

    def activate_provinces(self, request, queryset):
        """Bulk activate provinces"""
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} province(s) activated successfully.")
    activate_provinces.short_description = "Activate selected provinces"

    def deactivate_provinces(self, request, queryset):
        """Bulk deactivate provinces"""
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} province(s) deactivated successfully.")
    deactivate_provinces.short_description = "Deactivate selected provinces"


@admin.register(VatCode)
class VatCodeAdmin(admin.ModelAdmin):
    """Admin interface for VatCode model"""
    list_display = ['name', 'code', 'percentage', 'is_default', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_default', 'is_applicable_to_membership', 'is_applicable_to_competitions']
    search_fields = ['name', 'code']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-is_default', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'percentage', 'notes')
        }),
        ('Applicability', {
            'fields': ('is_applicable_to_membership', 'is_applicable_to_competitions')
        }),
        ('Settings', {
            'fields': ('is_default', 'is_active')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_vat_codes', 'deactivate_vat_codes', 'set_as_default']

    def activate_vat_codes(self, request, queryset):
        """Bulk activate VAT codes"""
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} VAT code(s) activated successfully.")
    activate_vat_codes.short_description = "Activate selected VAT codes"

    def deactivate_vat_codes(self, request, queryset):
        """Bulk deactivate VAT codes"""
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} VAT code(s) deactivated successfully.")
    deactivate_vat_codes.short_description = "Deactivate selected VAT codes"

    def set_as_default(self, request, queryset):
        """Set selected VAT code as default (only works with single selection)"""
        if queryset.count() > 1:
            self.message_user(request, "Please select only one VAT code to set as default.", level='error')
        else:
            VatCode.objects.all().update(is_default=False)
            queryset.update(is_default=True)
            self.message_user(request, "VAT code set as default successfully.")
    set_as_default.short_description = "Set as default VAT code"


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    """Admin interface for School model"""
    list_display = ['name', 'province', 'city', 'status', 'contact_person', 'created_at']
    list_filter = ['status', 'province', 'created_at']
    search_fields = ['name', 'city', 'contact_person', 'email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'province', 'status', 'description')
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'email', 'phone', 'website')
        }),
        ('Address Information', {
            'fields': ('address', 'city')
        }),
        ('Media', {
            'fields': ('logo',)
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['set_active', 'set_inactive', 'set_pending', 'set_suspended']

    def set_active(self, request, queryset):
        """Bulk set schools to active status"""
        count = queryset.update(status='ACTIVE')
        self.message_user(request, f"{count} school(s) set to active successfully.")
    set_active.short_description = "Set status to Active"

    def set_inactive(self, request, queryset):
        """Bulk set schools to inactive status"""
        count = queryset.update(status='INACTIVE')
        self.message_user(request, f"{count} school(s) set to inactive successfully.")
    set_inactive.short_description = "Set status to Inactive"

    def set_pending(self, request, queryset):
        """Bulk set schools to pending status"""
        count = queryset.update(status='PENDING')
        self.message_user(request, f"{count} school(s) set to pending successfully.")
    set_pending.short_description = "Set status to Pending"

    def set_suspended(self, request, queryset):
        """Bulk set schools to suspended status"""
        count = queryset.update(status='SUSPENDED')
        self.message_user(request, f"{count} school(s) set to suspended successfully.")
    set_suspended.short_description = "Set status to Suspended"


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin interface for PaymentMethod model"""
    list_display = ['name', 'code', 'is_active', 'allow_for_entries', 'allow_for_renewals', 'created_at']
    list_filter = ['is_active', 'allow_for_entries', 'allow_for_renewals']
    search_fields = ['name', 'code', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['name']
    prepopulated_fields = {'code': ('name',)}

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Settings', {
            'fields': ('is_active', 'allow_for_entries', 'allow_for_renewals')
        }),
        ('Audit Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_payment_methods', 'deactivate_payment_methods']

    def activate_payment_methods(self, request, queryset):
        """Bulk activate payment methods"""
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} payment method(s) activated successfully.")
    activate_payment_methods.short_description = "Activate selected payment methods"

    def deactivate_payment_methods(self, request, queryset):
        """Bulk deactivate payment methods"""
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} payment method(s) deactivated successfully.")
    deactivate_payment_methods.short_description = "Deactivate selected payment methods"

