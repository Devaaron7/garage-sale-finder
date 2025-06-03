# Use a pre-built image with Node.js and Chrome
FROM browserless/chrome:1.61-chrome-stable

# Set environment variables
ENV CHROME_BIN=/usr/bin/google-chrome \
    CHROME_PATH=/usr/bin/google-chrome \
    NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

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

# Use dumb-init as init system to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Set NODE_OPTIONS for better performance
ENV NODE_OPTIONS="--max-old-space-size=512"

# Start your app
CMD ["node", "server/index.js"]
