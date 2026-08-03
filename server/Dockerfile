# Use the official Microsoft Playwright image which includes all browser binaries
FROM mcr.microsoft.com/playwright:v1.62.1-jammy as base

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy source code and build config
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# Expose server port
EXPOSE 3001

# Run the app
ENV NODE_ENV=production
CMD ["npm", "start"]
