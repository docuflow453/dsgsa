#!/bin/bash

# ============================================
# Dressage Frontend - Docker Build & Deploy
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="dressage-frontend"
CONTAINER_NAME="dressage-frontend"
PORT="4200"

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

# Run Docker container
run() {
    print_header "Starting container"
    
    print_info "Starting $CONTAINER_NAME on port $PORT..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:80 \
        --restart unless-stopped \
        $IMAGE_NAME:latest
    
    print_success "Container started!"
    
    # Wait for container to be healthy
    print_info "Waiting for container to be healthy..."
    sleep 3
    
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
    echo "   http://localhost:$PORT"
    
    echo ""
    echo "🔍 Useful commands:"
    echo "   View logs:        docker logs -f $CONTAINER_NAME"
    echo "   Stop container:   docker stop $CONTAINER_NAME"
    echo "   Start container:  docker start $CONTAINER_NAME"
    echo "   Remove container: docker rm -f $CONTAINER_NAME"
    echo "   Shell access:     docker exec -it $CONTAINER_NAME sh"
    
    echo ""
}

# Main execution
main() {
    print_header "Dressage Frontend - Docker Deployment"
    
    check_docker
    cleanup
    build
    run
    show_info
    
    print_success "Deployment complete! 🎉"
    print_info "Visit http://localhost:$PORT to view the application"
}

# Run main function
main

