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
    "| PI-SPI (BCEAO) | Payment request to a PI alias, 8 UEMOA countries | To a PI alias | Full amount |",
    "the Wave (direct) and PI-SPI adapters are on the\n> main branch, not in a release yet",
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
    "yoonpay/yoon-php",
    "io.github.crossben:yoon-java",
    // What Yoon is not
    "**Not an aggregator.**",
    "**Not a card vault.**",
    "**Not a checkout UI.**",
    "**Not a hosted service.**",
    "It sends no telemetry.",
    // Load test intro
    "i7-11800H",
  ],
  "CHANGELOG.md": [
    "## [0.1.0]",
    "New provider **PI-SPI**",
    "Senegal (XOF) only. No provider offers refunds through an API; refund by payout.",
  ],
  "docs/load-test.md": [
    "| 100 | 24 000 | 0 % | 27 / 36 / 48 ms | 2 / 3 / 5 ms |",
    "| 200 | 48 002 | 0 % | 29 / 37 / 57 ms | 2 / 3 / 6 ms |",
    "| 300 | 71 948 | 0 % | 30 / 42 / 619 ms | 2 / 4 / 135 ms |",
  ],
  "docs/licensing.md": [
    "A **commercial licence** for the server is available",
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
  "clients/php/README.md": ["composer require yoonpay/yoon-php"],
  "clients/java/README.md": ["Java 17+"],
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
