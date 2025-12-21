# Use Node.js 18 LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including production keys if needed, but here we just need dependencies)
# We use --legacy-peer-deps because of the Motia beta/peer dependency mismatches seen earlier
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port Motia runs on (default 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
