import type { Content } from "./types";
import { version } from "./facts";

// English copy. Every factual sentence traces to content/facts.ts (and through it
// to the gateway repository). Nothing from PLAN.md §0's banned list appears here.

export const en: Content = {
  lang: "en",
  otherLang: { href: "/fr/", label: "Français" },
  meta: {
    title: "Yoon — one API for Africa's payment providers",
    description:
      "Yoon is a self-hosted, open-source payment gateway: one API in front of PayDunya, DexPay, NabooPay, Wave and PI-SPI, with routing, verified webhooks, idempotency, a ledger and reconciliation.",
  },
  header: {
    skipToContent: "Skip to content",
    nav: {
      how: "How it works",
      guarantees: "Guarantees",
      providers: "Providers",
      code: "Your code",
      api: "API",
      demo: "Demo",
      run: "Run it",
      pispi: "PI-SPI",
    },
    themeToggle: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    homeAria: "Yoon — home",
  },
  hero: {
    headline: "One API for Africa's payment providers.",
    subline:
      "A self-hosted, open-source gateway in front of PayDunya · DexPay · NabooPay · Wave · PI-SPI — routing, verified webhooks, idempotency, a ledger, reconciliation.",
    ctaDemo: "Try the demo",
    ctaGithub: "GitHub",
    statusLine: `v${version} — adapters not yet tested against provider sandboxes.`,
    scene: {
      labels: { app: "Your app", yoon: "Yoon", providers: ["PayDunya", "DexPay", "NabooPay"] },
      description:
        "Diagram: a payment leaves your app as intent — 5 000 XOF by Wave — travels the road to Yoon, which picks one provider and sends it there. A payment that times out stays on its road: Yoon waits for the provider's status API instead of sending it to another provider.",
      pause: "Pause the animation",
      play: "Play the animation",
    },
  },
  problem: {
    heading: "The same work, in every project",
    cards: [
      {
        title: "Every provider, every project",
        body: "Each integration re-implements the same provider calls, in each language, for each shop.",
      },
      {
        title: "Webhooks you have to verify",
        body: "Signature checks, duplicates, replays, late callbacks — each project re-solves them or lives with the risk.",
      },
      {
        title: "Payments that get stuck",
        body: "A timeout leaves one question: did the customer pay? Without reconciliation, orders and money drift apart.",
      },
    ],
  },
  how: {
    heading: "How a payment travels",
    intro:
      "You send intent, not provider calls. Yoon picks the provider, verifies what comes back, and keeps the ledger. A timeout is not a failure: the payment stays on its road until the provider's status API answers.",
    intent: "5 000 XOF by Wave",
    outcome: "chosen provider",
    timeout: "timeout → unknown",
    timeoutOutcome: "waits for the provider's status API",
    srDescription:
      "Sequence: your application sends intent (5 000 XOF by Wave) to Yoon; the road forks to PayDunya, DexPay and NabooPay; Yoon routes the payment to one of them. When a provider does not answer, the payment does not fork to another provider — it stays pending and Yoon asks the provider's status API.",
    steps: [
      "Your app sends intent — amount, country, method.",
      "Yoon picks a configured provider by capability, availability and priority.",
      "If the provider definitely refuses, Yoon tries the next one.",
      "If the provider never answers, Yoon does not retry and does not fail over — the status API resolves it.",
    ],
  },
  guarantees: {
    heading: "What Yoon guarantees",
    whyLabel: "Why it matters",
    items: [
      {
        key: "timeout",
        title: "A timeout is “unknown”, never “failed”",
        body: "No failover, no retry after a request may have reached a provider.",
        why: "The customer may already be paying. Retrying could charge them twice.",
      },
      {
        key: "callbacks",
        title: "Callbacks are re-confirmed",
        body: "Provider callbacks are stored, signature-checked, then confirmed with the provider's status API before anything changes.",
        why: "A callback is a hint, never the truth.",
      },
      {
        key: "amounts",
        title: "Amounts must match",
        body: "A payment settles only if the confirmed amount equals the requested amount.",
        why: "Partial or wrong amounts raise an alert instead of marking the order paid.",
      },
      {
        key: "ledger",
        title: "The ledger is enforced by Postgres",
        body: "A double-entry shadow ledger; the database itself refuses unbalanced or edited entries.",
        why: "Accounting stays reconciled with what actually happened.",
      },
      {
        key: "idempotency",
        title: "Every write is idempotent",
        body: "Requests need an Idempotency-Key; retries return the original result.",
        why: "The same request sent twice — or twenty times at once — runs once.",
      },
      {
        key: "payouts",
        title: "Payouts are sent once",
        body: "To exactly one provider, exactly once. An unknown outcome is flagged for a human, never guessed.",
        why: "Paying a recipient twice cannot be undone by software.",
      },
    ],
  },
  providersTable: {
    heading: "Providers",
    columns: { provider: "Provider", collect: "Collect", payout: "Payout", refund: "Refund" },
    none: "—",
    fullRefund: "Full amount",
    refundNote:
      "PayDunya, DexPay and NabooPay offer no refund API: refund a customer by sending a payout. Wave (direct) and PI-SPI refund the full amount; send a partial refund as a payout.",
    sandboxNote:
      "The adapters are tested against simulated provider APIs (from production integrations, Wave's public documentation and the BCEAO specification) — not yet against the providers' sandboxes.",
    countryNote:
      "XOF. PayDunya, DexPay, NabooPay: Senegal. Wave: Senegal, Côte d'Ivoire, Mali, Burkina Faso. PI-SPI: the eight UEMOA countries.",
  },
  pispi: {
    heading: "Yoon and PI-SPI: layers, not competitors",
    intro:
      "PI-SPI is the BCEAO's instant-payment platform: the rails that move money between banks, e-money issuers, microfinance institutions and payment institutions across the UEMOA. Yoon is software you run next to your application. PI-SPI moves the money; Yoon decides which road a payment takes, and makes sure it is never lost or paid twice.",
    stackLabel: "Where each piece sits",
    layers: {
      app: { title: "Your application", body: "Your shop, app or ERP. It calls one API." },
      yoon: {
        title: "Yoon, on your server",
        body: "Routing, idempotency, callback re-confirmation, reconciliation, a ledger. It holds no money.",
      },
      providers: {
        title: "Your payment providers",
        body: "PayDunya, DexPay, NabooPay and Wave, each through your own merchant account.",
        pispiRoute: "PI-SPI, through your bank's API Business",
        plannedBadge: "available · not sandbox-tested",
      },
      rails: {
        title: "PI-SPI, operated by the BCEAO",
        body: "The rails between licensed institutions: instant, around the clock, across the UEMOA.",
      },
    },
    compare: {
      heading: "Side by side",
      columns: { aspect: "Aspect", pispi: "PI-SPI", yoon: "Yoon" },
      rows: [
        {
          aspect: "What it is",
          pispi: "Regional payment infrastructure",
          yoon: "Open-source software in your backend",
        },
        {
          aspect: "Run by",
          pispi: "The BCEAO",
          yoon: "You, on your own server",
        },
        {
          aspect: "Who connects",
          pispi: "Banks, e-money issuers, microfinance and payment institutions",
          yoon: "Your applications, with your own merchant accounts",
        },
        {
          aspect: "Its job",
          pispi: "Move money between institutions, instantly",
          yoon: "Pick the route, never charge twice, confirm what providers say, reconcile, notify your app",
        },
        {
          aspect: "Holds funds",
          pispi: "Settles between institutions",
          yoon: "Never",
        },
      ],
    },
    use: {
      heading: "How Yoon uses PI-SPI",
      items: [
        "A PI-SPI provider that talks to the API Business your bank or e-money issuer exposes: the standard API the BCEAO specifies for business clients.",
        "Collect with a payment request sent to the customer's PI alias; they approve it in their own banking or wallet app.",
        "Payouts to a PI alias, and refunds as returns of funds (full amount): a real refund API, which none of the other providers offers.",
        "The same guarantees as every route: signed callbacks re-confirmed with the status API, a timeout stays unknown, amounts must match.",
        "Your code does not change: the same Yoon API, one more road.",
      ],
    },
    statusNote:
      "Available since 0.1.0, built from the BCEAO specification and not yet run against the PI-SPI sandbox.",
    caveat:
      "Yoon cannot connect to PI-SPI directly: only licensed institutions can. In production, your own bank or e-money issuer must offer the API Business to its business clients.",
    links: { site: "PI-SPI (BCEAO)", developer: "API Business developer portal" },
  },
  code: {
    heading: "Your code",
    intro:
      "Three client libraries, generated from the API contract, with idempotency-key-first helpers and webhook verification built in.",
    contractNote:
      "All three libraries are generated from api/openapi.yaml — the contract the server is tested against.",
    tabLabels: { laravel: "Laravel", php: "PHP", java: "Java", js: "TypeScript", curl: "curl" },
    responseLabel: "Yoon answers",
    copy: "Copy",
    copied: "Copied",
  },
  api: {
    heading: "The API at a glance",
    intro:
      "One versioned surface, documented by a contract the server is tested against. Errors come as problem+json with stable codes.",
    generatedNote: "Generated from api/openapi.yaml at build time.",
    referenceLabel: "Full reference",
  },
  demo: {
    heading: "Try it in five minutes",
    firstLine: "No provider account, no real money — Yoon ships a demo provider.",
    step1Title: "Start Yoon with the demo provider",
    step1Note: "From the repository root.",
    step2Title: "Start the example shop",
    step2Note: "A one-product Laravel shop that pays through Yoon.",
    step3Title: "Pay",
    step3Body:
      "Open http://localhost:8010, click Buy, then Pay on the demo checkout. You come back to the order page; Yoon's webhook marks it paid a few seconds later (refresh).",
    terminalLabel: "What it looks like",
    terminalNote: "The full commands are on the left.",
    linkLabel: "The example, step by step",
  },
  run: {
    heading: "Run it yourself",
    intro:
      "One small server, Docker, your own merchant accounts. The Compose file in deploy/ is the production setup.",
    steps: [
      { title: "Clone and configure", body: "Copy .env.example, set your domain and passwords." },
      { title: "docker compose up -d", body: "Caddy obtains the HTTPS certificate by itself." },
      {
        title: "Create an application",
        body: "apps create shop prints the API key once, and the callback URL to give your providers.",
      },
    ],
    composeHeading: "The Compose file includes",
    composeItems: [
      "Postgres",
      "Caddy, automatic HTTPS",
      "nightly backups, 14 days kept",
      "optional Prometheus and Grafana with alert rules and a dashboard",
    ],
    loadTestHeading: "What one instance sustained",
    columns: { rate: "Checkouts/s", errors: "Errors", create: "Create p95", read: "Read p95" },
    loadTestCaveat:
      "These numbers measure Yoon itself, with the in-memory demo provider. Real providers add their own latency to each create.",
  },
  not: {
    heading: "What Yoon is not",
    items: [
      {
        title: "Not an aggregator",
        body: "You open your own merchant account with each provider and bring your own keys.",
      },
      {
        title: "Not a card vault",
        body: "Yoon never sees card numbers; cards go through the provider's hosted checkout.",
      },
      {
        title: "Not a checkout UI",
        body: "Yoon returns the provider's checkout URL or push/USSD instruction; your app renders its own UI.",
      },
      {
        title: "Not a hosted service",
        body: "You run it yourself.",
      },
      {
        title: "No telemetry",
        body: "It sends nothing anywhere by default.",
      },
    ],
  },
  openSource: {
    heading: "Open source",
    serverLabel: "Server, core and providers:",
    clientsLabel: "clients and examples:",
    licence: {
      title: "Licences",
      body: "The server is AGPL-3.0 — what that asks of you, in plain words, is in the licensing guide. The client libraries and examples are Apache-2.0. A commercial licence is available.",
    },
    contribute: {
      title: "Contribute",
      body: "Issues and pull requests are welcome; a Contributor License Agreement is required.",
    },
    security: {
      title: "Security",
      body: "Yoon moves money. Report vulnerabilities privately through GitHub's vulnerability reporting.",
    },
    commercial: {
      title: "Commercial licence",
      body: "Open an issue, or contact the maintainer on GitHub.",
    },
  },
  footer: {
    meaning: "Yoon (Wolof): the way, the road.",
    tagline: "Yoon picks the way a payment travels.",
    links: [
      { label: "GitHub", href: "https://github.com/crossben/yoonpay" },
      { label: "Changelog", href: "https://github.com/crossben/yoonpay/blob/main/CHANGELOG.md" },
      {
        label: "Licences",
        href: "https://github.com/crossben/yoonpay/blob/main/docs/licensing.md",
      },
      {
        label: "API contract",
        href: "https://github.com/crossben/yoonpay/blob/main/api/openapi.yaml",
      },
    ],
    copyright: "© 2026 Ben Hattab",
  },
};

export default en;
