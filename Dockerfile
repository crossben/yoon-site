# Stage 1: install dependencies
# Build from the repository parent (docker-compose.yml sets context: ..): the site is
# generated from the gateway repository next to it. The ignore rules for this build live
# in Dockerfile.dockerignore, next to this file.
FROM node:24-alpine AS deps
WORKDIR /app
COPY website/package.json website/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Stage 2: build the site. The prebuild copies the brand assets from and checks every
# claim against the gateway repository (../yoon-app, copied in below — only the files
# the build reads; keep the list in sync with scripts/check-facts.mjs's sources).
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY website/ .
COPY yoon-app/README.md ./yoon-app/README.md
COPY yoon-app/CHANGELOG.md ./yoon-app/CHANGELOG.md
COPY yoon-app/CLAUDE.md ./yoon-app/CLAUDE.md
COPY yoon-app/CONTRIBUTING.md ./yoon-app/CONTRIBUTING.md
COPY yoon-app/SECURITY.md ./yoon-app/SECURITY.md
COPY yoon-app/api ./yoon-app/api
COPY yoon-app/docs ./yoon-app/docs
COPY yoon-app/clients/LICENSE ./yoon-app/clients/LICENSE
COPY yoon-app/clients/php/README.md ./yoon-app/clients/php/README.md
COPY yoon-app/clients/java/README.md ./yoon-app/clients/java/README.md
COPY yoon-app/clients/js/README.md ./yoon-app/clients/js/README.md
COPY yoon-app/clients/js/src/Yoon.ts ./yoon-app/clients/js/src/Yoon.ts
COPY yoon-app/examples/laravel-shop/README.md ./yoon-app/examples/laravel-shop/README.md
ENV YOON_APP_DIR=/app/yoon-app NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: run image — static export behind Caddy, the gateway's own production server
FROM caddy:2-alpine AS runner
COPY website/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/out /srv
EXPOSE 3000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
