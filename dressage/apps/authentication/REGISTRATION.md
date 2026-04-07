# User Registration API

## Overview

The registration endpoint allows new users to create accounts in the Dressage Riding System. The system supports registration for different user roles including Riders, Officials, Clubs, and more. When a user registers with the RIDER or OFFICIAL role, a corresponding profile is automatically created.

## Endpoint

**POST** `/api/register`

## Request Schema

### Required Fields (All Roles)

| Field | Type | Description |
|-------|------|-------------|
| `email` | EmailStr | Unique email address for the account |
| `password` | string | Password (minimum 8 characters) |
| `first_name` | string | User's first name (1-150 chars) |
| `last_name` | string | User's last name (1-150 chars) |
| `role` | string | User role (see Roles section) |

### Optional Fields (All Roles)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | User title: MR, MRS, MS, MISS, DR, PROF |
| `maiden_name` | string | Maiden name (optional, max 150 chars) |

### Additional Required Fields for RIDER and OFFICIAL Roles

| Field | Type | Description |
|-------|------|-------------|
| `date_of_birth` | date | Date of birth (YYYY-MM-DD format) |
| `gender` | string | Gender: MALE, FEMALE, OTHER |
| `nationality` | string | Nationality (ISO 3166-1 alpha-2 code, e.g., "ZA") |
| `id_number` OR `passport_number` | string | South African ID (13 digits) OR passport number |

### Optional Profile Fields (RIDER and OFFICIAL)

| Field | Type | Description |
|-------|------|-------------|
| `ethnicity` | string | Ethnicity: BLACK_AFRICAN, COLOURED, INDIAN, WHITE, OTHER |
| `address_line_1` | string | Primary address line (max 255 chars) |
| `address_line_2` | string | Secondary address line (max 255 chars) |
| `suburb` | string | Suburb (max 100 chars) |
| `city` | string | City (max 100 chars) |
| `province` | string | Province (max 100 chars) |
| `postal_code` | string | Postal code (max 20 chars) |
| `country` | string | Country (ISO 3166-1 alpha-2 code) |

## User Roles

- **RIDER** - Equestrian riders (requires profile creation)
- **OFFICIAL** - Competition officials/judges (requires profile creation)
- **CLUB** - Club representatives
- **PROVINCIAL** - Provincial representatives
- **SHOW_HOLDING_BODY** - Show holding body representatives
- **PUBLIC** - General public users
- ~~SAEF~~ - Reserved for internal use
- ~~ADMIN~~ - Reserved for internal use

## Response

### Success Response (201 Created)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "emma.davis@shyft.com",
    "first_name": "Emma",
    "last_name": "Davis",
    "role": "RIDER",
    "is_active": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 1800,
  "message": "Registration successful"
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Error description"
}
```

**Common Error Messages:**
- "Email address is already registered"
- "Date of birth is required for RIDER role"
- "Gender is required for RIDER role"
- "Nationality is required for RIDER role"
- "Either ID number or passport number must be provided"
- "SA ID number must be exactly 13 digits"
- "Validation error: [field]: [error details]"

## Examples

### Example 1: Rider Registration (South African)

**Request:**
```json
POST /api/register
Content-Type: application/json

{
  "email": "emma.davis@shyft.com",
  "password": "SecurePass123!",
  "first_name": "Emma",
  "last_name": "Davis",
  "role": "RIDER",
  "date_of_birth": "1995-05-15",
  "gender": "FEMALE",
  "nationality": "ZA",
  "id_number": "9505155009087",
  "address_line_1": "123 Equestrian Drive",
  "city": "Cape Town",
  "province": "Western Cape",
  "postal_code": "8001",
  "country": "ZA"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "emma.davis@shyft.com",
    "first_name": "Emma",
    "last_name": "Davis",
    "role": "RIDER",
    "is_active": true
  },
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 1800,
  "message": "Registration successful"
}
```

### Example 2: Official Registration (International with Passport)

**Request:**


## Validation Rules

### Password Requirements
- Minimum length: 8 characters
- No specific complexity requirements (should be implemented in production)

### Email Validation
- Must be a valid email format
- Must be unique across the system
- Case-insensitive uniqueness check

### Role-Specific Requirements

#### For RIDER and OFFICIAL Roles:
1. **Date of Birth** - Required, must be a valid date
2. **Gender** - Required, must be one of: MALE, FEMALE, OTHER
3. **Nationality** - Required, must be a 2-letter ISO country code (e.g., "ZA", "GB", "US")
4. **Identification** - At least ONE of the following:
   - **ID Number** - Must be exactly 13 digits (South African ID)
   - **Passport Number** - Any format

#### For Other Roles (CLUB, PROVINCIAL, SHOW_HOLDING_BODY, PUBLIC):
- Only basic user fields are required
- No profile creation occurs
- Can register with minimal information

### Field Format Validation

- **SA ID Number**: Must be exactly 13 digits, numeric only
- **Nationality/Country**: Must be ISO 3166-1 alpha-2 code (2 letters)
- **Email**: Must follow standard email format

## Auto-Login After Registration

Upon successful registration, the user is automatically logged in. The response includes:

- **access_token**: JWT token for API authentication (valid for 30 minutes)
- **refresh_token**: JWT token for refreshing access tokens (valid for 7 days)
- **expires_in**: Access token expiry in seconds (1800 = 30 minutes)

The client should store these tokens securely and use the access token for subsequent authenticated API requests.

### Using the Tokens

**Authorization Header:**
```
Authorization: Bearer <access_token>
```

**Refreshing Tokens:**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "<refresh_token>"
}
```

## Profile Creation

### Rider Profile

When a user registers with role **RIDER** or **OFFICIAL**, a Rider profile is automatically created with:

