FROM node:24.22.0-bookworm-slim AS base
WORKDIR /workspace
RUN npm install --global npm@11.8.0 --no-audit --no-fund

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund
COPY . .
RUN npm run typecheck && npm run build

FROM base AS runtime-dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM base AS runtime
COPY --chown=node:node package.json package-lock.json ./
COPY --from=runtime-dependencies --chown=node:node /workspace/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/build ./build
COPY --chown=node:node app/server/db ./app/server/db
COPY --chown=node:node app/server/env.server.ts app/server/runtime.server.ts ./app/server/
COPY --chown=node:node drizzle ./drizzle
COPY --chown=node:node scripts/database.ts scripts/start.ts scripts/bootstrap.sh ./scripts/
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "scripts/bootstrap.sh"]
