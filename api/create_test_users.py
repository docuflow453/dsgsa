#!/usr/bin/env python
"""
Create test users for authentication testing
Run this script after migrations: python manage.py shell < create_test_users.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Test users data
test_users = [
    {
        'email': 'rider@shyft.com',
        'first_name': 'Emma',
        'last_name': 'Williams',
        'password': 'password123',
        'role': 'Rider'
    },
    {
        'email': 'admin@shyft.com',
        'first_name': 'Sarah',
        'last_name': 'Parker',
        'password': 'password123',
        'role': 'Admin'
    },
    {
        'email': 'club@byteorbit.com',
        'first_name': 'Michael',
        'last_name': 'Johnson',
        'password': 'password123',
        'role': 'Club'
    },
    {
        'email': 'provincial@byteorbit.com',
        'first_name': 'Jessica',
        'last_name': 'Martinez',
        'password': 'password123',
        'role': 'Provincial'
    },
    {
        'email': 'saef@shyft.com',
        'first_name': 'David',
        'last_name': 'Anderson',
        'password': 'password123',
        'role': 'SAEF'
    }
]

print("Creating test users...")
print("-" * 50)

for user_data in test_users:
    email = user_data['email']
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        print(f"✓ User {email} already exists")
        continue
    
    # Create user
    user = User.objects.create_user(
        email=email,
        password=user_data['password'],
        first_name=user_data['first_name'],
        last_name=user_data['last_name'],
        role=user_data['role']
    )
    
    print(f"✓ Created user: {email} ({user_data['role']})")
    print(f"  Name: {user.get_full_name()}")
    print(f"  Password: {user_data['password']}")
    print()

print("-" * 50)
print("Test users created successfully!")
print("\nYou can now login with:")
print("  Email: rider@shyft.com")
print("  Password: password123")

