.PHONY: help build up down restart logs shell migrate makemigrations createsuperuser test clean

help:
	@echo "Available commands:"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View logs"
	@echo "  make shell          - Access Django shell"
	@echo "  make bash           - Access container bash"
	@echo "  make migrate        - Run database migrations"
	@echo "  make makemigrations - Create new migrations"
	@echo "  make createsuperuser - Create Django superuser"
	@echo "  make collectstatic  - Collect static files"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Remove containers and volumes"
	@echo "  make dev            - Start development environment"
	@echo "  make prod           - Start production environment"

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
	docker-compose exec api python manage.py test

clean:
	docker-compose down -v
	docker system prune -f

dev:
	docker-compose -f docker-compose.dev.yml up -d
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
	docker-compose exec db pg_dump -U dsriding_user dsriding_db > backup_$$(date +%Y%m%d_%H%M%S).sql

db-restore:
	@read -p "Enter backup file name: " file; \
	docker-compose exec -T db psql -U dsriding_user dsriding_db < $$file

db-shell:
	docker-compose exec db psql -U dsriding_user -d dsriding_db

# Monitoring
stats:
	docker stats

ps:
	docker-compose ps

# Cleanup
prune:
	docker system prune -a --volumes -f

