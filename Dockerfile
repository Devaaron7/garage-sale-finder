FROM node:18-alpine

# Install Chrome and ChromeDriver
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    yarn

# Set Chrome binary location
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 10000

# Start the application
CMD ["node", "server/index.js"]