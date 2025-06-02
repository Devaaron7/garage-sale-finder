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

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && CHROME_VERSION=$(google-chrome --version | grep -o '[0-9.]*') \
    && echo "Chrome version: $CHROME_VERSION" \
    && rm -rf /var/lib/apt/lists/*

# Install ChromeDriver with version 137.0.7151.68 to match Chrome
RUN CHROMEDRIVER_VERSION="137.0.7151.68" \
    && echo "Using ChromeDriver version: $CHROMEDRIVER_VERSION" \
    && wget -q "https://storage.googleapis.com/chrome-for-testing-public/137.0.7151.68/linux64/chromedriver-linux64.zip" -O /tmp/chromedriver.zip \
    && unzip -o /tmp/chromedriver.zip -d /tmp/ \
    && mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/ \
    && chmod +x /usr/local/bin/chromedriver \
    && rm -rf /tmp/chromedriver.zip /tmp/chromedriver-linux64 \
    && echo "ChromeDriver version: $(chromedriver --version || echo 'ChromeDriver installation failed')"

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
