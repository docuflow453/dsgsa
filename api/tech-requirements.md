As a senior engineer here is the requirements document and implement this  as per document

# Dressage Competition Management System

## Technical Requirements Specification

Version 1.0

---

# 1. Overview

Show Entry is a **comprehensive equestrian competition management system** built using **Django and Django REST Framework** with an **Angular frontend**.

The system manages:

* Riders
* Horses
* Clubs
* Show Holding Bodies
* Competitions
* Entries
* Financial transactions
* Memberships
* Riding orders
* Competition administration

The system supports **multiple organizations and governing bodies**, allowing centralized oversight while enabling independent competition management.

---

# 2. System Personas (User Roles)

## 2.1 Administrator

Platform administrators manage the **entire system**.

Responsibilities:

* Manage users
* Manage horses
* Manage grades
* Configure system settings
* Configure payment gateways
* Monitor financial transactions
* Manage competitions globally
* Manage accounting
* Monitor system health

Capabilities:

* Full system access
* Override permissions
* Configure integrations
* View all reports

---

## 2.2 Riders

Riders are **competitors entering shows**.

Capabilities:

* Register on the platform
* Manage their profile
* Manage their horses
* Enter competitions
* Select classes
* Pay entry fees
* Track competition history

Relationships:

* Linked to **multiple clubs**
* Linked to **Show Holding Bodies**
* Linked to **SAEF membership**
* Linked to **yearly subscription**

---

## 2.3 Show Holding Bodies

Organizations responsible for **hosting competitions**.

Capabilities:

* Create competitions
* Manage competition schedules
* Create classes
* Approve entries
* Manage riding orders
* Manage competition finances
* Configure levies and extras
* Integrate payment gateways

---

## 2.4 SAEF Administrator

Represents the **South African Equestrian Federation**.

Capabilities:

* View approved riders
* View horse registrations
* Verify rider eligibility
* Monitor competition participation
* Access federation reports

SAEF has **oversight access** but does not manage competitions directly.

---

## 2.5 Clubs

Local riding clubs responsible for **membership approval**.

Capabilities:

* Manage club profile
* Approve rider memberships
* View club members
* Track club competition participation

---

# 3. Core System Modules

---

# 3.1 Authentication & User Management

### Models

* `User`
* `Role`
* `Permission`

### API Endpoints

```
POST /api/auth/
POST /api/register/
GET /api/users/
GET /api/users/{id}/
PUT/PATCH /api/users/{id}/
DELETE /api/users/{id}/
```

### Authentication Methods

* Session Authentication
* Token Authentication
* JWT Authentication

---

# 3.2 Club Management

### Models

* `Club`
* `ShowHoldingBody`
* `PaymentMethod`
* `Levy`
* `Extra`

### API Endpoints

```
GET /api/clubs/
POST /api/clubs/
GET /api/clubs/{id}/
PUT/PATCH /api/clubs/{id}/
DELETE /api/clubs/{id}/
GET /api/clubs-list/
GET /api/payment-methods/
GET /api/extras/
GET /api/extras-report/
GET /api/levies/
```

---

# 3.3 Horse Management

### Models

* `Horse`
* `HorseBreed`
* `HorseColour`
* `HorseVaccination`
* `HorseDocument`
* `HorseOwner`
* `BreedType`
* `StudFarm`

### API Endpoints

```
GET /api/horses/
POST /api/horses/
GET /api/horses/{id}/
PUT/PATCH /api/horses/{id}/
DELETE /api/horses/{id}/
GET /api/horse-search/
GET /api/horses-details/
GET /api/breeds/
GET /api/breed-types/
GET /api/horse-colors/
GET /api/stud-farms/
```

### Horse Fields

* Name
* Registration Number
* Breed
* Colour
* Stud Farm
* Owner
* Rider
* Gender
* Date of Birth
* Microchip
* Passport

---

# 3.4 Rider Management

### Models

* `Rider`
* `SaefMembership`
* `RiderClub`
* `RiderShowHoldingBody`
* `Classification`

### API Endpoints

