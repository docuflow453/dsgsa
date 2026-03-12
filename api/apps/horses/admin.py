from django.contrib import admin
from .models import Horse, HorseBreed, HorseColour, BreedType, StudFarm, VaccinationType, HorseVaccination


@admin.register(Horse)
class HorseAdmin(admin.ModelAdmin):
    """Admin configuration for Horse model."""
    
    list_display = ['name', 'gender', 'breed', 'colour', 'date_of_birth', 'created_at']
    list_filter = ['gender', 'breed', 'colour', 'is_test', 'created_at']
    search_fields = ['name', 'passport_number', 'microchip_number']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'gender', 'date_of_birth', 'nationality')
        }),
        ('Breed Information', {
            'fields': ('breed', 'breed_type', 'colour', 'sire', 'dam', 'sire_of_dam')
        }),
        ('Documentation', {
            'fields': ('passport_number', 'passport_expiry', 'microchip_number', 'qr_link', 'fei_link')
        }),
        ('Status', {
            'fields': ('is_test',)
        }),
    )


@admin.register(HorseBreed)
class HorseBreedAdmin(admin.ModelAdmin):
    """Admin configuration for HorseBreed model."""
    
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    ordering = ['name']


@admin.register(BreedType)
class BreedTypeAdmin(admin.ModelAdmin):
    """Admin configuration for BreedType model."""
    
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    ordering = ['name']


@admin.register(HorseColour)
class HorseColourAdmin(admin.ModelAdmin):
    """Admin configuration for HorseColour model."""
    
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(StudFarm)
class StudFarmAdmin(admin.ModelAdmin):
    """Admin configuration for StudFarm model."""
    
    list_display = ['name', 'registration_number', 'contact_person', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'registration_number', 'contact_person']
    ordering = ['name']


@admin.register(VaccinationType)
class VaccinationTypeAdmin(admin.ModelAdmin):
    """Admin configuration for VaccinationType model."""
    
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    ordering = ['name']


@admin.register(HorseVaccination)
class HorseVaccinationAdmin(admin.ModelAdmin):
    """Admin configuration for HorseVaccination model."""
    
    list_display = ['horse', 'vaccination_type', 'date', 'created_at']
    list_filter = ['vaccination_type', 'date']
    search_fields = ['horse__name']
    ordering = ['-date']

