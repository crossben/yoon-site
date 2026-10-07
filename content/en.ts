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
      "Yoon is a self-hosted, open-source payment gateway: one API in front of PayDunya, DexPay, NabooPay, CinetPay, Wave, Stripe and PI-SPI, with routing, verified webhooks, idempotency, a ledger and reconciliation.",
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
      docs: "Docs",
    },
    themeToggle: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    homeAria: "Yoon — home",
  },
  hero: {
    headline: "One API for Africa's payment providers.",
    subline:
      "A self-hosted, open-source gateway in front of PayDunya · DexPay · NabooPay · CinetPay · Wave · Stripe · PI-SPI — routing, verified webhooks, idempotency, a ledger, reconciliation.",
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
  independent: {
    heading: "Not an aggregator. No cut of your payments.",
    lead: "Yoon is not an aggregator: you open your own merchant accounts with the providers and bring your own keys. Yoon removes the integration work, not the onboarding.",
    points: [
      {
        title: "Nothing to pay Yoon",
        body: "The server is free software under AGPL-3.0: no licence fee and no share of your payments. You run it yourself.",
      },
      {
        title: "The conditions are the licence's",
        body: "Running Yoon unmodified: no obligation beyond keeping the licence notices. Offering it to others over a network: offer them the source.",
      },
      {
        title: "You stay the merchant",
        body: "The providers' contracts, accounts and keys are yours. Yoon sits in front of them; it is not a party to your money.",
      },
    ],
    licensingLabel: "What the AGPL asks of you, plainly",
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
    partialRefund: "Full and partial",
    refundNote:
      "PayDunya, DexPay, NabooPay and CinetPay offer no refund API: refund a customer by sending a payout. Wave (direct) and PI-SPI refund the full amount; Stripe refunds any amount up to what was paid.",
    sandboxNote:
      "The adapters are tested against simulated provider APIs (from production integrations, Wave's and Stripe's public documentation, CinetPay's SDKs and the BCEAO specification) — not yet against the providers' sandboxes.",
    countryNote:
      "PayDunya, DexPay, NabooPay: Senegal. Wave: Senegal, Côte d'Ivoire, Mali, Burkina Faso. PI-SPI: the eight UEMOA countries. CinetPay: nine West and Central African countries. Stripe: cards from anywhere.",
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
      "Client libraries for PHP, Java, JavaScript and Python — plus a Symfony bundle and a Spring Boot starter — with idempotency-key-first helpers and webhook verification built in.",
    contractNote:
      "The four language clients are generated from api/openapi.yaml — the contract the server is tested against; the Symfony bundle and the Spring Boot starter build on the PHP and Java clients.",
    clientLabels: {
      php: "PHP / Laravel",
      java: "Java",
      js: "JavaScript / TypeScript",
      symfony: "Symfony",
      python: "Python",
      spring: "Spring Boot",
    },
    e2eNote:
      "The JavaScript and Python clients run a shared end-to-end scenario against a real server in CI:",
    tabLabels: {
      laravel: "Laravel",
      php: "PHP",
      symfony: "Symfony",
      java: "Java",
      js: "TypeScript",
      python: "Python",
      curl: "curl",
    },
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
    envHint: "Edit me — copy the result into your own .env",
    envRandomise: "Randomise secrets",
    envReset: "Reset",
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
        title: "Not a payment form",
        body: "Yoon never collects card or wallet details. It returns the provider's checkout URL or push/USSD instruction, or — with the optional hosted checkout — lets the customer pick a method, then hands them to the provider.",
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
  docs: {
    heroCta: "Docs",
    navLabel: "Documentation",
    navQuickstart: "Quickstart",
    navClients: "Client libraries",
    navProviders: "Providers",
    sourceLabel: "From",
    index: {
      title: "Documentation",
      description:
        "Run Yoon with the demo provider, take a first payment, and integrate it from PHP, Symfony, Java, Spring Boot, JavaScript or Python.",
      intro:
        "Every command and snippet on these pages is copied from the gateway repository — its README and each client's README — and the build fails if they drift apart.",
      quickstartBody:
        "Docker Compose, the demo provider, an API key, a first payment with curl and a signed webhook. No provider account, no real money.",
      clientsBody: "Install, create a payment with an idempotency key, verify a webhook.",
      providersBody: "What each provider does, and where its configuration is documented.",
      apiLabel: "API contract (OpenAPI)",
    },
    quickstart: {
      title: "Quickstart",
      description:
        "Run Yoon with Docker Compose and the demo provider, create an API key, take a first payment with curl and receive a webhook.",
      intro:
        "You need Docker and a clone of the repository. The demo provider serves its own checkout page: you click Pay or Decline, and a signed callback travels the real pipeline. No money moves — never enable it in production.",
      steps: {
        start: {
          title: "Configure Yoon",
          body: "At the repository root, create .env. It enables the demo provider for an application named shop, and says where Yoon sends that application's events. The webhook secret must be at least 32 characters.",
          after:
            "In a variable name, <APP> is the application name upper-cased, with - turned into _: shop becomes SHOP.",
        },
        app: {
          title: "Start it, create the application and its API key",
          body: "The operator command line creates the application and prints its API key once: copy it. Then restart Yoon, which reads provider and webhook settings at startup.",
        },
        pay: {
          title: "Create a first payment",
          body: "Replace yk_… with your key. Every write carries an Idempotency-Key: the same request sent again returns the original payment instead of charging twice.",
          after:
            "With the demo provider enabled for the application, the payment comes back pending with a checkout_url: open it and click Pay. Without a provider configured, Yoon answers 422 no_provider_for_method — that is the routing working.",
        },
        webhook: {
          title: "Receive the webhook",
          body: "When the payment settles, Yoon POSTs a signed event such as payment.succeeded to the application's webhook URL — in this .env, port 8010 on your machine. Events are also listed at GET /v1/events for catching up.",
          signature: "Every delivery carries this header:",
          rules:
            "Compute this HMAC over the raw body, compare it in constant time with v1, and reject the delivery if t is more than 5 minutes old. Delivery is at-least-once and unordered: deduplicate on the event id.",
          clients: "Each client library does this for you:",
        },
      },
      cliTitle: "Applications and keys",
      cliBody:
        "The same command line lists applications, issues another key for rotation and revokes one. A key is shown only once.",
    },
    client: {
      titles: {
        php: "PHP and Laravel",
        symfony: "Symfony",
        java: "Java",
        spring: "Spring Boot",
        js: "JavaScript and TypeScript",
        python: "Python",
      },
      description:
        "Install Yoon's {client} client, create a payment with an idempotency key and verify Yoon's webhooks.",
      requiresLabel: "Requires",
      install: "Install",
      create: "Create a payment",
      createNote:
        "The idempotency key is required on every write. Tie it to your order: a retry with the same key can never charge twice.",
      webhook: "Verify a webhook",
      webhookNote:
        "The helper checks the signature over the raw body and rejects a wrong or stale one with 401, answers an already-handled event with 200 without calling your code, and remembers an event only after your code answered 2xx. Events are unordered: act on the state in the event's object.",
      verifyInline: "To verify a signature yourself, over the raw request body:",
      captions: {
        "php.create": "Plain PHP",
        "php.laravelEnv": "Laravel — .env",
        "php.laravelCreate": "Laravel — the facade",
        "php.laravelWebhook": "Laravel — the yoon.webhook middleware",
        "symfony.bundle": "Register the bundle",
        "symfony.config": "Configure it",
        "symfony.create": "Yoon\\Yoon is autowirable",
        "symfony.webhook": "#[YoonWebhook] on the controller",
        "spring.config": "Configuration",
        "spring.create": "Inject the auto-configured Yoon bean",
        "spring.webhook": "The starter's filter verifies the event before your controller",
        "js.webhook": "Express",
        "js.verify": "Outside a framework",
        "python.webhook": "Django",
        "python.verify": "Outside a framework",
      },
      readmeLabel: "Other frameworks, errors and every helper: the client's README",
    },
    providers: {
      title: "Providers",
      description:
        "The payment providers Yoon supports, what each one does, and where its configuration is documented.",
      intro:
        "You open your own merchant account with each provider and bring your own keys: Yoon removes the integration work, not the onboarding. Each provider's page lists the credentials to set, how its statuses map to Yoon's, and its quirks.",
      columns: {
        provider: "Provider",
        collect: "Collect",
        payout: "Payout",
        refund: "Refund",
        status: "Status",
        doc: "Docs",
      },
      notTested: "Not sandbox-tested",
      docLink: "Configuration",
      configNote:
        "Providers are enabled per application with environment variables — YOON_APPS_<APP>_PROVIDERS_<PROVIDER>_PRIORITY and _CREDENTIALS_<KEY> — read at startup: restart Yoon after changes.",
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
