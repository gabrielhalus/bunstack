FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run build --filter=@bunstack/api...

FROM oven/bun:1

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 4000

CMD ["bun", "run", "start", "--filter=@bunstack/api", "--ui=stream"]
