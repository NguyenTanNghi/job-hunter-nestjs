# Stage 1: Build source code
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm install --legacy-peer-deps

# Copy entire source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy built application and static assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views

# Set environment
ENV NODE_ENV=production

# Expose port (default 8000)
EXPOSE 8000

# Start production server
CMD ["node", "dist/main"]
