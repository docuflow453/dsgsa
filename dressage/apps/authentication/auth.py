"""
JWT Authentication for Django Ninja API.
"""
from typing import Optional
from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from django.http import HttpRequest

from .services import AuthService

User = get_user_model()


class JWTAuth(HttpBearer):
    """
    JWT Bearer Token Authentication for Django Ninja.
    
    Validates JWT access tokens and attaches the authenticated user to the request.
    """
    
    def authenticate(self, request: HttpRequest, token: str) -> Optional[User]:
        """
        Authenticate the request using a JWT bearer token.
        
        Args:
            request: The HTTP request
            token: The JWT access token from the Authorization header
            
        Returns:
            The authenticated User object if valid, None otherwise
        """
        # Verify the access token
        payload = AuthService.verify_access_token(token)
        
        if not payload:
            return None
        
        # Get user_id from payload
        user_id = payload.get('user_id')
        if not user_id:
            return None
        
        # Get the user from the database
        try:
            user = User.objects.get(id=user_id, is_active=True)
            return user
        except User.DoesNotExist:
            return None


# Create a global instance to be used in API endpoints
jwt_auth = JWTAuth()

