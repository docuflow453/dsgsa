# Django Backend Implementation Guide

## Overview

This Django backend implementation follows the technical requirements document for the Dressage Competition Management System. The system is built using Django 6.0 and Django REST Framework with a service layer architecture.

## Project Structure

```
api/
├── api/                          # Main project configuration
│   ├── settings.py              # Django settings with REST Framework config
│   ├── urls.py                  # Main URL routing
│   └── wsgi.py
├── apps/                        # Django applications
│   ├── authentication/          # User management and authentication
│   ├── clubs/                   # Club and Show Holding Body management
│   ├── horses/                  # Horse management and registration
│   ├── riders/                  # Rider profiles and management
│   ├── competitions/            # Competition and class management
│   ├── entries/                 # Entry and transaction management
│   ├── disciplines/             # Discipline management
│   ├── payments/                # Payment gateway integration
│   ├── subscriptions/           # Membership and subscription management
│   └── arenas/                  # Arena and appointment management
└── manage.py
```

## Apps Overview

### 1. Authentication App (`apps/authentication/`)

**Models:**
- `User` - Custom user model with email authentication
- `Year` - Competition year management
- `Membership` - Membership types
- `Classification` - Horse classifications
- `Province` - Geographic provinces
- `YearClassificationFee` - Fee structure per year
- `Levy` - Additional fees

**Key Features:**
- Email-based authentication
- JWT token support
- User role management (admin, rider, club, show_holding_body, saef_admin, official)
- Custom user manager

**Endpoints:**
- `POST /api/auth/` - Login
- `POST /api/register/` - User registration
- `GET /api/users/` - List users
- `GET /api/years/` - List years
- `GET /api/memberships/` - List memberships
- `GET /api/classifications/` - List classifications
- `GET /api/provinces/` - List provinces
- `GET /api/levies/` - List levies

### 2. Clubs App (`apps/clubs/`)

**Models:**
- `Club` - Riding club information
- `ShowHoldingBody` - Organizations hosting competitions
- `PaymentMethod` - Payment method types
- `Extra` - Additional items/services

**Key Features:**
- Club profile management
- Show holding body management with banking details
- Payment method configuration
- Extra items for competitions

**Endpoints:**
- `GET /api/clubs/` - List clubs
- `GET /api/clubs-list/` - Simplified club list
- `GET /api/show-holding-bodies/` - List show holding bodies
- `GET /api/payment-methods/` - List payment methods
- `GET /api/extras/` - List extras
- `GET /api/extras-report/` - Extras usage report

### 3. Horses App (`apps/horses/`)

**Models:**
- `Horse` - Horse registration and details
- `HorseBreed` - Horse breeds
- `HorseColour` - Horse colors
- `BreedType` - Breed classifications
- `StudFarm` - Stud farm information
- `VaccinationType` - Vaccination types
- `HorseVaccination` - Vaccination records

**Key Features:**
- Comprehensive horse registration
- Breed and color management
- Vaccination tracking
- Passport and microchip management

**Endpoints:**
- `GET /api/horses/` - List horses
- `GET /api/horse-search/` - Search horses
- `GET /api/horses-details/` - Detailed horse list
- `GET /api/breeds/` - List breeds
- `GET /api/breed-types/` - List breed types
- `GET /api/horse-colors/` - List colors
- `GET /api/stud-farms/` - List stud farms

### 4. Riders App (`apps/riders/`)

**Models:**
- `Rider` - Rider profile and details
- `SaefMembership` - SAEF membership per year

**Key Features:**
- Comprehensive rider profiles
- SAEF membership management
- Banking details
- Rider eligibility checking

**Endpoints:**
- `GET /api/riders/` - List riders
- `GET /api/riders-detail/` - Detailed rider list
- `GET /api/saef-memberships/` - List SAEF memberships
- `POST /api/saef-memberships/{id}/approve/` - Approve membership

### 5. Accounting App (`apps/accounting/`)

**Models:**
- `Account` - Payment account tracking
- `RiderAccount` - Rider subscription accounts
- `HorseAccount` - Horse classification accounts

**Key Features:**
- Payment account management
- Rider subscription tracking
- Horse classification fee tracking
- Account approval workflow

**Endpoints:**
- `GET /api/accounts/` - List accounts
- `GET /api/rider-accounts/` - List rider accounts
- `GET /api/horse-accounts/` - List horse accounts

### 6. Competitions App (`apps/competitions/`)

**Models:**
- `Competition` - Competition details
- `CompetitionDate` - Competition dates
- `CompetitionClass` - Classes within competitions
- `CompetitionExtra` - Competition-specific extras
- `CompetitionFee` - Competition fees
- `CompetitionDocument` - Competition documents
- `Grade` - Competition grades
- `ClassType` - Class types
- `ClassRule` - Class rules

**Key Features:**
- Full competition lifecycle management
- Class and grade management
- Document attachments
- Banking details per competition
- Riding order generation

