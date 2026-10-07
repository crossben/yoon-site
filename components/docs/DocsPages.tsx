// The developer docs (/docs/… and /fr/docs/…). Static, server-rendered, no animation
// (website/PLAN.md §5a lists every animation the site has; docs pages add none).
// Snippets are read verbatim from the gateway snapshot (lib/docs.ts); prose comes from
// content/{en,fr}.ts; facts from content/facts.ts.
import type { ReactNode } from "react";
import { clients, providers, repo, version } from "@/content/facts";
import type { ClientId, Content } from "@/content/types";
import { docInline, docSnippet, type DocSnippetId } from "@/lib/docs";
import { clientOrder, clientPages, docsHref } from "@/lib/docsPages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import ExternalArrow from "@/components/ExternalArrow";

const linkClass =
  "font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent";

function Sidebar({ content, slug }: { content: Content; slug: string }) {
  const { docs } = content;
  const item = (to: string, label: string, sub = false) => (
    <li key={to}>
      <a
        href={docsHref(content.lang, to)}
        aria-current={slug === to ? "page" : undefined}
        className={`block rounded-md px-3 py-1.5 text-sm transition-colors hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-ink ${
          sub ? "pl-6 text-muted" : "text-muted"
        }`}
      >
        {label}
      </a>
    </li>
  );
  return (
    <nav aria-label={docs.navLabel} className="lg:sticky lg:top-24">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">
        <a href={docsHref(content.lang)} className="hover:text-ink">
          {docs.navLabel}
        </a>
      </p>
      <ul className="mt-3 space-y-0.5">
        {item("quickstart", docs.navQuickstart)}
        <li>
          <p className="px-3 pb-1 pt-3 text-sm font-medium text-ink">{docs.navClients}</p>
          <ul className="space-y-0.5">
            {clientOrder.map((id) => item(`clients/${id}`, docs.client.titles[id], true))}
          </ul>
        </li>
        {item("providers", docs.navProviders)}
      </ul>
    </nav>
  );
}

