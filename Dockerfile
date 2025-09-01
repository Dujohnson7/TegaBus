# Multi-stage build for TegaBus - Combined Frontend & Backend
FROM node:18-alpine AS frontend-builder

# Build TegaBus (Vite React app)
WORKDIR /app/tegabus
COPY frontend/tegabus/package*.json ./
RUN npm ci
COPY frontend/tegabus/ ./
RUN chmod +x node_modules/.bin/* && npm run build

# Build TegaPortal (React app) with correct base path
WORKDIR /app/tegaportal
COPY frontend/tegaPortal/package*.json ./
RUN npm ci
COPY frontend/tegaPortal/ ./
# Set the homepage for proper asset paths
RUN echo '{ "homepage": "/admin" }' > package.json.tmp && \
    cat package.json >> package.json.tmp && \
    mv package.json.tmp package.json && \
    chmod +x node_modules/.bin/* && npx react-scripts build

# Backend build stage
FROM openjdk:17-jdk-slim AS backend-builder
WORKDIR /app
COPY backend/tegabus_server/pom.xml ./
COPY backend/tegabus_server/src ./src
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Final combined image
FROM openjdk:17-jdk-slim

# Install nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend JAR
COPY --from=backend-builder /app/target/tegabus_server-0.0.1-SNAPSHOT.jar ./app.jar

# Copy frontend builds
COPY --from=frontend-builder /app/tegabus/dist /var/www/tegabus
COPY --from=frontend-builder /app/tegaportal/build /var/www/tegaportal

# Create nginx configuration
RUN mkdir -p /var/www/uploads && \
    rm -f /etc/nginx/sites-enabled/default

# Copy nginx config
COPY nginx.conf /etc/nginx/sites-enabled/tegabus

# Create startup script
RUN echo '#!/bin/bash' > /start.sh && \
    echo 'nginx -g "daemon on;"' >> /start.sh && \
    echo 'java -jar /app/app.jar --server.port=5000' >> /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE 80

# Create uploads directory
RUN mkdir -p /var/www/uploads

# Start both nginx and Spring Boot
CMD ["/start.sh"]