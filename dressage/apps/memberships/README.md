# Memberships App

The Memberships app manages membership types and subscriptions for the Dressage Riding System.

## Overview

This module provides functionality to:
- Define membership types (e.g., "Rider Membership", "Non-Rider Membership")
- Manage membership descriptions and status
- Control active/inactive membership types
- Create subscriptions combining membership types with competition years and pricing
- Support both competitive and recreational subscription options
- Track membership and subscription metadata

## Models

### Membership

Represents a membership type in the system.

**Fields:**
- `id`: UUIDField (primary_key) - Unique identifier
- `name`: CharField (max_length=100, unique) - Name of the membership type
- `description`: TextField - Detailed description of the membership type
- `is_active`: BooleanField (default=False) - Whether the membership is currently active
- `notes`: TextField (optional) - Additional notes about the membership
- `created_at`: DateTimeField (auto_now_add) - Timestamp when created
- `updated_at`: DateTimeField (auto_now) - Timestamp when last updated

**Constraints:**
- `name` must be unique
- `name` cannot be empty or only whitespace
- `description` cannot be empty or only whitespace

**Properties:**
- `status`: Returns "Active" or "Inactive" based on `is_active`

**Indexes:**
- `name` - For fast lookup by name
- `is_active` - For filtering active/inactive memberships
- `created_at` - For sorting by creation date

### Subscription

Represents a subscription offering that combines a membership type with a competition year and pricing.

**Fields:**
- `id`: UUIDField (primary_key) - Unique identifier
- `name`: CharField (max_length=200) - Name of the subscription
- `description`: TextField - Detailed description of the subscription
- `membership`: ForeignKey(Membership) - Associated membership type
- `year`: ForeignKey(Year) - Associated competition year
- `fee`: DecimalField (max_digits=10, decimal_places=2) - Subscription fee
- `is_recreational`: BooleanField (default=False) - Whether this is a recreational subscription
- `is_active`: BooleanField (default=False) - Whether the subscription is currently available
- `notes`: TextField (optional) - Additional notes about the subscription
- `created_at`: DateTimeField (auto_now_add) - Timestamp when created
- `updated_at`: DateTimeField (auto_now) - Timestamp when last updated

**Constraints:**
- Unique together: `membership`, `year`, `is_recreational` - Only one subscription per membership/year/type combination
- `name` cannot be empty or only whitespace
- `description` cannot be empty or only whitespace
- `fee` must be non-negative (>= 0)

**Properties:**
- `status`: Returns "Active" or "Inactive" based on `is_active`
- `subscription_type`: Returns "Recreational" or "Competitive" based on `is_recreational`

**Indexes:**
- `membership` + `year` - For fast lookup by membership and year
- `is_active` - For filtering active/inactive subscriptions
- `is_recreational` - For filtering by subscription type
- `created_at` - For sorting by creation date

## Schemas

### MembershipSchema
Full membership response with all fields and computed properties.

### MembershipCreateSchema
For creating new memberships. Requires `name` and `description`, optional `is_active` and `notes`.

### MembershipUpdateSchema
For updating memberships. All fields are optional.

### MembershipFilterSchema
For filtering memberships by `name` (case-insensitive) and `is_active` status.

### MembershipListResponseSchema
Paginated response with `count` and `results`.

### SubscriptionSchema
Full subscription response with all fields and computed properties including related membership and year.

### SubscriptionCreateSchema
For creating new subscriptions. Required fields: `name`, `description`, `membership_id`, `year_id`, `fee`. Optional: `is_recreational`, `is_active`, `notes`.

### SubscriptionUpdateSchema
For updating subscriptions. All fields optional: `name`, `description`, `membership_id`, `year_id`, `fee`, `is_recreational`, `is_active`, `notes`.

### SubscriptionFilterSchema
For filtering subscriptions. Optional filters: `name`, `membership_id`, `year_id`, `is_active`, `is_recreational`.

### SubscriptionListResponseSchema
Paginated response with `count` and `results`.

## API Endpoints

All endpoints follow the project's error handling pattern: `return status_code, {"message": "error_message"}`

### List Memberships
```
GET /api/memberships
```

**Query Parameters:**
- `name`: Filter by name (case-insensitive contains lookup)
- `is_active`: Filter by active status (true/false)
- `limit`: Number of results (default: 100, max: 1000)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "name": "Rider Membership",
      "description": "Full membership for riders",
      "is_active": true,
      "status": "Active",
      "notes": "Most popular membership",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Membership
