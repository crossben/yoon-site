# Yoon website — build plan

A one-page site that explains Yoon, deployed at **https://yoonpay.benhattab.pro**.

This plan is for the agent building the site. Follow it in order. When something here is
ambiguous, **stop and ask** rather than guessing. A reviewer checks the result against §9 and
sends back anything that fails it.

## Two repositories

```
yoon/
├── yoon-app/   the gateway — its own git repository (github.com/crossben/yoonpay)
└── website/    this site — its own git repository
```

In this plan, **paths without a `website/` prefix are paths in the gateway repository**, which the
site reads but never modifies. **Update (after review):** the build does not read `../yoon-app`
directly — a production host clones only this repository. It reads a committed snapshot,
`gateway/`, refreshed with `npm run sync:gateway`; CI's `gateway-drift` job fails when the
snapshot falls behind the gateway. See `README.md` § Refresh the gateway snapshot.

---

## 0. The one rule: no claim the repository doesn't back up

Yoon is a payments project. A website that overstates it damages trust more than having no
website. Every factual sentence on the site (numbers, capabilities, guarantees) must come from
the **facts sheet (§4)**, which cites its source in the gateway repository. Anything not in §4 does not
go on the site.

**Banned.** Reviewers reject on sight:

- testimonials, customer logos, "trusted by", user or adoption counts, GitHub star counts;
- "production-ready", "battle-tested", "bank-grade", "enterprise-grade", "secure" on its own,
  "PCI compliant", "certified", "licensed", "regulated", "aggregator";
- any performance number not in §4, or a number from §4 without its caveat;
- provider logos. Use the providers' names in text only (their logos are their trademarks);
- promises of features that don't exist: other countries, currencies other than XOF, providers
  other than PayDunya, DexPay and NabooPay, a hosted/SaaS version, refunds through PayDunya,
  DexPay or NabooPay, an admin UI, and NabooPay payouts;
- invented contact details: email addresses, phone numbers, company names, addresses. Link to
  GitHub instead; the owner adds contact details later (§10);
- animations that pretend to show live activity: "live transactions" tickers, fake request
  counters, fake dashboards, streams of invented payments. Animations illustrate how Yoon
  works; they never suggest real traffic or users;
- stock photos, AI-generated people, fake screenshots of the product. Real screenshots only
  (Swagger UI at `/docs` and the demo checkout page are real and can be captured, §6).

---

## 1. Where and with what

- **Location:** the `website/` repository (sibling of `yoon-app/`). The site's own code is
  Apache-2.0: add `LICENSE` by copying `$YOON_APP_DIR/clients/LICENSE`.
- **Framework:** Next.js, the latest stable release when you start (check `npm view next version`),
  App Router, TypeScript in `strict` mode.
- **Output:** fully static, `output: 'export'` in `next.config.ts`. No server, no API routes, no
  middleware, no runtime data fetching. The build produces `website/out/`, which any static host
  can serve.
