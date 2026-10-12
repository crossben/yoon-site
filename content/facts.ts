// The facts sheet — the ONLY source for every claim the website makes
// (website/PLAN.md §0 and §4). Each entry cites its source in the gateway
// repository ($YOON_APP_DIR, default ../yoon-app). Never retype a fact in copy:
// import it from here. scripts/check-facts.mjs fails the build when a source
// file no longer backs one of these facts.

const REPO_BASE = "https://github.com/crossben/yoonpay";
const BLOB = `${REPO_BASE}/blob/main`;

/** Repository links. Source: ADR-0017 (docs/adr/0017-github-and-image-namespace.md). */
export const repo = {
  home: REPO_BASE,
  blob: BLOB,
  openapi: `${BLOB}/api/openapi.yaml`,
  changelog: `${BLOB}/CHANGELOG.md`,
  licensing: `${BLOB}/docs/licensing.md`,
  deploy: `${BLOB}/docs/deploy.md`,
  loadTest: `${BLOB}/docs/load-test.md`,
  contributing: `${BLOB}/CONTRIBUTING.md`,
  security: `${BLOB}/SECURITY.md`,
  exampleShop: `${BLOB}/examples/laravel-shop`,
  adr: (n: string) => `${BLOB}/docs/adr/${n}`,
} as const;

/** Version. Source: CHANGELOG.md `## [0.4.0]`. */
export const version = "0.4.0";

/**
 * Providers and what each supports. Source: README.md § Providers, docs/providers/*.md.
 *
 * Adding a provider is one entry here: `name` must match the first cell of its row in the
 * gateway README's providers table, and `doc` its page under docs/providers/. The snapshot
 * sync and scripts/check-facts.mjs read this list (scripts/gateway.mjs), so the new page is
 * copied into gateway/ and both are guarded automatically.
 * `tested`: README.md status line and the provider page's Evidence section — "sandbox" or "live"
 * when the adapter has been run end to end against the provider's real API, false otherwise.
 */
export const providers = [
  {
    id: "paydunya",
    name: "PayDunya",
    doc: "docs/providers/paydunya.md",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: ["Wave", "Orange Money", "Free Money"],
    refund: false,
    tested: false,
  },
  {
    id: "dexpay",
    name: "DexPay",
    doc: "docs/providers/dexpay.md",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: ["Wave", "Orange Money"],
    refund: false,
    tested: "sandbox",
  },
  {
    id: "naboopay",
    name: "NabooPay",
    doc: "docs/providers/naboopay.md",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: [],
    refund: false,
    tested: "live",
  },
  {
    id: "cinetpay",
    name: "CinetPay",
    doc: "docs/providers/cinetpay.md",
    collect: ["Orange Money", "MTN", "Moov", "Wave", "Free Money", "and more (9 countries)"],
    payout: ["Mobile money"],
    refund: false,
    tested: false,
  },
  {
    id: "wave",
    name: "Wave (direct)",
    doc: "docs/providers/wave.md",
    collect: ["Wave"],
    payout: ["Wave"],
    refund: "full",
    tested: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    doc: "docs/providers/stripe.md",
    collect: ["card (international)"],
    payout: [],
    refund: "partial",
    tested: false,
  },
  {
    id: "pispi",
    name: "PI-SPI (BCEAO)",
    doc: "docs/providers/pispi.md",
    collect: ["PI alias"],
    payout: ["PI alias"],
    refund: "full",
    tested: false,
  },
] as const satisfies readonly {
  id: string;
  name: string;
  doc: `docs/providers/${string}.md`;
  collect: readonly string[];
  payout: readonly string[];
  refund: false | "full" | "partial";
  tested: false | "sandbox" | "live";
}[];

/** Source: README.md — "PayDunya, DexPay, NabooPay and CinetPay offer no refund API: refund a customer by sending a payout.", "Stripe refunds any amount up to what was paid." and "Wave (direct) and PI-SPI return the full amount of a payment". */
export const refundByPayout = true;

/** Source: CHANGELOG.md § Known limitations. */
export const country = "Senegal";
export const currency = "XOF";

