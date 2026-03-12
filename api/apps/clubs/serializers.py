from rest_framework import serializers
from .models import Club, ShowHoldingBody, PaymentMethod, Extra


class ClubSerializer(serializers.ModelSerializer):
    """Serializer for Club model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    province_name = serializers.CharField(source='province.name', read_only=True)
    
    class Meta:
        model = Club
        fields = [
            'id', 'user', 'user_email', 'name', 'saef_number',
            'address_line_1', 'address_line_2', 'province', 'province_name',
            'suburb', 'city', 'postal_code', 'country',
            'is_active', 'is_test', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ShowHoldingBodySerializer(serializers.ModelSerializer):
    """Serializer for ShowHoldingBody model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    province_name = serializers.CharField(source='province.name', read_only=True)
    
    class Meta:
        model = ShowHoldingBody
        fields = [
            'id', 'user', 'user_email', 'name', 'saef_number',
            'established_at', 'website',
            'address_line_1', 'address_line_2', 'province', 'province_name',
            'suburb', 'city', 'postal_code', 'country',
            'account_type', 'account_name', 'branch_code', 'account_number', 'bank_name',
            'is_active', 'is_test', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaymentMethod model."""
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'name', 'code', 'description', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExtraSerializer(serializers.ModelSerializer):
    """Serializer for Extra model."""
    
    class Meta:
        model = Extra
        fields = [
            'id', 'name', 'description', 'price', 'quantity_available',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

