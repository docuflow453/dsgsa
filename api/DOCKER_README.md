# Docker Setup for Dressage Competition Management System

## 🚀 Quick Start

### Development Environment

```bash
# Start development environment
make dev

# Run migrations
make migrate

# Create superuser
make createsuperuser

# View logs
make logs
```

Access the application:
- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/

### Production Environment

```bash
# Start production environment
make prod
```

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (Port 80)                     │
│                   Reverse Proxy                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Django API (Port 8000)                     │
│           Gunicorn + Django REST Framework              │
└────┬──────────────────────────────────────────┬─────────┘
     │                                          │
┌────▼──────────────────┐          ┌───────────▼─────────┐
│  PostgreSQL (5432)    │          │   Redis (6379)      │
│    Database           │          │  Cache & Broker     │
└───────────────────────┘          └─────────────────────┘
                                            │
                     ┌──────────────────────┴──────────────┐
                     │                                     │
          ┌──────────▼──────────┐           ┌─────────────▼────────┐
          │  Celery Worker      │           │  Celery Beat         │
          │  Background Tasks   │           │  Scheduled Tasks     │
          └─────────────────────┘           └──────────────────────┘
```

## 📦 Services

### Core Services

1. **db** - PostgreSQL 15 database
2. **redis** - Redis cache and message broker
3. **api** - Django REST API

### Optional Services

4. **celery** - Background task worker
5. **celery-beat** - Scheduled task scheduler
6. **nginx** - Reverse proxy and static file server

## 🛠️ Available Commands

### Using Makefile (Recommended)

```bash
make help              # Show all available commands
make build             # Build Docker images
make up                # Start all services
make down              # Stop all services
make restart           # Restart services
make logs              # View logs
make shell             # Django shell
make bash              # Container bash
make migrate           # Run migrations
make makemigrations    # Create migrations
make createsuperuser   # Create admin user
make test              # Run tests
make clean             # Remove containers and volumes
```

### Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d

# View logs
docker-compose logs -f api

# Execute commands
docker-compose exec api python manage.py <command>
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Key variables:
- `DEBUG` - Enable/disable debug mode
- `SECRET_KEY` - Django secret key
- `DATABASE_*` - Database configuration
- `ALLOWED_HOSTS` - Allowed hostnames
- `CORS_ALLOWED_ORIGINS` - CORS origins

### Docker Compose Files

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration

## 📊 Database Management

### Backup Database
```bash
make db-backup
# or
docker-compose exec db pg_dump -U dsriding_user dsriding_db > backup.sql
```

### Restore Database
```bash
make db-restore
# or
docker-compose exec -T db psql -U dsriding_user dsriding_db < backup.sql
```

### Access Database Shell
```bash
make db-shell
# or
docker-compose exec db psql -U dsriding_user -d dsriding_db
```

## 🔍 Monitoring

### View Service Status
```bash
make ps
# or
docker-compose ps
```

### View Resource Usage
```bash
make stats
# or
docker stats
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

## 🚨 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs api

# Rebuild
docker-compose build --no-cache api
docker-compose up -d
```

### Database Connection Error

```bash
# Check database is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Permission Issues

```bash
# Fix permissions
docker-compose exec api chown -R www-data:www-data /app/media
docker-compose exec api chown -R www-data:www-data /app/staticfiles
```

### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

## 🔐 Security

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Configure automated backups
- [ ] Review CORS settings
- [ ] Enable security headers

## 📈 Scaling

### Scale Workers
```bash
docker-compose up -d --scale celery=3
```

### Scale API (requires load balancer)
```bash
docker-compose up -d --scale api=2
```

## 🧹 Cleanup

### Remove Containers
```bash
make down
```

### Remove Containers and Volumes
```bash
make clean
```

### Remove All Docker Resources
```bash
make prune
```

## 📚 Additional Resources

- [Docker Guide](DOCKER_GUIDE.md) - Comprehensive Docker documentation
- [Quick Start](QUICKSTART.md) - Quick start guide
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Full implementation details
- [Migration Guide](MIGRATION_GUIDE.md) - Database migration instructions

## 💡 Tips

1. **Development**: Use `docker-compose.dev.yml` for auto-reload
2. **Production**: Use `docker-compose.yml` with Gunicorn
3. **Logs**: Always check logs when debugging
4. **Backups**: Set up automated database backups
5. **Monitoring**: Use `docker stats` to monitor resources
6. **Updates**: Regularly update Docker images

## 🆘 Support

For issues:
1. Check logs: `make logs`
2. Review environment variables
3. Verify Docker resources
4. Consult documentation
5. Check Docker and Docker Compose versions

## 📝 License

This project is part of the Dressage Competition Management System.

