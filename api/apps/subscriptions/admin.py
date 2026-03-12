from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['name', 'year', 'fee', 'is_official', 'is_recreational', 'is_active', 'created_at']
    list_filter = ['year', 'is_official', 'is_recreational', 'is_admin', 'is_active']
    search_fields = ['name', 'description']
    filter_horizontal = ['memberships']