**Core Fields:**
- Link to User account (OneToOne relationship)
- Date of birth
- Gender
- Nationality
- ID number OR passport number

**Optional Fields:**
- Ethnicity
- Complete address information
- SAEF number (assigned later)
- Banking details (can be added later)
- Is active flag (default: true)
- Is test flag (default: false)

### No Profile for Other Roles

Users registered with roles **CLUB**, **PROVINCIAL**, **SHOW_HOLDING_BODY**, or **PUBLIC** do not get an automatic profile. These users:
- Can still log in and use the system
- May have organization-specific data added later
- Have access based on their role permissions

## Integration Points

### User Model Fields

All registered users get a User record with:
- **id**: UUID (auto-generated)
- **email**: Unique email address
- **password**: Hashed password
- **first_name**: First name
- **last_name**: Last name
- **title**: Optional title
- **maiden_name**: Optional maiden name
- **role**: User role
- **is_active**: True (activated immediately)
- **is_staff**: False (unless promoted later)
- **activated_at**: Timestamp of registration
- **created_at**: Timestamp of creation
- **updated_at**: Timestamp of last update

### Rider Model Fields

For RIDER and OFFICIAL roles, a Rider record is created with:
- **user**: OneToOne link to User
- **date_of_birth**: Required
- **gender**: Required
- **nationality**: Required
- **id_number**: Optional (if provided)
- **passport_number**: Optional (if provided)
- **saef_number**: Null (assigned later through admin)
- **ethnicity**: Optional
- **address_line_1**: Optional
- **address_line_2**: Optional
- **suburb**: Optional
- **city**: Optional
- **province**: Optional
- **postal_code**: Optional
- **country**: Optional
- **is_active**: True
- **is_test**: False

## Security Considerations

1. **Password Storage**: Passwords are hashed using Django's default password hasher (PBKDF2)
2. **Email Uniqueness**: Checked before user creation to prevent duplicates
3. **JWT Tokens**: Signed with Django SECRET_KEY using HS256 algorithm
4. **Refresh Token Storage**: Stored in database with expiry tracking
5. **IP Address Logging**: Client IP is stored with refresh tokens for security audit
6. **Transaction Safety**: All registration steps wrapped in database transaction

## Error Handling

All errors follow the project's standardized pattern:

**Format:**
```json
{
  "message": "Descriptive error message"
}
```

**HTTP Status Codes:**
- **201 Created**: Registration successful
- **400 Bad Request**: Validation error, duplicate email, or missing required fields

## Testing

The registration functionality includes comprehensive test coverage:

### Test Scenarios:
✅ Successful rider registration with ID number
✅ Successful official registration with passport number
✅ Duplicate email rejection
✅ Missing required fields for RIDER role (DOB, gender, nationality)
✅ Missing identification (ID or passport)
✅ Public user registration (no profile)
✅ Full address information
✅ Optional fields (title, maiden name)
✅ Token generation and validation

**Run Tests:**
```bash
pytest apps/authentication/tests.py::TestUserRegistration -v
```

**Test Results:** All 11 tests passing ✅

## Usage Workflow

### 1. Client Registration Form

The client application should collect:
- Basic user info (email, password, name)
- Role selection
- Conditional fields based on role:
  - If RIDER or OFFICIAL: Show additional profile fields
  - If other roles: Only basic user fields

### 2. Submit Registration

POST the data to `/api/register` with all required fields.

### 3. Handle Response

**On Success (201):**
1. Store access_token and refresh_token securely
2. Set Authorization header for future requests
3. Redirect user to dashboard or profile completion

**On Error (400):**
1. Parse error message
2. Display to user
3. Allow correction and resubmission

### 4. Automatic Login

User is automatically logged in after registration:
- No separate login step required
- Tokens are immediately usable
- User can start using the application

## API Documentation

Full API documentation is available through Django Ninja's automatic OpenAPI documentation:

**Swagger UI:** `/api/docs`
**ReDoc:** `/api/redoc`

## Future Enhancements

Potential improvements for production:

1. **Email Verification**
   - Send verification email after registration
   - Require email confirmation before full activation
   - Add `email_confirmed_at` timestamp

2. **Password Strength**
   - Enforce complexity requirements
   - Check against common password lists
   - Require special characters, numbers, uppercase

3. **Captcha Protection**
   - Add reCAPTCHA to prevent bot registrations
   - Rate limiting per IP address

4. **Welcome Emails**
   - Send welcome email after registration
   - Include getting started guide
   - Provide helpful links

5. **Profile Photo**
   - Allow uploading profile photo during or after registration
   - Image validation and resize

6. **Multi-Step Registration**
   - Break into multiple steps for better UX
   - Save partial data as draft
   - Complete profile later

7. **OAuth Integration**
   - Social login options (Google, Facebook, etc.)
   - Link external accounts

## Support

For registration issues or questions:
- Check error messages for specific validation failures
- Ensure all required fields for the selected role are provided
- Verify email is not already registered
- Contact system administrator for account activation issues

---

**Last Updated**: 2026-04-02
**Version**: 1.0.0
**Endpoint**: `/api/register`

```json
POST /api/register
Content-Type: application/json

{
  "email": "michael.chen@shyft.com",
  "password": "SecurePass123!",
  "title": "DR",
  "first_name": "Michael",
  "last_name": "Chen",
  "role": "OFFICIAL",
  "date_of_birth": "1988-03-20",
  "gender": "MALE",
  "nationality": "GB",
  "passport_number": "GB123456789",
  "city": "London",
  "country": "GB"
}
```

### Example 3: Public User Registration

**Request:**
```json
POST /api/register
Content-Type: application/json

{
  "email": "public.user@byteorbit.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Smith",
  "role": "PUBLIC"
}
```


