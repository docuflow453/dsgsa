# Docker Deployment Guide - Dressage Backend

Complete guide for building and deploying the Dressage Django backend application using Docker.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Deployment Options](#deployment-options)
7. [Production Deployment](#production-deployment)
8. [Database Management](#database-management)
9. [Monitoring and Logs](#monitoring-and-logs)
10. [Troubleshooting](#troubleshooting)
11. [Advanced Usage](#advanced-usage)
12. [CI/CD Integration](#cicd-integration)

---

## 📖 Overview

This Django backend application is containerized using Docker for easy deployment. The setup includes:

- **Django 5.2** - Python web framework
- **Gunicorn** - WSGI HTTP server
- **PostgreSQL** - Production database
- **Redis** - Caching and Celery broker
- **Celery** - Background task processing
- **Nginx** - Reverse proxy and static file serving

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Nginx                             │
│              (Reverse Proxy & Load Balancer)            │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
             │                          │
    ┌────────▼────────┐        ┌────────▼────────┐
    │    Frontend     │        │    Backend      │
    │    (Angular)    │        │    (Django)     │
    │   Container     │        │   + Gunicorn    │
    └─────────────────┘        └────────┬────────┘
                                        │
                               ┌────────┴────────┐
                               │   PostgreSQL    │
                               │    Database     │
                               └─────────────────┘
                               ┌─────────────────┐
                               │      Redis      │
                               │  Cache/Broker   │
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │  Celery Worker  │
                               │  + Celery Beat  │
                               └─────────────────┘
```

---

## ✅ Prerequisites

### Required Software

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git** (for version control)

### Check Installations

```bash
docker --version
# Docker version 20.10.0 or higher

docker-compose --version
# Docker Compose version v2.0.0 or higher
```

### Install Docker

**macOS:**
```bash
brew install --cask docker
# Or download from https://www.docker.com/products/docker-desktop
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

**Windows:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop

---

## 🚀 Quick Start

### Option 1: Automated Script (Easiest)

```bash
# Navigate to backend directory
cd dressage

# Run deployment script
./build-and-deploy.sh
```

The script will:
1. ✅ Check Docker is running
2. ✅ Create .env file if missing
3. ✅ Build Docker image
4. ✅ Start container
5. ✅ Display access information

### Option 2: Docker Compose (Recommended)

```bash
# Navigate to project root
cd /path/to/dsriding

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Manual Docker Commands

```bash
cd dressage

# Build image
docker build -t dressage-backend:latest .

# Run container
docker run -d \\
  --name dressage-backend \\
  -p 8000:8000 \\
  --env-file .env \\
  dressage-backend:latest
```

---

## 📁 Project Structure

```
dressage/
├── Dockerfile                 # Docker image configuration
├── .dockerignore             # Files to exclude from build
├── .env.example              # Environment variables template
├── build-and-deploy.sh       # Automated deployment script
├── requirements.txt          # Python dependencies
├── manage.py                 # Django management script
├── dressage/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/                     # Django applications
│   ├── authentication/
│   ├── riders/
│   ├── users/
│   └── ...
└── staticfiles/              # Collected static files (generated)
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

**Edit `.env` with your configuration:**

```bash
# Database Configuration
DATABASE_NAME=dressage_db
DATABASE_USER=dressage_user
DATABASE_PASSWORD=your-secure-password-here

# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-change-this
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:4200,https://your-domain.com

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
CELERY_BROKER_URL=redis://redis:6379/0
```

### Important Security Notes

⚠️ **Never commit `.env` file to version control!**

- Use strong, unique passwords
- Change `DJANGO_SECRET_KEY` in production
- Set `DJANGO_DEBUG=False` in production
- Update `DJANGO_ALLOWED_HOSTS` with your domain

### Generate Secret Key

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

## 🐳 Deployment Options

### Development Deployment

For local development with hot-reloading:

```bash
docker-compose up
```

Features:
- Code changes reflect immediately (volume mounted)
- Debug mode enabled
- SQLite database (no PostgreSQL needed)
- Direct access to Django dev server

### Production Deployment

For production with optimizations:

```bash
docker-compose -f docker-compose.yml up -d
```

Features:
- Gunicorn WSGI server
- PostgreSQL database
- Redis caching
- Celery workers
- Nginx reverse proxy
- Static file optimization

---

## 🚢 Production Deployment

### Step 1: Prepare Environment

```bash
# Clone repository
git clone <repository-url>
cd dsriding

# Create and configure .env
cp .env.example .env
nano .env  # Edit with production values
```

### Step 2: Build Images

```bash
# Build all services
docker-compose build

# Or build specific service
docker-compose build backend
```

### Step 3: Initialize Database

```bash
# Start database only
docker-compose up -d db

# Wait for database to be ready (10 seconds)
sleep 10

# Run migrations
docker-compose run --rm backend python manage.py migrate

# Create superuser
docker-compose run --rm backend python manage.py createsuperuser

# Load initial data (optional)
docker-compose run --rm backend python manage.py loaddata initial_data.json
```

### Step 4: Collect Static Files

```bash
docker-compose run --rm backend python manage.py collectstatic --noinput
```

### Step 5: Start All Services

```bash
docker-compose up -d
```

### Step 6: Verify Deployment

```bash
# Check all containers are running
docker-compose ps

# Check logs
docker-compose logs backend

# Test API
curl http://localhost:8000/api/health
# Expected: {"status": "healthy"}

# Test admin
curl -I http://localhost:8000/admin/
# Expected: HTTP 200 OK
```

---

## 💾 Database Management

### Run Migrations

```bash
# Using docker-compose
docker-compose exec backend python manage.py migrate

# Using docker run
docker exec dressage-backend python manage.py migrate
```

### Create Superuser

```bash
docker-compose exec -it backend python manage.py createsuperuser
```

### Backup Database

```bash
# Export to SQL file
docker-compose exec db pg_dump -U dressage_user dressage_db > backup.sql

# Export with timestamp
docker-compose exec db pg_dump -U dressage_user dressage_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Stop backend services
docker-compose stop backend celery celery-beat

# Restore from backup
docker-compose exec -T db psql -U dressage_user dressage_db < backup.sql

# Restart services
docker-compose start backend celery celery-beat
```

### Database Shell

```bash
# PostgreSQL shell
docker-compose exec db psql -U dressage_user dressage_db

# Django shell
docker-compose exec backend python manage.py shell

# Django dbshell
docker-compose exec backend python manage.py dbshell
```

---

## 📊 Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f celery

# Last 100 lines
docker-compose logs --tail=100 backend

# Since specific time
docker-compose logs --since 2024-01-01T00:00:00 backend
```

### Container Stats

```bash
# Real-time stats for all containers
docker stats

# Specific container
docker stats dressage-backend

# One-time snapshot
docker stats --no-stream
```

### Health Checks

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' dressage-backend

# Health check endpoint
curl http://localhost:8000/api/health
```

### Application Metrics

```bash
# Django check
docker-compose exec backend python manage.py check

# Database check
docker-compose exec backend python manage.py check --database default

# Celery status
docker-compose exec celery celery -A dressage inspect stats
```

---

## 🔧 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker logs dressage-backend
```

**Common issues:**
- Database not ready → Wait 10-15 seconds and retry
- Port already in use → Change port in `.env` or `docker-compose.yml`
- Missing .env file → Copy from `.env.example`

### Database Connection Errors

```bash
# Check database is running
docker-compose ps db

# Test database connection
docker-compose exec backend python manage.py check --database default

# Check database credentials in .env
cat .env | grep DATABASE

# Restart database
docker-compose restart db
```

### Static Files Not Loading

```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Check static files volume
docker volume inspect dsriding_static_volume

# Restart nginx
docker-compose restart nginx
```

### Celery Not Processing Tasks

```bash
# Check celery logs
docker-compose logs celery

# Check Redis connection
docker-compose exec redis redis-cli ping
# Expected: PONG

# Restart celery
docker-compose restart celery celery-beat
```

### Permission Errors

```bash
# Fix file ownership
sudo chown -R $(whoami):$(whoami) .

# Fix volume permissions
docker-compose exec backend chown -R dressage:dressage /app
```

### Out of Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Remove specific volumes
docker volume rm dsriding_postgres_data
```

---

## 🎯 Advanced Usage

### Custom Gunicorn Configuration

Create `gunicorn.conf.py`:

```python
# gunicorn.conf.py
bind = "0.0.0.0:8000"
workers = 4
threads = 2
worker_class = "gthread"
worker_tmp_dir = "/dev/shm"
timeout = 60
keepalive = 5
errorlog = "-"
accesslog = "-"
loglevel = "info"
```

Update Dockerfile CMD:
```dockerfile
CMD ["gunicorn", "--config", "gunicorn.conf.py", "dressage.wsgi:application"]
```

### Multi-Stage Build Optimization

The Dockerfile uses multi-stage builds for smaller image size:

**Stage 1: Dependencies**
- Installs Python packages
- Creates virtual environment

**Stage 2: Application**
- Copies only installed packages
- Copies application code
- Collects static files
- Runs as non-root user

**Benefits:**
- Smaller final image (~300MB vs ~1GB)
- Faster builds (cached layers)
- Better security (no build tools in production)

### Environment-Specific Settings

**development.env:**
```bash
DJANGO_DEBUG=True
DATABASE_NAME=dressage_dev
```

**production.env:**
```bash
DJANGO_DEBUG=False
DATABASE_NAME=dressage_prod
```

**Usage:**
```bash
docker-compose --env-file development.env up
```

### Scaling Services

```bash
# Scale celery workers
docker-compose up -d --scale celery=4

# Scale backend instances (requires load balancer)
docker-compose up -d --scale backend=3
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect dsriding_postgres_data

# Backup volume
docker run --rm -v dsriding_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore volume
docker run --rm -v dsriding_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          cd dressage
          docker build -t dressage-backend:test .

      - name: Run tests
        run: |
          docker run --rm dressage-backend:test python manage.py test

      - name: Run linting
        run: |
          docker run --rm dressage-backend:test flake8 .

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Build and push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker build -t myregistry.com/dressage-backend:latest dressage/
          docker push myregistry.com/dressage-backend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/dsriding
            docker-compose pull
            docker-compose up -d
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/yourproject/dressage-backend

build:
  stage: build
  script:
    - cd dressage
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA

test:
  stage: test
  script:
    - docker run --rm $DOCKER_IMAGE:$CI_COMMIT_SHA python manage.py test

deploy:
  stage: deploy
  only:
    - main
  script:
    - ssh user@server "cd /app && docker-compose pull && docker-compose up -d"
```

---

## 📚 Additional Resources

### Dockerfile Explained

```dockerfile
# Base image with Python 3.11
FROM python:3.11-slim AS base

# Environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1  # Don't write .pyc files
ENV PYTHONUNBUFFERED=1         # Output directly to terminal

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\                      # Compiler for Python packages
    postgresql-client \\        # PostgreSQL client tools
    libpq-dev                   # PostgreSQL development files

# Stage 1: Install dependencies
FROM base AS dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Stage 2: Application
FROM base AS application
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Create non-root user for security
RUN useradd -m -u 1000 dressage
USER dressage

# Collect static files
RUN python manage.py collectstatic --noinput

# Run Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "dressage.wsgi:application"]
```

### Docker Compose Services

**Database (PostgreSQL):**
- Persistent storage with volume
- Health checks enabled
- Automatic restart

**Backend (Django):**
- Depends on database
- Environment variables from .env
- Volume mounts for development
- Health checks enabled

**Celery Worker:**
- Processes background tasks
- Shares backend image
- Connects to Redis broker

**Celery Beat:**
- Schedules periodic tasks
- Uses Django database scheduler
- Runs as single instance

**Redis:**
- In-memory cache and broker
- Persistent storage (AOF mode)
- Health checks enabled

**Nginx:**
- Reverse proxy
- Serves static/media files
- Load balancing (if scaled)

---

## ✅ Production Checklist

Before deploying to production, ensure:

### Security
- [ ] `DJANGO_DEBUG=False` in .env
- [ ] Strong `DJANGO_SECRET_KEY` generated
- [ ] `DJANGO_ALLOWED_HOSTS` configured correctly
- [ ] Database password is strong and unique
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] Security headers enabled in Nginx

### Performance
- [ ] Static files collected and served by Nginx
- [ ] Database indexes optimized
- [ ] Redis caching configured
- [ ] Gunicorn worker count appropriate for CPU cores
- [ ] Database connection pooling configured

### Reliability
- [ ] Database backups automated
- [ ] Log rotation configured
- [ ] Monitoring and alerts set up
- [ ] Health checks working
- [ ] Auto-restart policies configured

### Maintenance
- [ ] Documentation updated
- [ ] Deployment process documented
- [ ] Rollback plan prepared
- [ ] Team trained on Docker commands

---

## 🆘 Getting Help

### Check Logs First

```bash
# View all logs
docker-compose logs

# Filter by service
docker-compose logs backend | grep ERROR

# Follow logs in real-time
docker-compose logs -f backend
```

### Common Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart service
docker-compose restart backend

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend python manage.py <command>

# Remove all containers and volumes
docker-compose down -v
```

### Useful Links

- [Django Documentation](https://docs.djangoproject.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Celery Documentation](https://docs.celeryproject.org/)

---

## 📝 Notes

### Development vs Production

**Development:**
- Uses `docker-compose.yml` with SQLite
- Debug mode enabled
- Code changes auto-reload
- Verbose logging

**Production:**
- Uses production `docker-compose.yml` with PostgreSQL
- Debug mode disabled
- Gunicorn WSGI server
- Optimized logging

### Performance Tuning

**Gunicorn Workers:**
```
workers = (2 × CPU cores) + 1
```

**Database Connections:**
```python
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 600,  # Connection pooling
    }
}
```

**Redis Caching:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
    }
}
```

---

## 🎉 Success!

Your Dressage backend is now running in Docker!

**Next steps:**
1. Access the API at http://localhost:8000/api/
2. Access the admin at http://localhost:8000/admin/
3. Monitor logs with `docker-compose logs -f`
4. Create your first superuser
5. Start developing!

**Happy coding! 🚀**

