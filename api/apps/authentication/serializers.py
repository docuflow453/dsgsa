from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Year, Membership, Classification, Province, YearClassificationFee, Levy

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    name = serializers.SerializerMethodField()
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'title', 'firstName', 'first_name', 'maiden_name',
            'lastName', 'last_name', 'name', 'role', 'is_active',
            'email_confirmed_at', 'banned_at', 'activated_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'name', 'firstName', 'lastName']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'write_only': True},
            'last_name': {'write_only': True}
        }

    def get_name(self, obj):
        """Return full name."""
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'email', 'title', 'first_name', 'maiden_name', 'last_name',
            'password', 'password_confirm', 'role'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class YearSerializer(serializers.ModelSerializer):
    """Serializer for Year model."""
    
    class Meta:
        model = Year
        fields = [
            'id', 'title', 'start_date', 'end_date', 'open_at',
            'password', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MembershipSerializer(serializers.ModelSerializer):
    """Serializer for Membership model."""
    
    class Meta:
        model = Membership
        fields = ['id', 'name', 'code', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassificationSerializer(serializers.ModelSerializer):
    """Serializer for Classification model."""
    
    class Meta:
        model = Classification
        fields = [
            'id', 'name', 'is_pony', 'is_recreational', 'is_admin',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProvinceSerializer(serializers.ModelSerializer):
    """Serializer for Province model."""
    
    class Meta:
        model = Province
        fields = ['id', 'name', 'country_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class YearClassificationFeeSerializer(serializers.ModelSerializer):
    """Serializer for YearClassificationFee model."""
    
    classification_name = serializers.CharField(source='classification.name', read_only=True)
    year_title = serializers.CharField(source='year.title', read_only=True)
    
    class Meta:
        model = YearClassificationFee
        fields = [
            'id', 'classification', 'classification_name', 'year', 'year_title',
            'fee', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LevySerializer(serializers.ModelSerializer):
    """Serializer for Levy model."""
    
    class Meta:
        model = Levy
        fields = [
            'id', 'name', 'description', 'fee_exclusive', 'fee',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