**Endpoints:**
- `GET /api/competitions/` - List competitions
- `GET /api/competition/{slug}/` - Get competition by slug
- `GET /api/competition-dates/` - List competition dates
- `POST /api/competition-dates/{id}/generate_riding_order/` - Generate riding order
- `GET /api/competition-classes/` - List classes
- `GET /api/classes-riding-orders/` - Classes with riding orders
- `GET /api/grades/` - List grades
- `GET /api/class-types/` - List class types
- `GET /api/class-rules/` - List class rules

### 7. Entries App (`apps/entries/`)

**Models:**
- `Entry` - Competition entry
- `EntryClass` - Entry-class relationship
- `Transaction` - Payment transaction
- `TransactionExtra` - Transaction extras
- `RidingOrder` - Riding order per class

**Key Features:**
- Entry creation with multiple classes
- Transaction management
- Payment status tracking
- Riding order management
- Soft delete support

**Endpoints:**
- `GET /api/entries/` - List entries
- `GET /api/entries-list/` - Simplified entry list
- `GET /api/entries-details/` - Detailed entry list
- `GET /api/entry-classes/` - List entry classes
- `GET /api/transactions/` - List transactions
- `GET /api/competition-transactions/` - Competition transactions
- `GET /api/riding-orders/` - List riding orders

### 8. Disciplines App (`apps/disciplines/`)

**Models:**
- `Discipline` - Equestrian disciplines

**Endpoints:**
- `GET /api/disciplines/` - List disciplines

### 9. Payments App (`apps/payments/`)

**Models:**
- `PaymentGateway` - Payment gateway configuration
- `PayFastPayment` - PayFast payment records
- `EFTPayment` - EFT payment records

**Key Features:**
- Multiple payment gateway support
- PayFast integration
- EFT payment verification
- Payment proof upload

**Endpoints:**
- `GET /api/payment-gateways/` - List payment gateways
- `GET /api/payfast-payments/` - List PayFast payments
- `GET /api/eft-payments/` - List EFT payments

### 10. Subscriptions App (`apps/subscriptions/`)

**Models:**
- `Subscription` - Subscription plans

**Key Features:**
- Yearly subscription management
- Membership type linking
- Official/recreational/admin flags

**Endpoints:**
- `GET /api/subscriptions/` - List subscriptions

### 11. Arenas App (`apps/arenas/`)

**Models:**
- `Arena` - Arena information
- `BusinessHour` - Arena business hours
- `AppointmentType` - Appointment types
- `Appointment` - Arena bookings
- `BookingSetting` - Booking configuration

**Key Features:**
- Arena management
- Business hours configuration
- Appointment booking system
- Booking rules and restrictions

**Endpoints:**
- `GET /api/arenas/` - List arenas
- `GET /api/business-hours/` - List business hours
- `GET /api/appointment-types/` - List appointment types
- `GET /api/appointments/` - List appointments
- `GET /api/booking-settings/` - List booking settings

## Service Layer Architecture

Each app includes a `services.py` file containing business logic:

- **UserService** - User activation, banning, email confirmation
- **CompetitionService** - Entry fee calculation, competition status
- **EntryService** - Entry creation with classes and extras
- **TransactionService** - Payment approval, refunds
- **RidingOrderService** - Riding order generation
- **PaymentService** - Payment processing

## Installation & Setup

### Prerequisites
```bash
Python 3.10+
Django 6.0
Django REST Framework 3.12+
PostgreSQL (recommended)
```

### Required Packages
```bash
pip install django djangorestframework django-cors-headers django-filter djangorestframework-simplejwt
```

### Database Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Run Development Server
```bash
python manage.py runserver
```

## API Authentication

The system supports three authentication methods:
1. **Session Authentication** - For web browsers
2. **Token Authentication** - For mobile apps
3. **JWT Authentication** - For modern SPAs

## Key Design Patterns

1. **Service Layer Pattern** - Business logic separated from views
2. **Repository Pattern** - Data access through model managers
3. **Serializer Pattern** - Data validation and transformation
4. **ViewSet Pattern** - RESTful API endpoints

## Database Schema Highlights

- Custom User model with email authentication
- Soft delete support on entries
- Comprehensive audit trails (created_at, updated_at)
- Foreign key relationships with proper cascading
- Many-to-many relationships for complex associations

## Next Steps

1. Install required dependencies
2. Configure database settings in `settings.py`
3. Run migrations
4. Create initial data (years, memberships, classifications)
5. Set up payment gateway credentials
6. Configure CORS for Angular frontend
7. Set up media file handling for document uploads
8. Configure email backend for notifications
9. Set up Celery for background tasks (optional)
10. Deploy to production environment

## Testing

Each app should have comprehensive tests covering:
- Model validation
- API endpoints
- Service layer logic
- Permission checks
- Business rules

## Security Considerations

- JWT tokens for authentication
- Role-based access control
- API permission policies
- Secure payment handling
- File upload validation
- CORS configuration
- Environment-based settings

## Performance Optimization

- Database query optimization with select_related and prefetch_related
- Pagination on list endpoints
- Caching for frequently accessed data
- Database indexing on foreign keys
- Efficient serializer design

## Documentation

- API documentation available at `/api/docs/` (requires django-rest-swagger)
- Admin interface at `/admin/`
- Model documentation in docstrings
- Service layer documentation in comments

