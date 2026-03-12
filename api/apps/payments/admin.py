from django.contrib import admin
from .models import PaymentGateway, PayFastPayment, EFTPayment


@admin.register(PaymentGateway)
class PaymentGatewayAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'is_test_mode', 'created_at']
    list_filter = ['is_active', 'is_test_mode']
    search_fields = ['name', 'code']


@admin.register(PayFastPayment)
class PayFastPaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_id', 'transaction', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['payment_id', 'pf_payment_id']


@admin.register(EFTPayment)
class EFTPaymentAdmin(admin.ModelAdmin):
    list_display = ['reference_number', 'transaction', 'amount', 'status', 'payment_date', 'created_at']
    list_filter = ['status', 'payment_date', 'created_at']
    search_fields = ['reference_number', 'account_holder']

