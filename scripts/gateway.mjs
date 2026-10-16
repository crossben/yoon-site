// Where the site reads the gateway repository's files from, and which files those are.
//
// The website is its own repository: it must build from a clean clone on any host, so it
// never reads ../yoon-app at build time. It reads a committed snapshot in gateway/ instead,
// refreshed by `npm run sync:gateway` (scripts/sync-gateway.mjs). CI checks daily that the
// snapshot still matches the gateway repository.
import { resolve } from "node:path";
import { DOC_SNIPPETS } from "./doc-snippets.mjs";
// The providers list lives in content/facts.ts (Node runs TypeScript with type stripping):
// one entry there brings its docs page into the snapshot and under the drift guard.
const { providers } = await import("../content/facts.ts");

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
    "PayDunya, DexPay, NabooPay and CinetPay offer no refund API: refund a customer by sending a payout.",
    "Stripe refunds any amount up to what was paid.",
    "Wave (direct) and PI-SPI return the full amount of a payment",
    // Status (not sandbox-tested)
    "and have **not yet been run against the",
    // Status (DexPay sandbox, NabooPay live)
    "**NabooPay** (live, small real payments) have been run end to end against the real APIs",
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
    "**Not a payment form.**",
    "**Not a hosted service.**",
    "It sends no telemetry.",
    // Load test intro
    "i7-11800H",
  ],
  "CHANGELOG.md": [
    "## [0.1.0]",
    "## [0.2.0]",
    "## [0.3.0]",
    "## [0.4.0]",
    "## [0.5.0]",
    "## [0.6.0]",
    "### Billing",
    "**PI-SPI** (`pispi`, BCEAO instant payments",
    "PayDunya, DexPay and NabooPay: Senegal (XOF) only and no refund API (refund by payout).",
  ],
  // Billing docs page (/docs/billing): Yoon 0.3.0.
  "docs/billing.md": [
    "Yoon 0.3.0 bills **prepaid subscriptions**",
    "Nothing is charged automatically",
    "by mobile money, PI-SPI or card",
    "Every write takes an\n`Idempotency-Key`",
    "Every event carries the full object",
    "the helper drops exact duplicates",
    "# Yoon sends no e-mail",
    "**Paying early** stacks after the current period. **Paying in grace** starts from the old\n  period end (grace days are not free). **Paying after expiry** starts at the payment.",
    "Months are calendar months anchored on the first day paid",
    "A **downgrade** or cheaper-per-day change waits for the period\n  end.",
    "(reversible with\n  `/resume`)",
    "printable\npayment receipt (French/English)",
    "Each period is an invoice numbered without gaps.",
    "without payment or ledger posting",
    "Automatic charging, Stripe first,\nis on the roadmap",
    "Hosted checkout needs `YOON_PUBLIC_URL`.",
    // Free trials and coupons (Yoon 0.4).
    "## 6. Free trials (0.4)",
    "The subscription starts `trialing`: entitled, no\ninvoice, nothing to pay.",
    "Each customer gets one trial per plan.",
    "the paid\nperiod starts when the trial ends, so no trial day is lost.",
    "unpaid at the end, the subscription goes `past_due` (grace) with the\nfirst invoice open, then `expired`.",
    "**Upgrade your Yoon client to 0.4 before using trials**",
    "the 0.3 helpers treat `trialing` as not\nentitled",
    "## 7. Coupons (0.4)",
    // Customer portal (Yoon 0.6).
    "## 12. Customer portal (since 0.6.0)",
    "plan,\nstatus, paid-until date, invoices and receipts, a **Pay** button",
    "from yoonpay.fastapi import redirect_to_portal",
    "`portalRedirect(yoon, customerId, { returnUrl, allow })` from\n`@yoonpay/yoon/next`",
    "`POST /v1/customers/{id}/portal_sessions`",
    "The URL opens only that customer's portal and expires after an hour",
    "never\n  store or log the URL (it carries a secret token).",
    "Without `allow`, the customer may **view and pay** only.",
    "`cancel`\n  (at period end, and resume), `change_prices`",
    "an upgrade is paid\n  now, a cheaper plan waits for the period end) and `coupons`.",
    "Every action follows the same rules as the API and sends the usual events.",
    "(cause `portal`)",
    "`percent_off` or `amount_off`",
    "`once`, `repeating` or\n`forever`",
    "each **paid** invoice uses one period of the coupon.",
    "A 100% coupon pays the invoice by\nitself: `invoice.paid` arrives with no payment.",
    "| `YOON_APPS_<APP>_BILLING_GRACE_DAYS` | `3` |",
    "| `YOON_APPS_<APP>_BILLING_REMINDER_DAYS` | `3` |",
    "| `YOON_APPS_<APP>_BILLING_TIMEZONE` | `Africa/Dakar` |",
    "| `YOON_APPS_<APP>_BILLING_INVOICE_PREFIX` | `INV` |",
    "| `YOON_APPS_<APP>_BILLING_INVOICE_TTL` | `7d` |",
    "Prices never change",
    "Existing subscriptions keep their price.",
    "`409 customer_exists`",
    "**Never grant\naccess from the return URL**",
    "customers may renew early, it never loses days.",
    "Deliveries\nare at least once",
    "| `past_due` | Period ended unpaid, within the grace days; a renewal invoice is open | **yes** |",
    "| `incomplete` | Created, first invoice not paid | no |",
    "| `active` | Paid up to `current_period_end` | yes |",
    "| `expired` | Grace ended, or the first invoice was never paid | no |",
    "| `canceled` | Ended on request | no |",
    "money received is never ignored.",
    "Changing currency is refused.",
    "No automatic refund.",
    "**a payment receipt, not a tax invoice**",
    "`GET /v1/exports/subscriptions.csv`, `GET /v1/exports/invoices.csv`",
    "The subscription shows `comp: true`",
  ],
  // AI assistants docs page (/docs/mcp): Yoon 0.7.
  "docs/mcp.md": [
    "Available from Yoon 0.7.0.",
    "It can do nothing that key cannot already do, and by\ndefault it only reads.",
    "Your application keeps its own key; the assistant's can be revoked without touching it.",
    "never\nin a file you commit.",
    "Requires Node.js 20 or newer.",
    "Use the\nuser-level configuration (as below), so the key never lands in a project's files.",
    "Do not add `--trust`: it skips the\nconfirmation before each tool call.",
    "VS Code asks for\nthe key when the server first starts, so it is not written in the file",
    "Lists return 20 items by default and 50 at most",
    "With `YOON_MCP_WRITES=true`, and only then, three tools appear:",
    "Each requires an `idempotency_key`: retrying with the same key does the action once.",
    "There is no\ntool that sends money out or ends a customer's access",
    "**Phone numbers and e-mails are masked**",
    "**The API key is never sent:** every result is scrubbed of it.",
    "Descriptions, names, metadata and provider messages come back\n  under `untrusted_text`.",
    "That is why no tool can move money out.",
    "| `explain_payment` | The payment, its status history, and a one-line summary |",
    "| `create_portal_session` | A private, expiring portal link for one customer — view and pay only |",
  ],
  // Payment links docs page (/docs/payment-links): Yoon 0.5.
  "docs/payment-links.md": [
    "A payment link is a URL (and a QR code) you share anywhere",
    "WhatsApp, Instagram, an SMS, a\nprinted sign at the counter.",
    "completes Yoon's hosted\ncheckout with Wave, Orange Money, a card or any method your providers offer.",
    "Each payment through a link is an **ordinary hosted payment**",
    "A\nlink adds an entry point, nothing that touches money.",
    "Payment links need `YOON_PUBLIC_URL` (the link must be absolute).",
    "**Without a developer** — in the operator dashboard, tab **Payment links**",
    "Copy the\nlink, or save its QR code.",
    "(amount in minor units — 5000 is 5 000 XOF — or `any`)",
    "The answer carries `url` (what you share, `<YOON_PUBLIC_URL>/l/<code>`) and `qr_url` (an SVG QR\ncode of it).",
    "The code is random and unguessable; whoever has the link may pay it.",
    "| `amount` | A fixed amount in minor units. Omit it to let the customer type the amount, optionally between `min_amount` and `max_amount` (donations, tips, open invoices). |",
    "| `max_payments` | `1` for single use; omit for a link anyone can pay many times. |",
    "| `expires_at` | After this, the page says the link has expired. |",
    "| `method` | Limit the link to one method (e.g. `wave`). Default: every method your providers offer. |",
    "| `return_url` | Where the customer goes after paying. |",
    "The amount, currency and country never change: archive the link and create another.",
    "your application's name, the description, the amount (or a field for it) and\n**Pay**, in French or English, sized for a phone.",
    "Pressing **Pay** opens the hosted checkout.",
    "A\ndouble tap or a retry pays one payment.",
    "An archived, expired or used-up link says so instead.",
    "`GET /v1/payment_links/{id}`: `payments_count` and `amount_collected` (succeeded payments).",
    "Every payment carries `payment_link`; the dashboard and `payments.csv` show it;",
    "`payment_links.csv` exports each link with its totals.",
    "Your webhook receives `payment.succeeded` for each payment, with `payment_link` set.",
    "A single-use link counts **succeeded** payments: if two customers pay at the same moment, both\npayments go through (money received is never refused) and the link then shows as used.",
    'Dashboard **Archive**, `PATCH /v1/payment_links/{id}` with `{"active": false}`, or\n`POST /admin/v1/applications/{app}/payment_links/{id}/archive`.',
    "Payments already made are kept.",
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

// The docs pages (/docs/…): every snippet's marker must stay in its source file
// (scripts/doc-snippets.mjs), and every provider in content/facts.ts must keep its row in the
// README's providers table and its page under docs/providers/.
for (const { file, marker } of Object.values(DOC_SNIPPETS)) {
  (REQUIRED_STRINGS[file] ??= []).push(marker);
}
for (const provider of providers) {
  REQUIRED_STRINGS["README.md"].push(`| ${provider.name} |`, `[${provider.doc}](${provider.doc})`);
  (REQUIRED_STRINGS[provider.doc] ??= []).push("# ");
}

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