```
GET /api/memberships/{id}
```

**Response (200):** MembershipSchema
**Response (404):** `{"message": "Membership with id {id} not found"}`

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

**Response (201):** MembershipSchema
**Response (400):** `{"message": "error description"}`

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

**Response (200):** MembershipSchema
**Response (400):** `{"message": "error description"}`
**Response (404):** `{"message": "Membership with id {id} not found"}`

### Delete Membership
```
DELETE /api/memberships/{id}
```

**Response (200):** `{"message": "Membership deleted successfully"}`
**Response (404):** `{"message": "Membership with id {id} not found"}`

### Activate Membership
```
POST /api/memberships/{id}/activate
```

**Response (200):** MembershipSchema with `is_active=true`
**Response (404):** `{"message": "Membership with id {id} not found"}`

### Deactivate Membership
```
POST /api/memberships/{id}/deactivate
```

**Response (200):** MembershipSchema with `is_active=false`
**Response (404):** `{"message": "Membership with id {id} not found"}`

---

### List Subscriptions
```
GET /api/subscriptions
```

**Query Parameters:**
- `name`: Filter by name (case-insensitive contains lookup)
- `membership_id`: Filter by membership UUID
- `year_id`: Filter by year UUID
- `is_active`: Filter by active status (true/false)
- `is_recreational`: Filter by recreational status (true/false)
- `limit`: Number of results (default: 100, max: 1000)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "count": 3,
  "results": [
    {
      "id": "uuid",
      "name": "2024 Rider Membership - Competitive",
      "description": "Full competitive rider membership for 2024",
      "membership_id": "membership-uuid",
      "year_id": "year-uuid",
      "fee": 500.00,
      "is_recreational": false,
      "is_active": true,
      "status": "Active",
      "subscription_type": "Competitive",
      "notes": "Early bird special available",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Subscription
```
GET /api/subscriptions/{id}
```

**Response (200):** SubscriptionSchema
**Response (404):** `{"message": "Subscription with id {id} not found"}`

### Create Subscription
```
POST /api/subscriptions
```

**Request Body:**
```json
{
  "name": "2024 Rider Membership - Competitive",
  "description": "Full competitive rider membership for the 2024 season",
  "membership_id": "membership-uuid",
  "year_id": "year-uuid",
  "fee": 500.00,
  "is_recreational": false,
  "is_active": true,
  "notes": "Early bird rate until March 31"
}
```

**Response (201):** SubscriptionSchema
**Response (400):** `{"message": "error description"}`

### Update Subscription
```
PATCH /api/subscriptions/{id}
```

**Request Body:** (all fields optional)
```json
{
  "fee": 450.00,
  "is_active": true,
  "notes": "Updated pricing"
}
```

**Response (200):** SubscriptionSchema
**Response (400):** `{"message": "error description"}`
**Response (404):** `{"message": "Subscription with id {id} not found"}`

### Delete Subscription
```
DELETE /api/subscriptions/{id}
```

**Response (200):** `{"message": "Subscription deleted successfully"}`
**Response (404):** `{"message": "Subscription with id {id} not found"}`

### Activate Subscription
```
POST /api/subscriptions/{id}/activate
```

**Response (200):** SubscriptionSchema with `is_active=true`
**Response (404):** `{"message": "Subscription with id {id} not found"}`

### Deactivate Subscription
```
POST /api/subscriptions/{id}/deactivate
```

**Response (200):** SubscriptionSchema with `is_active=false`
**Response (404):** `{"message": "Subscription with id {id} not found"}`

---

## Admin Interface

The Django admin provides a comprehensive interface for managing both memberships and subscriptions:

### Membership Admin

**List View Features:**
- **Display columns:** name, status, is_active, created_at, updated_at
- **Filters:** is_active, created_at, updated_at
- **Search:** name, description, notes
- **Sorting:** By any column

**Edit View Features:**
- **Organized fieldsets:**
  - Basic Information: name, description, is_active
  - Additional Information: notes
  - Computed Properties: status (read-only)
  - Metadata: id, created_at, updated_at (read-only)

**Bulk Actions:**
- **Activate selected memberships** - Set is_active=True for multiple memberships
- **Deactivate selected memberships** - Set is_active=False for multiple memberships

Access: `http://localhost:8000/admin/memberships/membership/`

### Subscription Admin

**List View Features:**
- **Display columns:** name, membership, year, fee, subscription_type, status, is_active, created_at
- **Filters:** is_active, is_recreational, membership, year, created_at, updated_at
- **Search:** name, description, notes, membership__name, year__name
- **Sorting:** By any column

**Edit View Features:**
- **Organized fieldsets:**
  - Basic Information: name, description, membership, year
  - Pricing & Type: fee, is_recreational, is_active
  - Additional Information: notes
  - Computed Properties: status, subscription_type (read-only)
  - Metadata: id, created_at, updated_at (read-only)

**Bulk Actions:**
- **Activate selected subscriptions** - Set is_active=True for multiple subscriptions
- **Deactivate selected subscriptions** - Set is_active=False for multiple subscriptions
- **Mark as recreational** - Set is_recreational=True for multiple subscriptions
- **Mark as competitive** - Set is_recreational=False for multiple subscriptions

Access: `http://localhost:8000/admin/memberships/subscription/`

## Setup

### 1. Installation (Already Done)

The app is already registered in `INSTALLED_APPS`:
```python
# dressage/settings.py
INSTALLED_APPS = [
    ...
    'apps.memberships',
]
```

### 2. Run Migrations

```bash
cd dressage
python manage.py makemigrations memberships
python manage.py migrate memberships
```

### 3. Register Router (Already Done)

The router is already registered in the main API:
```python
# dressage/urls.py
from apps.memberships.api import router as memberships_router
api.add_router("", memberships_router)
```

### 4. Create Test Data

```bash
cd dressage
python create_memberships_test_data.py
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

### List All Memberships
```bash
curl http://localhost:8000/api/memberships
```

### List Active Memberships Only
```bash
curl "http://localhost:8000/api/memberships?is_active=true"
```

### Search by Name
```bash
curl "http://localhost:8000/api/memberships?name=rider"
```

### Get Specific Membership
```bash
curl http://localhost:8000/api/memberships/{membership_id}
```

### Update Membership
```bash
curl -X PATCH http://localhost:8000/api/memberships/{membership_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Rider Membership",
    "is_active": true
  }'
```

### Activate a Membership
```bash
curl -X POST http://localhost:8000/api/memberships/{membership_id}/activate
```

### Deactivate a Membership
```bash
curl -X POST http://localhost:8000/api/memberships/{membership_id}/deactivate
```

### Delete a Membership
```bash
curl -X DELETE http://localhost:8000/api/memberships/{membership_id}
```

### Pagination Example
```bash
# Get first 10 memberships
curl "http://localhost:8000/api/memberships?limit=10&offset=0"

# Get next 10 memberships
curl "http://localhost:8000/api/memberships?limit=10&offset=10"
```

---

### Create a Subscription
```bash
curl -X POST http://localhost:8000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2024 Rider Membership - Competitive",
    "description": "Full competitive rider membership for 2024 season",
    "membership_id": "membership-uuid-here",
    "year_id": "year-uuid-here",
    "fee": 500.00,
    "is_recreational": false,
    "is_active": true,
    "notes": "Early bird rate available until March 31"
  }'
