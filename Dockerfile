FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/app.db

# Start the application
CMD ["pnpm", "start"]
