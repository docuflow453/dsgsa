# Authentication Module Setup Guide

This guide walks you through setting up and using the authentication module.

## Installation

### 1. Install Dependencies

The authentication module requires PyJWT and djangorestframework-simplejwt. These have already been added to `requirements.txt`.

```bash
cd backend
pip install -r requirements.txt
```

Or if using pip-compile:

```bash
pip-compile requirements.in
pip install -r requirements.txt
```

### 2. Update Environment Variables

Copy the `.env.example` to `.env` and update the following settings:

```bash
cp .env.example .env
```

Edit `.env` and configure email settings:

```bash
# Email Configuration (for password reset emails)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend  # Use SMTP in production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@shyft.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=noreply@shyft.com
SUPPORT_EMAIL=support@shyft.com

# Frontend URL (for password reset links in emails)
FRONTEND_URL=http://localhost:4200

# JWT Configuration (optional - defaults are provided)
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=30
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
PASSWORD_RESET_TOKEN_EXPIRY_HOURS=1
```

**Note:** For development, you can use `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` which prints emails to the console instead of sending them.

### 3. Run Migrations

Create and apply database migrations for the authentication models:

```bash
cd backend
python manage.py makemigrations authentication
python manage.py migrate
```

This will create the following tables:
- `password_reset_tokens`
- `refresh_tokens`

### 4. Create a Test User

Create a superuser or test user to try authentication:

```bash
python manage.py createsuperuser
```

Or create a regular user via Django shell:

```python
python manage.py shell

from users.models import User
user = User.objects.create_user(
    username='alex.johnson@byteorbit.com',
    email='alex.johnson@byteorbit.com',
    password='TestPass123!',
    first_name='Alex',
    last_name='Johnson'
)
```

## Usage

### Testing the API

#### 1. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@byteorbit.com",
    "password": "TestPass123!"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "alex.johnson@byteorbit.com",
    "first_name": "Alex",
    "last_name": "Johnson",
    "role": "RIDER",
    "is_active": true
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1Qi...",
    "refresh_token": "eyJ0eXAiOiJKV1Qi...",
    "token_type": "Bearer",
    "expires_in": 1800
  },
  "message": "Login successful"
}
```

#### 2. Refresh Access Token

```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

#### 3. Forgot Password

```bash
curl -X POST http://localhost:8000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@byteorbit.com"
  }'
```

This will send a password reset email (or print to console in development).

#### 4. Reset Password

```bash
curl -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL",
    "new_password": "NewSecurePass123!",
    "confirm_password": "NewSecurePass123!"
  }'
```

#### 5. Validate Reset Token

```bash
curl -X GET http://localhost:8000/api/auth/validate-reset-token/TOKEN_HERE
```

#### 6. Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## Running Tests

Run all authentication tests:

```bash
cd backend
pytest apps/authentication/tests.py -v
```

Run specific test classes:

```bash
pytest apps/authentication/tests.py::TestAuthenticationService -v
pytest apps/authentication/tests.py::TestPasswordResetService -v
```

Run tests with coverage:

```bash
pytest apps/authentication/tests.py --cov=apps.authentication --cov-report=html
```

## API Documentation

Once the server is running, you can access the auto-generated API documentation:

- Shinobi API Docs: `http://localhost:8000/api/docs`

## Troubleshooting

### Issue: ModuleNotFoundError: No module named 'celery'

**Solution:** Install all dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Password reset emails not sending

**Solution:** Check your email configuration in `.env`. For development, use:
```bash
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Issue: Invalid token errors

**Solution:** Ensure:
1. Token hasn't expired
2. Token hasn't been used already
3. SECRET_KEY in settings matches the one used to create the token

## Security Best Practices

1. **Use HTTPS in production** - All authentication endpoints should use HTTPS
2. **Rotate SECRET_KEY** - Never commit your SECRET_KEY to version control
3. **Strong Passwords** - Enforce strong password policies
4. **Rate Limiting** - Implement rate limiting on authentication endpoints
5. **Monitor Failed Attempts** - Track and alert on suspicious login patterns
6. **Token Expiry** - Keep access token lifetime short (30 minutes recommended)
7. **Secure Email** - Use authenticated SMTP for password reset emails

## Next Steps

- Integrate with your frontend application
- Add rate limiting to prevent brute force attacks  
- Implement 2FA (Two-Factor Authentication)
- Add social authentication (OAuth)
- Set up monitoring and alerting for security events

