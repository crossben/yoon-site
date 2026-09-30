# The website builds from this repository alone: the gateway files it needs are in the
# committed snapshot gateway/ (refresh it with `npm run sync:gateway`). No sibling checkout,
# no token, so any host that clones this repository can build it.

# Stage 1: dependencies (clean install for this platform)
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Stage 2: build the static site. `prebuild` copies the brand assets from gateway/ and
# checks every claim against it.
FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: serve the static export with Caddy (HTTPS is terminated in front of it)
FROM caddy:2-alpine AS runner
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/out /srv
EXPOSE 3000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
