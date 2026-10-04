// The shape every language must fill completely. content/fr.ts is typed by this,
// so a missing or misspelled French string fails `npm run typecheck`.
import type { clients, guaranteeSources, providers } from "./facts";
import type { codeSnippets } from "../lib/snippets";
import type { DocSnippetId } from "../lib/docs";

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
  docs: string;
};

export type ClientId = keyof typeof clients;

/** Copy for the developer docs (/docs/…). Snippets themselves are never translated. */
export type DocsContent = {
  /** Hero link to the docs. */
  heroCta: string;
  /** Sidebar */
  navLabel: string;
  navQuickstart: string;
  navClients: string;
  navProviders: string;
  /** Label before the gateway file a snippet is copied from. */
  sourceLabel: string;
  index: {
    title: string;
    description: string;
    intro: string;
    quickstartBody: string;
    clientsBody: string;
    providersBody: string;
    apiLabel: string;
  };
  quickstart: {
    title: string;
    description: string;
    intro: string;
    steps: {
      start: { title: string; body: string; after: string };
      app: { title: string; body: string };
      pay: { title: string; body: string; after: string };
      webhook: { title: string; body: string; signature: string; rules: string; clients: string };
    };
    cliTitle: string;
    cliBody: string;
  };
  client: {
    /** Page title per client, e.g. "PHP and Laravel". */
    titles: Record<ClientId, string>;
    /** "{client}" is replaced by the client's title. */
    description: string;
    requiresLabel: string;
    install: string;
    create: string;
    createNote: string;
    webhook: string;
    webhookNote: string;
    /** Sentence introducing the inline verify call, for clients that only document one. */
    verifyInline: string;
    /** Optional caption above a snippet. */
    captions: Partial<Record<DocSnippetId, string>>;
    readmeLabel: string;
  };
  providers: {
    title: string;
    description: string;
    intro: string;
    columns: {
      provider: string;
      collect: string;
      payout: string;
      refund: string;
      status: string;
      doc: string;
    };
    notTested: string;
    docLink: string;
    configNote: string;
  };
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
    partialRefund: string;
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
  docs: DocsContent;
  footer: {
    meaning: string;
    tagline: string;
    links: { label: string; href: string }[];
    copyright: string;
  };
};

export type { clients, guaranteeSources, providers };
