# Docker Deployment Guide - Dressage Frontend

This guide explains how to build and deploy the Angular frontend using Docker.

## 📋 Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 1.29+)
- At least 2GB of available disk space

## 🏗️ Architecture

The Docker setup uses a **multi-stage build**:

1. **Stage 1 (Builder)**: Builds the Angular application
   - Base image: `node:20-alpine`
   - Installs dependencies with `npm ci`
   - Builds production bundle with `ng build --configuration production`
   - Output: Optimized files in `dist/` folder

2. **Stage 2 (Serve)**: Serves the built app with Nginx
   - Base image: `nginx:alpine`
   - Copies built files from Stage 1
   - Configures Nginx for SPA routing
   - Exposes port 80

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at: **http://localhost:4200**

### Option 2: Using Docker Commands

```bash
# Build the image
docker build -t dressage-frontend:latest .

# Run the container
docker run -d \
  --name dressage-frontend \
  -p 4200:80 \
  dressage-frontend:latest

# View logs
docker logs -f dressage-frontend

# Stop and remove container
docker stop dressage-frontend
docker rm dressage-frontend
```

## 🔧 Build Process Explained

### Stage 1: Build Angular App

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production
```

**What happens:**
- Copies package files first (for Docker layer caching)
- Installs dependencies (only production deps for final image)
- Copies source code
- Builds Angular app with production optimizations
- Creates `dist/` folder with minified, tree-shaken bundles

### Stage 2: Serve with Nginx

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**What happens:**
- Uses lightweight Nginx Alpine image
- Copies custom Nginx config for SPA routing
- Copies built files from Stage 1
- Exposes port 80
- Starts Nginx in foreground mode

## 📂 File Structure

```
frontend/
├── Dockerfile              # Multi-stage build configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf             # Nginx server configuration
├── .dockerignore          # Files to exclude from build context
└── dist/                  # Build output (created during build)
```

## ⚙️ Configuration Files

### nginx.conf

Configures Nginx to:
- ✅ Serve Angular SPA with proper routing (`try_files`)
- ✅ Enable Gzip compression
- ✅ Add security headers
- ✅ Cache static assets (1 year)
- ✅ Never cache `index.html` (ensures updates are served)
- ✅ Health check endpoint at `/health`

### .dockerignore

Excludes from build context:
- `node_modules/` (will be installed fresh)
- `dist/` (will be generated during build)
- IDE files, logs, temp files
- Documentation files

## 🔍 Advanced Usage

### Custom Port Mapping

```bash
# Run on port 8080 instead of 4200
docker run -d -p 8080:80 dressage-frontend:latest
```

### Build with Custom Configuration

```bash
# Build with build arguments
docker build \
  --build-arg NODE_ENV=production \
  -t dressage-frontend:v1.0.0 \
  .

# Build without cache (clean build)
docker build --no-cache -t dressage-frontend:latest .
```

### View Container Logs

```bash
# Follow logs (Docker Compose)
docker-compose logs -f frontend

# Follow logs (Docker)
docker logs -f dressage-frontend

# View last 100 lines
docker logs --tail 100 dressage-frontend
```

### Access Container Shell

```bash
# Docker Compose
docker-compose exec frontend sh

# Docker
docker exec -it dressage-frontend sh
```

### Inspect Build

```bash
# List files in container
docker run --rm dressage-frontend:latest ls -la /usr/share/nginx/html

# Check Nginx config
docker run --rm dressage-frontend:latest cat /etc/nginx/conf.d/default.conf
```

## 🧪 Testing

### Health Check

```bash
# Check if container is healthy
docker ps

# Test health endpoint
curl http://localhost:4200/health
# Expected response: "healthy"
```

### Test Application

```bash
# Access the app
open http://localhost:4200

# Or with curl
curl http://localhost:4200
```

## 🚢 Production Deployment

### Using Docker Registry

```bash
# Tag image for registry
docker tag dressage-frontend:latest myregistry.com/dressage-frontend:latest

# Push to registry
docker push myregistry.com/dressage-frontend:latest

# Pull and run on server
docker pull myregistry.com/dressage-frontend:latest
docker run -d -p 80:80 myregistry.com/dressage-frontend:latest
```

### Using Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag dressage-frontend:latest username/dressage-frontend:latest

# Push to Docker Hub
docker push username/dressage-frontend:latest

# Pull on server
docker pull username/dressage-frontend:latest
```

