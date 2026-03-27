# Apps Directory

This directory contains all the Django applications for the dressage project.

## Creating a New App

To create a new app in this directory, use the following command:

```bash
# From the backend directory
python manage.py startapp your_app_name apps/your_app_name

# Or using Docker
docker-compose exec api python manage.py startapp your_app_name apps/your_app_name
```

Or manually create the app structure:

```bash
mkdir -p apps/your_app_name
cd apps/your_app_name
touch __init__.py models.py views.py admin.py apps.py tests.py
mkdir migrations
touch migrations/__init__.py
```

## Registering the App

After creating an app, register it in `dressage/settings.py`:

```python
INSTALLED_APPS = [
    # ... Django default apps ...
    
    # Third-party apps
    'django_extensions',
    'rest_framework',
    # ...
    
    # Local apps (inside apps/ folder)
    'apps.your_app_name',  # Add your app here
]
```

## App Structure

Each app should follow this structure:

```
apps/
└── your_app_name/
    ├── __init__.py
    ├── admin.py          # Admin panel configuration
    ├── apps.py           # App configuration
    ├── models.py         # Database models
    ├── views.py          # Views/ViewSets
    ├── serializers.py    # DRF serializers (create this)
    ├── urls.py           # URL routing (create this)
    ├── services.py       # Business logic (create this)
    ├── tasks.py          # Celery tasks (create this)
    ├── tests/            # Test modules
    │   ├── __init__.py
    │   ├── test_models.py
    │   ├── test_views.py
    │   └── test_services.py
    └── migrations/       # Database migrations
        └── __init__.py
```

## Best Practices

1. **Use services.py** for business logic instead of putting it in views or models
2. **Create serializers.py** for Django REST Framework serializers
3. **Use tasks.py** for Celery background tasks
4. **Write tests** in the tests/ directory
5. **Use meaningful names** for your models, views, and functions
6. **Follow Django conventions** for model naming (singular, CamelCase)

## Example Apps for Dressage System

Based on the project requirements, you might create apps like:

- `apps.users` - User management and authentication
- `apps.riders` - Rider profiles and information
- `apps.horses` - Horse registration and details
- `apps.competitions` - Competition management
- `apps.entries` - Competition entries
- `apps.results` - Competition results
- `apps.payments` - Payment processing
- `apps.notifications` - Email and notifications
- `apps.reports` - Reporting and analytics

## Creating Your First App

Example: Creating a riders app

```bash
# Using Docker
docker-compose exec api python manage.py startapp riders apps/riders

# Add to INSTALLED_APPS in settings.py
'apps.riders',

# Create the necessary files
cd apps/riders
touch serializers.py urls.py services.py tasks.py
mkdir tests
touch tests/__init__.py tests/test_models.py tests/test_views.py
```

Then define your models, serializers, views, and URLs as needed.