/** The required status line. Source: README.md status note. */
export const sandboxStatus = true;

/**
 * Load-test table. Source: docs/load-test.md (always shown with its caveat:
 * measures Yoon itself; real providers add their own latency).
 */
export const loadTest = {
  hardware: "One laptop: Intel i7-11800H, 32 GB RAM; Yoon, Postgres and k6 in Docker Desktop",
  rows: [
    { rate: "100", errors: "0 %", createP95: "36 ms", readP95: "3 ms" },
    { rate: "200", errors: "0 %", createP95: "37 ms", readP95: "3 ms" },
    { rate: "300", errors: "0 %", createP95: "42 ms", readP95: "4 ms" },
  ],
} as const;

/** Guarantees shown on the site, each with its ADR/source on GitHub (PLAN.md §5.4). */
export const guaranteeSources = {
  timeout: repo.adr("0010-routing-and-failover.md"),
  callbacks: repo.adr("0012-webhooks-and-reconciliation.md"),
  amounts: repo.adr("0012-webhooks-and-reconciliation.md"),
  ledger: repo.adr("0012-webhooks-and-reconciliation.md"),
  idempotency: repo.openapi,
  payouts: repo.adr("0010-routing-and-failover.md"),
} as const;

/**
 * PI-SPI — the BCEAO's instant-payment platform. These facts are about an external system, so
 * their sources are the BCEAO's own pages, not the gateway repository:
 *   - https://pispi.bceao.int/ (public site: operator, participants, 24/7, instant)
 *   - https://developer.pispi.bceao.int/ (API Business specification, version 1.5.0: an API that
 *     participants expose to their business clients — payment requests, payments, returns of
 *     funds, webhooks signed with HMAC-SHA256, OAuth2 + mTLS)
 * Yoon's PI-SPI provider ships in 0.1.0 but is NOT sandbox-tested (README.md providers table,
 * CHANGELOG.md [0.1.0], docs/providers/pispi.md): the site must always say so.
 */
export const pispi = {
  site: "https://pispi.bceao.int/",
  developerPortal: "https://developer.pispi.bceao.int/",
  operator: "BCEAO",
  zone: "UEMOA",
  apiBusinessVersion: "1.5.0",
  providerStatus: "available-not-sandbox-tested",
} as const;

/**
 * Client libraries. Source: README.md § Client libraries, ADR-0018.
 * `install` is what the card's copy button copies. npm packages go through safe-install
 * (https://github.com/crossben/safe-install: install scripts reviewed before they run); it
 * covers the npm family only, so the other ecosystems use their own tool. Maven has no install
 * command: the Java cards copy the Gradle dependency line.
 */
export const clients = {
  php: {
    package: "yoonpay/yoon-php",
    requires: "PHP 8.2+, Laravel 10–13",
    install: "composer require yoonpay/yoon-php",
  },
  java: {
    package: "io.github.crossben:yoon-java",
    requires: "Java 17+",
    install: `implementation("io.github.crossben:yoon-java:${version}")`,
  },
  js: {
    package: "@yoonpay/yoon",
    requires: "Node ≥ 20 — also Bun, Deno and edge runtimes",
    install: "safe-install add @yoonpay/yoon",
  },
  symfony: {
    package: "yoonpay/yoon-php",
    requires: "Symfony 6.4 LTS and 7.x — bundle in the PHP client",
    install: "composer require yoonpay/yoon-php",
  },
  python: {
    package: "yoonpay",
    requires: "Python ≥ 3.10 — Django, FastAPI and Flask helpers",
    install: "pip install yoonpay",
  },
  spring: {
    package: "io.github.crossben:yoon-spring-boot-starter",
    requires: "Spring Boot 3.x and 4.x",
    install: `implementation("io.github.crossben:yoon-spring-boot-starter:${version}")`,
  },
} as const;

/** Licence split. Source: docs/licensing.md. */
export const licensing = {
  server: "AGPL-3.0",
  clients: "Apache-2.0",
} as const;
