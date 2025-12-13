# Use Node 20 with Ubuntu base
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install Chromium and dependencies for ChromeHeadless/Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libx11-6 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libpango-1.0-0 \
    libharfbuzz0b \
    libfreetype6 \
    libnss3 \
    libxss1 \
    libglib2.0-0 \
    libgtk-3-0 \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Optional: tell Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the built Angular app (dist folder)
COPY dist ./dist

# Expose the port your app uses
EXPOSE 4000

# Start your server
CMD ["node", "dist/oussemabenelhaj_4twin2/server/server.mjs"]
