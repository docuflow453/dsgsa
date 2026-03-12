from rest_framework import serializers
from .models import Account, RiderAccount, HorseAccount


class AccountSerializer(serializers.ModelSerializer):
    """Serializer for Account model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    year_title = serializers.CharField(source='year.title', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Account
        fields = [
            'id', 'user', 'user_email', 'year', 'year_title', 'amount',
            'payment_method', 'approved_by', 'approved_by_name', 'approved_at',
            'data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RiderAccountSerializer(serializers.ModelSerializer):
    """Serializer for RiderAccount model."""
    
    rider_name = serializers.CharField(source='rider.user.get_full_name', read_only=True)
    subscription_name = serializers.CharField(source='subscription.name', read_only=True)
    
    class Meta:
        model = RiderAccount
        fields = [
            'id', 'rider', 'rider_name', 'account', 'subscription',
            'subscription_name', 'amount', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HorseAccountSerializer(serializers.ModelSerializer):
    """Serializer for HorseAccount model."""
    
    horse_name = serializers.CharField(source='horse.name', read_only=True)
    classification_name = serializers.CharField(source='classification_type.name', read_only=True)
    
    class Meta:
        model = HorseAccount
        fields = [
            'id', 'horse', 'horse_name', 'account', 'classification_type',
            'classification_name', 'amount', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

