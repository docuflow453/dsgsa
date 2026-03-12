# Use a recent, stable Node.js image as the base for development
# node:20-alpine is a lightweight choice compatible with Angular 21
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) first
# This allows Docker to cache dependencies and avoid reinstalling them if source code changes
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli@21

# Install application dependencies with legacy peer deps to handle any conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Expose the port Angular development server runs on (default 4200)
EXPOSE 4200

# Command to run the Angular application in development mode
# --host 0.0.0.0 makes the server accessible from outside the container
CMD ["ng", "serve", "--host", "0.0.0.0"]