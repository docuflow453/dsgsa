from django.contrib import admin
from .models import (
    Competition, CompetitionDate, CompetitionClass, CompetitionExtra,
    CompetitionFee, CompetitionDocument, Grade, ClassType, ClassRule
)


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ['name', 'competition_type', 'show_holding_body', 'entry_close', 'is_active', 'created_at']
    list_filter = ['competition_type', 'is_active', 'is_test', 'entry_close']
    search_fields = ['name', 'venue']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-entry_close']


@admin.register(CompetitionDate)
class CompetitionDateAdmin(admin.ModelAdmin):
    list_display = ['competition', 'start_date', 'start_time', 'is_active']
    list_filter = ['is_active', 'start_date']
    ordering = ['start_date', 'start_time']


@admin.register(CompetitionClass)
class CompetitionClassAdmin(admin.ModelAdmin):
    list_display = ['competition', 'grade', 'class_type', 'fee', 'category', 'is_active']
    list_filter = ['competition', 'grade', 'class_type', 'is_active']
    ordering = ['competition', 'approximate_start_time']


@admin.register(CompetitionExtra)
class CompetitionExtraAdmin(admin.ModelAdmin):
    list_display = ['competition', 'name', 'price', 'quantity', 'is_stable', 'is_active']
    list_filter = ['competition', 'is_stable', 'is_active']


@admin.register(CompetitionFee)
class CompetitionFeeAdmin(admin.ModelAdmin):
    list_display = ['competition', 'fee', 'is_included_in_entry_fee', 'is_active']
    list_filter = ['competition', 'is_included_in_entry_fee', 'is_active']


@admin.register(CompetitionDocument)
class CompetitionDocumentAdmin(admin.ModelAdmin):
    list_display = ['competition', 'document_type', 'filename', 'is_active']
    list_filter = ['competition', 'document_type', 'is_active']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(ClassType)
class ClassTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(ClassRule)
class ClassRuleAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']

