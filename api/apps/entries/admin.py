from django.contrib import admin
from .models import Entry, EntryClass, Transaction, TransactionExtra, RidingOrder


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ['get_rider_name', 'horse', 'competition', 'amount', 'is_active', 'created_at']
    list_filter = ['competition', 'is_active', 'created_at']
    search_fields = ['rider__user__first_name', 'rider__user__last_name', 'horse__name']
    ordering = ['-created_at']
    
    def get_rider_name(self, obj):
        return obj.rider.user.get_full_name()
    get_rider_name.short_description = 'Rider'


@admin.register(EntryClass)
class EntryClassAdmin(admin.ModelAdmin):
    list_display = ['entry', 'competition_class', 'created_at']
    list_filter = ['competition_class', 'created_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'entry', 'amount', 'payment_status', 'payment_method', 'created_at']
    list_filter = ['payment_status', 'payment_method', 'created_at']
    ordering = ['-created_at']


@admin.register(TransactionExtra)
class TransactionExtraAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'competition_extra', 'quantity', 'price', 'created_at']
    list_filter = ['competition_extra', 'created_at']


@admin.register(RidingOrder)
class RidingOrderAdmin(admin.ModelAdmin):
    list_display = ['competition_class', 'order', 'get_rider_name', 'get_horse_name', 'created_at']
    list_filter = ['competition_class', 'created_at']
    ordering = ['competition_class', 'order']
    
    def get_rider_name(self, obj):
        return obj.entry.rider.user.get_full_name()
    get_rider_name.short_description = 'Rider'
    
    def get_horse_name(self, obj):
        return obj.entry.horse.name
    get_horse_name.short_description = 'Horse'

