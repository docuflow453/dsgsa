# Database Migration Guide

## Prerequisites

Before running migrations, ensure:
1. Django is installed: `pip install -r requirements.txt`
2. Database is configured in `api/settings.py`
3. Database server is running (if using PostgreSQL/MySQL)

## Migration Order

Due to model dependencies, migrations should be run in this order:

### 1. Authentication App (Foundation)
```bash
python manage.py makemigrations authentication
python manage.py migrate authentication
```

**Models Created:**
- User (custom user model)
- Year
- Membership
- Classification
- Province
- YearClassificationFee
- Levy

### 2. Clubs App
```bash
python manage.py makemigrations clubs
python manage.py migrate clubs
```

**Models Created:**
- Club (depends on User, Province)
- ShowHoldingBody (depends on User, Province)
- PaymentMethod
- Extra

### 3. Horses App
```bash
python manage.py makemigrations horses
python manage.py migrate horses
```

**Models Created:**
- HorseBreed
- BreedType
- HorseColour
- StudFarm
- Horse
- VaccinationType
- HorseVaccination

### 4. Subscriptions App
```bash
python manage.py makemigrations subscriptions
python manage.py migrate subscriptions
```

**Models Created:**
- Subscription (depends on Year, Membership)

### 5. Riders App
```bash
python manage.py makemigrations riders
python manage.py migrate riders
```

**Models Created:**
- Rider (depends on User, Province)
- SaefMembership (depends on Rider, Year)
- Account (depends on User, Year)
- RiderAccount (depends on Rider, Account, Subscription)
- HorseAccount (depends on Horse, Account, Classification)

### 6. Disciplines App
```bash
python manage.py makemigrations disciplines
python manage.py migrate disciplines
```

**Models Created:**
- Discipline

### 7. Competitions App
```bash
python manage.py makemigrations competitions
python manage.py migrate competitions
```

**Models Created:**
- Grade
- ClassType
- ClassRule
- Competition (depends on ShowHoldingBody)
- CompetitionDate (depends on Competition)
- CompetitionClass (depends on Competition, Grade, ClassType, ClassRule)
- CompetitionExtra (depends on Competition)
- CompetitionFee (depends on Competition)
- CompetitionDocument (depends on Competition)

### 8. Entries App
```bash
python manage.py makemigrations entries
python manage.py migrate entries
```

**Models Created:**
- Entry (depends on Rider, Horse, Competition)
- EntryClass (depends on Entry, CompetitionClass)
- Transaction (depends on Entry, User)
- TransactionExtra (depends on Transaction, CompetitionExtra)
- RidingOrder (depends on Entry, CompetitionClass)

### 9. Payments App
```bash
python manage.py makemigrations payments
python manage.py migrate payments
```

**Models Created:**
- PaymentGateway
- PayFastPayment (depends on Transaction)
- EFTPayment (depends on Transaction)

### 10. Arenas App
```bash
python manage.py makemigrations arenas
python manage.py migrate arenas
```

**Models Created:**
- Arena
- BusinessHour (depends on Arena)
- AppointmentType
- Appointment (depends on Arena, AppointmentType, User)
- BookingSetting (depends on Arena)

## Run All Migrations at Once

If you prefer to run all migrations together:

```bash
python manage.py makemigrations
python manage.py migrate
```

Django will automatically resolve dependencies and run migrations in the correct order.

## Verify Migrations

Check migration status:
```bash
python manage.py showmigrations
```

All apps should show `[X]` for applied migrations.

## Common Issues and Solutions

### Issue 1: Circular Dependencies
**Error:** "Circular dependency detected"

**Solution:** Run migrations for individual apps in the order specified above.

### Issue 2: Custom User Model
**Error:** "AUTH_USER_MODEL refers to model 'authentication.User' that has not been installed"

**Solution:** Ensure authentication app is migrated first.

### Issue 3: Foreign Key Constraints
**Error:** "Cannot add foreign key constraint"

**Solution:** Ensure parent models are migrated before child models.

### Issue 4: Database Already Exists
**Error:** "Table already exists"

**Solution:** 
```bash
python manage.py migrate --fake-initial
```

## Reset Database (Development Only)

⚠️ **WARNING: This will delete all data!**

```bash
# Drop all tables
python manage.py flush

# Or delete database file (SQLite only)
rm db.sqlite3

# Run migrations again
python manage.py migrate
```

## Production Migration Strategy

For production deployments:

1. **Backup Database**
   ```bash
   pg_dump dbname > backup.sql  # PostgreSQL
   ```

2. **Test Migrations Locally**
   ```bash
   python manage.py migrate --plan
   ```

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Verify Data Integrity**
   - Check critical tables
   - Verify relationships
   - Test API endpoints

## Post-Migration Tasks

After successful migration:

1. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

2. **Load Initial Data**
   - Create initial Year
   - Create Memberships
   - Create Classifications
   - Create Provinces
   - Create Grades
   - Create Class Types

3. **Verify Admin Interface**
   - Access `/admin/`
   - Check all models are registered
   - Test CRUD operations

4. **Test API Endpoints**
   - Test authentication
   - Test basic CRUD operations
   - Verify permissions

## Migration Best Practices

1. **Always backup before migrating in production**
2. **Test migrations in development first**
3. **Review migration files before applying**
4. **Use `--plan` flag to preview migrations**
5. **Keep migrations small and focused**
6. **Document custom migrations**
7. **Never edit applied migrations**
8. **Use data migrations for complex changes**

## Rollback Migrations

To rollback to a specific migration:

```bash
python manage.py migrate app_name migration_name
```

Example:
```bash
python manage.py migrate authentication 0001_initial
```

To rollback all migrations for an app:
```bash
python manage.py migrate app_name zero
```

## Check for Migration Issues

```bash
# Check for unapplied migrations
python manage.py showmigrations

# Check for migration conflicts
python manage.py makemigrations --check

# Dry run migrations
python manage.py migrate --plan
```

