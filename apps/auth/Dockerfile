# --- Build stage ---
FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run build --filter=@bunstack/auth...

# --- Serve stage ---
FROM nginx:stable-alpine

COPY --from=builder /app/apps/auth/dist /usr/share/nginx/html

COPY --from=builder /app/apps/auth/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
