// The structure of the docs pages, shared by both languages: which gateway snippets each
// client page shows, in which order. The snippets come from scripts/doc-snippets.mjs; the
// prose around them from content/{en,fr}.ts (`docs`).
import type { Metadata } from "next";
import { clients, repo } from "@/content/facts";
import type { ClientId, Content } from "@/content/types";
import type { DocSnippetId } from "@/lib/docs";

export const SITE = "https://yoonpay.benhattab.pro";

/** Sidebar order. */
export const clientOrder = [
  "php",
  "symfony",
  "java",
  "spring",
  "js",
  "python",
] as const satisfies readonly ClientId[];

export type ClientPage = {
  install: DocSnippetId[];
  create: DocSnippetId[];
  webhook: DocSnippetId[];
  /** The copy-ready prompt for an AI coding agent, from the client README. */
  agent: DocSnippetId;
  /** Inline verification call, for clients whose README documents no framework helper here. */
  verifyInline?: DocSnippetId;
  readme: string;
};

export const clientPages: Record<ClientId, ClientPage> = {
  php: {
    agent: "php.agent",
    install: ["php.install"],
    create: ["php.create", "php.laravelEnv", "php.laravelCreate"],
    webhook: ["php.laravelWebhook"],
    verifyInline: "php.verify",
    readme: `${repo.blob}/clients/php/README.md`,
  },
  symfony: {
    agent: "symfony.agent",
    install: ["symfony.install", "symfony.bundle", "symfony.config"],
    create: ["symfony.create"],
    webhook: ["symfony.webhook"],
    readme: `${repo.blob}/clients/php/README.md#symfony`,
  },
  java: {
    agent: "java.agent",
    install: ["java.install"],
    create: ["java.create"],
    webhook: [],
    verifyInline: "java.verify",
    readme: `${repo.blob}/clients/java/README.md`,
  },
  spring: {
    agent: "spring.agent",
    install: ["spring.install", "spring.config"],
    create: ["spring.create"],
    webhook: ["spring.webhook"],
    readme: `${repo.blob}/clients/java-spring-boot-starter/README.md`,
  },
  js: {
    agent: "js.agent",
    install: ["js.install"],
    create: ["js.create"],
    webhook: ["js.webhook", "js.verify"],
    readme: `${repo.blob}/clients/js/README.md`,
  },
  python: {
    agent: "python.agent",
    install: ["python.install"],
    create: ["python.create"],
    webhook: ["python.webhook", "python.verify"],
    readme: `${repo.blob}/clients/python/README.md`,
  },
};

export { clients };

/** Docs slugs: "" (index), "quickstart", "providers", "clients/<id>". */
export function docsHref(lang: Content["lang"], slug = ""): string {
  return `${lang === "en" ? "" : "/fr"}/docs/${slug ? `${slug}/` : ""}`;
}

/** Per-page metadata with canonical and hreflang alternates for both languages. */
export function docsMetadata(
  content: Content,
  slug: string,
  title: string,
  description: string,
): Metadata {
  const url = docsHref(content.lang, slug);
  const fullTitle = `${title} — Yoon`;
  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: { en: docsHref("en", slug), fr: docsHref("fr", slug) },
    },
    openGraph: {
      type: "website",
      siteName: "Yoon",
      title: fullTitle,
      description,
      url,
      locale: content.lang === "en" ? "en" : "fr_FR",
      images: [{ url: "/brand/social-preview.png", width: 1280, height: 640 }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

/** Every docs slug, for the sitemap. */
export const docsSlugs = [
  "",
  "quickstart",
  ...clientOrder.map((id) => `clients/${id}`),
  "providers",
];