```
GET /api/riders/
POST /api/riders/
GET /api/riders/{id}/
PUT/PATCH /api/riders/{id}/
DELETE /api/riders/{id}/
GET /api/riders-detail/
```

Frontend Route:

```
/my/*
```

---

# 3.5 Competition Management

### Models

* `Competition`
* `CompetitionDate`
* `CompetitionClass`
* `CompetitionExtra`
* `CompetitionLevy`
* `CompetitionDocument`
* `ClassGrade`
* `ClassType`
* `ClassRule`

### API Endpoints

```
GET /api/competitions/
POST /api/competitions/
GET /api/competitions/{id}/
PUT/PATCH /api/competitions/{id}/
DELETE /api/competitions/{id}/

GET /api/competition/{slug}/
GET /api/competition-dates/
POST /api/competition-dates/{id}/generate_riding_order/

GET /api/dates/
GET /api/competition-class/
GET /api/classes-riding-orders/

GET /api/competition-extras/
GET /api/competition-levy/
GET /api/competition-documents/

GET /api/grades/
GET /api/class-types/
GET /api/class-rules/
```

---

# 3.6 Discipline Management

### Models

* `Discipline`

### API

```
GET /api/disciplines/
POST /api/disciplines/
GET /api/disciplines/{id}/
GET /api/discipline-classes/
```

---

# 3.7 Entry Management

### Models

* `Transaction`
* `Entry`
* `EntryClass`
* `EntryExtra`
* `EntryLevy`
* `RidingOrder`

### API

```
GET /api/entries/
POST /api/entries/
GET /api/entries/{id}/
PUT/PATCH /api/entries/{id}/
DELETE /api/entries/{id}/

GET /api/entries-list/
GET /api/entries-details/
GET /api/entries-classes/

GET /api/transactions/
GET /api/competition-transactions/
GET /api/transaction-extras/

GET /api/riding-orders/
```

---

# 3.8 Arena & Appointment Management

### Models

* `Arena`
* `BusinessHour`
* `AppointmentType`
* `Appointment`
* `BookingSetting`

### API

```
GET /api/arenas/
POST /api/arenas/
GET /api/arenas/{id}/

GET /api/business-hours/
GET /api/appointment-types/

GET /api/appointments/
POST /api/appointments/

GET /api/booking-setting/
```

---

# 3.9 Payment Management

### Models

* `PaymentGateway`
* `PayFast`
* `EFT`

### API

```
GET /api/payments/
POST /api/payments/
```

---

# 3.10 Checkout & Cart

### Models

* `Cart`

### API

```
GET /api/cart/
POST /api/cart/
PUT/PATCH /api/cart/{id}/
DELETE /api/cart/{id}/
```

Frontend route:

```
/checkout/*
```

---

# 3.11 Subscription Management

### Models

* `Subscription`

### API

```
GET /api/subscriptions/
POST /api/subscriptions/
GET /api/subscriptions/{id}/
```

---

# 4. Angular Frontend Architecture

The frontend will be implemented using **Angular**.

## Core Angular Modules

### Authentication Module

```
auth/
 - login
 - register
 - forgot-password
 - reset-password
```

---

### Rider Module

```
rider/
 - dashboard
 - profile
 - horses
 - competition-entries
 - payments
```

---

### Horse Module

```
horses/
 - horse-list
 - horse-details
 - horse-registration
```

---

### Competition Module

```
competitions/
 - competition-list
 - competition-details
 - competition-entry
 - riding-orders
 - results
```

---

### Admin Module

```
admin/
 - users
 - clubs
 - horses
 - competitions
 - disciplines
 - reports
```

---

### Show Holding Body Module

```
show-management/
 - competitions
 - classes
 - entries
 - financials
```

---

### Club Module

```
clubs/
 - club-dashboard
 - members
 - approvals
```

---

# 5. Full System Architecture

## High-Level Architecture

```
Angular Frontend
        |
        |
API Gateway
        |
Django REST Backend
        |
Business Logic Layer
        |
Database (PostgreSQL)
        |
Infrastructure Services
```

---

## Backend

Framework:

* Django 3.2
* Django REST Framework

Responsibilities:

* Authentication
* Business logic
* Competition workflows
* Financial processing
* API endpoints

