from rest_framework import serializers
from .models import Horse, HorseBreed, HorseColour, BreedType, StudFarm, VaccinationType, HorseVaccination


class HorseBreedSerializer(serializers.ModelSerializer):
    """Serializer for HorseBreed model."""
    
    class Meta:
        model = HorseBreed
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BreedTypeSerializer(serializers.ModelSerializer):
    """Serializer for BreedType model."""
    
    class Meta:
        model = BreedType
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class HorseColourSerializer(serializers.ModelSerializer):
    """Serializer for HorseColour model."""
    
    class Meta:
        model = HorseColour
        fields = ['id', 'name', 'code', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudFarmSerializer(serializers.ModelSerializer):
    """Serializer for StudFarm model."""
    
    class Meta:
        model = StudFarm
        fields = [
            'id', 'name', 'registration_number', 'contact_person',
            'email', 'phone', 'website', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VaccinationTypeSerializer(serializers.ModelSerializer):
    """Serializer for VaccinationType model."""
    
    class Meta:
        model = VaccinationType
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class HorseVaccinationSerializer(serializers.ModelSerializer):
    """Serializer for HorseVaccination model."""
    
    vaccination_type_name = serializers.CharField(source='vaccination_type.name', read_only=True)
    horse_name = serializers.CharField(source='horse.name', read_only=True)
    
    class Meta:
        model = HorseVaccination
        fields = [
            'id', 'horse', 'horse_name', 'vaccination_type', 'vaccination_type_name',
            'date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HorseSerializer(serializers.ModelSerializer):
    """Serializer for Horse model."""
    
    breed_name = serializers.CharField(source='breed.name', read_only=True)
    breed_type_name = serializers.CharField(source='breed_type.name', read_only=True)
    colour_name = serializers.CharField(source='colour.name', read_only=True)
    vaccinations = HorseVaccinationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Horse
        fields = [
            'id', 'name', 'passport_number', 'passport_expiry', 'date_of_birth',
            'nationality', 'breed', 'breed_name', 'breed_type', 'breed_type_name',
            'colour', 'colour_name', 'sire', 'dam', 'sire_of_dam', 'gender',
            'microchip_number', 'qr_link', 'fei_link', 'is_test',
            'vaccinations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HorseDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Horse model with all related data."""
    
    breed = HorseBreedSerializer(read_only=True)
    breed_type = BreedTypeSerializer(read_only=True)
    colour = HorseColourSerializer(read_only=True)
    vaccinations = HorseVaccinationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Horse
        fields = [
            'id', 'name', 'passport_number', 'passport_expiry', 'date_of_birth',
            'nationality', 'breed', 'breed_type', 'colour', 'sire', 'dam',
            'sire_of_dam', 'gender', 'microchip_number', 'qr_link', 'fei_link',
            'is_test', 'vaccinations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

