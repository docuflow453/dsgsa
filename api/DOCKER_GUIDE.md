# Docker Deployment Guide

## Overview

This guide covers deploying the Dressage Competition Management System using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## Quick Start

### 1. Clone and Navigate
```bash
cd api
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your configuration (optional for development).

### 3. Build and Start Services
```bash
docker-compose up -d --build
```

### 4. Run Migrations
```bash
docker-compose exec api python manage.py migrate
```

### 5. Create Superuser
```bash
docker-compose exec api python manage.py createsuperuser
```

### 6. Access the Application
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/
- Nginx (if enabled): http://localhost/

## Docker Services

### 1. PostgreSQL Database (`db`)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: postgres_data
- **Credentials**: See docker-compose.yml

### 2. Redis Cache (`redis`)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Use**: Caching and Celery broker

### 3. Django API (`api`)
- **Build**: Custom Dockerfile
- **Port**: 8000
- **Volumes**: 
  - Source code
  - Static files
  - Media files

### 4. Celery Worker (`celery`)
- **Build**: Same as API
- **Purpose**: Background task processing
- **Optional**: Can be disabled if not needed

### 5. Celery Beat (`celery-beat`)
- **Build**: Same as API
- **Purpose**: Scheduled task execution
- **Optional**: Can be disabled if not needed

### 6. Nginx (`nginx`)
- **Image**: nginx:alpine
- **Port**: 80
- **Purpose**: Reverse proxy and static file serving
- **Optional**: For production use

## Common Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api

# Start with logs
docker-compose up
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api
```

### Execute Commands
```bash
# Django management commands
docker-compose exec api python manage.py <command>

# Shell access
docker-compose exec api bash

# Django shell
docker-compose exec api python manage.py shell

# Database shell
docker-compose exec db psql -U dsriding_user -d dsriding_db
```

### Rebuild Services
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build api

# Rebuild and restart
docker-compose up -d --build
```

## Database Management

### Backup Database
```bash
docker-compose exec db pg_dump -U dsriding_user dsriding_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U dsriding_user dsriding_db < backup.sql
```

### Reset Database
```bash
docker-compose exec api python manage.py flush
docker-compose exec api python manage.py migrate
```

## Environment Variables

Key environment variables in `.env`:

```bash
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_NAME=dsriding_db
DATABASE_USER=dsriding_user
DATABASE_PASSWORD=dsriding_password
DATABASE_HOST=db
DATABASE_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

## Production Deployment

### 1. Update Environment Variables
```bash
DEBUG=False
SECRET_KEY=<generate-strong-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### 2. Use Production Database
Update database credentials with production values.

### 3. Enable Nginx
Uncomment nginx service in docker-compose.yml

### 4. SSL/TLS Configuration
Add SSL certificates and update nginx.conf

### 5. Security Checklist
- [ ] Change SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_HOSTS
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Configure backups

## Scaling

### Scale Workers
```bash
docker-compose up -d --scale celery=3
```

### Scale API
```bash
docker-compose up -d --scale api=2
```

Note: You'll need a load balancer for multiple API instances.

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs api

# Check service status
docker-compose ps

# Restart service
docker-compose restart api
```

### Database Connection Issues
```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec api python manage.py dbshell
```

### Permission Issues
```bash
# Fix permissions
docker-compose exec api chown -R www-data:www-data /app/media
docker-compose exec api chown -R www-data:www-data /app/staticfiles
```

### Out of Memory
```bash
# Check resource usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
```

## Monitoring

### Health Checks
```bash
# API health
curl http://localhost:8000/api/

# Nginx health
curl http://localhost/health/

# Database health
docker-compose exec db pg_isready -U dsriding_user
```

### Resource Usage
```bash
docker stats
```

## Maintenance

### Update Images
```bash
docker-compose pull
docker-compose up -d
```

### Clean Up
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a --volumes
```

## Development Workflow

### 1. Make Code Changes
Edit files locally (they're mounted as volumes)

### 2. Restart Service
```bash
docker-compose restart api
```

### 3. Run Migrations
```bash
docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
```

### 4. Collect Static Files
```bash
docker-compose exec api python manage.py collectstatic --noinput
```

## Testing

### Run Tests
```bash
docker-compose exec api python manage.py test
```

### Run with Coverage
```bash
docker-compose exec api pytest --cov=apps
```

## Backup Strategy

### Automated Backups
Create a cron job:
```bash
0 2 * * * cd /path/to/project && docker-compose exec -T db pg_dump -U dsriding_user dsriding_db | gzip > backups/backup-$(date +\%Y\%m\%d).sql.gz
```

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check Docker resources
4. Review documentation

