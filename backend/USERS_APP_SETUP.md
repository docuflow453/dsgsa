# Users App Setup & Testing Guide

## Overview

A custom Django users app has been created in `backend/apps/users/` with:

- ✅ Custom User model extending AbstractUser
- ✅ Role-based access control (ADMIN, STAFF, MEMBER)
- ✅ Timestamp fields for account state tracking
- ✅ Full CRUD API using django-shinobi
- ✅ Admin interface integration
- ✅ Comprehensive test suite

## Quick Start

### 1. Start Docker Services

```bash
cd backend

# Start all services
docker-compose up -d --build

# Check service status
docker-compose ps
```

### 2. Run Migrations

Once the containers are running, create and apply migrations:

```bash
# Generate migrations for the users app
docker-compose exec api python manage.py makemigrations users

# Apply migrations
docker-compose exec api python manage.py migrate

# Or use the Makefile shortcuts
make makemigrations
make migrate
```

### 3. Create a Superuser

```bash
docker-compose exec api python manage.py createsuperuser

# Follow the prompts to create an admin user
# Example:
#   Username: admin@byteorbit.com
#   Email: admin@byteorbit.com
#   Password: ********
```

### 4. Access the Application

- **Django Admin**: http://localhost:8000/admin/
- **API Docs (Swagger)**: http://localhost:8000/api/docs
- **API Docs (ReDoc)**: http://localhost:8000/api/redoc
- **API Root**: http://localhost:8000/api/

## API Testing

### Get Available Roles

```bash
curl http://localhost:8000/api/users/roles
```

Expected response:
```json
[
  {"value": "ADMIN", "label": "Administrator"},
  {"value": "STAFF", "label": "Staff Member"},
  {"value": "MEMBER", "label": "Member"}
]
```

### Create a New User

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alex.johnson@byteorbit.com",
    "email": "alex.johnson@byteorbit.com",
    "password": "SecurePassword123!",
    "first_name": "Alex",
    "last_name": "Johnson",
    "role": "MEMBER"
  }'
```

### List All Users

```bash
# Basic list
curl http://localhost:8000/api/users

# With search
curl "http://localhost:8000/api/users?search=alex"

# Filter by role
curl "http://localhost:8000/api/users?role=ADMIN"

# With pagination
curl "http://localhost:8000/api/users?limit=10&offset=0"
```

### Get a Specific User

```bash
curl http://localhost:8000/api/users/1
```

### Update User Information

```bash
curl -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.new@byteorbit.com",
    "first_name": "Alexander",
    "role": "STAFF"
  }'
```

### Update User Password

```bash
curl -X PATCH http://localhost:8000/api/users/1/password \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "SecurePassword123!",
    "new_password": "NewSecurePassword456!"
  }'
```

### Ban a User

```bash
curl -X POST http://localhost:8000/api/users/1/ban
```

### Activate a User

```bash
curl -X POST http://localhost:8000/api/users/1/activate
```

### Verify User Email

```bash
curl -X POST http://localhost:8000/api/users/1/verify-email
```

### Delete a User

```bash
curl -X DELETE http://localhost:8000/api/users/1
```

## Running Tests

```bash
# Run all tests
docker-compose exec api pytest

# Run users app tests specifically
docker-compose exec api pytest apps/users/tests.py

# Run with verbose output
docker-compose exec api pytest -v apps/users/tests.py

# Run with coverage
docker-compose exec api pytest --cov=apps/users apps/users/tests.py
```

## File Structure

```
backend/apps/users/
├── __init__.py
├── admin.py          # Django admin configuration
├── api.py            # API endpoints (django-shinobi)
├── apps.py           # App configuration
├── models.py         # Custom User model
├── schemas.py        # Pydantic schemas for API validation
├── tests.py          # Test suite
├── migrations/       # Database migrations
│   └── __init__.py
└── README.md         # Detailed app documentation
```

## Next Steps

1. ✅ Start Docker services
2. ✅ Run migrations
3. ✅ Create a superuser
4. ✅ Test the API endpoints
5. ✅ Access Django admin to manage users
6. 🔄 Add authentication/authorization middleware (if needed)
7. 🔄 Add email verification functionality
8. 🔄 Add password reset functionality
9. 🔄 Add user profile endpoints

## Troubleshooting

### Migrations Not Found

If you get "No migrations to apply" or similar:

```bash
# Remove existing migrations
docker-compose exec api rm -rf apps/users/migrations

# Recreate migrations directory
docker-compose exec api mkdir -p apps/users/migrations
docker-compose exec api touch apps/users/migrations/__init__.py

# Generate fresh migrations
docker-compose exec api python manage.py makemigrations users
docker-compose exec api python manage.py migrate
```

### Import Errors

If you get import errors, ensure the app is properly registered in `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'users',  # Should be present
]

AUTH_USER_MODEL = 'users.User'  # Should be set
```

For more details, see `backend/apps/users/README.md`