function DocsShell({
  content,
  slug,
  title,
  intro,
  children,
}: {
  content: Content;
  slug: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const other = content.lang === "en" ? "fr" : "en";
  return (
    <>
      <a
        href="#main"
        className="skip-link z-[100] rounded-md bg-surface px-3 py-2 text-sm font-medium text-ink shadow"
      >
        {content.header.skipToContent}
      </a>
      <Header content={content} onHome={false} otherHref={docsHref(other, slug)} current="docs" />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="border-b border-line pb-6 lg:border-b-0 lg:pb-0">
          <Sidebar content={content} slug={slug} />
        </aside>
        <main id="main" className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{title}</h1>
          <div className="mt-4 max-w-3xl leading-relaxed text-muted">{intro}</div>
          <div className="mt-10 max-w-3xl space-y-12">{children}</div>
        </main>
      </div>
      <Footer content={content} />
    </>
  );
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed">{children}</p>;
}

/** A gateway snippet, verbatim, with its caption and the file it comes from. */
async function Snippet({
  content,
  id,
  caption,
}: {
  content: Content;
  id: DocSnippetId;
  caption?: string;
}) {
  const snippet = docSnippet(id);
  return (
    <figure className="mt-4">
      {caption ? <figcaption className="mb-2 text-sm font-medium">{caption}</figcaption> : null}
      <CodeBlock
        code={snippet.code}
        lang={snippet.lang}
        labels={content.code}
        caption={`${content.docs.sourceLabel}: ${snippet.source}`}
      />
    </figure>
  );
}

function Inline({ id }: { id: DocSnippetId }) {
  return (
    <code className="mt-3 block overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-sm">
      {docInline(id)}
    </code>
  );
}

function Step({
  n,
  id,
  title,
  children,
}: {
  n: number;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <H2 id={id}>
        <span className="mr-3 font-mono text-accent" aria-hidden="true">
          {n}.
        </span>
        {title}
      </H2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- index

export function DocsIndex({ content }: { content: Content }) {
  const { docs } = content;
  const card = (href: string, title: string, body: string) => (
    <a
      href={href}
      className="block rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </a>
  );
  return (
    <DocsShell content={content} slug="" title={docs.index.title} intro={<p>{docs.index.intro}</p>}>
      <div className="grid gap-4 sm:grid-cols-2">
        {card(docsHref(content.lang, "quickstart"), docs.navQuickstart, docs.index.quickstartBody)}
        {card(docsHref(content.lang, "providers"), docs.navProviders, docs.index.providersBody)}
      </div>
      <section aria-labelledby="clients">
        <H2 id="clients">{docs.navClients}</H2>
        <P>{docs.index.clientsBody}</P>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {clientOrder.map((id) => (
            <li key={id}>
              <a
                href={docsHref(content.lang, `clients/${id}`)}
                className="block rounded-xl border border-line bg-surface px-5 py-4 transition-colors hover:border-accent"
              >
                <span className="font-medium">{docs.client.titles[id]}</span>
                <span className="mt-1 block font-mono text-xs text-muted">
                  {clients[id].package}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm">
        <a href={repo.openapi} className={linkClass}>
          {docs.index.apiLabel} <ExternalArrow />
        </a>
      </p>
    </DocsShell>
  );
}

// ---------------------------------------------------------------- quickstart

export function QuickstartDoc({ content }: { content: Content }) {
  const q = content.docs.quickstart;
  return (
    <DocsShell content={content} slug="quickstart" title={q.title} intro={<p>{q.intro}</p>}>
      <Step n={1} id="configure" title={q.steps.start.title}>
        <P>{q.steps.start.body}</P>
        <Snippet content={content} id="quickstart.env" caption=".env" />
        <p className="mt-3 text-sm leading-relaxed text-muted">{q.steps.start.after}</p>
      </Step>
      <Step n={2} id="api-key" title={q.steps.app.title}>
        <P>{q.steps.app.body}</P>
        <Snippet content={content} id="quickstart.up" />
      </Step>
      <Step n={3} id="first-payment" title={q.steps.pay.title}>
        <P>{q.steps.pay.body}</P>
        <Snippet content={content} id="quickstart.curl" />
        <P>{q.steps.pay.after}</P>
      </Step>
      <Step n={4} id="webhook" title={q.steps.webhook.title}>
        <P>{q.steps.webhook.body}</P>
        <P>{q.steps.webhook.signature}</P>
        <Inline id="quickstart.signatureHeader" />
        <P>{q.steps.webhook.rules}</P>
        <Inline id="quickstart.signatureHmac" />
        <P>{q.steps.webhook.clients}</P>
        <ul className="mt-3 flex flex-wrap gap-2">
          {clientOrder.map((id) => (
            <li key={id}>
              <a
                href={docsHref(content.lang, `clients/${id}`)}
                className="inline-block rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {content.docs.client.titles[id]}
              </a>
            </li>
          ))}
        </ul>
      </Step>
      <section aria-labelledby="cli">
        <H2 id="cli">{q.cliTitle}</H2>
        <P>{q.cliBody}</P>
        <Snippet content={content} id="quickstart.cli" />
      </section>
    </DocsShell>
  );
}

// ---------------------------------------------------------------- one page per client

export function ClientDoc({ content, client }: { content: Content; client: ClientId }) {
  const c = content.docs.client;
  const page = clientPages[client];
  const snippets = (ids: DocSnippetId[]) =>
    ids.map((id) => <Snippet key={id} content={content} id={id} caption={c.captions[id]} />);
  return (
    <DocsShell
      content={content}
      slug={`clients/${client}`}
      title={c.titles[client]}
      intro={
        <p>
          <code className="font-mono text-ink">{clients[client].package}</code> — {c.requiresLabel}:{" "}
          {clients[client].requires}.
        </p>
      }
    >
      <section aria-labelledby="install">
        <H2 id="install">{c.install}</H2>
        {snippets(page.install)}
      </section>
      <section aria-labelledby="create">
        <H2 id="create">{c.create}</H2>
        <P>{c.createNote}</P>
        {snippets(page.create)}
      </section>
      <section aria-labelledby="webhook">
        <H2 id="webhook">{c.webhook}</H2>
        {page.webhook.length > 0 ? <P>{c.webhookNote}</P> : null}
        {snippets(page.webhook)}
        {page.verifyInline ? (
          <>
            <P>{c.verifyInline}</P>
            <Inline id={page.verifyInline} />
          </>
        ) : null}
      </section>
      <section aria-labelledby="agent">
        <H2 id="agent">{c.agent}</H2>
        <P>{c.agentNote}</P>
        {snippets([page.agent])}
      </section>
      <p className="text-sm">
        <a href={page.readme} className={linkClass}>
          {c.readmeLabel} <ExternalArrow />
        </a>
      </p>
    </DocsShell>
  );
}

// ---------------------------------------------------------------- providers

export function ProvidersDoc({ content }: { content: Content }) {
  const p = content.docs.providers;
  const t = content.providersTable;
  return (
    <DocsShell content={content} slug="providers" title={p.title} intro={<p>{p.intro}</p>}>
      {/* The status is required next to the table, not in a footnote (PLAN.md §9). */}
      <p className="rounded-xl border border-accent bg-surface p-4 text-sm leading-relaxed">
        <strong>v{version}.</strong> {t.sandboxNote}
      </p>
      <div className="relative overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[44rem] border-collapse bg-surface text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {Object.values(p.columns).map((label) => (
                <th key={label} scope="col" className="px-4 py-3 font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="border-b border-line align-top last:border-b-0">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {provider.name}
                </th>
                <td className="px-4 py-3 text-muted">{provider.collect.join(", ")}</td>
                <td className="px-4 py-3 text-muted">
                  {provider.payout.length ? provider.payout.join(", ") : t.none}
                </td>
                <td className="px-4 py-3 text-muted">
                  {provider.refund === "partial"
                    ? t.partialRefund
                    : provider.refund
                      ? t.fullRefund
                      : t.none}
                </td>
                <td className="px-4 py-3">
                  {provider.sandboxTested ? null : (
                    <span className="inline-block whitespace-nowrap rounded-full border border-line px-2 py-0.5 text-xs">
                      {p.notTested}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a href={`${repo.blob}/${provider.doc}`} className={linkClass}>
                    {p.docLink}
                    <span className="sr-only"> — {provider.name}</span> <ExternalArrow />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 text-sm leading-relaxed">
        <p>{t.refundNote}</p>
        <p className="text-muted">{t.countryNote}</p>
        <p className="text-muted">{p.configNote}</p>
      </div>
    </DocsShell>
  );
}
