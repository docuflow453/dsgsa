#!/usr/bin/env python
"""
Script to create test data for the Horse app.
Run with: python create_horse_test_data.py
"""
import os
import sys
import django
from datetime import date, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dressage.settings')
django.setup()

from apps.horse.models import (
    Classification, Breed, BreedType, HorseColor,
    Horse
)

def create_test_data():
    """Create test data for horses and related entities"""
    
    print("Creating test data for Horse app...")
    
    # Create Classifications
    classifications = [
        {'name': 'Pony', 'description': 'Height below 14.2 hands'},
        {'name': 'Horse', 'description': 'Height 14.2 hands and above'},
        {'name': 'Small Pony', 'description': 'Height below 12.2 hands'},
    ]
    
    for class_data in classifications:
        classification, created = Classification.objects.get_or_create(
            name=class_data['name'],
            defaults={'description': class_data['description']}
        )
        if created:
            print(f"✅ Created classification: {classification.name}")
    
    # Create Breeds
    breeds_data = [
        {'name': 'Warmblood', 'description': 'Popular sport horse breed'},
        {'name': 'Thoroughbred', 'description': 'Athletic racing breed'},
        {'name': 'Arabian', 'description': 'Ancient desert breed'},
        {'name': 'Quarter Horse', 'description': 'American working horse'},
    ]
    
    breeds = {}
    for breed_data in breeds_data:
        breed, created = Breed.objects.get_or_create(
            name=breed_data['name'],
            defaults={'description': breed_data['description']}
        )
        breeds[breed.name] = breed
        if created:
            print(f"✅ Created breed: {breed.name}")
    
    # Create Breed Types
    breed_types_data = [
        {'breed': 'Warmblood', 'name': 'Hanoverian'},
        {'breed': 'Warmblood', 'name': 'Dutch Warmblood'},
        {'breed': 'Warmblood', 'name': 'Oldenburg'},
    ]
    
    for bt_data in breed_types_data:
        breed_type, created = BreedType.objects.get_or_create(
            breed=breeds[bt_data['breed']],
            name=bt_data['name']
        )
        if created:
            print(f"✅ Created breed type: {breed_type.name}")
    
    # Create Horse Colors
    colors_data = [
        {'name': 'Bay', 'color_code': '#8B4513'},
        {'name': 'Chestnut', 'color_code': '#CD853F'},
        {'name': 'Black', 'color_code': '#000000'},
        {'name': 'Grey', 'color_code': '#808080'},
        {'name': 'Palomino', 'color_code': '#F0DC82'},
    ]
    
    colors = {}
    for color_data in colors_data:
        color, created = HorseColor.objects.get_or_create(
            name=color_data['name'],
            defaults={'color_code': color_data['color_code']}
        )
        colors[color.name] = color
        if created:
            print(f"✅ Created color: {color.name}")
    
    # Create Sample Horses
    horses_data = [
        {
            'name': 'Thunderbolt',
            'gender': 'STALLION',
            'passport_number': 'ZA-2019-001234',
            'microchip_number': '953010001234567',
            'date_of_birth': date(2019, 3, 15),
            'breed': breeds['Warmblood'],
            'color': colors['Bay'],
            'country': 'South Africa',
            'sire': 'Lightning Strike',
            'dam': 'Summer Rain',
            'sire_of_dam': 'Winter Storm',
        },
        {
            'name': 'Midnight Star',
            'gender': 'MARE',
            'passport_number': 'ZA-2020-005678',
            'microchip_number': '953010005678901',
            'date_of_birth': date(2020, 7, 22),
            'breed': breeds['Thoroughbred'],
            'color': colors['Black'],
            'country': 'South Africa',
            'sire': 'Dark Knight',
            'dam': 'Starlight',
            'sire_of_dam': 'Moon Dancer',
        },
        {
            'name': 'Golden Dream',
            'gender': 'GELDING',
            'passport_number': 'ZA-2018-009012',
            'microchip_number': '953010009012345',
            'date_of_birth': date(2018, 5, 10),
            'breed': breeds['Arabian'],
            'color': colors['Palomino'],
            'country': 'South Africa',
            'sire': 'Desert Prince',
            'dam': 'Golden Sunset',
            'sire_of_dam': 'Arabian Nights',
        },
    ]
    
    for horse_data in horses_data:
        horse, created = Horse.objects.get_or_create(
            passport_number=horse_data['passport_number'],
            defaults=horse_data
        )
        if created:
            print(f"✅ Created horse: {horse.name} (Age: {horse.age} years)")
    
    print("\n✅ Test data creation complete!")
    print(f"Total Classifications: {Classification.objects.count()}")
    print(f"Total Breeds: {Breed.objects.count()}")
    print(f"Total Breed Types: {BreedType.objects.count()}")
    print(f"Total Colors: {HorseColor.objects.count()}")
    print(f"Total Horses: {Horse.objects.count()}")

if __name__ == '__main__':
    create_test_data()

