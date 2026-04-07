# Docker Quick Start - Dressage Frontend

Quick reference for common Docker operations.

## 🚀 One-Command Deploy

```bash
./build-and-deploy.sh
```

This will:
1. ✅ Check if Docker is running
2. ✅ Stop and remove existing container
3. ✅ Build fresh Docker image
4. ✅ Start container on port 4200
5. ✅ Display access information

---

## 📋 Common Commands

### Build

```bash
# Build image
docker build -t dressage-frontend:latest .

# Build without cache (clean build)
docker build --no-cache -t dressage-frontend:latest .

# Build with Docker Compose
docker-compose build
```

### Run

```bash
# Run container (port 4200)
docker run -d --name dressage-frontend -p 4200:80 dressage-frontend:latest

# Run with Docker Compose
docker-compose up -d

# Run on different port (e.g., 8080)
docker run -d --name dressage-frontend -p 8080:80 dressage-frontend:latest
```

### Stop/Start

```bash
# Stop container
docker stop dressage-frontend

# Start container
docker start dressage-frontend

# Restart container
docker restart dressage-frontend

# Stop with Docker Compose
docker-compose stop
```

### Remove

```bash
# Remove container
docker rm dressage-frontend

# Force remove (stop + remove)
docker rm -f dressage-frontend

# Remove image
docker rmi dressage-frontend:latest

# Remove with Docker Compose
docker-compose down
```

### Logs

```bash
# View logs (follow)
docker logs -f dressage-frontend

# View last 100 lines
docker logs --tail 100 dressage-frontend

# View logs with Docker Compose
docker-compose logs -f
```

### Inspect

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Check container status
docker inspect dressage-frontend

# View container stats
docker stats dressage-frontend
```

### Shell Access

```bash
# Access container shell
docker exec -it dressage-frontend sh

# Run command in container
docker exec dressage-frontend ls -la /usr/share/nginx/html
```

---

## 🔍 Troubleshooting

### Container won't start

```bash
# Check logs
docker logs dressage-frontend

# Check if port is in use
lsof -i :4200

# Try different port
docker run -d -p 8080:80 dressage-frontend:latest
```

### Build fails

```bash
# Clean rebuild
docker build --no-cache -t dressage-frontend:latest .

# Check Docker disk space
docker system df

# Clean up unused resources
docker system prune -a
```

### App not accessible

```bash
# Check if container is running
docker ps | grep dressage-frontend

# Check port mapping
docker port dressage-frontend

# Test health endpoint
curl http://localhost:4200/health
```

---

## 📦 Image Management

```bash
# List images
docker images

# Tag image
docker tag dressage-frontend:latest dressage-frontend:v1.0.0

# Save image to file
docker save dressage-frontend:latest > dressage-frontend.tar

# Load image from file
docker load < dressage-frontend.tar

# Push to registry
docker push myregistry.com/dressage-frontend:latest
```

---

## 🧹 Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a

# Remove specific container and image
docker rm -f dressage-frontend
docker rmi dressage-frontend:latest
```

---

## ✅ Quick Test

After deployment, verify everything works:

```bash
# 1. Check container is running
docker ps | grep dressage-frontend

# 2. Test health endpoint
curl http://localhost:4200/health
# Expected: "healthy"

# 3. Test app loads
curl -I http://localhost:4200
# Expected: HTTP/1.1 200 OK

# 4. Open in browser
open http://localhost:4200
```

---

## 📚 More Information

- Full deployment guide: [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
- Dockerfile: [Dockerfile](./Dockerfile)
- Nginx config: [nginx.conf](./nginx.conf)
- Docker Compose: [docker-compose.yml](./docker-compose.yml)