```

### List All Subscriptions
```bash
curl http://localhost:8000/api/subscriptions
```

### Filter Subscriptions by Year
```bash
curl "http://localhost:8000/api/subscriptions?year_id={year_uuid}"
```

### Filter Active Competitive Subscriptions
```bash
curl "http://localhost:8000/api/subscriptions?is_active=true&is_recreational=false"
```

### Filter by Membership Type
```bash
curl "http://localhost:8000/api/subscriptions?membership_id={membership_uuid}"
```

### Get Specific Subscription
```bash
curl http://localhost:8000/api/subscriptions/{subscription_id}
```

### Update Subscription Fee
```bash
curl -X PATCH http://localhost:8000/api/subscriptions/{subscription_id} \
  -H "Content-Type: application/json" \
  -d '{
    "fee": 450.00,
    "notes": "Updated early bird pricing"
  }'
```

### Activate a Subscription
```bash
curl -X POST http://localhost:8000/api/subscriptions/{subscription_id}/activate
```

### Deactivate a Subscription
```bash
curl -X POST http://localhost:8000/api/subscriptions/{subscription_id}/deactivate
```

### Delete a Subscription
```bash
curl -X DELETE http://localhost:8000/api/subscriptions/{subscription_id}
```

### Complex Subscription Query
```bash
# Get all active recreational subscriptions for a specific membership
curl "http://localhost:8000/api/subscriptions?membership_id={membership_uuid}&is_active=true&is_recreational=true&limit=50"
```

## Testing

### Run All Tests
```bash
cd dressage
pytest apps/memberships/tests.py -v
```

### Run Specific Test Class
```bash
pytest apps/memberships/tests.py::TestMembershipModel -v
pytest apps/memberships/tests.py::TestMembershipService -v
```

### Test Coverage

The test suite includes **20 comprehensive tests**:

**Model Tests (7 tests):**
- ✅ test_create_membership_success
- ✅ test_membership_status_property
- ✅ test_name_uniqueness
- ✅ test_name_whitespace_validation
- ✅ test_description_whitespace_validation
- ✅ test_default_is_active_false
- ✅ test_str_representation

**Service Tests (13 tests):**
- ✅ test_create_membership_success
- ✅ test_create_membership_duplicate_name
- ✅ test_update_membership_success
- ✅ test_update_nonexistent_membership
- ✅ test_get_membership_success
- ✅ test_get_nonexistent_membership
- ✅ test_get_memberships_with_filters
- ✅ test_get_memberships_pagination
- ✅ test_get_active_memberships
- ✅ test_activate_membership
- ✅ test_deactivate_membership
- ✅ test_activate_nonexistent_membership
- ✅ test_deactivate_nonexistent_membership

### System Check
```bash
cd dressage
python manage.py check
# Should show: System check identified no issues (0 silenced).
```

## Architecture

### Project Structure
```
apps/memberships/
├── __init__.py
├── apps.py                 # App configuration
├── models.py               # Membership model
├── schemas.py              # Pydantic schemas for API
├── services.py             # Business logic layer
├── api.py                  # Django Ninja API endpoints
├── admin.py                # Django admin configuration
├── tests.py                # Comprehensive test suite
├── migrations/
│   ├── __init__.py
│   └── 0001_initial.py
└── README.md               # This file
```

### Design Patterns

**Service Layer Pattern:**
- Business logic is separated from API views
- All data manipulation goes through the service layer
- Consistent return format: `(success, result, error)`

**Schema Validation:**
- Pydantic schemas validate all incoming data
- Prevents invalid data from reaching the database
- Clear error messages for validation failures

**Error Handling:**
- All errors follow the standard format: `{"message": "error text"}`
- No `HttpError` exceptions - return status codes directly
- Proper HTTP status codes: 200, 201, 400, 404

## Notes

- Membership names must be unique across the system
- Name and description validation prevents empty/whitespace-only values
- The `is_active` field defaults to `False` for safety
- All API errors follow the standard format: `{"message": "error text"}`
- UUID primary keys are used for all memberships
- Timestamps (`created_at`, `updated_at`) are managed automatically

## Integration with Frontend

The API is designed to work seamlessly with the Angular frontend:

**TypeScript Interface Example:**
```typescript
interface Membership {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## Performance Considerations

- Database indexes on `name`, `is_active`, and `created_at` for fast queries
- Pagination support (limit/offset) for large datasets
- Efficient filtering using Django ORM
- Minimal database queries through service layer optimization



**Response (200):** MembershipSchema with `is_active=false`
**Response (404):** `{"message": "Membership with id {id} not found"}`

## Service Layer

The `MembershipService` class provides business logic:

- `create_membership(data)` - Create a new membership with validation
  - Returns: `(success, membership, error_message)`
- `update_membership(membership_id, data)` - Update membership details
  - Returns: `(success, membership, error_message)`
- `delete_membership(membership_id)` - Delete a membership
  - Returns: `(success, error_message)`
- `get_membership(membership_id)` - Get a single membership
  - Returns: `Membership or None`
- `get_memberships(filters, limit, offset)` - Get memberships with filtering
  - Returns: `(count, memberships_list)`
- `get_active_memberships()` - Get all active memberships
  - Returns: `List[Membership]`
- `activate_membership(membership_id)` - Activate a membership
  - Returns: `(success, membership, error_message)`
- `deactivate_membership(membership_id)` - Deactivate a membership
  - Returns: `(success, membership, error_message)`

All service methods return consistent tuples for error handling.

