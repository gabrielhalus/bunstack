# --- Build stage ---
FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run build --filter=@bunstack/web...

# --- Serve stage ---
FROM nginx:stable-alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
