# Authentication Module

JWT-based authentication module for the Dressage Riding System providing secure login, token refresh, and logout functionality.

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Flexible Login**: Support for both username and email authentication
- **Remember Me**: Extended session support (30 days instead of 7)
- **Token Refresh**: Seamless access token renewal without re-authentication
- **Secure Logout**: Token revocation for proper session termination
- **IP Tracking**: Security auditing through IP address logging
- **Token Management**: Admin interface for viewing and managing tokens

## API Endpoints

### 1. Login
**POST** `/api/auth/login`

Authenticate user credentials and receive JWT tokens.

**Request:**
```json
{
  "username": "sarah.parker@shyft.com",
  "password": "SecurePass123!",
  "remember_me": false
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "sarah.parker",
    "email": "sarah.parker@shyft.com",
    "first_name": "Sarah",
    "last_name": "Parker",
    "role": "RIDER",
    "is_active": true
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 1800,
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Notes:**
- `username` can be either username or email address
- `remember_me=true` extends refresh token lifetime to 30 days (default: 7 days)
- Returns generic error message to prevent user enumeration
- Checks for active and non-banned accounts

### 2. Refresh Token
**POST** `/api/auth/refresh`

Generate a new access token using a valid refresh token.

**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 1800,
  "message": "Token refreshed successfully"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid or expired refresh token"
}
```

### 3. Logout
**POST** `/api/auth/logout`

Revoke refresh token to logout user.

**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Error Response (400):**
```json
{
  "message": "Unable to revoke the refresh token"
}
```

## Token Configuration

### Access Tokens
- **Lifetime**: 30 minutes
- **Purpose**: Short-lived token for API authentication
- **Storage**: Client-side (memory or session storage recommended)
- **Contains**: User ID, username, email, role, expiry, issue time

### Refresh Tokens
- **Lifetime (Normal)**: 7 days
- **Lifetime (Remember Me)**: 30 days
- **Purpose**: Long-lived token for obtaining new access tokens
- **Storage**: Database (tracked and revokable)
- **Contains**: User ID, expiry, issue time

## Security Features

1. **Password Hashing**: Uses Django's built-in password hashing
2. **Token Revocation**: Refresh tokens can be revoked on logout
3. **IP Tracking**: Logs IP address for each login and token creation
4. **Account Checks**: Validates active and non-banned status
5. **Token Expiry**: Automatic expiration prevents stale tokens
6. **Generic Errors**: Prevents user enumeration attacks

## Database Models

### RefreshToken
Stores JWT refresh tokens for tracking and revocation.

**Fields:**
- `id`: UUID primary key
- `user`: Foreign key to User model
- `token`: JWT refresh token string (unique)
- `created_at`: Timestamp when created
- `expires_at`: Timestamp when expires
- `is_revoked`: Boolean flag for revocation
- `revoked_at`: Timestamp when revoked
- `ip_address`: IP address of requester

**Properties:**
- `is_expired`: Check if token has expired
- `is_valid`: Check if token is valid (not expired and not revoked)

**Methods:**
- `revoke()`: Revoke the token

## Service Layer

### AuthService

Main service class for authentication operations.

**Methods:**
- `login(username, password, remember_me, ip_address)`: Authenticate and generate tokens
- `refresh_access_token(refresh_token)`: Generate new access token
- `logout(refresh_token)`: Revoke refresh token
- `verify_access_token(access_token)`: Verify and decode access token
- `cleanup_expired_tokens()`: Remove expired tokens from database

## Usage Examples

### Frontend Integration (Angular)

```typescript
// Login
loginUser(credentials: {username: string, password: string, remember_me?: boolean}) {
  return this.http.post('http://localhost:8000/api/auth/login', credentials);
}

// Use access token in requests
getUserProfile() {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get('http://localhost:8000/api/users/profile', { headers });
}

// Refresh token
refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  return this.http.post('http://localhost:8000/api/auth/refresh', {
    refresh_token: refresh
  });
}

// Logout
logout() {
  const refresh = localStorage.getItem('refresh_token');
  return this.http.post('http://localhost:8000/api/auth/logout', {
    refresh_token: refresh
  });
}
```

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sarah.parker@shyft.com",
    "password": "SecurePass123!",
    "remember_me": true
  }'
```

**Make Authenticated Request:**
```bash
curl -X GET http://localhost:8000/api/users/1 \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Refresh Access Token:**
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

**Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

## Admin Interface

The admin interface provides:
- View all refresh tokens
- Filter by revoked status, creation date, expiry date
- Search by user details or IP address
- Bulk actions: Revoke tokens, Delete expired tokens
- Read-only access (no manual token creation)

Access at: `http://localhost:8000/admin/auth/refreshtoken/`

## Testing

Run tests with pytest:

```bash
# Run all auth tests
pytest apps/auth/tests.py -v

# Run specific test
pytest apps/auth/tests.py::TestAuthService::test_login_with_username -v

# Run with coverage
pytest apps/auth/tests.py --cov=apps.auth --cov-report=html
```

## Integration

The auth app is already integrated in the project. To verify:

1. **Settings** (`dressage/settings.py`):
```python
INSTALLED_APPS = [
    ...
    'apps.auth',
]
```

2. **URLs** (`dressage/urls.py`):
```python
from apps.auth.api import router as auth_router

api.add_router("", auth_router)
```

3. **Migrations**:
```bash
python manage.py makemigrations auth
python manage.py migrate auth
```

## Best Practices

### Frontend Token Storage
- **Access Token**: Store in memory or sessionStorage (never localStorage for production)
- **Refresh Token**: Store in httpOnly cookie (recommended) or secure storage

### Token Refresh Strategy
- Refresh access token proactively before expiry (e.g., at 25 minutes)
- Implement automatic refresh on 401 responses
- Clear tokens and redirect to login on refresh failure

### Error Handling
- Generic error messages prevent user enumeration
- Log failed login attempts for security monitoring
- Implement rate limiting to prevent brute force attacks

### Cleanup
- Run periodic cleanup of expired tokens:
```python
from apps.auth.services import AuthService
AuthService.cleanup_expired_tokens()
```

- Set up a Celery task for automatic cleanup:
```python
@app.task
def cleanup_expired_auth_tokens():
    from apps.auth.services import AuthService
    count = AuthService.cleanup_expired_tokens()
    return f"Cleaned up {count} expired tokens"
```

## Troubleshooting

### "Invalid credentials" on login
- Verify username/email and password are correct
- Check if user account is active (`is_active=True`)
- Ensure user is not banned (`banned_at=None`)

### "Invalid or expired refresh token"
- Token may have expired (check `expires_at` in database)
- Token may have been revoked (check `is_revoked` in database)
- Token signature may be invalid (check `SECRET_KEY` hasn't changed)

### 401 Unauthorized on API requests
- Verify access token is included in `Authorization` header
- Check token format: `Bearer <token>`
- Access token may have expired (30 minute lifetime)
- Use refresh endpoint to get new access token