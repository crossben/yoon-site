// The shape every language must fill completely. content/fr.ts is typed by this,
// so a missing or misspelled French string fails `npm run typecheck`.
import type { clients, guaranteeSources, providers } from "./facts";
import type { codeSnippets } from "../lib/snippets";

type SnippetId = keyof typeof codeSnippets;

export type Nav = {
  how: string;
  guarantees: string;
  providers: string;
  code: string;
  api: string;
  demo: string;
  run: string;
  pispi: string;
};

export type Content = {
  lang: "en" | "fr";
  /** The other language's route and its label. */
  otherLang: { href: string; label: string };
  meta: { title: string; description: string };
  header: {
    skipToContent: string;
    nav: Nav;
    themeToggle: { toLight: string; toDark: string };
    homeAria: string;
  };
  hero: {
    headline: string;
    subline: string;
    ctaDemo: string;
    ctaGithub: string;
    statusLine: string;
    scene: {
      labels: { app: string; yoon: string; providers: readonly string[] };
      description: string;
      pause: string;
      play: string;
    };
  };
  independent: {
    heading: string;
    lead: string;
    points: { title: string; body: string }[];
    licensingLabel: string;
  };
  problem: {
    heading: string;
    cards: { title: string; body: string }[];
  };
  how: {
    heading: string;
    intro: string;
    intent: string;
    outcome: string;
    timeout: string;
    timeoutOutcome: string;
    srDescription: string;
    steps: string[];
  };
  guarantees: {
    heading: string;
    whyLabel: string;
    items: {
      key: keyof typeof guaranteeSources;
      title: string;
      body: string;
      why: string;
    }[];
  };
  providersTable: {
    heading: string;
    columns: { provider: string; collect: string; payout: string; refund: string };
    none: string;
    refundNote: string;
    fullRefund: string;
    sandboxNote: string;
    countryNote: string;
  };
  pispi: {
    heading: string;
    intro: string;
    stackLabel: string;
    layers: {
      app: { title: string; body: string };
      yoon: { title: string; body: string };
      providers: { title: string; body: string; pispiRoute: string; plannedBadge: string };
      rails: { title: string; body: string };
    };
    compare: {
      heading: string;
      columns: { aspect: string; pispi: string; yoon: string };
      rows: { aspect: string; pispi: string; yoon: string }[];
    };
    use: { heading: string; items: string[] };
    statusNote: string;
    caveat: string;
    links: { site: string; developer: string };
  };
  code: {
    heading: string;
    intro: string;
    contractNote: string;
    /** Labels for the library cards, keyed like content/facts.ts `clients`. */
    clientLabels: Record<keyof typeof clients, string>;
    e2eNote: string;
    tabLabels: Record<SnippetId, string>;
    responseLabel: string;
    copy: string;
    copied: string;
  };
  api: {
    heading: string;
    intro: string;
    generatedNote: string;
    referenceLabel: string;
  };
  demo: {
    heading: string;
    firstLine: string;
    step1Title: string;
    step1Note: string;
    step2Title: string;
    step2Note: string;
    step3Title: string;
    step3Body: string;
    terminalLabel: string;
    terminalNote: string;
    linkLabel: string;
    envHint: string;
    envRandomise: string;
    envReset: string;
  };
  run: {
    heading: string;
    intro: string;
    steps: { title: string; body: string }[];
    composeHeading: string;
    composeItems: string[];
    loadTestHeading: string;
    loadTestCaveat: string;
    columns: { rate: string; errors: string; create: string; read: string };
  };
  not: {
    heading: string;
    items: { title: string; body: string }[];
  };
  openSource: {
    heading: string;
    serverLabel: string;
    clientsLabel: string;
    licence: { title: string; body: string };
    contribute: { title: string; body: string };
    security: { title: string; body: string };
    commercial: { title: string; body: string };
  };
  footer: {
    meaning: string;
    tagline: string;
    links: { label: string; href: string }[];
    copyright: string;
  };
};

export type { clients, guaranteeSources, providers };
