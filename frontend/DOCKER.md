# Docker Setup for DSRiding Frontend

## Issue Resolution

### Problem
The original Docker build was failing with a TypeScript version conflict:
```
Could not resolve dependency:
peer typescript@">=5.9 <6.0" from @angular-devkit/build-angular@21.2.2
```

### Solution
1. **Updated TypeScript version** in `package.json` from `~5.6.2` to `~5.9.3`
2. **Added `--legacy-peer-deps`** flag to npm install in Dockerfile
3. **Installed Angular CLI globally** in the Docker image

## Docker Files

### 1. Dockerfile (Development)
For local development with hot reload:
```bash
docker build -t angular-dev -f Dockerfile .
docker run -p 4200:4200 angular-dev
```

### 2. Dockerfile.prod (Production)
Multi-stage build with Nginx for production:
```bash
docker build -t angular-prod -f Dockerfile.prod .
docker run -p 80:80 angular-prod
```

### 3. docker-compose.yml
Orchestrate the frontend service:
```bash
docker-compose up
```

## Quick Start

### Option 1: Docker Build & Run
```bash
# Build the image
docker build -t angular-dev -f Dockerfile .

# Run the container
docker run -p 4200:4200 -v $(pwd)/src:/app/src angular-dev

# Access the app
open http://localhost:4200
```

### Option 2: Docker Compose (Recommended)
```bash
# Start the service
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## Features

### Development Dockerfile
- ✅ Node.js 20 Alpine (lightweight)
- ✅ Angular CLI 21 installed globally
- ✅ Legacy peer deps support
- ✅ Hot reload ready
- ✅ Port 4200 exposed

### Production Dockerfile
- ✅ Multi-stage build (smaller image)
- ✅ Nginx for serving static files
- ✅ Production optimized build
- ✅ Port 80 exposed

### Docker Compose
- ✅ Volume mounting for hot reload
- ✅ Network configuration
- ✅ Environment variables
- ✅ Easy orchestration

## Volume Mounting

The docker-compose.yml mounts source files for hot reload:
```yaml
volumes:
  - ./src:/app/src              # Source code
  - ./angular.json:/app/angular.json
  - ./tsconfig.json:/app/tsconfig.json
  - /app/node_modules           # Prevent overwrite
```

## Environment Variables

Set in docker-compose.yml:
```yaml
environment:
  - NODE_ENV=development
```

## Troubleshooting

### Build fails with peer dependency errors
**Solution**: The Dockerfile now uses `--legacy-peer-deps` flag

### Changes not reflecting
**Solution**: Ensure volumes are mounted correctly in docker-compose.yml

### Port already in use
**Solution**: Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "4201:4200"  # Use 4201 instead
```

### Container exits immediately
**Solution**: Check logs with `docker-compose logs`

## Commands Reference

### Docker Build
```bash
# Development build
docker build -t angular-dev .

# Production build
docker build -t angular-prod -f Dockerfile.prod .

# Build with no cache
docker build --no-cache -t angular-dev .
```

### Docker Run
```bash
# Run development container
docker run -p 4200:4200 angular-dev

# Run with volume mount
docker run -p 4200:4200 -v $(pwd)/src:/app/src angular-dev

# Run in detached mode
docker run -d -p 4200:4200 angular-dev

# Run with custom name
docker run --name my-angular-app -p 4200:4200 angular-dev
```

### Docker Compose
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f angular-frontend

# Execute command in container
docker-compose exec angular-frontend sh
```

### Docker Management
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# List images
docker images

# Remove image
docker rmi angular-dev

# Clean up unused resources
docker system prune -a
```

## Integration with Backend

To connect with Django backend, update the network in docker-compose.yml:

```yaml
networks:
  dsriding-network:
    external: true  # Use existing network from backend
```

Or create a combined docker-compose.yml at the root level.

## Performance Tips

1. **Use .dockerignore** - Excludes unnecessary files from build context
2. **Layer caching** - Package files copied before source code
3. **Multi-stage builds** - Smaller production images
4. **Volume mounts** - Fast development with hot reload

## Next Steps

1. Build the image: `docker build -t angular-dev .`
2. Run with compose: `docker-compose up`
3. Access app: `http://localhost:4200`
4. Make changes and see hot reload in action!

