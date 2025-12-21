# Use Node.js 22 Slim (Debian-based) to ensure better binary compatibility
FROM node:22-slim

# Install system dependencies required for potential native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    redis-server \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Enable detailed logs to debug startup issues
ENV REDIS_MEMORY_SERVER_DEBUG=1

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Fix permissions
RUN chmod -R +x node_modules/.bin

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "run", "start"]
