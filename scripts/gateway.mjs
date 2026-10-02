// Where the site reads the gateway repository's files from, and which files those are.
//
// The website is its own repository: it must build from a clean clone on any host, so it
// never reads ../yoon-app at build time. It reads a committed snapshot in gateway/ instead,
// refreshed by `npm run sync:gateway` (scripts/sync-gateway.mjs). CI checks daily that the
// snapshot still matches the gateway repository.
import { resolve } from "node:path";

/** The snapshot the build reads. `YOON_APP_DIR` overrides it (e.g. to read a live checkout). */
export const SNAPSHOT_DIR = resolve(process.env.YOON_APP_DIR ?? "gateway");

/** Brand assets, under docs/assets/ in the gateway. */
export const BRAND_FILES = [
  "logo.svg",
  "logo-dark.svg",
  "mark.svg",
  "icon.svg",
  "social-preview.png",
];

// file → strings that must appear in it for the site's claims to stay true.
export const REQUIRED_STRINGS = {
  "README.md": [
    // One-liner and name meaning
    "Yoon picks the way a payment travels",
    "A self-hosted, open-source payment gateway for Africa's payment providers",
    // Providers and methods
    "NabooPay",
    "| PayDunya | Wave, Orange Money, Free Money, card | Wave, Orange Money, Free Money | — |",
    "| DexPay | Wave, Orange Money, Free Money, card | Wave, Orange Money | — |",
    "| NabooPay | Wave, Orange Money, Free Money, card | — | — |",
    "| Wave (direct) | Wave, 4 XOF countries | Wave | Full amount |",
    "| PI-SPI (BCEAO) | Payment request to a PI alias, 8 UEMOA countries | To a PI alias | Full amount |",
    // Refunds
    "PayDunya, DexPay and NabooPay offer no refund API: refund a customer by sending a payout.",
    "Wave (direct) and PI-SPI return the full amount of a payment",
    // Status (not sandbox-tested)
    "yet been run against the providers' sandboxes",
    // Money safety
    "A timeout\n  is *unknown*, never *failed*",
    "failover only after a definite refusal",
    "never for payouts",
    "re-confirmed with the provider's status API",
    // Demo
    "YOON_DEMO_ENABLED=true",
    // Clients
    "| JavaScript / TypeScript | `@yoonpay/yoon` | [clients/js](clients/js) — Node ≥ 20",
    "| Symfony | `yoonpay/yoon-php` | [clients/php](clients/php#symfony)",
    "| Python | `yoonpay` | [clients/python](clients/python)",
    "| Spring Boot | `io.github.crossben:yoon-spring-boot-starter` |",
    "The PHP, Java, JavaScript and Python clients are generated from `api/openapi.yaml`",
    "yoonpay/yoon-php",
    "io.github.crossben:yoon-java",
    // What Yoon is not
    "**Not an aggregator.**",
    "Yoon removes the integration work, not the onboarding.",
    "**Not a card vault.**",
    "**Not a checkout UI.**",
    "**Not a hosted service.**",
    "It sends no telemetry.",
    // Load test intro
    "i7-11800H",
  ],
  "CHANGELOG.md": [
    "## [0.1.0]",
    "**PI-SPI** (`pispi`, BCEAO instant payments",
    "PayDunya, DexPay and NabooPay: Senegal (XOF) only and no refund API (refund by payout).",
  ],
  "docs/load-test.md": [
    "| 100 | 24 000 | 0 % | 27 / 36 / 48 ms | 2 / 3 / 5 ms |",
    "| 200 | 48 002 | 0 % | 29 / 37 / 57 ms | 2 / 3 / 6 ms |",
    "| 300 | 71 948 | 0 % | 30 / 42 / 619 ms | 2 / 4 / 135 ms |",
  ],
  "docs/licensing.md": [
    "A **commercial licence** for the server is available",
    "no obligation beyond",
    "| `yoon-core`, `yoon-server`, `yoon-providers/*`, `yoon-testkit` | [AGPL-3.0](../LICENSE) |",
    "| `clients/php`, `clients/java`, `examples/` | [Apache-2.0](../clients/LICENSE) |",
  ],
  "docs/deploy.md": ["Caddy", "nightly backups", "Prometheus"],
  "api/openapi.yaml": [
    "name: Idempotency-Key",
    "operationId: createPayment",
    "operationId: createPayout",
  ],
  "docs/adr/0010-routing-and-failover.md": [
    "go to exactly one provider, exactly once",
    "`Unknown`\n  stops routing",
  ],
  "docs/adr/0012-webhooks-and-reconciliation.md": [
    "**Provider callbacks are hints.**",
    "A success is applied only if the confirmed amount equals the",
  ],
  "docs/adr/0017-github-and-image-namespace.md": ["github.com/crossben/yoonpay"],
  "docs/adr/0018-java-client-coordinates.md": ["io.github.crossben:yoon-java"],
  "docs/adr/0007-no-default-telemetry.md": ["Yoon sends nothing anywhere by default"],
  "clients/php/README.md": [
    "composer require yoonpay/yoon-php",
    "Yoon\\Symfony\\YoonBundle::class",
    "#[YoonWebhook]",
  ],
  "clients/java/README.md": ["Java 17+"],
  "clients/python/README.md": [
    "pip install yoonpay",
    'idempotency_key="order-1042"',
    "from yoonpay.django import yoon_webhook",
  ],
  "clients/java-spring-boot-starter/README.md": [
    "yoon-spring-boot-starter",
    "yoon.webhook-secret=${YOON_WEBHOOK_SECRET}",
    "Spring Boot 3.x or 4.x",
  ],
  "clients/e2e/scenario.md": [
    "The end-to-end scenario, shared by every client",
    "proves every client against a real Yoon server",
    "same idempotency key",
  ],
  "docs/providers/pispi.md": [
    "has **not yet been run against the PI-SPI sandbox**",
    "Payment request (`POST /demandes-paiements`, category `521`, e-commerce)",
    "A partial refund is refused",
    "Your bank or e-money issuer must offer it",
  ],
  "clients/js/README.md": [
    "npm install @yoonpay/yoon",
    "The client **never retries**",
    'express.raw({ type: "application/json" })',
  ],
  "clients/js/src/Yoon.ts": [
    "idempotencyKey: string",
    "dangerouslyAllowBrowser",
    "yoon-javascript/",
  ],
  "examples/laravel-shop/README.md": ["no provider account, no real money"],
  "CONTRIBUTING.md": ["Contributor License Agreement"],
  "SECURITY.md": ["private vulnerability reporting"],
};

/**
 * Every gateway file the build reads — exactly what the snapshot holds. Never add the
 * gateway's CLAUDE.md or AGENTS.md: coding agents load those automatically from any folder
 * they work in, and the gateway's rules would leak into this repository.
 */
export const GATEWAY_FILES = [
  ...Object.keys(REQUIRED_STRINGS),
  "api/openapi.yaml",
  ...BRAND_FILES.map((file) => `docs/assets/${file}`),
].filter((file, i, all) => all.indexOf(file) === i);
