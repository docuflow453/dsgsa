# Membership App - Membership Types Management

The Membership app manages membership types for the Dressage Riding System.

## Overview

This module provides functionality to:
- Define membership types (e.g., "Rider Membership", "Non-Rider Membership")
- Manage membership descriptions and status
- Control active/inactive membership types
- Track membership metadata

## Models

### Membership

Represents a membership type.

**Fields:**
- `name`: CharField (max_length=100, unique) - Name of the membership type
- `description`: TextField - Detailed description of the membership type
- `is_active`: BooleanField - Whether the membership is currently active (default: False)
- `notes`: TextField (optional) - Additional notes about the membership
- `created_at`: DateTimeField - Timestamp when created
- `updated_at`: DateTimeField - Timestamp when last updated

**Constraints:**
- `name` must be unique
- `name` cannot be empty or only whitespace

**Properties:**
- `status`: Returns "Active" or "Inactive" based on `is_active`

## API Endpoints

All endpoints follow the project's error handling pattern: `return status_code, {"message": "error_message"}`

### List Memberships
```
GET /api/memberships
```

**Query Parameters:**
- `name`: Filter by name (case-insensitive lookup)
- `is_active`: Filter by active status
- `limit`: Number of results (default: 100, max: 1000)
- `offset`: Pagination offset

**Response:**
```json
{
  "count": 5,
  "results": [...]
}
```

### Get Membership
```
GET /api/memberships/{id}
```

### Create Membership
```
POST /api/memberships
```

**Request Body:**
```json
{
  "name": "Rider Membership",
  "description": "Full membership for riders participating in competitions",
  "is_active": true,
  "notes": "Includes competition access and voting rights"
}
```

### Update Membership
```
PATCH /api/memberships/{id}
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Membership Name",
  "is_active": false
}
```

### Delete Membership
```
DELETE /api/memberships/{id}
```

### Activate Membership
```
POST /api/memberships/{id}/activate
```

### Deactivate Membership
```
POST /api/memberships/{id}/deactivate
```

## Service Layer

The `MembershipService` class provides business logic:

- `create_membership(data)` - Create a new membership with validation
- `update_membership(membership_id, data)` - Update membership details
- `delete_membership(membership_id)` - Delete a membership
- `get_active_memberships()` - Get all active memberships
- `activate_membership(membership_id)` - Activate a membership
- `deactivate_membership(membership_id)` - Deactivate a membership

All service methods return consistent tuples: `(success, result, error_message)`

## Admin Interface

The Django admin provides:
- List view with filtering by active status and dates
- Search by name, description, and notes
- Bulk actions: Activate/Deactivate memberships
- Organized fieldsets for easy editing
- Read-only timestamp fields

## Setup

1. **Add to INSTALLED_APPS** (already done):
```python
INSTALLED_APPS = [
    ...
    'membership',
]
```

2. **Run migrations**:
```bash
python manage.py makemigrations membership
python manage.py migrate membership
```

3. **Register router** (already done):
```python
from membership.api import router as membership_router
api.add_router("", membership_router)
```

## Usage Examples

### Create a Membership Type
```bash
curl -X POST http://localhost:8000/api/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rider Membership",
    "description": "Full membership for riders",
    "is_active": true
  }'
```

### List Active Memberships
```bash
curl "http://localhost:8000/api/memberships?is_active=true"
```

### Search by Name
```bash
curl "http://localhost:8000/api/memberships?name=rider"
```

### Activate a Membership
```bash
curl -X POST http://localhost:8000/api/memberships/1/activate
```

## Testing

Run tests with:
```bash
pytest apps/membership/tests.py -v
```

The test suite includes:
- Model validation tests
- Service layer tests
- Unique constraint validation
- Activation/deactivation tests

## Notes

- Membership names must be unique
- Name and description validation prevents empty/whitespace-only values
- All API errors follow the standard format: `{"message": "error text"}`
- The `is_active` field defaults to `False` for safety

