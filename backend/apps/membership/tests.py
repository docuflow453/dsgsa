from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import Membership
from .services import MembershipService


class MembershipModelTests(TestCase):
    """Tests for Membership model"""
    
    def setUp(self):
        """Set up test data"""
        self.valid_membership_data = {
            'name': 'Rider Membership',
            'description': 'Full membership for riders participating in competitions',
            'is_active': True,
        }
    
    def test_create_valid_membership(self):
        """Test creating a valid membership"""
        membership = Membership.objects.create(**self.valid_membership_data)
        self.assertEqual(membership.name, 'Rider Membership')
        self.assertTrue(membership.is_active)
        self.assertEqual(membership.status, 'Active')
    
    def test_membership_str_representation(self):
        """Test string representation of membership"""
        membership = Membership.objects.create(**self.valid_membership_data)
        self.assertEqual(str(membership), 'Rider Membership')
    
    def test_unique_name_constraint(self):
        """Test that membership names must be unique"""
        Membership.objects.create(**self.valid_membership_data)
        
        # Try to create another membership with the same name
        with self.assertRaises(IntegrityError):
            Membership.objects.create(**self.valid_membership_data)
    
    def test_membership_status_property(self):
        """Test membership status property"""
        active_membership = Membership.objects.create(**self.valid_membership_data)
        self.assertEqual(active_membership.status, 'Active')
        
        inactive_data = self.valid_membership_data.copy()
        inactive_data['name'] = 'Inactive Membership'
        inactive_data['is_active'] = False
        inactive_membership = Membership.objects.create(**inactive_data)
        self.assertEqual(inactive_membership.status, 'Inactive')
    
    def test_empty_name_validation(self):
        """Test that empty names are rejected"""
        invalid_data = self.valid_membership_data.copy()
        invalid_data['name'] = '   '  # Only whitespace
        
        with self.assertRaises(ValidationError):
            Membership.objects.create(**invalid_data)


class MembershipServiceTests(TestCase):
    """Tests for MembershipService"""
    
    def setUp(self):
        """Set up test data"""
        self.valid_data = {
            'name': 'Rider Membership',
            'description': 'Full membership for riders',
            'is_active': True,
        }
    
    def test_create_membership_service(self):
        """Test creating membership through service"""
        success, membership, error = MembershipService.create_membership(self.valid_data)
        
        self.assertTrue(success)
        self.assertIsNotNone(membership)
        self.assertIsNone(error)
        self.assertEqual(membership.name, 'Rider Membership')
    
    def test_create_duplicate_membership(self):
        """Test creating membership with duplicate name"""
        MembershipService.create_membership(self.valid_data)
        
        # Try to create another with same name
        success, membership, error = MembershipService.create_membership(self.valid_data)
        
        self.assertFalse(success)
        self.assertIsNone(membership)
        self.assertIn('already exists', error)
    
    def test_update_membership_service(self):
        """Test updating membership through service"""
        membership = Membership.objects.create(**self.valid_data)
        
        update_data = {'name': 'Updated Membership Name'}
        success, updated_membership, error = MembershipService.update_membership(membership.id, update_data)
        
        self.assertTrue(success)
        self.assertEqual(updated_membership.name, 'Updated Membership Name')
        self.assertIsNone(error)
    
    def test_update_nonexistent_membership(self):
        """Test updating a membership that doesn't exist"""
        success, membership, error = MembershipService.update_membership(9999, {'name': 'Test'})
        
        self.assertFalse(success)
        self.assertIsNone(membership)
        self.assertEqual(error, 'Membership not found')
    
    def test_delete_membership_service(self):
        """Test deleting membership through service"""
        membership = Membership.objects.create(**self.valid_data)
        membership_id = membership.id
        
        success, error = MembershipService.delete_membership(membership_id)
        
        self.assertTrue(success)
        self.assertIsNone(error)
        self.assertFalse(Membership.objects.filter(id=membership_id).exists())
    
    def test_delete_nonexistent_membership(self):
        """Test deleting a membership that doesn't exist"""
        success, error = MembershipService.delete_membership(9999)
        
        self.assertFalse(success)
        self.assertEqual(error, 'Membership not found')
    
    def test_get_active_memberships(self):
        """Test getting only active memberships"""
        # Create active membership
        Membership.objects.create(**self.valid_data)
        
        # Create inactive membership
        inactive_data = self.valid_data.copy()
        inactive_data['name'] = 'Inactive Membership'
        inactive_data['is_active'] = False
        Membership.objects.create(**inactive_data)
        
        active_memberships = MembershipService.get_active_memberships()
        
        self.assertEqual(active_memberships.count(), 1)
        self.assertEqual(active_memberships.first().name, 'Rider Membership')
    
    def test_activate_membership(self):
        """Test activating a membership"""
        inactive_data = self.valid_data.copy()
        inactive_data['is_active'] = False
        membership = Membership.objects.create(**inactive_data)
        
        success, error = MembershipService.activate_membership(membership.id)
        
        self.assertTrue(success)
        self.assertIsNone(error)
        membership.refresh_from_db()
        self.assertTrue(membership.is_active)
    
    def test_deactivate_membership(self):
        """Test deactivating a membership"""
        membership = Membership.objects.create(**self.valid_data)
        
        success, error = MembershipService.deactivate_membership(membership.id)
        
        self.assertTrue(success)
        self.assertIsNone(error)
        membership.refresh_from_db()
        self.assertFalse(membership.is_active)

