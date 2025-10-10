FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run build --filter=@bunstack/auth...

FROM oven/bun:1

WORKDIR /app

COPY --from=builder /app ./
