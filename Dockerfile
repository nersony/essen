# Use official Node.js 18 Alpine base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy lock files and package manifest
COPY package.json ./
COPY package-lock.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and install dependencies based on lockfile presence
RUN corepack enable && corepack prepare pnpm@latest --activate && \
  if [ -f pnpm-lock.yaml ]; then \
    pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci --legacy-peer-deps; \
  else \
    npm install --legacy-peer-deps; \
  fi

# Copy application code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Set port and hostname
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

# Create non-root user and assign permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3003

# Build and run the application
CMD ["sh", "-c", "pnpm run build && pnpm run start"]