- **Styling:** Tailwind CSS (latest stable, v4 CSS-first config). No component library.
- **Animation:** GSAP (with ScrollTrigger and `@gsap/react`'s `useGSAP` for cleanup) and
  three.js — see §5a for what animates and §7 for the budget. Both are installed from npm and
  bundled; nothing loads from a CDN. Use plain `three`, not react-three-fiber (smaller, and one
  scene doesn't need it). **Licence note for the owner:** three.js is MIT, but GSAP (free,
  including commercial use) ships under its own "Standard no-charge licence", not an
  open-source licence. The site's code stays Apache-2.0; GSAP remains under its own terms. Say
  so in `README.md`. If the owner wants only open-source dependencies, swap GSAP for Motion
  One or plain Web Animations — ask before starting §5a.
- **Fonts:** self-hosted through `next/font`. Use **Ubuntu Sans** for text (it matches the
  logo's rounded geometry and is on Google Fonts) and **JetBrains Mono** for code. Nothing loads
  from a font CDN at runtime.
- **Code highlighting:** Shiki at build time (server components), so no highlighter ships to
  the browser.
- **Package manager:** npm with a committed `package-lock.json`. Node version pinned in
  `website/.nvmrc` (current LTS).
- **No analytics, no cookies, no third-party scripts.** Yoon's own rule is no telemetry
  (ADR-0007), and the site follows it. That also means no cookie banner.

---

## 2. Brand

Use the files in `$YOON_APP_DIR/docs/assets/` **as they are**: copy them into `public/brand/` at build
time with a small `prebuild` script, so there is one source of truth. Never redraw or recolour
the logo.

| Asset | Use |
| --- | --- |
| `logo.svg` / `logo-dark.svg` | header and hero wordmark (light / dark theme) |
| `mark.svg` | decorative road-Y in the "how it works" section |
| `icon.svg` | favicon (`app/icon.svg`) |
| `social-preview.png` | Open Graph and Twitter image |

**Palette** (taken from the logo; define as CSS variables):

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#F4EFE6` sand | `#14120F` | page background |
| `--surface` | `#FFFFFF` | `#1D1B18` | cards, code blocks |
| `--ink` | `#1D1B18` | `#F4EFE6` | text |
| `--muted` | `#6B655B` | `#B3AB9E` | secondary text |
| `--accent` | `#B5532E` terracotta | `#D8744D` | links, highlights, the road |
| `--line` | `#E2DACB` | `#2E2A25` | borders |

- **Contrast:** body text must meet WCAG AA (4.5:1). Measured ratios:

| Pair | Ratio |
| --- | --- |
| ink on sand | 15.00:1 |
| muted on sand | 5.04:1 |
| accent on white | 4.95:1 |
| **accent on sand** | **4.32:1** (fails for body text) |
| dark ink on dark bg | 16.33:1 |
| dark muted on dark bg | 8.22:1 |
| dark accent on dark bg | 5.81:1 |

  So on `--bg`, use the accent only for large text (≥ 24 px, or ≥ 18.7 px bold), icons, borders
  and underlined links with ink-coloured text, never for body-size text. Re-check any new pair
  and list the ratios in the pull request.

- **Theme:** follow `prefers-color-scheme`, with a manual toggle stored in `localStorage` (read it
  in an inline script in `<head>` so the page doesn't flash).
- **Tone:** plain, direct, developer-to-developer. Short sentences, concrete examples, no hype.
  The Wolof meaning is the one story the brand tells: _yoon_ = the road, and the Y is a road
  forking, because Yoon picks the way a payment travels.

---

## 3. Languages

English at `/` and French at `/fr/`. French matters: the first users are in Senegal.

- Put all copy in `website/content/en.ts` and `website/content/fr.ts`, typed by one shared
  `Content` type, so a missing French string fails the type check. Don't use an i18n library;
  two statically generated routes are enough.
- `<html lang>`, `hreflang` alternates and a language switch that keeps the current section
  anchor.
- Technical terms stay in English inside code and API names (`Idempotency-Key`, `payment.succeeded`).
- The owner reviews the French copy before launch (§10). Write natural French, not a
  word-for-word translation.

---

## 4. Facts sheet — the only source for claims

Put these in `website/content/facts.ts` and import them. Never retype a fact in copy.

| Fact | Value | Source |
| --- | --- | --- |
| What it is | Self-hosted, open-source payment gateway: one API in front of several African payment providers | `README.md` |
| Name meaning | _Yoon_ (Wolof): the way, the road | `README.md` |
| Providers | PayDunya (collect, payout), DexPay (collect, payout), NabooPay (collect only) | `README.md` § Providers, `docs/providers/*.md` |
| Methods | Wave, Orange Money, Free Money, card | `README.md` § Providers |
| Country / currency | Senegal, XOF only | `CHANGELOG.md` § Known limitations |
| Refunds | Supported by the API, but none of the three providers offers a refund API: refund by payout | `README.md` § Providers |
| Provider testing status | Adapters tested against simulated APIs built from production integrations, **not yet against the providers' sandboxes** | `README.md` status line |
| Money safety | A timeout is "unknown", never "failed": no failover or retry after a request may have reached a provider; payouts are sent once | `README.md`, ADR-0010 |
| Callbacks | Stored, signature checked, then re-confirmed with the provider's status API before anything changes | ADR-0012 |
| Amounts | A payment settles only if the confirmed amount equals the requested amount | `CLAUDE.md` Money safety |
| Ledger | Double-entry shadow ledger; Postgres itself refuses unbalanced or edited entries | ADR-0012, `LedgerDatabaseGuardTest` |
| Idempotency | Every write needs an `Idempotency-Key`; retries return the original result | `api/openapi.yaml` |
| Events to apps | Signed (HMAC-SHA256 with timestamp), retried with backoff, dead-lettered, replayable | ADR-0012 |
| Reconciliation | Stuck payments settle automatically; unknown payouts are flagged for a human | ADR-0012 |
| Clients | PHP/Laravel `yoonpay/yoon-php` (Laravel 10–13), Java `io.github.crossben:yoon-java` (Java 17+) | `README.md` § Client libraries, ADR-0018 |
| Demo | `YOON_DEMO_ENABLED=true`: demo provider, checkout page served by Yoon, no money moves | `README.md` § Try it |
| Load test | One instance, laptop (i7-11800H, Docker Desktop), in-memory demo provider: 100/200/300 checkouts per second, 0 % errors, create p95 36/37/42 ms. **Caveat always shown:** measures Yoon itself; real providers add their own latency | `docs/load-test.md` |
| Licence | Server AGPL-3.0; clients and examples Apache-2.0; commercial licence available | `docs/licensing.md` |
| Not | Not an aggregator (you bring your own merchant accounts); not a card vault; not a checkout UI; not a hosted service; no telemetry | `README.md` § What Yoon is not |
| Version | 0.1.0 | `CHANGELOG.md` |
| Repository | https://github.com/crossben/yoonpay | ADR-0017 |

**Guard against drift:** write `scripts/check-facts.mjs` (run in `prebuild` and in CI). It reads
the source files from `$YOON_APP_DIR` and fails with a clear message if that directory is missing.
For each fact that comes from a file, it asserts that a key string still appears in that file,
and fails the build otherwise. Examples: `docs/load-test.md` contains `| 300 | 71 948 | 0 % |`;
`CHANGELOG.md` contains `## [0.1.0]`; `README.md` contains `NabooPay`. When the repository
changes, the website build breaks until the facts are updated. That is intended.

Also generate the **API at a glance** list (§5, section 7) at build time from `api/openapi.yaml`:
parse it with the `yaml` package, keep only the operations tagged Payments, Refunds, Payouts,
Events, Ledger, Exports or Meta, and render method + path + summary. Never hand-write the
endpoint list.

---

## 5. The page, section by section

One page, with anchored sections and a sticky header (logo, section links, language, theme,
GitHub). The copy below is a brief for each section: write the final text within these limits.

1. **Hero.**
   - Wordmark.
   - Headline, in the spirit of "One API for Africa's payment providers".
   - One-sentence subline: self-hosted, open source, PayDunya · DexPay · NabooPay.
   - Buttons: "Try the demo" (anchor to section 8) and "GitHub".
   - Right under the buttons, the status line in small text: _v0.1.0 — adapters not yet tested
     against provider sandboxes._ This is required, not optional.
2. **The problem.** Every project re-integrates each provider, in every language, and re-solves
   webhook verification, idempotency and stuck payments. Three short cards; no statistics.
3. **How a payment travels.** The signature visual:
   - an inline SVG where the app sends _intent_ ("5 000 XOF by Wave") to Yoon, and the road
     forks to the providers;
   - the chosen route lights up; a timeout does **not** fork to another provider (this is Yoon's
     core idea, so show it);
   - driven by GSAP ScrollTrigger (§5a), static diagram under `prefers-reduced-motion`, with a
     text description for screen readers.
4. **What Yoon guarantees.** Six items from the money-safety rows of §4:
   - timeout ≠ failure;
   - callbacks re-confirmed;
   - amounts must match;
   - ledger enforced by Postgres;
   - idempotent writes;
   - payouts sent once.

   Each item: one sentence plus a "why it matters" line. Link each to its ADR on GitHub.

5. **Providers.** A table from §4: provider, collect, payout, refund, methods. Show the refund
   note and the sandbox-testing status next to the table, not in a footnote.
6. **Your code.** Tabs: Laravel, plain PHP, Java, curl. Short, real snippets adapted from
   `clients/php/README.md`, `clients/java/README.md` and `examples/laravel-shop`: create a
   payment with an idempotency key, then handle the webhook. Each snippet must match the real
   client API exactly (the reviewer compiles or diffs them, §9). Include a "copy" button.
7. **API at a glance.** The generated endpoint list (§4), grouped by tag, with a link to the
   full reference. The reference is Swagger UI, served by each Yoon instance at `/docs`, so
   link to the OpenAPI file on GitHub; do not host a live instance.
8. **Try it in 5 minutes.** The demo steps from `examples/laravel-shop/README.md`, in order,
   copy-pasteable. The first line says: no provider account, no real money.
9. **Run it yourself.** Deploy in three steps (links to `docs/deploy.md`), what the Compose file
   includes (Postgres, Caddy HTTPS, backups, optional Prometheus/Grafana), and the load-test
   table with its caveat and hardware line (§4).
10. **What Yoon is not.** The five items from §4. Being honest about this builds trust.
11. **Open source.** Licences in plain words (link `docs/licensing.md`); contribute (link
    `CONTRIBUTING.md`, mention the CLA); security reports go through `SECURITY.md`; commercial
    licence: "open an issue or contact the maintainer on GitHub" until §10 gives a contact.
12. **Footer.** Logo mark, the Wolof meaning, links (GitHub, docs, changelog, licence),
    "© 2026 Ben Hattab". No social icons unless the owner provides accounts.

Target: under 1 200 words of copy per language, and the whole page readable in 4 minutes.

---

## 5a. Animation — "dev style", but honest

The feel: a terminal and an architecture diagram come to life. It's precise and quiet: things
draw, type and route; nothing bounces or sparkles. Every animation explains something true
about Yoon.

### three.js — one scene, in the hero

- **What:** a low-poly, isometric-ish 3D road network in brand colours on the page background.
  An "app" node on one side; the road runs to a **Y fork** (the logo, in 3D) and splits to three
  provider nodes labelled in text: PayDunya, DexPay, NabooPay. Small glowing packets (payments)
  travel the road and take a branch. Every so often one packet reaches a provider, stalls with
  a subtle "timeout" pulse, and **waits there**; it never jumps to another branch. That is the
  no-failover rule, shown.
- **Style:** flat-shaded geometry, a few hundred triangles, no textures, no post-processing
  that costs much (at most a cheap bloom on the packets). Terracotta road, sand and ink
  surfaces; a dark-theme variant. Slow camera drift, and gentle parallax on pointer move
  (desktop only).
- **Loading:** the scene is **decorative and never the LCP element**. The hero text and
  wordmark render first as HTML. Load the scene with `next/dynamic` (`ssr: false`) after the
  page is idle (`requestIdleCallback`, with a timeout fallback). Until it arrives, and forever
  when it can't run, show a static SVG of the same composition (drawn from `mark.svg`).
- **Runs only when it should:**
  - render only while visible (IntersectionObserver) and while the tab is visible;
  - cap device pixel ratio at 1.5, and 1 on small screens;
  - target 60 fps and drop to a static frame if the frame time stays above 32 ms;
  - dispose geometries, materials and the renderer on unmount.
- **Fallbacks:** no WebGL, `prefers-reduced-motion`, or `Save-Data` → the static SVG. A visible
  **pause/play button** on the scene (WCAG 2.2.2: anything that moves for more than 5 s must be
  pausable). The canvas is `aria-hidden`; the section has a text description.

### GSAP — small, purposeful moments

- **Terminal typing** (section 8, "Try it in 5 minutes"): the demo commands type themselves into
  a terminal-styled block, line by line, followed by their real output (the key line shows
  `yk_…` masked). The real, copyable commands sit next to it. The animation plays once, when
  scrolled into view.
- **Route drawing** (section 3): ScrollTrigger scrubs the SVG diagram. Paths draw with
  `stroke-dashoffset`, the intent label travels to Yoon, the chosen branch lights up, and the
  timeout branch shows its "unknown → waits for the provider's status" step.
- **Request/response** (section 6): when a code tab opens, the HTTP request highlights and then
  the JSON response "streams" in token by token. Use the real response shape from
  `$YOON_APP_DIR/api/openapi.yaml`.
- **Reveals:** section headings and the guarantee cards fade and slide up 12 px with a short
  stagger, once. No parallax on text.
- **Load-test table:** no counting-up numbers. The values appear as they are, with their caveat
  (animated counters read as live data).

### Rules for every animation

- `prefers-reduced-motion: reduce` → no motion at all: final states render immediately, the
  hero shows the static SVG, and typing shows the full text.
- Nothing flashes more than 3 times per second. Nothing auto-plays sound.
- Content is readable and usable with JavaScript disabled (animations only enhance
  server-rendered HTML).
- All GSAP code in client components using `useGSAP` (cleanup on unmount, no leaks between
  language routes). Register plugins once.
- Durations are short: 200–600 ms for UI, and at most 1.5 s for a scrubbed or typed sequence step.

---

## 6. Screenshots (optional, real only)

If you add product screenshots, capture them from a local instance run with the demo
(`examples/laravel-shop/README.md`): the Swagger UI at `/docs` and the demo checkout page. Save
them as optimised WebP files in `website/public/screens/`, with alt text. Never edit them to show
data or features that don't exist.

---

## 7. Quality bar

- **Lighthouse (mobile):** Performance ≥ 95, Accessibility 100, Best practices 100, SEO 100.
  Attach the report to the pull request.
- **JavaScript:**
  - at most ~100 kB gzipped loaded before the page is interactive. That covers the theme
    toggle, the language switch, the code tabs, the copy buttons and GSAP with ScrollTrigger
    (about 45 kB);
  - three.js and the hero scene form a separate chunk loaded when the page is idle, at most
    ~180 kB gzipped. Tree-shake it by importing only the three.js classes you use;
  - report both sizes (from `next build` output) in the pull request.
- **Responsive:** from 360 px wide, with no horizontal scroll and a 16 px side gutter on mobile.
- **Keyboard:** everything reachable, visible focus rings, a skip-to-content link, and tabs that
  follow the ARIA tabs pattern.
- **Motion:** exactly what §5a lists, nothing more; every rule in §5a holds.
- **Performance with animation:**
  - the Lighthouse targets above apply **with** the scene and GSAP enabled;
  - Total Blocking Time < 200 ms;
  - CLS < 0.05: the scene container and terminal blocks have fixed dimensions;
  - the hero LCP is text or the wordmark, never the canvas.
  - Test on a throttled mid-range mobile profile.
- **SEO:**
  - per-language `metadata` (title, description, canonical, `hreflang`);
  - Open Graph image `social-preview.png`;
  - `sitemap.xml` and `robots.txt` generated at build;
  - JSON-LD `SoftwareSourceCode` pointing to the repository.
- **Links:** a link checker (e.g. `lychee` in CI) passes; every GitHub link points to
  `github.com/crossben/yoonpay/blob/main/...`.

---

## 8. Repository integration

- `website/package.json` scripts:
  - `dev`;
  - `prebuild` (copies brand assets and runs `check-facts`);
  - `build`;
  - `lint` (ESLint with the Next config);
  - `typecheck` (`tsc --noEmit`);
  - `format` (Prettier).
- **CI:** `.github/workflows/ci.yml` in the website repository. Check out this repository, then
  the gateway into `yoon-app/` with `actions/checkout` (`repository: crossben/yoonpay`,
  `path: yoon-app`; while the gateway repository is private this needs a read-only token in a
  secret, e.g. `YOON_APP_READ_TOKEN`), set `YOON_APP_DIR=yoon-app`, then run `npm ci`, `lint`,
  `typecheck`, `build` and the link check, and upload `out/` as an artifact. Also run it on a
  daily schedule, so facts that drift in the gateway repository are caught even without a
  website change.
- **Deployment:** **don't implement a deploy step** until the owner picks a host (§10). The
  artifact is ready for any static host. Document the two likely options in `README.md`:
  - **Cloudflare Pages** (connect the repo, build command `npm run build`, output `out`, custom
    domain `yoonpay.benhattab.pro`; the build needs the gateway checked out, so use the GitHub
    Actions artifact or a build script that clones it);
  - **any web server** (upload `out/`, point a CNAME or A record for `yoonpay` at it).
- **Never modify the gateway repository.** If the site needs something there (a link to the site
  in its README, a missing fact), list it in the pull request for the owner.

---

## 9. Review checklist (the reviewer will run this)

- [ ] Every sentence with a number, capability or guarantee is traceable to §4; nothing from the
      banned list (§0).
- [ ] The status line (not sandbox-tested) is visible in the hero and next to the providers
      table.
- [ ] `check-facts` fails when a source string is changed (the reviewer edits one to try).
- [ ] The API list is generated from `api/openapi.yaml`: no admin or provider-callback routes.
- [ ] Code snippets match the real clients:
  - PHP compiles against `$YOON_APP_DIR/clients/php` (`php -l` plus a quick run with a mocked Guzzle);
  - Java compiles against `$YOON_APP_DIR/clients/java`;
  - the curl command works against a local demo instance.
- [ ] The demo steps, followed exactly on a clean machine, end with a paid order.
- [ ] EN and FR have the same sections; `hreflang` is correct; French reads naturally.
- [ ] Lighthouse scores and the contrast ratios are in the pull request; keyboard-only
      navigation works; reduced motion works.
- [ ] No request leaves the page for a third-party domain (check the browser's network tab).
- [ ] Animations, checked by the reviewer:
  - with `prefers-reduced-motion` on, nothing moves, and the static hero SVG and full terminal
    text show;
  - the pause button stops the scene;
  - with WebGL disabled, the fallback shows;
  - the scene stops rendering when scrolled away (CPU drops);
  - the no-failover packet never switches branch;
  - nothing implies live traffic.
- [ ] Bundle sizes for the initial load and the scene chunk are in the pull request and within §7.
- [ ] `npm run build` works from a clean clone with only `npm ci`.

---

## 10. Open questions for the owner (don't guess these)

1. **Hosting** for `yoonpay.benhattab.pro`: Cloudflare Pages, Vercel, your own server, or
   Hostinger? This decides the deploy step and the DNS record.
2. **Contact** for the commercial licence and for press: an email address, or GitHub only?
3. **French copy review:** who proofreads it before launch?
4. **Author presence:** should the footer name you and link to benhattab.pro?
5. **Screenshots:** include them (§6), or keep the page text- and diagram-only?

---

## 11. Suggested order of work

1. `git init` in `website/`, scaffold Next.js (static export, Tailwind, fonts, brand copy script,
   theme); `PLAN.md` stays in the repository root.
2. `facts.ts`, `check-facts.mjs`, and the OpenAPI loader.
3. Page skeleton with every section in English, using the real facts.
4. The "how a payment travels" diagram (static SVG first, then the GSAP route drawing).
5. Code tabs with verified snippets, then the GSAP typing and response streaming.
   5b. The three.js hero scene, last among the visuals (the static SVG fallback ships first), with
   pause, reduced-motion and no-WebGL fallbacks.
6. French content.
7. SEO, sitemap, JSON-LD, accessibility pass, Lighthouse.
8. CI workflow and `README.md`.
9. Open a pull request with the Lighthouse report, contrast ratios, the answers still needed
   from §10, and anything in this plan you had to interpret.
