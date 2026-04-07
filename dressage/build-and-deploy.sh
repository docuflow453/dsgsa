#!/bin/bash

# ============================================
# Dressage Backend - Docker Build & Deploy
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="dressage-backend"
CONTAINER_NAME="dressage-backend"
PORT="8000"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_info "No .env file found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_info "Please edit .env file with your configuration"
            read -p "Press enter to continue after editing .env file..."
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_success ".env file exists"
    fi
}

# Stop and remove existing container
cleanup() {
    print_header "Cleaning up existing container"
    
    if docker ps -a | grep -q $CONTAINER_NAME; then
        print_info "Stopping existing container..."
        docker stop $CONTAINER_NAME || true
        print_info "Removing existing container..."
        docker rm $CONTAINER_NAME || true
        print_success "Cleanup complete"
    else
        print_info "No existing container found"
    fi
}

# Build Docker image
build() {
    print_header "Building Docker image"
    
    print_info "Building $IMAGE_NAME:latest..."
    docker build -t $IMAGE_NAME:latest .
    
    print_success "Build complete!"
    
    # Show image size
    IMAGE_SIZE=$(docker images $IMAGE_NAME:latest --format "{{.Size}}")
    print_info "Image size: $IMAGE_SIZE"
}

# Run database migrations
migrate() {
    print_header "Running database migrations"
    
    print_info "Applying migrations..."
    docker run --rm \
        --env-file .env \
        $IMAGE_NAME:latest \
        python manage.py migrate
    
    print_success "Migrations complete!"
}

# Collect static files
collectstatic() {
    print_header "Collecting static files"
    
    print_info "Collecting static files..."
    docker run --rm \
        --env-file .env \
        -v $(pwd)/staticfiles:/app/staticfiles \
        $IMAGE_NAME:latest \
        python manage.py collectstatic --noinput
    
    print_success "Static files collected!"
}

# Run Docker container
run() {
    print_header "Starting container"
    
    print_info "Starting $CONTAINER_NAME on port $PORT..."
    docker run -d \
        --name $CONTAINER_NAME \
        --env-file .env \
        -p $PORT:8000 \
        -v $(pwd)/staticfiles:/app/staticfiles \
        -v $(pwd)/mediafiles:/app/mediafiles \
        --restart unless-stopped \
        $IMAGE_NAME:latest
    
    print_success "Container started!"
    
    # Wait for container to be healthy
    print_info "Waiting for container to be healthy..."
    sleep 5
    
    if docker ps | grep -q $CONTAINER_NAME; then
        print_success "Container is running"
    else
        print_error "Container failed to start"
        docker logs $CONTAINER_NAME
        exit 1
    fi
}

# Show container info
show_info() {
    print_header "Container Information"
    
    echo ""
    echo "📊 Container Status:"
    docker ps | grep $CONTAINER_NAME || echo "Container not running"

    echo ""
    echo "🌐 Access the application at:"
    echo "   API: http://localhost:$PORT/api/"
    echo "   Admin: http://localhost:$PORT/admin/"

    echo ""
    echo "🔍 Useful commands:"
    echo "   View logs:        docker logs -f $CONTAINER_NAME"
    echo "   Stop container:   docker stop $CONTAINER_NAME"
    echo "   Start container:  docker start $CONTAINER_NAME"
    echo "   Remove container: docker rm -f $CONTAINER_NAME"
    echo "   Shell access:     docker exec -it $CONTAINER_NAME sh"
    echo "   Run migrations:   docker exec $CONTAINER_NAME python manage.py migrate"
    echo "   Create superuser: docker exec -it $CONTAINER_NAME python manage.py createsuperuser"

    echo ""
}

# Main execution
main() {
    print_header "Dressage Backend - Docker Deployment"

    check_docker
    check_env
    cleanup
    build
    # migrate  # Uncomment if you want to run migrations during deployment
    # collectstatic  # Uncomment if you want to collect static files during deployment
    run
    show_info

    print_success "Deployment complete! 🎉"
    print_info "Visit http://localhost:$PORT/api/ to view the API"
}

# Run main function
main
