FROM oven/bun:1.3.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile && bun i -d typescript && bun pm cache rm
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun:1.3.2-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone standalone
COPY --from=builder /app/.next/static standalone/.next/static
COPY --from=builder /app/public standalone/public
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "bun", "run", "standalone/server.js" ]