### Environment Variables

If you need to pass environment variables at runtime:

**Note:** Angular environment files are compiled during build, so you can't change them at runtime. For dynamic configuration, consider:

1. **Build-time variables** (recommended):
   ```bash
   docker build --build-arg API_URL=https://api.example.com -t frontend .
   ```

2. **Runtime configuration file**:
   Mount a config file at runtime:
   ```bash
   docker run -v ./config.json:/usr/share/nginx/html/assets/config.json frontend
   ```

## 🔒 Security Best Practices

### 1. Use Non-Root User (Enhanced Dockerfile)

```dockerfile
# Add to Dockerfile after COPY --from=builder
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /usr/share/nginx/html

USER nginx
```

### 2. Scan for Vulnerabilities

```bash
# Scan image with Docker Scout
docker scout cves dressage-frontend:latest

# Or with Trivy
trivy image dressage-frontend:latest
```

### 3. Keep Base Images Updated

```bash
# Pull latest base images
docker pull node:20-alpine
docker pull nginx:alpine

# Rebuild
docker build --no-cache -t dressage-frontend:latest .
```

## 📊 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats dressage-frontend

# One-time stats
docker stats --no-stream dressage-frontend
```

### Disk Usage

```bash
# Check image size
docker images dressage-frontend

# Check container disk usage
docker ps -s
```

## 🐛 Troubleshooting

### Build Fails

**Problem:** `npm ci` fails with peer dependency errors

**Solution:**
```bash
# Use --legacy-peer-deps flag (already in Dockerfile)
# Or try --force
RUN npm install --force
```

**Problem:** Out of memory during build

**Solution:**
```bash
# Increase Docker memory limit
# Docker Desktop > Settings > Resources > Memory > 4GB+
```

### Container Starts But App Not Accessible

**Problem:** Can't access http://localhost:4200

**Solution:**
```bash
# Check if container is running
docker ps

# Check if port is mapped correctly
docker port dressage-frontend

# Check logs for errors
docker logs dressage-frontend

# Check if port 4200 is already in use
lsof -i :4200
```

### 404 Errors on Angular Routes

**Problem:** Refreshing page returns 404

**Solution:**
- Ensure `nginx.conf` has `try_files $uri $uri/ /index.html;`
- This is already configured in the provided `nginx.conf`

### Stale Cache Issues

**Problem:** Changes not reflecting after rebuild

**Solution:**
```bash
# Clear browser cache
# Or use incognito mode

# Ensure index.html is not cached (nginx.conf handles this)
# Check nginx.conf has:
location = /index.html {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

## 📈 Performance Optimization

### Image Size Optimization

Current setup already optimized:
- ✅ Multi-stage build (only production files in final image)
- ✅ Alpine Linux base images (minimal size)
- ✅ Excludes `node_modules` from final image
- ✅ Uses npm ci (faster, deterministic installs)

**Expected image size:** ~50-80MB (depending on app size)

### Build Speed Optimization

```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build -t dressage-frontend:latest .

# Use Docker layer caching
# Package files are copied first, so dependencies layer is cached
# if package.json hasn't changed
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          cd frontend
          docker build -t dressage-frontend:${{ github.sha }} .
          docker tag dressage-frontend:${{ github.sha }} dressage-frontend:latest

      - name: Push to registry
        run: |
          docker push dressage-frontend:latest
```

## ✅ Success Criteria

After deployment, verify:

- [x] Container is running: `docker ps`
- [x] Health check passes: `curl http://localhost:4200/health`
- [x] App loads: `curl http://localhost:4200`
- [x] Angular routes work: Navigate to `/my/profile`, `/auth/login`
- [x] Static assets load: Check browser DevTools Network tab
- [x] No console errors in browser
- [x] Gzip compression active: Check response headers
- [x] Security headers present: Check response headers

## 📞 Support

For issues or questions:
- Check logs: `docker logs dressage-frontend`
- Check container status: `docker ps -a`
- Verify Nginx config: `docker exec dressage-frontend cat /etc/nginx/conf.d/default.conf`

---

**Happy Deploying! 🚀**

