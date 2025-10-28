FROM oven/bun:latest AS base
COPY . /app
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

FROM base AS build
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base
COPY --from=build /app/.next /app/.next
COPY --from=build /app/.next/static /app/.next/standalone/.next/static
COPY --from=base /app/public /app/.next/standalone/public
EXPOSE 3000/tcp
CMD [ "bun", "run", ".next/standalone/server.js" ]