---

## Database

Recommended:

```
PostgreSQL
```

Features:

* relational integrity
* transaction support
* performance indexing

---

## Infrastructure

Recommended stack:

```
NGINX
Gunicorn
Redis
PostgreSQL
Celery
Docker
```

---

# 6. Database Entity Model (ERD)

## Core Entities
### Year

```
Year
- id
- title
- start_date
- end_date
- open_at
- password
- is_active
- created_at
- updated_at
```

```
Membership
- id
- name
- code
- is_active
- created_at
- updated_at
```

```
Subscription
- id
- name
- description
- memberships
- fee
- year_id
- is_official
- is_recreational
- is_admin
- is_active
- created_at
- updated_at
```

```
Classification
- id
- name
- is_pony
- is_recreational
- is_admin
- is_active
- created_at
- updated_at
```

```
YearClassificationFee
- id
- classification_id
- year_id
- fee
- created_at
- updated_at
```

```
Province
- id
- name
- country_id
- created_at
- updated_at
```

```
Levy
- id
- name
- description
- fee_exclusive
- fee
- is_active
- created_at
- updated_at
```


### User

```
User
- id
- email
- title
- first_name
- maiden_name
- last_name
- password
- role
- is_active
- email_confirmed_at
- banned_at
- activated_at
- created_at
- updated_at
```

---

### Rider

```
Rider
- id
- user_id
- saef_number
- id_number
- date_of_birth
- gender
- ethnicity
- passport_number
- passport_expiry
- nationality
- address_line_1
- address_line_2
- province_id
- suburb
- city
- postal_code
- country
- account_type
- account_name
- branch_code
- account_number
- bank_name
- is_active
- is_international
- is_test
```

```
SaefMembership
- id
- rider_id
- year_id 
- approved_at
- approved_by_id
- created_at
- updated_at
```

---

### Judge

```
Judge
- id
- user_id
- name
- cell_number
- province_id
- panel
- promotion_date
- is_active
- created_at
- updated_at
```
---


```
School
- id
- name
- contact_person
- conteact_number
- province_id
- is_active
- created_at
- updated_at
```
---

---

### Horse

```
Horse
- id
- name
- passport_number
- passport_expiry
- date_of_birth
- nationality
- breed_id
- breed_type_id
- colour_id
- sire
- dam
- sire_of_dam
- gender
- microchip_number
- qr_link
- fei_link
- is_test
- created_at
- updated_at
```

```
HorseVaccination
- id
- horse_id
- vaccination_type_id
- date
- created_at
- updated_at
```

---

### Club

```
Club
- id
- user_id
- name
- saef_number
- address_line_1
- address_line_2
- province_id
- suburb
- city
- postal_code
- country
- is_active
- is_test
- created_at
- updated_at
```

---

### ShowHoldingBody

```
ShowHoldingBody
- id
- user_id
- name
- saef_number
- established_at
- website
- address_line_1
- address_line_2
- province_id
- suburb
- city
- postal_code
- country
- account_type
- account_name
- branch_code
- account_number
- bank_name
- is_active
- is_test
- created_at
- updated_at
```

### Account

```
Account
- id
- user_id
- year_id
- amount
- payment_method
- approved_by_id
- approved_at
- data
- created_at
- updated_at
```

```
RiderAccount
- id
- rider_id
- account_id
- subscription_id
- amount
- updated_at
- created_at
```

```
HorseAccount
- id
- horse_id
- account_id
- classification_type_id
- amount
- updated_at
- created_at
```

---

### Competition

```
Competition
- id
- name
- competition_type
- entry_close
- show_holding_body_id
- course_designer
- late_entry_fee
- terms_and_conditions
- entry_message
- close_message
- ground_message
- programme
- venue
- enquiries
- catering
- vet_inspections
- account_type
- account_name
- branch_code
- account_number
- bank_name
- payment_reference_prefix
- is_active
- is_test
- created_at
- updated_at
```

```
CompetitionDate
- id
- competition_id
- start_date
- start_time
- is_active
```

```
CompetitionExtra
- id
- competition_id
- name
- quantity
- price
- is_stable
- is_active
```

