# ========================================
# Stage 1: Build the Angular application
# ========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Use --legacy-peer-deps if you have peer dependency issues
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular app for production
# This will create the dist/ folder with optimized production build
RUN npm run build -- --configuration production

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
# Angular CLI outputs to dist/ by default (as per angular.json)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

