# Years App - Competition Year Management

The Years app manages competition periods and subscription windows for the Dressage Riding System.

## Overview

This module provides functionality to:
- Define competition years with start and end dates
- Manage year status (PENDING, ACTIVE, COMPLETE, ARCHIVED)
- Control registration periods for each year
- Track competition seasons and subscription windows

## Models

### Year

Represents a competition year/period.

**Fields:**
- `name`: CharField - Name of the competition year (e.g., "2024 Season")
- `year`: PositiveIntegerField - Year number (e.g., 2024)
- `start_date`: DateField - Start date of the competition year
- `end_date`: DateField - End date (validated to be >= start_date)
- `is_registration_open`: BooleanField - Whether registration is open
- `status`: CharField - Status (PENDING, ACTIVE, COMPLETE, ARCHIVED)
- `notes`: TextField - Additional notes (optional)
- `created_at`: DateTimeField - Timestamp when created
- `updated_at`: DateTimeField - Timestamp when last updated

**Constraints:**
- `end_date` must be on or after `start_date` (enforced at database and model level)

## API Endpoints

All endpoints follow the project's error handling pattern: `return status_code, {"message": "error_message"}`

### List Years
```
GET /api/years
```

**Query Parameters:**
- `status`: Filter by status (PENDING, ACTIVE, COMPLETE, ARCHIVED)
- `year`: Filter by year number
- `is_registration_open`: Filter by registration status
- `limit`: Number of results (default: 100, max: 1000)
- `offset`: Pagination offset

**Response:**
```json
{
  "count": 10,
  "results": [...]
}
```

### Get Year
```
GET /api/years/{id}
```

### Create Year
```
POST /api/years
```

**Request Body:**
```json
{
  "name": "2024 Competition Season",
  "year": 2024,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "is_registration_open": false,
  "status": "PENDING",
  "notes": "Main competition season"
}
```

### Update Year
```
PATCH /api/years/{id}
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Season Name",
  "status": "ACTIVE"
}
```

### Delete Year
```
DELETE /api/years/{id}
```

### Activate Year
```
POST /api/years/{id}/activate
```

Activates a year and deactivates all others.

## Service Layer

The `YearService` class provides business logic:

- `create_year(data)` - Create a new year with validation
- `update_year(year_id, data)` - Update year details
- `delete_year(year_id)` - Delete a year
- `get_active_year()` - Get currently active year
- `set_year_active(year_id)` - Activate a specific year
- `open_registration(year_id)` - Open registration for a year
- `close_registration(year_id)` - Close registration for a year

## Admin Interface

The Django admin provides:
- List view with filtering by status, registration status, and year
- Bulk actions: Activate years, Open/Close registration
- Organized fieldsets for easy editing
- Read-only timestamp fields

## Setup

1. **Add to INSTALLED_APPS** (already done):
```python
INSTALLED_APPS = [
    ...
    'years',
]
```

2. **Run migrations**:
```bash
python manage.py makemigrations years
python manage.py migrate years
```

3. **Register router** (already done):
```python
from years.api import router as years_router
api.add_router("", years_router)
```

## Usage Examples

### Create a Competition Year
```bash
curl -X POST http://localhost:8000/api/years \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2024 Season",
    "year": 2024,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "status": "PENDING"
  }'
```

### List Active Years
```bash
curl "http://localhost:8000/api/years?status=ACTIVE"
```

### Activate a Year
```bash
curl -X POST http://localhost:8000/api/years/1/activate
```

## Testing

Run tests with:
```bash
pytest apps/years/tests.py -v
```

The test suite includes:
- Model validation tests
- Service layer tests
- Date constraint validation
- Status transitions

## Notes

- Only one year should typically be ACTIVE at a time
- End date validation is enforced at both model and database levels
- All API errors follow the standard format: `{"message": "error text"}`

