# Authentication Module

This module provides comprehensive authentication functionality for the Dressage Riding System, including JWT-based authentication, password reset, and token management.

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Login**: User authentication with email and password
- **Token Refresh**: Refresh access tokens using valid refresh tokens
- **Password Reset**: Secure password reset flow with email verification
- **Logout**: Token revocation for secure logout
- **Token Management**: Track and manage refresh tokens and password reset tokens

## API Endpoints

### 1. Login
**POST** `/api/auth/login`

Authenticate user and receive JWT tokens.

**Request:**
```json
{
  "email": "sarah.parker@shyft.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "sarah.parker@shyft.com",
    "first_name": "Sarah",
    "last_name": "Parker",
    "role": "RIDER",
    "is_active": true
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 1800
  },
  "message": "Login successful"
}
```

### 2. Refresh Token
**POST** `/api/auth/refresh`

Get a new access token using a refresh token.

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
  "expires_in": 1800
}
```

### 3. Forgot Password
**POST** `/api/auth/forgot-password`

Initiate password reset process. Sends reset email if user exists.

**Request:**
```json
{
  "email": "sarah.parker@shyft.com"
}
```

**Response (200):**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent.",
  "email": "sarah.parker@shyft.com"
}
```

### 4. Reset Password
**POST** `/api/auth/reset-password`

Reset password using token from email.

**Request:**
```json
{
  "token": "abc123xyz...",
  "new_password": "NewSecurePass123!",
  "confirm_password": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Your password has been reset successfully. You can now login with your new password.",
  "success": true
}
```

### 5. Validate Reset Token
**GET** `/api/auth/validate-reset-token/{token}`

Check if a password reset token is valid.

**Response (200):**
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

### 6. Logout
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

## Models

### PasswordResetToken
Stores password reset tokens with expiry and usage tracking.

**Fields:**
- `id`: UUID primary key
- `user`: Foreign key to User model
- `token`: Unique reset token string
- `created_at`: Timestamp of creation
- `expires_at`: Expiration timestamp (default: 1 hour)
- `used_at`: Timestamp when used (null if not used)
- `ip_address`: IP address of requester

### RefreshToken
Stores JWT refresh tokens for tracking and revocation.

**Fields:**
- `id`: UUID primary key
- `user`: Foreign key to User model
- `token`: JWT refresh token string
- `created_at`: Timestamp of creation
- `expires_at`: Expiration timestamp (default: 7 days)
- `revoked_at`: Timestamp when revoked (null if not revoked)
- `ip_address`: IP address of requester

## Configuration

Add these settings to your `.env` file:

```bash
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@shyft.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@shyft.com
SUPPORT_EMAIL=support@shyft.com

# Frontend URL for email links
FRONTEND_URL=http://localhost:4200

# JWT Configuration (optional, defaults provided)
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=30
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
PASSWORD_RESET_TOKEN_EXPIRY_HOURS=1
```

## Testing

Run the authentication tests:

```bash
cd backend
pytest apps/authentication/tests.py -v
```

## Security Features

- **Password Hashing**: Uses Django's built-in password hashing
- **Email Enumeration Prevention**: Always returns success for forgot password
- **Token Expiry**: All tokens have expiration times
- **Single-use Reset Tokens**: Password reset tokens can only be used once
- **Token Revocation**: Refresh tokens can be revoked on logout
- **IP Tracking**: Tracks IP addresses for security auditing
- **HTTPS Recommended**: Use HTTPS in production for token transmission

