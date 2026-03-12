# Quick Start Guide

## Installation

### 1. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Database

Update `api/settings.py` with your database credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'dsriding_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

For development, you can use SQLite (already configured):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 6. Load Initial Data (Optional)

Create initial data for testing:

```bash
python manage.py shell
```

```python
from apps.authentication.models import Year, Membership, Classification, Province
from datetime import date

# Create a year
year = Year.objects.create(
    title="2024 Season",
    start_date=date(2024, 1, 1),
    end_date=date(2024, 12, 31),
    is_active=True
)

# Create memberships
memberships = [
    Membership.objects.create(name="Senior Competitive", code="SC", is_active=True),
    Membership.objects.create(name="Junior Competitive", code="JC", is_active=True),
    Membership.objects.create(name="Pony Rider", code="PR", is_active=True),
]

# Create classifications
classifications = [
    Classification.objects.create(name="Preliminary", is_active=True),
    Classification.objects.create(name="Novice", is_active=True),
    Classification.objects.create(name="Elementary", is_active=True),
]

# Create provinces
provinces = [
    Province.objects.create(name="Gauteng", country_id=1),
    Province.objects.create(name="Western Cape", country_id=1),
    Province.objects.create(name="KwaZulu-Natal", country_id=1),
]

print("Initial data created successfully!")
```

### 7. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## Testing the API

### 1. Access Admin Panel
Navigate to `http://localhost:8000/admin/` and login with your superuser credentials.

### 2. Register a User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.parker@shyft.com",
    "first_name": "Sarah",
    "last_name": "Parker",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "role": "rider"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.parker@shyft.com",
    "password": "SecurePass123!"
  }'
```

Save the returned token for authenticated requests.

### 4. Make Authenticated Request
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/` - Login
- `POST /api/register/` - Register new user
- `GET /api/users/` - List users

### Competitions
- `GET /api/competitions/` - List competitions
- `GET /api/competition/{slug}/` - Get competition details
- `GET /api/grades/` - List grades
- `GET /api/class-types/` - List class types

### Entries
- `GET /api/entries/` - List entries
- `POST /api/entries/` - Create entry
- `GET /api/transactions/` - List transactions

### Horses
- `GET /api/horses/` - List horses
- `POST /api/horses/` - Register horse
- `GET /api/breeds/` - List breeds

### Riders
- `GET /api/riders/` - List riders
- `GET /api/saef-memberships/` - List SAEF memberships

### Clubs
- `GET /api/clubs/` - List clubs
- `GET /api/show-holding-bodies/` - List show holding bodies

## Common Tasks

### Create a Competition
1. Login to admin panel
2. Navigate to Competitions
3. Click "Add Competition"
4. Fill in details and save
5. Add competition dates
6. Add competition classes

### Create an Entry
1. Ensure rider and horse exist
2. POST to `/api/entries/` with:
   - rider_id
   - horse_id
   - competition_id
   - classes (array of class IDs)
   - extras (optional)

### Generate Riding Order
1. POST to `/api/competition-dates/{id}/generate_riding_order/`
2. System will randomize and assign orders

## Troubleshooting

### Migration Issues
```bash
python manage.py migrate --run-syncdb
```

### Clear Database
```bash
python manage.py flush
```

### Check Installed Apps
```bash
python manage.py check
```

### View Routes
```bash
python manage.py show_urls  # Requires django-extensions
```

## Next Steps

1. Configure email backend for notifications
2. Set up media file storage
3. Configure payment gateway credentials
4. Set up CORS for Angular frontend
5. Deploy to production server
6. Set up SSL certificates
7. Configure backup strategy
8. Set up monitoring and logging

## Support

For issues or questions, refer to:
- Django Documentation: https://docs.djangoproject.com/
- DRF Documentation: https://www.django-rest-framework.org/
- Technical Requirements: `tech-requirements.md`
- Implementation Guide: `IMPLEMENTATION_GUIDE.md`

