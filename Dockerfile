# ---- Stage 1: Build the React app (works for CRA or Vite) ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --silent

# Build
COPY . .
# If your build script is named something else, change BUILD_CMD
ARG BUILD_CMD=build
RUN npm run $BUILD_CMD

# Normalize output: if build output is "dist", rename it to "build"
RUN if [ -d /app/dist ]; then mv /app/dist /app/build; fi

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Copy static files
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]