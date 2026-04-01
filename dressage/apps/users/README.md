# Users App

Custom Django user authentication and management app with role-based access control.

## Features

- **Custom User Model** extending Django's AbstractUser
- **Role-based Access Control** with three roles: ADMIN, STAFF, MEMBER
- **Account State Tracking** with timestamps for:
  - `banned_at` - When user was banned
  - `activated_at` - When user account was activated
  - `email_verified_at` - When email was verified
- **Full CRUD API** using django-shinobi (Django Ninja fork)
- **Admin Interface** with custom user management

## Model

### User Model Fields

Inherits all fields from `AbstractUser` plus:

- `role` (CharField): User role - ADMIN, STAFF, or MEMBER (default: MEMBER)
- `banned_at` (DateTimeField): Timestamp when user was banned
- `activated_at` (DateTimeField): Timestamp when user was activated
- `email_verified_at` (DateTimeField): Timestamp when email was verified

### User Properties

- `is_banned`: Check if user is currently banned
- `is_activated`: Check if user account is activated
- `is_email_verified`: Check if user email is verified
- `is_admin`: Check if user has admin role
- `is_staff_member`: Check if user has staff role

## API Endpoints

All endpoints are prefixed with `/api/`

### User CRUD Operations

- `GET /users/roles` - List available user roles
- `GET /users` - List all users (with filtering and pagination)
  - Query params: `search`, `role`, `is_active`, `limit`, `offset`
- `GET /users/{user_id}` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/{user_id}` - Update user information
- `DELETE /users/{user_id}` - Delete a user

### User Account Management

- `PATCH /users/{user_id}/password` - Update user password
- `POST /users/{user_id}/ban` - Ban a user
- `POST /users/{user_id}/unban` - Unban a user
- `POST /users/{user_id}/activate` - Activate a user account
- `POST /users/{user_id}/verify-email` - Verify user email

## Usage

### Creating a User

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

### Listing Users

```bash
# List all users
curl http://localhost:8000/api/users

# Search users
curl "http://localhost:8000/api/users?search=alex"

# Filter by role
curl "http://localhost:8000/api/users?role=ADMIN"

# Pagination
curl "http://localhost:8000/api/users?limit=10&offset=0"
```

### Updating a User

```bash
curl -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.new@byteorbit.com",
    "role": "STAFF"
  }'
```

### Account Actions

```bash
# Ban user
curl -X POST http://localhost:8000/api/users/1/ban

# Activate user
curl -X POST http://localhost:8000/api/users/1/activate

# Verify email
curl -X POST http://localhost:8000/api/users/1/verify-email
```

## Running Migrations

Since this is a Docker-based project, run migrations using:

```bash
# Generate migrations
docker-compose exec api python manage.py makemigrations users

# Apply migrations
docker-compose exec api python manage.py migrate users

# Or use the Makefile
make makemigrations
make migrate
```

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to manage users through the web interface.

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

