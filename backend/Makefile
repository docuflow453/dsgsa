.PHONY: help build up down restart logs shell bash migrate makemigrations createsuperuser collectstatic test clean dev prod db-backup db-restore compile-requirements

help:
	@echo "Available commands:"
	@echo "  make help           - Show this help message"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View logs"
	@echo "  make shell          - Open Django shell"
	@echo "  make bash           - Open container bash"
	@echo "  make migrate        - Run database migrations"
	@echo "  make makemigrations - Create new migrations"
	@echo "  make createsuperuser - Create Django superuser"
	@echo "  make collectstatic  - Collect static files"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Remove containers and volumes"
	@echo "  make dev            - Start development environment"
	@echo "  make prod           - Start production environment"
	@echo "  make db-backup      - Backup database"
	@echo "  make db-restore     - Restore database from backup"
	@echo "  make compile-requirements - Compile requirements.in to requirements.txt"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-celery:
	docker-compose logs -f celery

shell:
	docker-compose exec api python manage.py shell

bash:
	docker-compose exec api bash

migrate:
	docker-compose exec api python manage.py migrate

makemigrations:
	docker-compose exec api python manage.py makemigrations

createsuperuser:
	docker-compose exec api python manage.py createsuperuser

collectstatic:
	docker-compose exec api python manage.py collectstatic --noinput

test:
	docker-compose exec api pytest

test-coverage:
	docker-compose exec api pytest --cov=. --cov-report=html

clean:
	docker-compose down -v
	docker system prune -f

dev:
	docker-compose -f docker-compose.dev.yml up -d --build
	@echo "Development environment started!"
	@echo "API: http://localhost:8000"
	@echo "Run 'make migrate' to apply migrations"
	@echo "Run 'make createsuperuser' to create admin user"

prod:
	docker-compose up -d --build
	docker-compose exec api python manage.py migrate
	docker-compose exec api python manage.py collectstatic --noinput
	@echo "Production environment started!"
	@echo "API: http://localhost:8000"

# Database commands
db-backup:
	docker-compose exec db pg_dump -U backend_user backend_db > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created"

db-restore:
	@read -p "Enter backup file name: " file; \
	docker-compose exec -T db psql -U backend_user backend_db < $$file

# Development utilities
compile-requirements:
	docker-compose exec api pip-compile requirements.in

format:
	docker-compose exec api black .

lint:
	docker-compose exec api flake8 .

# Service-specific commands
celery-logs:
	docker-compose logs -f celery

celery-restart:
	docker-compose restart celery

redis-cli:
	docker-compose exec redis redis-cli

db-shell:
	docker-compose exec db psql -U backend_user -d backend_db

# Container inspection
ps:
	docker-compose ps

stats:
	docker stats

