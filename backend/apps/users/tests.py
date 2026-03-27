import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from users.models import UserRole

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Test suite for custom User model"""
    
    def test_create_user(self):
        """Test creating a basic user"""
        user = User.objects.create_user(
            username='sarah.parker@shyft.com',
            email='sarah.parker@shyft.com',
            password='SecurePassword123!',
            first_name='Sarah',
            last_name='Parker'
        )
        
        assert user.username == 'sarah.parker@shyft.com'
        assert user.email == 'sarah.parker@shyft.com'
        assert user.first_name == 'Sarah'
        assert user.last_name == 'Parker'
        assert user.role == UserRole.MEMBER
        assert user.is_active is True
        assert user.check_password('SecurePassword123!')
    
    def test_create_user_with_role(self):
        """Test creating a user with a specific role"""
        user = User.objects.create_user(
            username='admin.user@byteorbit.com',
            email='admin.user@byteorbit.com',
            password='AdminPass123!',
            role=UserRole.ADMIN
        )
        
        assert user.role == UserRole.ADMIN
        assert user.is_admin is True
        assert user.is_staff_member is False
    
    def test_user_str_representation(self):
        """Test user string representation"""
        user = User.objects.create_user(
            username='test.user@shyft.com',
            email='test.user@shyft.com',
            password='TestPass123!',
            role=UserRole.STAFF
        )
        
        assert str(user) == 'test.user@shyft.com (Staff Member)'
    
    def test_user_role_choices(self):
        """Test that user roles are correctly defined"""
        assert UserRole.ADMIN == 'ADMIN'
        assert UserRole.STAFF == 'STAFF'
        assert UserRole.MEMBER == 'MEMBER'
        assert len(UserRole.choices) == 3
    
    def test_banned_user_property(self):
        """Test is_banned property"""
        user = User.objects.create_user(
            username='banned.user@byteorbit.com',
            email='banned.user@byteorbit.com',
            password='BannedPass123!'
        )
        
        assert user.is_banned is False
        
        user.banned_at = timezone.now()
        user.save()
        
        assert user.is_banned is True
    
    def test_activated_user_property(self):
        """Test is_activated property"""
        user = User.objects.create_user(
            username='inactive.user@shyft.com',
            email='inactive.user@shyft.com',
            password='InactivePass123!'
        )
        
        assert user.is_activated is False
        
        user.activated_at = timezone.now()
        user.save()
        
        assert user.is_activated is True
    
    def test_email_verified_property(self):
        """Test is_email_verified property"""
        user = User.objects.create_user(
            username='unverified.user@byteorbit.com',
            email='unverified.user@byteorbit.com',
            password='UnverifiedPass123!'
        )
        
        assert user.is_email_verified is False
        
        user.email_verified_at = timezone.now()
        user.save()
        
        assert user.is_email_verified is True
    
    def test_user_ordering(self):
        """Test that users are ordered by date_joined descending"""
        user1 = User.objects.create_user(
            username='first.user@shyft.com',
            email='first.user@shyft.com',
            password='FirstPass123!'
        )
        
        user2 = User.objects.create_user(
            username='second.user@shyft.com',
            email='second.user@shyft.com',
            password='SecondPass123!'
        )
        
        users = list(User.objects.all())
        assert users[0].id == user2.id
        assert users[1].id == user1.id
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        superuser = User.objects.create_superuser(
            username='super.admin@byteorbit.com',
            email='super.admin@byteorbit.com',
            password='SuperPass123!'
        )
        
        assert superuser.is_superuser is True
        assert superuser.is_staff is True
        assert superuser.is_active is True

