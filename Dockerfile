# The website builds from this repository alone: the gateway files it needs are in the
# committed snapshot gateway/ (refresh it with `npm run sync:gateway`). No sibling checkout,
# no token, so any host that clones this repository can build it.

# Stage 1: dependencies (clean install for this platform), through safe-install: lifecycle
# scripts off, and none run unless approved (this site needs none). The binary is pinned by
# version and SHA-256, so a tampered release cannot slip in. Same setup as the safe-install
# website (../safe-install/website/Dockerfile); bump the three ARGs together.
FROM node:24-alpine AS deps
WORKDIR /app
ARG SAFE_INSTALL_VERSION=0.2.3
ARG SAFE_INSTALL_SHA256_amd64=65bac5f863b953c9676e7b772827043d3b062b6e0b8ae6ea14b79bdf433bfcf8
ARG SAFE_INSTALL_SHA256_arm64=28eec348ba9842a69cc1df236dba3354c9eccd76ed3fd12ac4513386ad566c6c
ARG TARGETARCH
RUN set -eu; \
    arch="${TARGETARCH:-$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')}"; \
    case "$arch" in \
      amd64) sum="$SAFE_INSTALL_SHA256_amd64" ;; \
      arm64) sum="$SAFE_INSTALL_SHA256_arm64" ;; \
      *) echo "unsupported architecture: $arch" >&2; exit 1 ;; \
    esac; \
    wget -qO /tmp/si.tar.gz "https://github.com/crossben/safe-install/releases/download/v${SAFE_INSTALL_VERSION}/safe-install_linux_${arch}.tar.gz"; \
    echo "$sum  /tmp/si.tar.gz" | sha256sum -c -; \
    tar -xzf /tmp/si.tar.gz -C /usr/local/bin safe-install; \
    rm /tmp/si.tar.gz; \
    safe-install version
# From the lockfile alone, so this layer is reused when only the source changes.
COPY package.json package-lock.json ./
RUN SAFE_INSTALL_NO_UPDATE_CHECK=1 safe-install install --frozen-lockfile --ci

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
