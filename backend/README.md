# Django Backend with Docker

This is a Django 5.2 backend application configured to run with Docker, featuring Django-Shinobi (a fork of Django Ninja) for API endpoints, PostgreSQL database, Redis cache, and Celery for background tasks.

## 📋 Stack

- **Django 5.2** - Web framework
- **Django-Shinobi** - API framework (fork of Django Ninja) for API endpoints and documentation
- **PostgreSQL 15** - Database
- **Redis 7** - Cache and message broker
- **Celery** - Background task processing
- **Gunicorn** - Production WSGI server

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)

### Development Setup

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development environment:**
   ```bash
   make dev
   ```
   
   Or using docker-compose directly:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

4. **Run migrations:**
   ```bash
   make migrate
   ```

5. **Create superuser:**
   ```bash
   make createsuperuser
   ```

6. **Access the application:**
   - API: http://localhost:8000
   - Admin: http://localhost:8000/admin

### Production Setup

```bash
make prod
```

## 🛠️ Available Commands

### Using Makefile (Recommended)

```bash
make help              # Show all available commands
make build             # Build Docker images
make up                # Start all services
make down              # Stop all services
make restart           # Restart services
make logs              # View logs
make logs-api          # View API logs only
make logs-celery       # View Celery logs only
make shell             # Django shell
make bash              # Container bash
make migrate           # Run migrations
make makemigrations    # Create migrations
make createsuperuser   # Create admin user
make test              # Run tests
make test-coverage     # Run tests with coverage
make clean             # Remove containers and volumes
make dev               # Start development environment
make prod              # Start production environment
make compile-requirements # Compile requirements.in to requirements.txt
make format            # Format code with Black
make lint              # Lint code with Flake8
```

### Database Commands

```bash
make db-backup         # Backup database
make db-restore        # Restore database
make db-shell          # Open PostgreSQL shell
```

### Service-Specific Commands

```bash
make celery-logs       # View Celery logs
make celery-restart    # Restart Celery worker
make redis-cli         # Open Redis CLI
```

## 📦 Docker Services

### Core Services

1. **db** - PostgreSQL 15 database
2. **redis** - Redis cache and message broker
3. **api** - Django REST API

### Background Task Services

4. **celery** - Background task worker
5. **celery-beat** - Scheduled task scheduler

## 📁 Project Structure

```
backend/
├── Dockerfile                  # Docker image configuration
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
├── requirements.in             # Python dependencies (source)
├── requirements.txt            # Compiled dependencies
├── .env.example                # Environment variables template
├── .dockerignore               # Docker ignore file
├── Makefile                    # Convenience commands
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

Key variables:
- `DEBUG` - Enable/disable debug mode
- `SECRET_KEY` - Django secret key (change in production!)
- `DATABASE_*` - Database configuration
- `REDIS_URL` - Redis connection URL
- `CELERY_BROKER_URL` - Celery broker URL
- `ALLOWED_HOSTS` - Allowed hostnames
- `CORS_ALLOWED_ORIGINS` - CORS origins

### Updating Dependencies

1. Edit `requirements.in`
2. Run: `make compile-requirements`
3. Rebuild: `make build`

## 🧪 Testing

Run tests:
```bash
make test
```

Run tests with coverage:
```bash
make test-coverage
```

## 📊 Monitoring

View service status:
```bash
make ps
```

View resource usage:
```bash
make stats
```

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Use strong database passwords
- Enable SSL/HTTPS in production
- Set `DEBUG=False` in production
- Configure proper `ALLOWED_HOSTS`

## 📝 Next Steps

1. Create your Django project inside this directory
2. Configure Django settings to use environment variables
3. Create your apps and models
4. Set up Django-Shinobi API routes
5. Configure Celery tasks

## 🆘 Troubleshooting

### Container won't start
```bash
make logs
```

### Database connection issues
```bash
make db-shell
```

### Reset everything
```bash
make clean
make dev
```

## 📚 Documentation

- [Django 5.2 Docs](https://docs.djangoproject.com/)
- [Django-Shinobi GitHub](https://github.com/django-shinobi/django-shinobi)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Celery Docs](https://docs.celeryproject.org/)

