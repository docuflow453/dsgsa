from typing import Optional, List, Tuple, Dict, Any
from django.db import transaction
from django.db.models import Q, Prefetch
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import (
    Classification, Breed, BreedType, HorseColor, Horse,
    HorseVaccination, HorseAccount, HorseDocument
)


class HorseService:
    """Service class for Horse CRUD operations and business logic"""

    @classmethod
    def create_horse(cls, data: Dict[str, Any], user=None) -> Tuple[bool, Optional[Horse], Optional[str]]:
        """
        Create a new horse.

        Args:
            data: Dictionary containing horse data
            user: User creating the horse (optional)

        Returns:
            Tuple of (success, horse_instance, error_message)
        """
        try:
            # Validate breed
            try:
                breed = Breed.objects.get(id=data['breed_id'], is_active=True)
            except Breed.DoesNotExist:
                return False, None, "Breed not found or inactive"

            # Validate color
            try:
                color = HorseColor.objects.get(id=data['color_id'], is_active=True)
            except HorseColor.DoesNotExist:
                return False, None, "Color not found or inactive"

            # Validate breed type if provided
            breed_type = None
            if data.get('breed_type_id'):
                try:
                    breed_type = BreedType.objects.get(
                        id=data['breed_type_id'],
                        breed=breed,
                        is_active=True
                    )
                except BreedType.DoesNotExist:
                    return False, None, "Breed type not found or does not match breed"

            # Check for duplicate passport number
            if Horse.objects.filter(passport_number=data['passport_number']).exists():
                return False, None, "Passport number already exists"

            # Check for duplicate microchip number
            if Horse.objects.filter(microchip_number=data['microchip_number']).exists():
                return False, None, "Microchip number already exists"

            # Create horse
            with transaction.atomic():
                horse = Horse.objects.create(
                    name=data['name'],
                    gender=data['gender'],
                    passport_number=data['passport_number'],
                    microchip_number=data['microchip_number'],
                    date_of_birth=data['date_of_birth'],
                    breed=breed,
                    breed_type=breed_type,
                    color=color,
                    country=data['country'],
                    sire=data.get('sire', ''),
                    dam=data.get('dam', ''),
                    sire_of_dam=data.get('sire_of_dam', ''),
                    status=data.get('status', 'ACTIVE'),
                )

            return True, horse, None

        except Exception as e:
            return False, None, str(e)

    @classmethod
    def update_horse(cls, horse_id: str, data: Dict[str, Any]) -> Tuple[bool, Optional[Horse], Optional[str]]:
        """
        Update an existing horse.

        Args:
            horse_id: UUID of the horse to update
            data: Dictionary containing fields to update

        Returns:
            Tuple of (success, horse_instance, error_message)
        """
        try:
            horse = Horse.objects.get(id=horse_id)

            # Validate breed if being updated
            if 'breed_id' in data:
                try:
                    breed = Breed.objects.get(id=data['breed_id'], is_active=True)
                    horse.breed = breed
                except Breed.DoesNotExist:
                    return False, None, "Breed not found or inactive"

            # Validate color if being updated
            if 'color_id' in data:
                try:
                    color = HorseColor.objects.get(id=data['color_id'], is_active=True)
                    horse.color = color
                except HorseColor.DoesNotExist:
                    return False, None, "Color not found or inactive"

            # Validate breed type if being updated
            if 'breed_type_id' in data:
                if data['breed_type_id']:
                    try:
                        breed_type = BreedType.objects.get(
                            id=data['breed_type_id'],
                            breed=horse.breed,
                            is_active=True
                        )
                        horse.breed_type = breed_type
                    except BreedType.DoesNotExist:
                        return False, None, "Breed type not found or does not match breed"
                else:
                    horse.breed_type = None

            # Check for duplicate passport number
            if 'passport_number' in data and data['passport_number'] != horse.passport_number:
                if Horse.objects.filter(passport_number=data['passport_number']).exists():
                    return False, None, "Passport number already exists"

            # Check for duplicate microchip number
            if 'microchip_number' in data and data['microchip_number'] != horse.microchip_number:
                if Horse.objects.filter(microchip_number=data['microchip_number']).exists():
                    return False, None, "Microchip number already exists"

            # Update simple fields
            for field in ['name', 'gender', 'passport_number', 'microchip_number',
                         'date_of_birth', 'country', 'sire', 'dam', 'sire_of_dam',
                         'status', 'is_banned']:
                if field in data:
                    setattr(horse, field, data[field])

            # Handle banned_at timestamp
            if 'is_banned' in data:
                if data['is_banned'] and not horse.banned_at:
                    horse.banned_at = timezone.now()
                elif not data['is_banned']:
                    horse.banned_at = None

            horse.save()
            return True, horse, None

        except Horse.DoesNotExist:
            return False, None, "Horse not found"
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def get_horse(cls, horse_id: str) -> Optional[Horse]:
        """Get a horse by ID with related data"""
        try:
            return Horse.objects.select_related(
                'breed', 'breed_type', 'color'
            ).prefetch_related(
                'vaccinations', 'documents', 'accounts'
            ).get(id=horse_id)
        except Horse.DoesNotExist:
            return None

    @classmethod
    def get_horses(cls, filters: Dict[str, Any] = None) -> List[Horse]:
        """Get all horses with optional filtering"""
        queryset = Horse.objects.select_related(
            'breed', 'breed_type', 'color'
        ).all()

        if filters:
            if 'name' in filters:
                queryset = queryset.filter(name__icontains=filters['name'])
            if 'status' in filters:
                queryset = queryset.filter(status=filters['status'])
            if 'is_banned' in filters:
                queryset = queryset.filter(is_banned=filters['is_banned'])

        return list(queryset)

    @classmethod
    def delete_horse(cls, horse_id: str) -> Tuple[bool, Optional[str]]:
        """Delete a horse"""
        try:
            horse = Horse.objects.get(id=horse_id)
            horse.delete()
            return True, None
        except Horse.DoesNotExist:
            return False, "Horse not found"
        except Exception as e:
            return False, str(e)


