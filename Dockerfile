FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy dependency definitions
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --no-frozen-lockfile; \
  else npm i --legacy-peer-deps; \
  fi

# Copy app source
COPY . .

# Environment variables (can be overridden by CapRover)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose app port
EXPOSE 3001

# Runtime build + start command
CMD ["sh", "-c", "npm run build && npm run start"]
