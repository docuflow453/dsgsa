from typing import List
from ninja import Router, Query
from django.http import HttpRequest

from .schemas import (
    HorseSchema, HorseCreateSchema, HorseUpdateSchema, HorseFilterSchema,
    BreedSchema, BreedCreateSchema, BreedUpdateSchema, BreedFilterSchema,
    ClassificationSchema, ClassificationCreateSchema, ClassificationUpdateSchema, ClassificationFilterSchema,
)
from .services import HorseService, BreedService
from .models import Horse, Breed, Classification


router = Router(tags=["Horse Management"])


# ==================== Horse Endpoints ====================

@router.get("/horses", response={200: List[HorseSchema], 400: dict})
def list_horses(request: HttpRequest, filters: HorseFilterSchema = Query(...)):
    """
    List all horses with optional filtering.

    **Filters:**
    - name: Filter by horse name (case-insensitive partial match)
    - gender: Filter by gender
    - status: Filter by status
    - is_banned: Filter by banned status
    """
    try:
        horses = Horse.objects.select_related('breed', 'breed_type', 'color').filter(filters.get_filter_expression())

        # Convert to schema format
        horse_list = []
        for horse in horses:
            horse_data = {
                'id': str(horse.id),
                'name': horse.name,
                'gender': horse.gender,
                'passport_number': horse.passport_number,
                'microchip_number': horse.microchip_number,
                'date_of_birth': horse.date_of_birth,
                'breed_id': str(horse.breed.id),
                'breed_name': horse.breed.name,
                'breed_type_id': str(horse.breed_type.id) if horse.breed_type else None,
                'breed_type_name': horse.breed_type.name if horse.breed_type else None,
                'color_id': str(horse.color.id),
                'color_name': horse.color.name,
                'country': horse.country,
                'sire': horse.sire,
                'dam': horse.dam,
                'sire_of_dam': horse.sire_of_dam,
                'status': horse.status,
                'is_banned': horse.is_banned,
                'banned_at': horse.banned_at,
                'age': horse.age,
                'created_at': horse.created_at,
                'updated_at': horse.updated_at,
            }
            horse_list.append(horse_data)

        return 200, horse_list
    except Exception as e:
        return 400, {"message": str(e)}


@router.post("/horses", response={201: HorseSchema, 400: dict})
def create_horse(request: HttpRequest, payload: HorseCreateSchema):
    """
    Create a new horse.

    **Request Body:**
    - All horse details including name, gender, passport_number, etc.

    **Response:**
    - 201: Horse created successfully
    - 400: Validation error or business logic violation
    """
    success, horse, error = HorseService.create_horse(payload.dict())

    if not success:
        return 400, {"message": error}

    return 201, {
        'id': str(horse.id),
        'name': horse.name,
        'gender': horse.gender,
        'passport_number': horse.passport_number,
        'microchip_number': horse.microchip_number,
        'date_of_birth': horse.date_of_birth,
        'breed_id': str(horse.breed.id),
        'breed_name': horse.breed.name,
        'breed_type_id': str(horse.breed_type.id) if horse.breed_type else None,
        'breed_type_name': horse.breed_type.name if horse.breed_type else None,
        'color_id': str(horse.color.id),
        'color_name': horse.color.name,
        'country': horse.country,
        'sire': horse.sire,
        'dam': horse.dam,
        'sire_of_dam': horse.sire_of_dam,
        'status': horse.status,
        'is_banned': horse.is_banned,
        'banned_at': horse.banned_at,
        'age': horse.age,
        'created_at': horse.created_at,
        'updated_at': horse.updated_at,
    }


@router.get("/horses/{horse_id}", response={200: HorseSchema, 404: dict})
def get_horse(request: HttpRequest, horse_id: str):
    """
    Get details for a specific horse.

    **Parameters:**
    - horse_id: UUID of the horse

    **Response:**
    - 200: Horse details
    - 404: Horse not found
    """
    horse = HorseService.get_horse(horse_id)

    if not horse:
        return 404, {"message": "Horse not found"}

    return 200, {
        'id': str(horse.id),
        'name': horse.name,
        'gender': horse.gender,
        'passport_number': horse.passport_number,
        'microchip_number': horse.microchip_number,
        'date_of_birth': horse.date_of_birth,
        'breed_id': str(horse.breed.id),
        'breed_name': horse.breed.name,
        'breed_type_id': str(horse.breed_type.id) if horse.breed_type else None,
        'breed_type_name': horse.breed_type.name if horse.breed_type else None,
        'color_id': str(horse.color.id),
        'color_name': horse.color.name,
        'country': horse.country,
        'sire': horse.sire,
        'dam': horse.dam,
        'sire_of_dam': horse.sire_of_dam,
        'status': horse.status,
        'is_banned': horse.is_banned,
        'banned_at': horse.banned_at,
        'age': horse.age,
        'created_at': horse.created_at,
        'updated_at': horse.updated_at,
    }


@router.patch("/horses/{horse_id}", response={200: HorseSchema, 400: dict, 404: dict})
def update_horse(request: HttpRequest, horse_id: str, payload: HorseUpdateSchema):
    """Update a horse's details."""
    success, horse, error = HorseService.update_horse(horse_id, payload.dict(exclude_unset=True))

    if not success:
        if error == "Horse not found":
            return 404, {"message": error}
        return 400, {"message": error}

    return 200, {
        'id': str(horse.id),
        'name': horse.name,
        'gender': horse.gender,
        'passport_number': horse.passport_number,
        'microchip_number': horse.microchip_number,
        'date_of_birth': horse.date_of_birth,
        'breed_id': str(horse.breed.id),
        'breed_name': horse.breed.name,
        'breed_type_id': str(horse.breed_type.id) if horse.breed_type else None,
        'breed_type_name': horse.breed_type.name if horse.breed_type else None,
        'color_id': str(horse.color.id),
        'color_name': horse.color.name,
        'country': horse.country,
        'sire': horse.sire,
        'dam': horse.dam,
        'sire_of_dam': horse.sire_of_dam,
        'status': horse.status,
        'is_banned': horse.is_banned,
        'banned_at': horse.banned_at,
        'age': horse.age,
        'created_at': horse.created_at,
        'updated_at': horse.updated_at,
    }


@router.delete("/horses/{horse_id}", response={200: dict, 404: dict})
def delete_horse(request: HttpRequest, horse_id: str):
    """Delete a horse."""
    success, error = HorseService.delete_horse(horse_id)

    if not success:
        return 404, {"message": error}

    return 200, {"message": "Horse deleted successfully"}
