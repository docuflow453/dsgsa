# Quick Start Guide - Dressage Backend

## 🚀 Getting Started

### 1. Environment Setup

Copy the environment file and customize if needed:

```bash
cp .env.example .env
```

### 2. Start Development Environment

```bash
# Start all services
make dev

# Or using docker-compose directly
docker-compose -f docker-compose.dev.yml up -d --build
```

This will start:
- PostgreSQL database (port 5432)
- Redis (port 6379)
- Django API (port 8000)
- Celery worker
- Celery beat scheduler

### 3. Run Initial Migrations

```bash
make migrate

# Or
docker-compose exec api python manage.py migrate
```

### 4. Create Superuser

```bash
make createsuperuser

# Or
docker-compose exec api python manage.py createsuperuser
```

### 5. Access the Application

- **API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📦 Project Structure

```
backend/
├── dressage/              # Django project settings
│   ├── __init__.py
│   ├── settings.py        # Main settings
│   ├── urls.py            # Main URL configuration
│   ├── wsgi.py            # WSGI entry point
│   ├── asgi.py            # ASGI entry point
│   └── celery.py          # Celery configuration
├── apps/                  # All Django apps go here
│   ├── __init__.py
│   └── README.md          # App creation guide
├── manage.py              # Django management script
├── requirements.in        # Python dependencies (source)
├── requirements.txt       # Compiled dependencies
├── Dockerfile             # Docker image
├── docker-compose.yml     # Production config
├── docker-compose.dev.yml # Development config
├── Makefile               # Convenience commands
└── README.md              # Main documentation
```

## 🛠️ Common Commands

### Docker Management

```bash
make dev            # Start development environment
make prod           # Start production environment
make build          # Build Docker images
make up             # Start all services
make down           # Stop all services
make restart        # Restart services
make logs           # View all logs
make logs-api       # View API logs only
make logs-celery    # View Celery logs
```

### Django Management

```bash
make migrate        # Run migrations
make makemigrations # Create new migrations
make shell          # Django shell
make bash           # Container bash
make createsuperuser # Create admin user
make collectstatic  # Collect static files
```

### Database Management

```bash
make db-backup      # Backup database
make db-restore     # Restore database
make db-shell       # PostgreSQL shell
```

### Testing & Code Quality

```bash
make test           # Run tests
make test-coverage  # Run tests with coverage
make format         # Format code with Black
make lint           # Lint code with Flake8
```

## 📝 Creating Your First App

### Step 1: Create the app

```bash
# Create an app called 'riders' in the apps directory
docker-compose exec api python manage.py startapp riders apps/riders
```

### Step 2: Register the app

Add to `dressage/settings.py`:

```python
INSTALLED_APPS = [
    # ... existing apps ...
    
    # Local apps
    'apps.riders',  # Add this
]
```

### Step 3: Create models

Edit `apps/riders/models.py`:

```python
from django.db import models

class Rider(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

### Step 4: Create and run migrations

```bash
make makemigrations
make migrate
```

### Step 5: Register in admin (optional)

Edit `apps/riders/admin.py`:

```python
from django.contrib import admin
from .models import Rider

@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'created_at']
    search_fields = ['first_name', 'last_name', 'email']
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

- `DEBUG=True` - Enable debug mode
- `SECRET_KEY=...` - Django secret key
- `DATABASE_*` - Database settings
- `REDIS_URL` - Redis connection
- `CELERY_BROKER_URL` - Celery broker
- `ALLOWED_HOSTS` - Allowed hosts
- `CORS_ALLOWED_ORIGINS` - CORS settings

## 🧪 Testing

Run tests:

```bash
make test
```

Run tests with coverage:

```bash
make test-coverage
```

## 🐛 Troubleshooting

### View logs

```bash
make logs
```

### Restart services

```bash
make restart
```

### Clean and rebuild

```bash
make clean
make dev
```

### Access container shell

```bash
make bash
```

## 📚 Next Steps

1. Read the `apps/README.md` for app creation guidelines
2. Create your Django apps in the `apps/` directory
3. Set up Django-Shinobi for API endpoints
4. Configure your models and migrations
5. Write tests for your code

## 🆘 Help

For more detailed documentation, see:
- `README.md` - Complete documentation
- `apps/README.md` - App creation guide
- [Django 5.2 Docs](https://docs.djangoproject.com/)

