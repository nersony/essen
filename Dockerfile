FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --no-frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci --legacy-peer-deps; \
  else \
    npm install --legacy-peer-deps; \
  fi

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3003

CMD ["sh", "-c", "npm run build && npm run start"]
