# Build stage
FROM node:20-bullseye-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (needed for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-bullseye-slim

WORKDIR /app

# Install Chromium + required libs for ChromeHeadless (optimized list)
RUN apt-get update && apt-get install -y \
    chromium \
    libgbm1 \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apt/*

# Tell Puppeteer / Karma to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built dist from build stage
COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/oussemabenelhaj_4twin2/server/server.mjs"]