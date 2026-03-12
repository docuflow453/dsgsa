from rest_framework import serializers
from .models import PaymentGateway, PayFastPayment, EFTPayment


class PaymentGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentGateway
        fields = [
            'id', 'name', 'code', 'is_active', 'is_test_mode',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PayFastPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayFastPayment
        fields = [
            'id', 'transaction', 'merchant_id', 'merchant_key', 'amount',
            'item_name', 'payment_id', 'pf_payment_id', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EFTPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EFTPayment
        fields = [
            'id', 'transaction', 'reference_number', 'amount', 'bank_name',
            'account_holder', 'payment_date', 'proof_of_payment', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

