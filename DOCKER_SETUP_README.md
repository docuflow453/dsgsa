# Dressage Full-Stack Docker Deployment

Complete Docker setup for the Dressage South Africa application - Django backend + Angular frontend.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx Proxy                          │
│                    (Port 80/443)                            │
│                   nginx:alpine                              │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             │ /                        │ /api, /admin, /static
             │                          │
    ┌────────▼────────┐        ┌────────▼────────┐
    │   Frontend      │        │    Backend      │
    │   Container     │        │   Container     │
    │                 │        │                 │
    │   Angular 21    │        │  Django 5.2     │
    │   + Nginx       │        │  + Gunicorn     │
    │   Port: 80      │        │  Port: 8000     │
    └─────────────────┘        └────────┬────────┘
                                        │
                               ┌────────┴────────┐
                               │                 │
                      ┌────────▼────────┐ ┌──────▼──────┐
                      │   PostgreSQL    │ │    Redis    │
                      │   Database      │ │Cache/Broker │
                      │   Port: 5432    │ │ Port: 6379  │
                      └─────────────────┘ └──────┬──────┘
                                                │
                                       ┌────────▼────────┐
                                       │  Celery Worker  │
                                       │  + Celery Beat  │
                                       └─────────────────┘
```

---

## 📦 Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **nginx** | nginx:alpine | 80, 443 | Reverse proxy & load balancer |
| **frontend** | dressage-frontend | 4200 | Angular SPA (internal) |
| **backend** | dressage-backend | 8000 | Django API (internal) |
| **db** | postgres:15-alpine | 5432 | PostgreSQL database |
| **redis** | redis:7-alpine | 6379 | Cache & Celery broker |
| **celery** | dressage-backend | - | Background task worker |
| **celery-beat** | dressage-backend | - | Scheduled task scheduler |

---

## 🚀 Quick Start

### 1. Prerequisites

- Docker 20.10+
- Docker Compose v2.0+

```bash
docker --version
docker-compose --version
```

### 2. Clone and Configure

```bash
# Clone repository
git clone <repository-url>
cd dsriding

# Create environment file
cp .env.example .env

# Edit with your configuration
nano .env
```

### 3. Deploy All Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec -it backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### 5. Access the Application

- **Frontend:** http://localhost (port 80)
- **Backend API:** http://localhost/api/
- **Admin Panel:** http://localhost/admin/
- **API Health:** http://localhost/api/health

---

## 📁 Project Structure

```
dsriding/
├── docker-compose.yml          # Full-stack orchestration
├── .env.example                # Environment variables template
├── .env                        # Your configuration (create this)
│
├── dressage/                   # Backend (Django)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── build-and-deploy.sh
│   ├── requirements.txt
│   ├── manage.py
│   ├── DOCKER_DEPLOYMENT.md    # Backend deployment guide
│   └── ...
│
├── frontend/                   # Frontend (Angular)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── build-and-deploy.sh
│   ├── docker-compose.yml
│   ├── DOCKER_DEPLOYMENT.md    # Frontend deployment guide
│   ├── DOCKER_QUICK_START.md
│   └── ...
│
└── nginx/                      # Global Nginx proxy
    ├── nginx.conf
    └── conf.d/
        └── dressage.conf       # Routing configuration
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Database
DATABASE_NAME=dressage_db
DATABASE_USER=dressage_user
DATABASE_PASSWORD=your-secure-password

# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,your-domain.com

# CORS
CORS_ALLOWED_ORIGINS=http://localhost,https://your-domain.com
```

### Generate Secret Key

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

## 🔄 Common Operations

### Start/Stop Services

```bash
# Start all
docker-compose up -d

# Stop all
docker-compose stop

# Restart specific service
docker-compose restart backend

# Remove all (keeps volumes)
docker-compose down

# Remove all (including volumes)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands

```bash
# Django management commands
docker-compose exec backend python manage.py <command>

# Database shell
docker-compose exec backend python manage.py dbshell

# PostgreSQL shell
docker-compose exec db psql -U dressage_user dressage_db

# Backend shell access
docker-compose exec backend sh

# Frontend shell access
docker-compose exec frontend sh
```

---

## 📚 Detailed Documentation

- **Backend Deployment:** [dressage/DOCKER_DEPLOYMENT.md](dressage/DOCKER_DEPLOYMENT.md)
- **Frontend Deployment:** [frontend/DOCKER_DEPLOYMENT.md](frontend/DOCKER_DEPLOYMENT.md)
- **Frontend Quick Reference:** [frontend/DOCKER_QUICK_START.md](frontend/DOCKER_QUICK_START.md)

---

## 🔍 Health Checks

```bash
# Global health
curl http://localhost/health

# Backend API
curl http://localhost/api/health
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:4200/health

# Database
docker-compose exec db pg_isready -U dressage_user

# Redis
docker-compose exec redis redis-cli ping
```

---

## 🛠️ Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Wait for database to be ready
docker-compose exec db pg_isready -U dressage_user
```

### Nginx 502 Bad Gateway

```bash
# Check backend is running
docker-compose ps backend

# Check backend health
curl http://backend:8000/api/health

# Restart nginx
docker-compose restart nginx

# Check nginx logs
docker-compose logs nginx
```

---

## 🚀 Production Deployment

1. **Update .env with production values**
2. **Enable HTTPS in nginx configuration**
3. **Set DJANGO_DEBUG=False**
4. **Use strong passwords**
5. **Configure domain in ALLOWED_HOSTS**
6. **Set up SSL certificates**
7. **Configure backups**
8. **Set up monitoring**

---

## 📊 Monitoring

```bash
# Container stats
docker stats

# Specific container
docker stats dressage-backend

# Disk usage
docker system df

# Inspect container
docker inspect dressage-backend
```

---

## 🧹 Cleanup

```bash
# Remove stopped containers
docker-compose down

# Remove images
docker rmi dressage-backend dressage-frontend

# Remove volumes
docker volume rm dsriding_postgres_data dsriding_redis_data

# Clean everything
docker system prune -a --volumes
```

---

## ✅ Success Criteria

After deployment, verify:

- [ ] All containers running: `docker-compose ps`
- [ ] Frontend accessible: http://localhost
- [ ] Backend API working: http://localhost/api/health
- [ ] Admin panel accessible: http://localhost/admin/
- [ ] Database connected: `docker-compose exec backend python manage.py check --database default`
- [ ] Static files served correctly
- [ ] Login functionality works
- [ ] No errors in logs

---

**Your Dressage application is now fully dockerized! 🎉**

For detailed service-specific information, see the individual deployment guides.