class BreedService:
    """Service class for Breed CRUD operations"""

    @classmethod
    def create_breed(cls, data: Dict[str, Any]) -> Tuple[bool, Optional[Breed], Optional[str]]:
        """Create a new breed"""
        try:
            if Breed.objects.filter(name__iexact=data['name']).exists():
                return False, None, "Breed with this name already exists"

            breed = Breed.objects.create(**data)
            return True, breed, None
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def update_breed(cls, breed_id: str, data: Dict[str, Any]) -> Tuple[bool, Optional[Breed], Optional[str]]:
        """Update a breed"""
        try:
            breed = Breed.objects.get(id=breed_id)

            if 'name' in data and data['name'].lower() != breed.name.lower():
                if Breed.objects.filter(name__iexact=data['name']).exists():
                    return False, None, "Breed with this name already exists"

            for field in ['name', 'description', 'is_active']:
                if field in data:
                    setattr(breed, field, data[field])

            breed.save()
            return True, breed, None
        except Breed.DoesNotExist:
            return False, None, "Breed not found"
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def get_breed(cls, breed_id: str) -> Optional[Breed]:
        """Get a breed by ID"""
        try:
            return Breed.objects.get(id=breed_id)
        except Breed.DoesNotExist:
            return None

    @classmethod
    def get_breeds(cls, filters: Dict[str, Any] = None) -> List[Breed]:
        """Get all breeds"""
        queryset = Breed.objects.all()

        if filters:
            if 'name' in filters:
                queryset = queryset.filter(name__icontains=filters['name'])
            if 'is_active' in filters:
                queryset = queryset.filter(is_active=filters['is_active'])

        return list(queryset)

    @classmethod
    def delete_breed(cls, breed_id: str) -> Tuple[bool, Optional[str]]:
        """Delete a breed"""
        try:
            breed = Breed.objects.get(id=breed_id)
            breed.delete()
            return True, None
        except Breed.DoesNotExist:
            return False, "Breed not found"
        except Exception as e:
            return False, str(e)




class ClassificationService:
    """Service class for Classification CRUD operations"""

    @classmethod
    def create_classification(cls, data: Dict[str, Any]) -> Tuple[bool, Optional[Classification], Optional[str]]:
        """Create a new classification"""
        try:
            if Classification.objects.filter(name__iexact=data['name']).exists():
                return False, None, "Classification with this name already exists"

            classification = Classification.objects.create(**data)
            return True, classification, None
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def update_classification(cls, classification_id: str, data: Dict[str, Any]) -> Tuple[bool, Optional[Classification], Optional[str]]:
        """Update a classification"""
        try:
            classification = Classification.objects.get(id=classification_id)

            # Check for duplicate name
            if 'name' in data and data['name'].lower() != classification.name.lower():
                if Classification.objects.filter(name__iexact=data['name']).exists():
                    return False, None, "Classification with this name already exists"

            for field in ['name', 'description', 'is_active']:
                if field in data:
                    setattr(classification, field, data[field])

            classification.save()
            return True, classification, None
        except Classification.DoesNotExist:
            return False, None, "Classification not found"
        except Exception as e:
            return False, None, str(e)

    @classmethod
    def get_classification(cls, classification_id: str) -> Optional[Classification]:
        """Get a classification by ID"""
        try:
            return Classification.objects.get(id=classification_id)
        except Classification.DoesNotExist:
            return None

    @classmethod
    def get_classifications(cls, filters: Dict[str, Any] = None) -> List[Classification]:
        """Get all classifications with optional filtering"""
        queryset = Classification.objects.all()

        if filters:
            if 'name' in filters:
                queryset = queryset.filter(name__icontains=filters['name'])
            if 'is_active' in filters:
                queryset = queryset.filter(is_active=filters['is_active'])

        return list(queryset)

    @classmethod
    def delete_classification(cls, classification_id: str) -> Tuple[bool, Optional[str]]:
        """Delete a classification"""
        try:
            classification = Classification.objects.get(id=classification_id)
            classification.delete()
            return True, None
        except Classification.DoesNotExist:
            return False, "Classification not found"
        except Exception as e:
            return False, str(e)

