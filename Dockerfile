FROM node:20-alpine

# Install dependencies for Puppeteer / Chrome
RUN apk add --no-cache \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    chromium \
    nss \
    atk \
    atk-bridge \
    cups-libs \
    libxcomposite \
    libxrandr \
    libxdamage \
    pango \
    cairo \
    bash \
    libgbm \
    alsa-lib \
    libxkbfile \
    libx11

# Set Chromium executable path for Puppeteer (optional)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY dist ./dist

EXPOSE 4000

CMD ["node", "dist/oussemabenelhaj_4twin2/server/server.mjs"]
