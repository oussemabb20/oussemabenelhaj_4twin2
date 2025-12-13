FROM node:20-bullseye

WORKDIR /app

# Install Chromium + required libs for ChromeHeadless
RUN apt-get update && apt-get install -y \
    chromium \
    libgbm1 \
    libx11-6 \
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

# Tell Puppeteer / Karma to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy dist
COPY dist ./dist

EXPOSE 4000

CMD ["node", "dist/oussemabenelhaj_4twin2/server/server.mjs"]
