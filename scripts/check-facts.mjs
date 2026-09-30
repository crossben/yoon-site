// Fact-drift guard. Every factual claim on the website must still be backed by the
// gateway repository (website/PLAN.md §0 and §4). For each fact we assert that a key
// string still appears in its source file. When the repository changes and a fact no
// longer holds, this fails the build until website/content/facts.ts is updated.
// That is intended.
//
// Location of the gateway: $YOON_APP_DIR (default ../yoon-app).
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const yoonAppDir = resolve(process.env.YOON_APP_DIR ?? "../yoon-app");

// file → strings that must appear in it for the site's claims to stay true.
const REQUIRED_STRINGS = {
  "README.md": [
    // One-liner and name meaning
    "Yoon picks the way a payment travels",
    "A self-hosted, open-source payment gateway for Africa's payment providers",
    // Providers and methods
    "NabooPay",
    "| PayDunya | Wave, Orange Money, Free Money, card | Wave, Orange Money, Free Money | — |",
    "| DexPay | Wave, Orange Money, Free Money, card | Wave, Orange Money | — |",
    "| NabooPay | Wave, Orange Money, Free Money, card | — | — |",
    // Refunds
    "None of the three offers a refund API: refund a customer by sending a payout.",
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
  "CLAUDE.md": ["Settle only when the confirmed amount equals the requested amount."],
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
  "examples/laravel-shop/README.md": ["no provider account, no real money"],
  "CONTRIBUTING.md": ["Contributor License Agreement"],
  "SECURITY.md": ["private vulnerability reporting"],
};

const problems = [];

for (const [file, strings] of Object.entries(REQUIRED_STRINGS)) {
  let content;
  try {
    content = readFileSync(join(yoonAppDir, file), "utf8");
  } catch {
    problems.push(
      `  ${file}: cannot read it. Is the gateway repository checked out at ${yoonAppDir}?`,
    );
    continue;
  }
  for (const s of strings) {
    if (!content.includes(s)) {
      problems.push(
        `  ${file}: expected to contain ${JSON.stringify(s.length > 72 ? s.slice(0, 69) + "..." : s)}`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(
    `\n[check-facts] The website makes claims the gateway repository no longer backs up:\n` +
      problems.join("\n") +
      `\n\n[check-facts] Update website/content/facts.ts (and the copy that cites it) to match the\n` +
      `[check-facts] sources in ${yoonAppDir}. Never edit the gateway repository from here.\n`,
  );
  process.exit(1);
}
console.log(
  `[check-facts] All ${Object.keys(REQUIRED_STRINGS).length} source files still back every claim on the site.`,
);
