# =========================
# Base builder image
# =========================
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json bun.lock turbo.json tsconfig.json ./
COPY packages ./packages
COPY apps ./apps

# Install dependencies (cached for monorepo)
RUN bun install --frozen-lockfile

# Build static apps
RUN bun run --filter @bunstack/auth build
RUN bun run --filter @bunstack/web build

# =========================
# Production runtime image
# =========================
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy API source and dependencies only
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy built static sites
COPY --from=builder /app/apps/auth/dist ./apps/api/public/auth
COPY --from=builder /app/apps/web/dist ./apps/api/public/web

# Expose API port
EXPOSE 3000

# Define environment
ENV NODE_ENV=production
ENV PORT=3000

# Run the API (Hono server serves static files)
CMD ["bun", "run", "--filter", "@bunstack/api", "start"]
