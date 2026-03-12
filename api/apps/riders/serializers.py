from rest_framework import serializers
from .models import Rider, SaefMembership


class RiderSerializer(serializers.ModelSerializer):
    """Serializer for Rider model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    province_name = serializers.CharField(source='province.name', read_only=True)
    
    class Meta:
        model = Rider
        fields = [
            'id', 'user', 'user_email', 'user_full_name', 'saef_number',
            'id_number', 'date_of_birth', 'gender', 'ethnicity',
            'passport_number', 'passport_expiry', 'nationality',
            'address_line_1', 'address_line_2', 'province', 'province_name',
            'suburb', 'city', 'postal_code', 'country',
            'account_type', 'account_name', 'branch_code', 'account_number', 'bank_name',
            'is_active', 'is_international', 'is_test', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RiderDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Rider model."""
    
    user = serializers.SerializerMethodField()
    province_name = serializers.CharField(source='province.name', read_only=True)
    saef_memberships = serializers.SerializerMethodField()
    
    class Meta:
        model = Rider
        fields = [
            'id', 'user', 'saef_number', 'id_number', 'date_of_birth',
            'gender', 'ethnicity', 'passport_number', 'passport_expiry',
            'nationality', 'address_line_1', 'address_line_2', 'province',
            'province_name', 'suburb', 'city', 'postal_code', 'country',
            'account_type', 'account_name', 'branch_code', 'account_number',
            'bank_name', 'is_active', 'is_international', 'is_test',
            'saef_memberships', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'full_name': obj.user.get_full_name(),
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
    
    def get_saef_memberships(self, obj):
        memberships = obj.saef_memberships.all()
        return SaefMembershipSerializer(memberships, many=True).data


class SaefMembershipSerializer(serializers.ModelSerializer):
    """Serializer for SaefMembership model."""
    
    rider_name = serializers.CharField(source='rider.user.get_full_name', read_only=True)
    year_title = serializers.CharField(source='year.title', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = SaefMembership
        fields = [
            'id', 'rider', 'rider_name', 'year', 'year_title',
            'approved_at', 'approved_by', 'approved_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']




