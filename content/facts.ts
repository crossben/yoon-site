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

/** Version. Source: CHANGELOG.md `## [0.1.0]`. */
export const version = "0.1.0";

/** Providers and what each supports. Source: README.md § Providers, docs/providers/*.md. */
export const providers = [
  {
    id: "paydunya",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: ["Wave", "Orange Money", "Free Money"],
    refund: false,
  },
  {
    id: "dexpay",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: ["Wave", "Orange Money"],
    refund: false,
  },
  {
    id: "naboopay",
    collect: ["Wave", "Orange Money", "Free Money", "card"],
    payout: [],
    refund: false,
  },
] as const;

/** Source: README.md — "None of the three offers a refund API: refund a customer by sending a payout." */
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
 * Yoon's PI-SPI provider is PLANNED, not built: the site must always say so. When it ships, add
 * its README line to scripts/check-facts.mjs and move `providerStatus` to "available".
 */
export const pispi = {
  site: "https://pispi.bceao.int/",
  developerPortal: "https://developer.pispi.bceao.int/",
  operator: "BCEAO",
  zone: "UEMOA",
  apiBusinessVersion: "1.5.0",
  providerStatus: "planned",
} as const;

/** Client libraries. Source: README.md § Client libraries, ADR-0018. */
export const clients = {
  php: { package: "yoonpay/yoon-php", requires: "PHP 8.2+, Laravel 10–13" },
  java: { package: "io.github.crossben:yoon-java", requires: "Java 17+" },
} as const;

/** Licence split. Source: docs/licensing.md. */
export const licensing = {
  server: "AGPL-3.0",
  clients: "Apache-2.0",
} as const;
