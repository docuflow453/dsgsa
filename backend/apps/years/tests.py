from datetime import date
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Year, YearStatus
from .services import YearService


class YearModelTests(TestCase):
    """Tests for Year model"""
    
    def setUp(self):
        """Set up test data"""
        self.valid_year_data = {
            'name': '2024 Competition Season',
            'year': 2024,
            'start_date': date(2024, 1, 1),
            'end_date': date(2024, 12, 31),
            'status': YearStatus.PENDING,
        }
    
    def test_create_valid_year(self):
        """Test creating a valid year"""
        year = Year.objects.create(**self.valid_year_data)
        self.assertEqual(year.name, '2024 Competition Season')
        self.assertEqual(year.year, 2024)
        self.assertEqual(year.status, YearStatus.PENDING)
        self.assertFalse(year.is_registration_open)
    
    def test_end_date_before_start_date_raises_error(self):
        """Test that end_date before start_date raises validation error"""
        invalid_data = self.valid_year_data.copy()
        invalid_data['start_date'] = date(2024, 12, 31)
        invalid_data['end_date'] = date(2024, 1, 1)
        
        with self.assertRaises(ValidationError):
            Year.objects.create(**invalid_data)
    
    def test_year_str_representation(self):
        """Test string representation of year"""
        year = Year.objects.create(**self.valid_year_data)
        self.assertEqual(str(year), '2024 Competition Season (2024)')
    
    def test_year_properties(self):
        """Test year model properties"""
        year = Year.objects.create(**self.valid_year_data)
        
        self.assertTrue(year.is_pending)
        self.assertFalse(year.is_active)
        self.assertFalse(year.is_complete)
        self.assertFalse(year.is_archived)
        
        year.status = YearStatus.ACTIVE
        year.save()
        
        self.assertFalse(year.is_pending)
        self.assertTrue(year.is_active)
    
    def test_duration_days_calculation(self):
        """Test duration calculation"""
        year = Year.objects.create(**self.valid_year_data)
        # 2024 is a leap year, so 366 days
        self.assertEqual(year.duration_days, 365)


class YearServiceTests(TestCase):
    """Tests for YearService"""
    
    def setUp(self):
        """Set up test data"""
        self.valid_data = {
            'name': '2024 Season',
            'year': 2024,
            'start_date': date(2024, 1, 1),
            'end_date': date(2024, 12, 31),
            'status': YearStatus.PENDING,
        }
    
    def test_create_year_service(self):
        """Test creating year through service"""
        success, year, error = YearService.create_year(self.valid_data)
        
        self.assertTrue(success)
        self.assertIsNotNone(year)
        self.assertIsNone(error)
        self.assertEqual(year.name, '2024 Season')
    
    def test_update_year_service(self):
        """Test updating year through service"""
        year = Year.objects.create(**self.valid_data)
        
        update_data = {'name': 'Updated Season 2024'}
        success, updated_year, error = YearService.update_year(year.id, update_data)
        
        self.assertTrue(success)
        self.assertEqual(updated_year.name, 'Updated Season 2024')
        self.assertIsNone(error)
    
    def test_delete_year_service(self):
        """Test deleting year through service"""
        year = Year.objects.create(**self.valid_data)
        year_id = year.id
        
        success, error = YearService.delete_year(year_id)
        
        self.assertTrue(success)
        self.assertIsNone(error)
        self.assertFalse(Year.objects.filter(id=year_id).exists())
    
    def test_get_active_year(self):
        """Test getting active year"""
        # Create multiple years
        Year.objects.create(**self.valid_data)
        
        active_data = self.valid_data.copy()
        active_data['name'] = 'Active Year'
        active_data['status'] = YearStatus.ACTIVE
        active_year = Year.objects.create(**active_data)
        
        result = YearService.get_active_year()
        
        self.assertIsNotNone(result)
        self.assertEqual(result.id, active_year.id)
    
    def test_set_year_active(self):
        """Test activating a year"""
        year = Year.objects.create(**self.valid_data)
        
        success, error = YearService.set_year_active(year.id)
        
        self.assertTrue(success)
        self.assertIsNone(error)
        
        year.refresh_from_db()
        self.assertEqual(year.status, YearStatus.ACTIVE)
    
    def test_open_close_registration(self):
        """Test opening and closing registration"""
        year = Year.objects.create(**self.valid_data)
        
        # Open registration
        success, error = YearService.open_registration(year.id)
        self.assertTrue(success)
        year.refresh_from_db()
        self.assertTrue(year.is_registration_open)
        
        # Close registration
        success, error = YearService.close_registration(year.id)
        self.assertTrue(success)
        year.refresh_from_db()
        self.assertFalse(year.is_registration_open)

