# Authentication Setup Guide

This guide explains how to set up and test the integrated authentication system between the Angular frontend and Django backend.

## Overview

The authentication system uses:
- **Backend**: Django REST Framework with Token Authentication
- **Frontend**: Angular with HttpClient and JWT interceptors
- **User ID**: UUID for security
- **Token Format**: `Token <token>` (Django Token Authentication)

## Backend Setup

### 1. Navigate to API Directory

```bash
cd api
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Test Users

```bash
python manage.py shell < create_test_users.py
```

This creates the following test users:

| Email | Password | Role | Name |
|-------|----------|------|------|
| rider@shyft.com | password123 | Rider | Emma Williams |
| admin@shyft.com | password123 | Admin | Sarah Parker |
| club@byteorbit.com | password123 | Club | Michael Johnson |
| provincial@byteorbit.com | password123 | Provincial | Jessica Martinez |
| saef@shyft.com | password123 | SAEF | David Anderson |

### 5. Start Django Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd full-version
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Angular Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Testing Authentication

### 1. Login Test

1. Navigate to `http://localhost:4200/auth/login`
2. Enter credentials:
   - **Email**: `rider@shyft.com`
   - **Password**: `password123`
3. Click "Login"
4. You should be redirected to the Rider dashboard at `/my/dashboard`

### 2. API Response Format

The login endpoint returns:

```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "rider@shyft.com",
    "firstName": "Emma",
    "lastName": "Williams",
    "name": "Emma Williams",
    "role": "Rider"
  }
}
```

### 3. Token Storage

The token is stored in:
- **LocalStorage** (if "Remember Me" is checked)
- **SessionStorage** (if "Remember Me" is not checked)

### 4. Authenticated Requests

All subsequent API requests automatically include the authentication header:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

## API Endpoints

### Authentication

- **POST** `/api/users/login/` - User login
- **POST** `/api/users/register/` - User registration
- **GET** `/api/users/` - List users (authenticated)
- **GET** `/api/users/{id}/` - Get user details (authenticated)

### Example Login Request

```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rider@shyft.com",
    "password": "password123"
  }'
```

### Example Authenticated Request

```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
```

## Role-Based Redirects

After successful login, users are redirected based on their role:

| Role | Dashboard Path |
|------|----------------|
| Admin | `/admin/dashboard` |
| SAEF | `/saef/dashboard` |
| Provincial | `/provincial/dashboard` |
| Club | `/clubs/dashboard` |
| ShowHoldingBody | `/shb/dashboard` |
| Rider | `/my/dashboard` |
| Official | `/official/dashboard` |

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure:
1. Django CORS settings include `http://localhost:4200`
2. `CORS_ALLOW_CREDENTIALS = True` is set in `api/api/settings.py`

### Token Not Being Sent

Check:
1. Token is stored in localStorage/sessionStorage
2. Auth interceptor is properly configured
3. Request URL matches the API URL in environment.ts

### 401 Unauthorized

Verify:
1. Token is valid and not expired
2. User account is active
3. Authorization header format is `Token <token>` (not `Bearer <token>`)

## Security Features

1. **UUID Primary Keys**: User IDs are UUIDs for enhanced security
2. **Token Authentication**: Secure token-based authentication
3. **Password Hashing**: Passwords are hashed using Django's built-in system
4. **CORS Protection**: Configured to only allow specific origins
5. **HTTPS Ready**: Can be easily configured for production with HTTPS

## Next Steps

1. Implement password reset functionality
2. Add email verification
3. Implement refresh token mechanism
4. Add two-factor authentication
5. Set up rate limiting for login attempts

