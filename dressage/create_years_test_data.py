#!/usr/bin/env python
"""
Script to create test data for the Years app.
Run with: python create_years_test_data.py
"""
import os
import sys
import django
from datetime import date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dressage.settings')
django.setup()

from apps.years.models import Year, YearStatus


def create_test_data():
    """Create test data for competition years"""

    print("Creating test data for Years app...")

    # Create competition years
    years_data = [
        {
            'name': '2023 Competition Season',
            'year': 2023,
            'start_date': date(2023, 1, 1),
            'end_date': date(2023, 12, 31),
            'status': YearStatus.COMPLETE,
            'is_registration_open': False,
            'notes': 'Completed season for 2023'
        },
        {
            'name': '2024 Competition Season',
            'year': 2024,
            'start_date': date(2024, 1, 1),
            'end_date': date(2024, 12, 31),
            'status': YearStatus.ACTIVE,
            'is_registration_open': True,
            'notes': 'Current active competition season'
        },
        {
            'name': '2025 Competition Season',
            'year': 2025,
            'start_date': date(2025, 1, 1),
            'end_date': date(2025, 12, 31),
            'status': YearStatus.PENDING,
            'is_registration_open': False,
            'notes': 'Upcoming season, registration not yet open'
        },
        {
            'name': '2026 Planning Year',
            'year': 2026,
            'start_date': date(2026, 1, 1),
            'end_date': date(2026, 12, 31),
            'status': YearStatus.PENDING,
            'is_registration_open': False,
            'notes': 'Future planning year'
        },
    ]

    for year_data in years_data:
        year, created = Year.objects.get_or_create(
            year=year_data['year'],
            defaults=year_data
        )
        if created:
            print(f"✅ Created year: {year.name} (Status: {year.status})")
            print(f"   - Date Range: {year.start_date} to {year.end_date}")
            print(f"   - Duration: {year.duration_days} days")
            print(f"   - Registration Open: {year.is_registration_open}")
            print(f"   - Is Current: {year.is_current}")
            print(f"   - Days Remaining: {year.days_remaining}")
        else:
            print(f"⚠️  Year {year.year} already exists, skipping...")

    print("\n✅ Test data creation complete!")
    print(f"\n📊 Summary:")
    print(f"   Total Years: {Year.objects.count()}")
    print(f"   Active Years: {Year.objects.filter(status=YearStatus.ACTIVE).count()}")
    print(f"   Pending Years: {Year.objects.filter(status=YearStatus.PENDING).count()}")
    print(f"   Complete Years: {Year.objects.filter(status=YearStatus.COMPLETE).count()}")
    print(f"   Registration Open: {Year.objects.filter(is_registration_open=True).count()}")

    # Display active year
    active_year = Year.objects.filter(status=YearStatus.ACTIVE).first()
    if active_year:
        print(f"\n🎯 Active Year: {active_year.name}")
        print(f"   - ID: {active_year.id}")
        print(f"   - Days Remaining: {active_year.days_remaining}")


if __name__ == '__main__':
    create_test_data()

