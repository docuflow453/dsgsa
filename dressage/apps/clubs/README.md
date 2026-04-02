# Clubs Module

## Overview

The **Clubs** module manages equestrian club organizations within the Dressage Riding System. Riders can be linked to one or more clubs each year when they register or renew their membership. This module provides comprehensive club management including registration, contact information, address details, primary contacts, and bank account information for payment processing.

## Table of Contents

1. [Architecture](#architecture)
2. [Models](#models)
3. [Service Layer](#service-layer)
4. [API Endpoints](#api-endpoints)
5. [Schemas](#schemas)
6. [Status Workflow](#status-workflow)
7. [Usage Examples](#usage-examples)
8. [Testing](#testing)

---

## Architecture

The Clubs module follows the established project patterns:

- **Service Layer Pattern**: All business logic is encapsulated in `ClubService` which returns `(success, result, error)` tuples
- **UUID Primary Keys**: All clubs use UUID for primary keys
- **Pydantic Schemas**: Data validation using Pydantic for API requests/responses
- **Django Ninja**: REST API with automatic OpenAPI documentation
- **FilterSchema**: Advanced filtering capabilities for list endpoints
- **Soft Deletes**: Clubs are deactivated rather than deleted
- **Audit Fields**: Created and updated timestamps on all records

### Directory Structure

```
apps/clubs/
├── __init__.py
├── apps.py              # Django app configuration
├── models.py            # Club model and status choices
├── schemas.py           # Pydantic schemas for validation
├── services.py          # Business logic layer
├── api.py               # Django Ninja API endpoints
├── admin.py             # Django admin configuration
├── tests.py             # Comprehensive pytest test suite
└── migrations/          # Database migrations
```

---

## Models

### Club Model

The `Club` model represents an equestrian club organization.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key (UUID4) |
| `name` | CharField | Yes | Unique club name (max 255 chars) |
| `registration_number` | CharField | No | Official registration number |
| `logo` | FileField | No | Club logo (uploaded to `clubs/logos/`) |
| `email` | EmailField | Yes | Contact email address |
| `phone` | CharField | Yes | Contact phone number |
| `website` | URLField | No | Club website URL |
| `address_line_1` | CharField | Yes | Primary address line |
| `address_line_2` | CharField | No | Secondary address line |
| `city` | CharField | Yes | City name |
| `province` | ForeignKey | Yes | Link to Province (PROTECT on delete) |
| `postal_code` | CharField | Yes | Postal/ZIP code |
| `country` | CountryField | Yes | ISO 3166-1 alpha-2 country code |
| `primary_contact_name` | CharField | Yes | Primary contact person name |
| `primary_contact_email` | EmailField | Yes | Primary contact email |
| `primary_contact_phone` | CharField | Yes | Primary contact phone |
| `bank_name` | CharField | No | Bank name for payments |
| `account_number` | CharField | No | Bank account number |
| `branch_code` | CharField | No | Bank branch code |
| `account_type` | CharField | No | Account type (see AccountType) |
| `account_holder_name` | CharField | No | Account holder name |
| `status` | CharField | Yes | Current status (default: ACTIVE) |
| `created_at` | DateTime | Auto | Creation timestamp |
| `updated_at` | DateTime | Auto | Last update timestamp |

**Properties:**

- `is_active`: Returns `True` if status is ACTIVE
- `full_address`: Returns formatted complete address string
- `has_bank_details`: Returns `True` if all bank fields are complete
- `has_logo`: Returns `True` if club has uploaded a logo

**Validation:**

- Name cannot be only whitespace
- If any bank details are provided, `bank_name`, `account_number`, and `account_holder_name` are all required
- Name must be unique across all clubs

### ClubStatus Choices

```python
class ClubStatus(models.TextChoices):
    ACTIVE = 'ACTIVE', 'Active'
    PENDING = 'PENDING', 'Pending Approval'
    SUSPENDED = 'SUSPENDED', 'Suspended'
    BANNED = 'BANNED', 'Banned'
    INACTIVE = 'INACTIVE', 'Inactive'
```

### AccountType Choices

```python
class AccountType(models.TextChoices):
    CURRENT = 'CURRENT', 'Current Account'
    SAVINGS = 'SAVINGS', 'Savings Account'
    BUSINESS = 'BUSINESS', 'Business Account'
    TRANSMISSION = 'TRANSMISSION', 'Transmission Account'
```

---

## Service Layer

The `ClubService` class provides the following methods:

### create_club(data: Dict) → Tuple[bool, Optional[Club], Optional[str]]

Creates a new club with the provided data.

**Parameters:**
- `data`: Dictionary containing club fields (including `province_id`)

**Returns:**
- `(True, club, None)` on success
- `(False, None, error_message)` on failure

**Example:**
```python
success, club, error = ClubService.create_club({
    "name": "Example Riding Club",
    "email": "info@example.shyft.com",
    "phone": "+27211234567",
    "address_line_1": "123 Main Street",
    "city": "Cape Town",
    "province_id": "uuid-of-province",
    "postal_code": "8001",
    "country": "ZA",
    "primary_contact_name": "Sarah Parker",
    "primary_contact_email": "sarah.parker@shyft.com",
    "primary_contact_phone": "+27211234567"
})
```

- `name` (str): Filter by name (case-insensitive partial match)
- `status` (str): Filter by exact status
- `is_active` (bool): Filter by active/inactive status
- `province_id` (str): Filter by province UUID
- `country` (str): Filter by country code
- `search` (str): Search across name, email, city, registration number
- `skip` (int): Pagination offset (default: 0)
- `limit` (int): Results per page (default: 100)

**Returns:**
```python
{
    'items': [club1, club2, ...],
    'total': total_count,
    'skip': offset,
    'limit': page_size,
    'count': items_in_current_page
}
```

---

## API Endpoints

All endpoints are prefixed with `/api/memberships/clubs`

### List Clubs

**GET** `/api/memberships/clubs`

Query parameters for filtering:
- `name`: Filter by club name (partial match)
- `status`: Filter by status (ACTIVE, PENDING, etc.)
- `is_active`: Filter by active status (true/false)
- `province_id`: Filter by province UUID
- `country`: Filter by country code (e.g., "ZA")
- `search`: Full-text search

**Response:**
```json
{
    "items": [
        {
            "id": "uuid",
            "name": "Cape Town Equestrian Club",
            "email": "info@ctec.shyft.com",
            "status": "ACTIVE",
            "is_active": true,
            ...
        }
    ],
    "total": 50,
    "skip": 0,
    "limit": 100,
    "count": 50
}
```

### Create Club

**POST** `/api/memberships/clubs`

**Request Body:**
```json
{
    "name": "New Riding Club",
    "email": "info@newclub.shyft.com",
    "phone": "+27211234567",
    "address_line_1": "123 Horse Lane",
    "city": "Johannesburg",
    "province_id": "province-uuid",
    "postal_code": "2000",
    "country": "ZA",
    "primary_contact_name": "Alex Johnson",
    "primary_contact_email": "alex.johnson@byteorbit.com",
    "primary_contact_phone": "+27211234567",
    "bank_name": "First National Bank",
    "account_number": "62001234567",
    "branch_code": "250655",
    "account_type": "BUSINESS",
    "account_holder_name": "New Riding Club"
}
```

**Response:** `201 Created` with Club object

### Get Club

**GET** `/api/memberships/clubs/{id}`

**Response:** `200 OK` with Club object or `404 Not Found`

### Update Club

**PATCH** `/api/memberships/clubs/{id}`

All fields are optional. Only provided fields will be updated.

**Request Body:**
```json
{
    "name": "Updated Club Name",
    "status": "SUSPENDED"
}
```

**Response:** `200 OK` with updated Club object

### Delete Club

**DELETE** `/api/memberships/clubs/{id}`

Performs soft delete by setting status to INACTIVE.

**Response:**
```json
{
    "message": "Club successfully deactivated",
    "id": "club-uuid"
}
```

---

## Schemas

### ClubCreateSchema

Used for creating new clubs. All required fields must be provided.

### ClubUpdateSchema

Used for updating clubs. All fields are optional.

### ClubSchema

Complete response schema including all fields and computed properties:
- All model fields
- `is_active` (computed)
- `full_address` (computed)
- `has_bank_details` (computed)
- `has_logo` (computed)
- Nested `province` object with province details

### ClubFilterSchema

Django Ninja FilterSchema for list endpoint:
- `name`: Filter by name (icontains)
- `status`: Exact match
- `is_active`: Boolean filter
- `province_id`: FK filter
- `country`: Exact match
- `search`: Custom search logic

---

## Status Workflow

### Status Transitions

```
┌─────────┐
│ PENDING │ ──► Initial state when club registers
└─────────┘
     │
     ▼
┌─────────┐
│ ACTIVE  │ ──► Approved and operational
└─────────┘
     │
     ├──► SUSPENDED ──► Temporarily suspended
     │
     ├──► BANNED ──► Permanently banned
     │
     └──► INACTIVE ──► Soft deleted or deactivated
```

### Status Descriptions

- **PENDING**: Club has registered but awaits approval
- **ACTIVE**: Club is approved and can have members
- **SUSPENDED**: Club is temporarily suspended (can be reactivated)
- **BANNED**: Club is permanently banned (serious violations)
- **INACTIVE**: Club is deactivated (soft delete or voluntary deactivation)

---

## Usage Examples

### Scenario 1: Club Registration

A new equestrian club wants to register in the system:

```python
from apps.clubs.services import ClubService
from apps.common.models import Province

# Get province
province = Province.objects.get(name="Western Cape")

# Create club
success, club, error = ClubService.create_club({
    "name": "Stellenbosch Riding Academy",
    "registration_number": "SRA2024",
    "email": "admin@stellenbosch-riding.shyft.com",
    "phone": "+27218871234",
    "website": "https://stellenbosch-riding.co.za",
    "address_line_1": "45 Vineyard Road",
    "address_line_2": "Paradyskloof",
    "city": "Stellenbosch",
    "province_id": str(province.id),
    "postal_code": "7600",
    "country": "ZA",
    "primary_contact_name": "Emma Davis",
    "primary_contact_email": "emma.davis@shyft.com",
    "primary_contact_phone": "+27218871234",
    "status": "PENDING"  # Awaiting approval
})

if success:
    print(f"Club created: {club.name}")
```

### Scenario 2: Approving a Pending Club

An admin approves a pending club:

```python
success, club, error = ClubService.update_club(
    club_id="pending-club-uuid",
    data={"status": "ACTIVE"}
)

if success:
    print(f"{club.name} is now active!")
```

### Scenario 3: Adding Bank Details

A club wants to add payment details:

```python
success, club, error = ClubService.update_club(
    club_id="club-uuid",
    data={
        "bank_name": "Standard Bank",
        "account_number": "10203040506",
        "branch_code": "051001",
        "account_type": "BUSINESS",
        "account_holder_name": "Stellenbosch Riding Academy"
    }
)

if success and club.has_bank_details:
    print("Bank details saved successfully!")
```

### Scenario 4: Searching for Clubs

Find all active clubs in a specific province:

```python
success, result, error = ClubService.get_clubs(
    province_id="western-cape-uuid",
    is_active=True
)

if success:
    for club in result['items']:
        print(f"{club.name} - {club.city}")
```

### Scenario 5: Rider Membership

When a rider registers, they can select clubs:

```python
# In riders app
from apps.clubs.models import Club

# Get active clubs
active_clubs = Club.objects.filter(status="ACTIVE")

# Rider selects clubs
rider.clubs.add(club1, club2)  # Many-to-many relationship
```

---

## Testing

The module includes comprehensive pytest tests covering:

### Model Tests
- ✅ Creating clubs with valid data
- ✅ Club with complete bank details
- ✅ Full address formatting
- ✅ Different status values
- ✅ Name uniqueness validation
- ✅ Name whitespace validation
- ✅ Incomplete bank details validation
- ✅ String representation

### Service Tests
- ✅ Successful club creation
- ✅ Invalid province handling
- ✅ Get club by ID
- ✅ Club not found error
- ✅ Update club fields
- ✅ Soft delete (deactivate)
- ✅ Filtering and search

### Running Tests

```bash
# Run all clubs tests
pytest apps/clubs/tests.py -v

# Run specific test
pytest apps/clubs/tests.py::TestClubModel::test_create_club_success -v

# Run with coverage
pytest apps/clubs/tests.py --cov=apps.clubs --cov-report=html
```

**Test Results:** All 15 tests passing ✅

---

## Admin Interface

The Django admin provides a comprehensive interface for managing clubs:

**List View:**
- Name, registration number, email, city, province, status
- Filters: status, country, province, account type, created date
- Search: name, registration, email, phone, city, contact name

**Detail View:**
- Organized fieldsets: Basic Info, Address, Primary Contact, Bank Details, Audit
- Read-only: ID, timestamps, computed properties
- Bulk actions: Activate, Deactivate, Suspend, Ban

---

## Integration Points

### Province Dependency

Clubs have a foreign key to `Province` (from `apps.common`):
- Province cannot be deleted if clubs exist (PROTECT)
- Province is included in club responses
- Filtering by province is supported

### Future Integrations

**Riders** (apps.riders):
- Riders can be members of multiple clubs
- Many-to-many relationship: Rider ↔ Club
- Clubs can view their member roster

**Competitions** (future):
- Clubs can host competitions
- Club members get priority registration
- Club affiliation shown in results

**Payments** (future):
- Club bank details used for prize money
- Club membership fees
- Revenue sharing with competition organizers

---

## Error Handling

All API endpoints follow the project's standardized error pattern:

**Success Response:**
```json
{
    "id": "uuid",
    "name": "Club Name",
    ...
}
```

**Error Response:**
```json
{
    "message": "Descriptive error message"
}
```

**HTTP Status Codes:**
- `200 OK`: Successful GET/PATCH/DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors
- `404 Not Found`: Resource not found

---

## Best Practices

1. **Always validate province exists** before creating clubs
2. **Use soft delete** (set status to INACTIVE) instead of hard delete
3. **Complete bank details** if providing any bank information
4. **Use service layer** for all business logic, never bypass it
5. **Filter by is_active** for user-facing club lists
6. **Include province** when retrieving clubs (use select_related)
7. **Validate country codes** (ISO 3166-1 alpha-2 format)

---

## Technical Notes

- **UUID Primary Keys**: All clubs use UUID4 for primary keys
- **Country Field**: Uses `django-countries` for standardized country handling
- **Soft Deletes**: DELETE operations set status to INACTIVE
- **File Uploads**: Logos stored in `MEDIA_ROOT/clubs/logos/`
- **Timezone Aware**: All timestamps use Django's timezone settings
- **Validation**: Both Pydantic (API) and Django (model) validation layers

---

## Maintenance

### Adding New Status Types

1. Update `ClubStatus` choices in `models.py`
2. Add migration for existing data if needed
3. Update status workflow documentation
4. Add admin bulk actions if needed

### Adding New Fields

1. Add field to `Club` model
2. Update schemas (`ClubCreateSchema`, `ClubUpdateSchema`, `ClubSchema`)
3. Update service methods if special handling needed
4. Create and run migrations
5. Add tests for new field
6. Update API documentation

---

## License

Part of the Dressage Riding System - Internal Use Only

---

**Last Updated**: 2026-04-02
**Version**: 1.0.0
**Maintainer**: Dressage Development Team

