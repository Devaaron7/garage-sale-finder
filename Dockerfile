FROM node:18-slim

# Install Chrome and dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    unzip \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome and ChromeDriver using the official installation method
RUN echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    # Install the latest stable version of Chrome
    apt-get install -y google-chrome-stable && \
    # Get the installed Chrome version
    CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+') && \
    # Get the matching ChromeDriver version
    CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d. -f1) && \
    CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR_VERSION") && \
    # Install ChromeDriver
    wget -q "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" -O /tmp/chromedriver.zip && \
    unzip -o /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip && \
    # Verify installations
    echo "Chrome version: $(google-chrome --version)" && \
    echo "ChromeDriver version: $(chromedriver --version)" && \
    # Clean up
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV CHROME_BIN=/usr/bin/google-chrome \
    CHROME_PATH=/usr/bin/google-chrome \
    NODE_ENV=production \
    CHROMEDRIVER_PATH=/usr/local/bin/chromedriver

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm install; \
    fi

# Copy the rest of the app
COPY . .

# Build frontend (if needed)
RUN npm run build

# Expose app port
EXPOSE 10000

# Start your app
CMD ["node", "server/index.js"]
