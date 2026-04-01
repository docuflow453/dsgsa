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
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_test_users():
    """Create test users for authentication testing."""
    
    test_users = [
        {
            'username': 'sarah.parker',
            'email': 'sarah.parker@shyft.com',
            'password': 'SecurePass123!',
            'first_name': 'Sarah',
            'last_name': 'Parker',
            'role': 'RIDER',
            'is_active': True,
        },
        {
            'username': 'alex.johnson',
            'email': 'alex.johnson@byteorbit.com',
            'password': 'SecurePass123!',
            'first_name': 'Alex',
            'last_name': 'Johnson',
            'role': 'ADMIN',
            'is_active': True,
        },
        {
            'username': 'mike.wilson',
            'email': 'mike.wilson@shyft.com',
            'password': 'SecurePass123!',
            'first_name': 'Mike',
            'last_name': 'Wilson',
            'role': 'STAFF',
            'is_active': True,
        },
    ]
    
    print("Creating test users...")
    print("-" * 60)
    
    for user_data in test_users:
        username = user_data['username']
        email = user_data['email']
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"✗ User '{username}' already exists. Skipping.")
            continue
        
        if User.objects.filter(email=email).exists():
            print(f"✗ Email '{email}' already exists. Skipping.")
            continue
        
        # Create user
        user = User.objects.create(
            username=user_data['username'],
            email=user_data['email'],
            password=make_password(user_data['password']),
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            role=user_data['role'],
            is_active=user_data['is_active'],
        )
        
        print(f"✓ Created user: {username} ({email})")
        print(f"  Role: {user_data['role']}")
        print(f"  Password: {user_data['password']}")
        print()
    
    print("-" * 60)
    print("Test users created successfully!")
    print()
    print("You can now test login with:")
    print("  Username: sarah.parker")
    print("  Email: sarah.parker@shyft.com")
    print("  Password: SecurePass123!")
    print()
    print("cURL example:")
    print('curl -X POST http://localhost:8000/api/auth/login \\')
    print('  -H "Content-Type: application/json" \\')
    print('  -d \'{"username": "sarah.parker@shyft.com", "password": "SecurePass123!"}\'')

if __name__ == '__main__':
    create_test_users()

