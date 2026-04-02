#!/usr/bin/env python
"""
Script to create test data for the Memberships app.
Run with: python create_memberships_test_data.py
"""
import os
import sys
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dressage.settings')
django.setup()

from apps.memberships.models import Membership, Subscription
from apps.years.models import Year


def create_test_data():
    """Create test data for membership types"""

    print("Creating test data for Memberships app...")

    # Create membership types
    memberships_data = [
        {
            'name': 'Rider Membership',
            'description': 'Full membership for riders participating in dressage competitions. Includes competition access, voting rights, and full member benefits.',
            'is_active': True,
            'notes': 'Most popular membership type for active competitors'
        },
        {
            'name': 'Non-Rider Membership',
            'description': 'Membership for non-riders including coaches, officials, and supporters. Provides access to events and member resources.',
            'is_active': True,
            'notes': 'For coaches, officials, and supporters'
        },
        {
            'name': 'Junior Rider Membership',
            'description': 'Discounted membership for junior riders (under 18 years). Includes all rider benefits at a reduced rate.',
            'is_active': True,
            'notes': 'Age verification required'
        },
        {
            'name': 'Club Membership',
            'description': 'Membership for affiliated riding clubs. Enables club-level participation in events and competitions.',
            'is_active': True,
            'notes': 'Requires valid club registration'
        },
        {
            'name': 'Honorary Membership',
            'description': 'Complimentary membership granted to distinguished members of the dressage community.',
            'is_active': True,
            'notes': 'Granted by board decision only'
        },
        {
            'name': 'International Membership',
            'description': 'Membership for international riders competing in South African events.',
            'is_active': True,
            'notes': 'FEI registration may be required'
        },
        {
            'name': 'Student Membership',
            'description': 'Discounted membership for full-time students pursuing equestrian studies.',
            'is_active': False,
            'notes': 'Currently under review - proof of enrollment required'
        },
        {
            'name': 'Life Membership',
            'description': 'Lifetime membership with all benefits. One-time payment, valid for life.',
            'is_active': False,
            'notes': 'Program temporarily suspended pending policy review'
        },
    ]

    for membership_data in memberships_data:
        membership, created = Membership.objects.get_or_create(
            name=membership_data['name'],
            defaults=membership_data
        )
        if created:
            print(f"✅ Created membership: {membership.name} ({membership.status})")
            print(f"   - Description: {membership.description[:80]}...")
            print(f"   - Active: {membership.is_active}")
        else:
            print(f"⚠️  Membership '{membership.name}' already exists, skipping...")

    print("\n📝 Membership types created successfully!")
    print(f"   Total Memberships: {Membership.objects.count()}")
    print(f"   Active Memberships: {Membership.objects.filter(is_active=True).count()}")

    # Create subscriptions for available years
    print("\n\n📅 Creating subscription offerings...")

    # Get active years
    active_years = Year.objects.filter(is_registration_open=True)[:3]

    if not active_years:
        print("⚠️  No years available for creating subscriptions.")
        print("   Please run 'python create_years_test_data.py' first.")
    else:
        # Get active memberships
        rider_membership = Membership.objects.filter(name='Rider Membership').first()
        junior_membership = Membership.objects.filter(name='Junior Rider Membership').first()
        non_rider_membership = Membership.objects.filter(name='Non-Rider Membership').first()
        club_membership = Membership.objects.filter(name='Club Membership').first()

        created_count = 0
        skipped_count = 0

        for year in active_years:
            # Rider Membership - Competitive
            if rider_membership:
                sub, created = Subscription.objects.get_or_create(
                    membership=rider_membership,
                    year=year,
                    is_recreational=False,
                    defaults={
                        'name': f'{year.year} Rider Membership - Competitive',
                        'description': f'Full competitive rider membership for {year.year} season. Includes competition access, voting rights, and all member benefits.',
                        'fee': Decimal('650.00'),
                        'is_active': True,
                        'notes': 'Early bird discount available until January 31'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

                # Rider Membership - Recreational
                sub, created = Subscription.objects.get_or_create(
                    membership=rider_membership,
                    year=year,
                    is_recreational=True,
                    defaults={
                        'name': f'{year.year} Rider Membership - Recreational',
                        'description': f'Recreational rider membership for {year.year} season. For non-competitive riders and casual participants.',
                        'fee': Decimal('350.00'),
                        'is_active': True,
                        'notes': 'Limited competition access - recreational events only'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

            # Junior Rider Membership - Competitive
            if junior_membership:
                sub, created = Subscription.objects.get_or_create(
                    membership=junior_membership,
                    year=year,
                    is_recreational=False,
                    defaults={
                        'name': f'{year.year} Junior Rider - Competitive',
                        'description': f'Competitive junior rider membership for {year.year} season. Discounted rate for riders under 18.',
                        'fee': Decimal('450.00'),
                        'is_active': True,
                        'notes': 'Age verification required - proof of age needed'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

                # Junior Rider Membership - Recreational
                sub, created = Subscription.objects.get_or_create(
                    membership=junior_membership,
                    year=year,
                    is_recreational=True,
                    defaults={
                        'name': f'{year.year} Junior Rider - Recreational',
                        'description': f'Recreational junior rider membership for {year.year} season. Ideal for young riders learning dressage.',
                        'fee': Decimal('250.00'),
                        'is_active': True,
                        'notes': 'Perfect for beginners - includes training sessions'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

            # Non-Rider Membership
            if non_rider_membership:
                sub, created = Subscription.objects.get_or_create(
                    membership=non_rider_membership,
                    year=year,
                    is_recreational=False,
                    defaults={
                        'name': f'{year.year} Non-Rider Membership',
                        'description': f'Non-rider membership for {year.year} season. For coaches, officials, and supporters.',
                        'fee': Decimal('300.00'),
                        'is_active': True,
                        'notes': 'Includes access to all events and member resources'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

            # Club Membership
            if club_membership:
                sub, created = Subscription.objects.get_or_create(
                    membership=club_membership,
                    year=year,
                    is_recreational=False,
                    defaults={
                        'name': f'{year.year} Club Membership',
                        'description': f'Club membership for {year.year} season. For affiliated riding clubs.',
                        'fee': Decimal('1500.00'),
                        'is_active': True,
                        'notes': 'Covers up to 50 club members - additional fees may apply'
                    }
                )
                if created:
                    created_count += 1
                    print(f"✅ Created: {sub.name} - R{sub.fee}")
                else:
                    skipped_count += 1

        print(f"\n📝 Subscription creation summary:")
        print(f"   Created: {created_count}")
        if skipped_count > 0:
            print(f"   Skipped (already exist): {skipped_count}")

    # Final summary
    print("\n✅ Test data creation complete!")
    print(f"\n📊 Final Summary:")
    print(f"   Total Memberships: {Membership.objects.count()}")
    print(f"   Total Subscriptions: {Subscription.objects.count()}")
    print(f"   Active Subscriptions: {Subscription.objects.filter(is_active=True).count()}")
    print(f"   Competitive Subscriptions: {Subscription.objects.filter(is_recreational=False).count()}")
    print(f"   Recreational Subscriptions: {Subscription.objects.filter(is_recreational=True).count()}")

    # Display active memberships
    print(f"\n🎯 Active Membership Types:")
    for membership in Membership.objects.filter(is_active=True):
        print(f"   - {membership.name} (ID: {membership.id})")
        sub_count = Subscription.objects.filter(membership=membership).count()
        if sub_count > 0:
            print(f"     {sub_count} subscription(s) available")


if __name__ == '__main__':
    create_test_data()

