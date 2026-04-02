# Rider App - Rider Profile Management

The Rider app manages rider profiles and their associated entities for the Dressage Riding System.

## Overview

This module provides functionality to:
- Manage rider profiles with personal information, address details, and banking information
- Track rider accounts and subscriptions to competition years
- Manage SAEF memberships
- Track club and show holding body affiliations
- Validate identification (SA ID number or passport number)

## Models

### Rider

The primary rider profile model containing all personal and contact information.

**Fields:**
- `user`: OneToOneField to `users.User` (required)
- `saef_number`: CharField (unique, optional) - SAEF membership number
- `id_number`: CharField (unique, 13 chars, optional) - South African ID number
- `passport_number`: CharField (unique, optional) - Passport number
- `date_of_birth`: DateField (required)
- `gender`: CharField with choices (MALE, FEMALE, OTHER)
- `ethnicity`: CharField with choices (BLACK_AFRICAN, COLOURED, INDIAN, WHITE, OTHER)
- `nationality`: CharField (required)
- **Address Fields**: `address_line_1`, `address_line_2`, `province`, `suburb`, `city`, `postal_code`, `country`
- **Banking Details**: `account_type`, `account_name`, `bank_name` (all optional)
- `is_active`: BooleanField (default: True)
- `is_test`: BooleanField (default: False) - For test profiles
- `created_at`, `updated_at`: DateTimeField (audit fields)

**Constraints:**
- Either `id_number` or `passport_number` must be provided
- `user`, `saef_number`, `id_number`, and `passport_number` must be unique

**Properties:**
- `full_name`: Returns rider's full name from associated user
- `age`: Calculates current age from date of birth
- `full_address`: Returns formatted full address

### RiderAccount

Links riders to competition years with subscription information.

**Fields:**
- `rider`: ForeignKey to `Rider`
- `year`: ForeignKey to `years.Year`
- `subscription`: ForeignKey to `membership.Subscription` (optional)
- `is_active`: BooleanField (default: True)

**Constraints:**
- Unique together: `rider` and `year`

### SaefMembership

Manages SAEF membership records for riders.

**Fields:**
- `rider`: ForeignKey to `Rider`
- `membership_number`: CharField (required)
- `year`: ForeignKey to `years.Year`
- `is_active`: BooleanField (default: True)
- `expiry_date`: DateField (optional)

### RiderClub

Tracks rider club affiliations per year.

**Fields:**
- `rider`: ForeignKey to `Rider`
- `name`: CharField (club name)
- `year`: ForeignKey to `years.Year`
- `is_active`: BooleanField (default: True)

**Constraints:**
- Unique together: `rider` and `year`

### RiderShowHoldingBody

Tracks rider show holding body affiliations.

**Fields:**
- `rider`: ForeignKey to `Rider`
- `name`: CharField (show holding body name)
- `year`: ForeignKey to `years.Year`
- `is_active`: BooleanField (default: True)

**Constraints:**
- Unique together: `rider` and `year`

## API Endpoints

All endpoints follow the project's error handling pattern: `return status_code, {"message": "error_message"}`

### List Riders
```
GET /api/riders
```

**Query Parameters:**
- `search`: Search across user name, email, and SAEF number
- `is_active`: Filter by active status
- `is_test`: Filter by test profile status
- `nationality`: Filter by nationality (exact match)
- `gender`: Filter by gender
- `limit`: Number of results (default: 100, max: 1000)
- `offset`: Pagination offset

**Response:**
```json
{
  "count": 50,
  "results": [...]
}
```

### Get Rider
```
GET /api/riders/{id}
```

### Create Rider
```
POST /api/riders
```

**Request Body:**
```json
{
  "user_id": 1,
  "id_number": "9001015009087",
  "date_of_birth": "1990-01-01",
  "gender": "MALE",
  "ethnicity": "BLACK_AFRICAN",
  "nationality": "South African",
  "address_line_1": "123 Main Street",
  "province": "Gauteng",
  "city": "Johannesburg",
  "postal_code": "2000",
  "country": "South Africa",
  "is_active": true,
  "is_test": false
}
```

### Update Rider
```
PATCH /api/riders/{id}
```

**Request Body:** (all fields optional)
```json
{
  "nationality": "British",
  "city": "Cape Town"
}
```

### Delete Rider
```
DELETE /api/riders/{id}
```

Performs a soft delete by setting `is_active=False`.

## Service Layer

The `RiderService` class provides business logic:

- `create_rider(data)` - Create a rider with validation
- `update_rider(rider_id, data)` - Update rider details
- `delete_rider(rider_id)` - Soft delete (deactivate) a rider
- `get_active_riders()` - Get all active riders
- `get_riders_by_nationality(nationality)` - Filter riders by nationality

All service methods return consistent tuples: `(success, result, error_message)`

## Admin Interface

The Django admin provides:
- **Rider**: Full management with fieldsets, search, filtering, and bulk actions
- **RiderAccount**: Manage rider accounts and subscriptions
- **SaefMembership**: Manage SAEF memberships
- **RiderClub**: Manage club affiliations
- **RiderShowHoldingBody**: Manage show holding body affiliations

**Bulk Actions:**
- Activate/Deactivate riders
- Mark/Unmark as test profiles

## Setup

1. **Add to INSTALLED_APPS** (already done):
```python
INSTALLED_APPS = [
    ...
    'rider',
]
```

2. **Run migrations**:
```bash
python manage.py migrate rider
```

3. **Register router** (already done):
```python
from rider.api import router as rider_router
api.add_router("", rider_router)
```

## Validation Rules

1. **ID/Passport Requirement**: Either `id_number` OR `passport_number` must be provided
2. **ID Number Format**: Must be exactly 13 digits
3. **Unique Constraints**:
   - User can only have one rider profile
   - SAEF number must be unique
   - ID number must be unique
   - Passport number must be unique

## Usage Examples

### Create a Rider Profile
```bash
curl -X POST http://localhost:8000/api/riders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "id_number": "9001015009087",
    "date_of_birth": "1990-01-01",
    "gender": "MALE",
    "ethnicity": "WHITE",
    "nationality": "South African",
    "address_line_1": "123 Main Street",
    "province": "Gauteng",
    "city": "Johannesburg",
    "postal_code": "2000",
    "country": "South Africa"
  }'
```

### Search Riders
```bash
curl "http://localhost:8000/api/riders?search=michael&is_active=true"
```

### Filter by Nationality
```bash
curl "http://localhost:8000/api/riders?nationality=South%20African&limit=50"
```

### Update Banking Details
```bash
curl -X PATCH http://localhost:8000/api/riders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "account_type": "CURRENT",
    "account_name": "Michael Chen",
    "bank_name": "Standard Bank"
  }'
```

## Testing

Run tests with:
```bash
pytest apps/rider/tests.py -v
```

The test suite includes:
- Model validation tests
- Service layer tests
- ID/Passport validation
- Age calculation tests
- Unique constraint validation

## Notes

- Rider profiles are linked 1:1 with User accounts
- All deletions are soft deletes (setting `is_active=False`)
- ID numbers are validated for SA format (13 digits)
- Banking details are optional and can be added later
- All API errors follow the standard format: `{"message": "error text"}`


