#!/usr/bin/env python
"""
Script to create a test user for authentication testing.

Usage:
    python create_test_user.py
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dressage.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_test_users():
    """Create test users for authentication testing."""
    
    test_users = [
        {
            'email': 'sarah.parker@shyft.com',
            'password': 'SecurePass123!',
            'first_name': 'Sarah',
            'last_name': 'Parker',
            'role': 'RIDER',
            'is_active': True,
        },
        {
            'email': 'alex.johnson@byteorbit.com',
            'password': 'SecurePass123!',
            'first_name': 'Alex',
            'last_name': 'Johnson',
            'role': 'ADMIN',
            'is_active': True,
        },
        {
            'email': 'mike.wilson@shyft.com',
            'password': 'SecurePass123!',
            'first_name': 'Mike',
            'last_name': 'Wilson',
            'role': 'OFFICIAL',
            'is_active': True,
        },
    ]

    print("Creating test users...")
    print("-" * 60)
    
    for user_data in test_users:
        email = user_data['email']

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print(f"✗ Email '{email}' already exists. Skipping.")
            continue

        # Create user using the custom UserManager
        user = User.objects.create_user(
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            role=user_data['role'],
            is_active=user_data['is_active'],
        )

        if user_data['role'] == 'RIDER':
            from apps.riders.models import (
                Rider, RiderAccount, SaefMembership, RiderClub, RiderShowHoldingBody
            )
            Rider.objects.create(
                user=user,
                id_number='9001015009087',
                date_of_birth='1990-01-01',
                gender='MALE',
                nationality='ZA'
            )

        print(f"✓ Created user: {email}")
        print(f"  Role: {user_data['role']}")
        print(f"  Password: {user_data['password']}")
        print()

    print("-" * 60)
    print("Test users created successfully!")
    print()
    print("You can now test login with:")
    print("  Email: sarah.parker@shyft.com")
    print("  Password: SecurePass123!")
    print()
    print("cURL example:")
    print('curl -X POST http://localhost:8000/api/auth/login \\')
    print('  -H "Content-Type: application/json" \\')
    print('  -d \'{"username": "sarah.parker@shyft.com", "password": "SecurePass123!"}\'')

if __name__ == '__main__':
    create_test_users()

