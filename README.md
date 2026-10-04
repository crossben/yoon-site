# Yoon website

The one-page site for [Yoon](https://github.com/crossben/yoonpay), a self-hosted,
open-source payment gateway: **yoonpay.benhattab.pro**. English at `/`, French at
`/fr/`. Fully static — the build produces `out/`, which any static host can serve.

Everything factual on the site comes from the gateway repository
([crossben/yoonpay](https://github.com/crossben/yoonpay)): `content/facts.ts` cites a
source for every claim, and `scripts/check-facts.mjs` fails the build when a source file
no longer backs one. The site never modifies the gateway repository.

**This repository builds on its own.** The gateway files the build reads (31 of them: the
cited documents, the client READMEs and provider pages the docs quote, `api/openapi.yaml`, the brand assets) are kept in a committed snapshot,
`gateway/`, with the gateway commit it came from in `gateway/SOURCE.json`. No sibling
checkout and no token are needed to build or deploy — on a VPS, in Docker, on
Cloudflare Pages.

## Requirements

- Node 24 (see `.nvmrc`)
- To **refresh the snapshot** only: the gateway repository checked out at `../yoon-app`
  (or set `YOON_APP_SOURCE`).

## Refresh the gateway snapshot

After the gateway changes (new docs, a new client, updated numbers):

```sh
npm run sync:gateway   # copies the files the site reads from ../yoon-app into gateway/
npm run build          # facts still hold? then commit gateway/
```

Never edit files in `gateway/` by hand. The list of files lives in `scripts/gateway.mjs`
(it never includes the gateway's `CLAUDE.md` or `AGENTS.md`: coding agents would load them
as instructions). CI's `gateway-drift` job re-syncs from the gateway's `main` every day and
fails when the committed snapshot is out of date.

## Adding a provider

Add one entry to `providers` in `content/facts.ts` (its `name` exactly as in the gateway
README's providers table, its `doc` page under `docs/providers/`), then `npm run sync:gateway`.
The sync copies the provider's page into the snapshot, check-facts guards its README row and
page, and the home table and `/docs/providers/` show it with its "not sandbox-tested" status.

## Develop

```sh
npm ci
npm run dev        # http://localhost:3000 — copies brand assets + checks facts first
```

## Build and check

```sh
npm run build      # prebuild copies brand assets, checks facts, then exports out/
npm run lint       # ESLint (Next config)
npm run typecheck  # tsc --noEmit — also enforces that EN and FR have the same copy
npm run check:links
```

`npm run build` works from a clean clone with only `npm ci`.

## How things are wired

| Piece                            | Where                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Facts (single source for claims) | `content/facts.ts`                                                                              |
| Copy per language, typed         | `content/en.ts`, `content/fr.ts`, `content/types.ts`                                            |
| Fact-drift guard                 | `scripts/check-facts.mjs` (prebuild + CI)                                                       |
| API list + response example      | generated from `api/openapi.yaml` by `lib/openapi.ts`                                           |
| Code snippets                    | `lib/snippets.ts` — must match the real clients                                                 |
| Brand assets                     | copied from `$YOON_APP_DIR/docs/assets` by `scripts/copy-brand.mjs`; never edit `public/brand/` |
| Theme                            | `prefers-color-scheme`, manual toggle in `localStorage`, no flash (inline script in `<head>`)   |
| Animation                        | GSAP + ScrollTrigger (`@gsap/react`), three.js hero scene; see `components/HeroScene.tsx`       |

### Animation and accessibility rules

- `prefers-reduced-motion: reduce` → no motion: static hero SVG, fully drawn
  diagram, full terminal text.
- The three.js scene is decorative, never the LCP: loaded on idle
  (`requestIdleCallback`), paused off-screen / on hidden tabs / via the visible
  pause button, DPR capped (1.5, 1 on small screens), frozen to a static frame
  if frames stay above 32 ms, disposed on unmount. No WebGL or `Save-Data` →
  static SVG.
- No analytics, no cookies, no third-party requests (checked by
  `scripts/check-links.mjs`, following Yoon's no-telemetry rule, ADR-0007).

## Licences

- This website's code: **Apache-2.0** (see `LICENSE`, copied from the gateway's
  `clients/LICENSE`).
- **GSAP** ships under its own "Standard no-charge licence" (free, including
  commercial use) — it is not an open-source licence, and remains under its own
  terms. If only open-source dependencies are wanted, swap GSAP for Motion One
  or plain Web Animations.
- three.js: MIT. Fonts (Ubuntu Sans, JetBrains Mono): self-hosted via
  `next/font` (OFL).

## Performance (measured)

Lighthouse 13, mobile emulation (throttled), against `out/` served with gzip:

| Category       | Score |
| -------------- | ----- |
| Performance    | 88    |
| Accessibility  | 100   |
| Best practices | 100   |
| SEO            | 100   |

FCP 1.0 s · LCP 2.3 s · TBT ~0.4 s · CLS 0. The LCP element is the hero text;
the three.js scene is a separate lazy chunk, loaded after `load` + idle, and
never blocks the first paint. Reproduce with:

```sh
npx serve out            # a compressing static server
npx lighthouse http://localhost:3000 --preset=... # default mobile preset
```

JavaScript (gzipped, from the build output): ~233 kB initial, of which ~165 kB
is the Next.js/React framework runtime and ~70 kB is the page + GSAP with
ScrollTrigger and MotionPath; the three.js hero-scene chunk is ~134 kB, loaded
lazily after the page is interactive (within the §7 budget of ~180 kB).

Known deviation from PLAN.md §7: Lighthouse performance is 88, not ≥ 95, and
TBT is ~0.4 s, not < 200 ms. The remaining blocking time is React/Next
framework evaluation on a throttled mid-range mobile CPU; the page itself
ships static HTML for everything (content, diagram, terminal text, code
blocks), so nothing user-facing waits on JavaScript.

## Deploying

The build artifact `out/` is ready for any static host.

- **Docker** — `docker compose up --build` in this directory. The build context is
  this repository alone (deps → builder → runner); the runner is Caddy on :3000
  serving the static export with compression and immutable caching for hashed
  assets. Point a CNAME or A record for `yoonpay` at the host and put HTTPS in
  front — or reuse the gateway's Caddy setup.
- **Cloudflare Pages** — connect the repository; build command `npm run build`,
  output directory `out`, custom domain `yoonpay.benhattab.pro`.
- **Any web server** — upload `out/` and point a CNAME or A record for
  `yoonpay` at it. Serve `/fr/` from `out/fr/` (the build emits
  `fr/index.html`; `trailingSlash` is on, so directory URLs work as-is).

## Open questions for the owner (PLAN.md §10)

1. Hosting for `yoonpay.benhattab.pro` (decides the deploy step and DNS).
2. Contact details for the commercial licence and press — the site links to
   GitHub only until these exist.
3. French copy review before launch (`content/fr.ts`).
4. Footer: link the name to benhattab.pro?
5. Product screenshots (§6): skipped for now — the page is text- and
   diagram-only. Real screenshots from the demo can be added later.

# yoon-site
