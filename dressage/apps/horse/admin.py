from django.contrib import admin
from .models import (
    Classification, Breed, BreedType, HorseColor,
    Horse, HorseVaccination, HorseAccount, HorseDocument
)


@admin.register(Classification)
class ClassificationAdmin(admin.ModelAdmin):
    """Admin for Classification model"""
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    """Admin for Breed model"""
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BreedType)
class BreedTypeAdmin(admin.ModelAdmin):
    """Admin for BreedType model"""
    list_display = ['name', 'breed', 'is_active', 'created_at']
    list_filter = ['is_active', 'breed', 'created_at']
    search_fields = ['name', 'breed__name']
    ordering = ['breed__name', 'name']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'breed', 'is_active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HorseColor)
class HorseColorAdmin(admin.ModelAdmin):
    """Admin for HorseColor model"""
    list_display = ['name', 'color_code', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'color_code']
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'color_code', 'is_active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Horse)
class HorseAdmin(admin.ModelAdmin):
    """Admin for Horse model"""
    list_display = ['name', 'passport_number', 'microchip_number', 'breed', 'gender', 'status', 'is_banned', 'created_at']
    list_filter = ['status', 'gender', 'is_banned', 'breed', 'color', 'created_at']
    search_fields = ['name', 'passport_number', 'microchip_number', 'sire', 'dam']
    ordering = ['-created_at']
    readonly_fields = ['id', 'age', 'created_at', 'updated_at', 'banned_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'gender', 'passport_number', 'microchip_number', 'date_of_birth', 'age')
        }),
        ('Breed & Color', {
            'fields': ('breed', 'breed_type', 'color')
        }),
        ('Origin', {
            'fields': ('country', 'sire', 'dam', 'sire_of_dam')
        }),
        ('Status', {
            'fields': ('status', 'is_banned', 'banned_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['ban_horses', 'activate_horses']

    def ban_horses(self, request, queryset):
        """Ban selected horses"""
        from django.utils import timezone
        updated = queryset.update(is_banned=True, status='BANNED', banned_at=timezone.now())
        self.message_user(request, f"{updated} horses have been banned.")
    ban_horses.short_description = "Ban selected horses"

    def activate_horses(self, request, queryset):
        """Activate selected horses"""
        updated = queryset.update(is_banned=False, status='ACTIVE', banned_at=None)
        self.message_user(request, f"{updated} horses have been activated.")
    activate_horses.short_description = "Activate selected horses"


@admin.register(HorseVaccination)
class HorseVaccinationAdmin(admin.ModelAdmin):
    """Admin for HorseVaccination model"""
    list_display = ['horse', 'vaccination_type', 'vaccination_date', 'expiry_date', 'is_expired', 'created_at']
    list_filter = ['vaccination_type', 'vaccination_date', 'expiry_date']
    search_fields = ['horse__name', 'horse__passport_number', 'veterinarian', 'batch_number']
    ordering = ['-vaccination_date']
    readonly_fields = ['id', 'is_expired', 'created_at', 'updated_at']

    fieldsets = (
        ('Horse & Type', {
            'fields': ('horse', 'vaccination_type', 'vaccination_date', 'expiry_date')
        }),
        ('Details', {
            'fields': ('batch_number', 'veterinarian', 'notes')
        }),
        ('Metadata', {
            'fields': ('id', 'is_expired', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HorseAccount)
class HorseAccountAdmin(admin.ModelAdmin):
    """Admin for HorseAccount model"""
    list_display = ['horse', 'account_ref', 'classification', 'year_ref', 'amount', 'created_at']
    list_filter = ['classification', 'year_ref', 'created_at']
    search_fields = ['horse__name', 'horse__passport_number', 'account_ref', 'year_ref']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Horse & References', {
            'fields': ('horse', 'account_ref', 'year_ref', 'classification')
        }),
        ('Financial', {
            'fields': ('amount',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HorseDocument)
class HorseDocumentAdmin(admin.ModelAdmin):
    """Admin for HorseDocument model"""
    list_display = ['horse', 'title', 'document_type', 'file_name', 'upload_date', 'expiry_date', 'is_expired']
    list_filter = ['document_type', 'upload_date', 'expiry_date']
    search_fields = ['horse__name', 'horse__passport_number', 'title', 'file_name']
    ordering = ['-upload_date']
    readonly_fields = ['id', 'upload_date', 'is_expired', 'created_at', 'updated_at', 'uploaded_by']

    fieldsets = (
        ('Horse & Document Type', {
            'fields': ('horse', 'document_type', 'title')
        }),
        ('File Information', {
            'fields': ('file_name', 'file_url', 'expiry_date')
        }),
        ('Additional Info', {
            'fields': ('notes', 'uploaded_by')
        }),
        ('Metadata', {
            'fields': ('id', 'upload_date', 'is_expired', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