```
CompetitionFee
- id
- competition_id
- fee
- is_included_in_entry_fee
- is_active
```

```
CompetitionDocument
- id
- competition_id
- document_type
- filename
- attachment
- is_active
- created_at
- updated_at
```

---

### Competition Class

```
CompetitionClass
- id
- competition_id
- grade_id
- class_type
- fee
- class_rule
- category
- approximate_start_time
- is_active
```

---

### Transaction

```
Transaction
- id
- entry_id
- amount
- payment_status
- payment_method
- approved_at
- approved_by_id
- created_at
- updated_at
```

---

### Entry

```
Entry
- id
- rider_id
- horse_id
- competition_id
- amount
- transaction_id
- is_active
- created_at
- updated_at
- deleted_at
```

---

# 7. Competition Lifecycle Workflow

## Competition Setup

```
Administrator / Show Body
        ↓
Create Competition
        ↓
Create Competition Days
        ↓
Create Classes
        ↓
Publish Competition
```

---

## Entry Workflow

```
Rider selects competition
        ↓
Select horse
        ↓
Select classes
        ↓
Add extras
        ↓
Add to cart
        ↓
Checkout
        ↓
Payment processing
        ↓
Entry confirmed
```

---

## Riding Order Workflow

```
Entries close
        ↓
Organizer generates riding order
        ↓
Riding order published
        ↓
Competition day
```

---

## Results Workflow

```
Competition completed
        ↓
Results captured
        ↓
Results published
```

---

# 8. Technical Stack

### Backend

* Django 6.0
* Django REST Framework 3.12
* Python 3.x

### Libraries
* django-ninja
* django-allauth
* django-rest-auth
* django-filter
* django-cors-headers
* django-enumfields
* django-redis
* django-huey

---

# 9. Security

Security mechanisms:

* JWT authentication
* Role-based access control
* API permission policies
* Secure payment handling
* Audit logging

---

# 10. Audit & Logging

The system must track:

* user actions
* entry submissions
* payment transactions
* competition changes
* horse updates


# Membership

MEMBERSHIP DESCRIPTIONS

Senior (Adult) Competitive: You will be a full competitive Senior (Adult) Rider Member. You and your horses performance history will be recorded and you will receive full grading points at all levels. You will be eligible to be selected for provincial and National teams. You are also entitled to participate in any clinics, seminar, programmes organised by Dressage SA.
International: Senior (Adult) competitive riders who regularly compete in South Africa and need access to your systems for entries and information. All results and marks will be kept while registered.
Pony Rider Competitive: You will be a full competitive Pony Rider Member. You and your horses performance history will be recorded and you will receive full grading points at all levels. You will be eligible to be selected for provincial and National teams. You are also entitled to participate in any clinics, seminar, programmes organised by Dressage SA.
Children Competitive: You will be a full competitive Child Rider Member. You and your horses performance history will be recorded and you will receive full grading points at all levels. You will be eligible to be selected for provincial and National teams. You are also entitled to participate in any clinics, seminar, programmes organised by Dressage SA.
Junior Competitive: You will be a full competitive Junior Rider Member. You and your horses performance history will be recorded and you will receive full grading points at all levels. You will be eligible to be selected for provincial and National teams. You are also entitled to participate in any clinics, seminar, programmes organised by Dressage SA.
Non Graded Senior (Adult) Rider:  You may compete in any graded or non graded shows affiliated to Dressage SA up to and including Novice. Your horse needs to be registered with DSA. Your performance history will be recorded however you will not receive any grading points or ranking. The fee is levied to cover your insurance as well as administration.
Non Graded Pony / Child / Junior Rider:  You may compete in any graded or non graded shows affiliated to Dressage SA up to and including Novice. Your horse needs to be registered with DSA. Your performance history will be recorded however you will not receive any grading points or ranking. The fee is levied to cover your insurance as well as administration.
Non Participating Owner: This membership is for owners who own graded and non graded horses. Horses may compete in graded or non graded shows affilliated to Dressage SA. You will receive notification of any clinics, seminars or programmes organised by Dressage SA.
Official: Members who only officiate at events. These members may not compete in any competitions.