import ExternalArrow from "@/components/ExternalArrow";
import { highlight } from "@/lib/shiki";
import {
  version,
  providers,
  loadTest,
  guaranteeSources,
  repo,
  licensing,
  pispi,
} from "@/content/facts";
import type { Content } from "@/content/types";
import { codeSnippets, demoEnv, demoStepYoon, demoStepShop } from "@/lib/snippets";
import { paymentResponseExample } from "@/lib/openapi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import RoadDiagram from "@/components/RoadDiagram";
import CodeTabs, { type CodeTab } from "@/components/CodeTabs";
import CopyButton from "@/components/CopyButton";
import Terminal from "@/components/Terminal";
import ApiList from "@/components/ApiList";

function JsonLd({ content }: { content: Content }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Yoon",
    description: content.meta.description,
    url: "https://yoonpay.benhattab.pro/",
    codeRepository: repo.home,
    softwareVersion: version,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    programmingLanguage: ["Java", "PHP"],
    isAccessibleForFree: true,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

async function CodeBlock({
  code,
  lang,
  labels,
}: {
  code: string;
  lang: string;
  labels: { copy: string; copied: string };
}) {
  const html = await highlight(code, lang);
  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="flex justify-end px-3 pt-2">
        <CopyButton text={code} label={labels.copy} copiedLabel={labels.copied} />
      </div>
      <div
        className="overflow-x-auto px-4 pb-4 pt-1 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default async function Page({ content }: { content: Content }) {
  const tabs: CodeTab[] = await Promise.all(
    (
      [
        ["laravel", "php"],
        ["php", "php"],
        ["java", "java"],
        ["js", "typescript"],
        ["curl", "bash"],
      ] as const
    ).map(async ([id, lang]) => ({
      id,
      label: content.code.tabLabels[id],
      lang,
      raw: codeSnippets[id],
      html: await highlight(codeSnippets[id], lang),
    })),
  );
  const responseHtml = await highlight(JSON.stringify(paymentResponseExample(), null, 2), "json");

  return (
    <>
      <a
        href="#main"
        className="skip-link z-[100] rounded-md bg-surface px-3 py-2 text-sm font-medium text-ink shadow"
      >
        {content.header.skipToContent}
      </a>
      <Header content={content} />
      <main id="main">
        <Hero content={content} />

        {/* 2 — The problem */}
        <Section id="problem" title={content.problem.heading}>
          <Reveal className="grid gap-4 md:grid-cols-3" stagger>
            {content.problem.cards.map((card) => (
              <div key={card.title} className="rounded-xl border border-line bg-surface p-6">
                <h3 className="font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* 3 — How a payment travels */}
        <Section id="how" title={content.how.heading} intro={content.how.intro}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <RoadDiagram content={content.how} labels={content.hero.scene.labels} />
            <Reveal as="ol" className="space-y-4" stagger>
              {content.how.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent font-mono text-xs text-accent"
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </Section>

        {/* 4 — What Yoon guarantees */}
        <Section id="guarantees" title={content.guarantees.heading}>
          <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger>
            {content.guarantees.items.map((item) => {
              const href = guaranteeSources[item.key];
              const label = href.includes("/adr/")
                ? `ADR-${href.match(/(\d{4})/)?.[1] ?? ""}`
                : "api/openapi.yaml";
              return (
                <div
                  key={item.key}
                  className="flex flex-col rounded-xl border border-line bg-surface p-6"
                >
                  <h3 className="font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                  <p className="mt-2 text-sm leading-relaxed">
                    <span className="font-medium">{content.guarantees.whyLabel}</span>{" "}
                    <span className="text-muted">{item.why}</span>
                  </p>
                  <a
                    href={href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                  >
                    {label}
                    <ExternalArrow />
                  </a>
                </div>
              );
            })}
          </Reveal>
        </Section>

        {/* 5 — Providers */}
        <Section id="providers" title={content.providersTable.heading}>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[34rem] border-collapse bg-surface text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    {[
                      content.providersTable.columns.provider,
                      content.providersTable.columns.collect,
                      content.providersTable.columns.payout,
                      content.providersTable.columns.refund,
                    ].map((label) => (
                      <th key={label} scope="col" className="px-4 py-3 font-semibold">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider.id} className="border-b border-line last:border-b-0">
                      <th scope="row" className="px-4 py-3 text-left font-medium">
                        {provider.name}
                      </th>
                      <td className="px-4 py-3 text-muted">{provider.collect.join(", ")}</td>
                      <td className="px-4 py-3 text-muted">
                        {provider.payout.length ? provider.payout.join(", ") : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {provider.refund
                          ? content.providersTable.fullRefund
                          : content.providersTable.none}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="min-w-0 space-y-3 text-sm leading-relaxed">
              <p className="rounded-xl border border-line bg-surface p-4">
                {content.providersTable.refundNote}
              </p>
              <p className="rounded-xl border border-line bg-surface p-4">
                {content.providersTable.sandboxNote}
              </p>
              <p className="text-muted">{content.providersTable.countryNote}</p>
            </div>
          </div>
        </Section>

        {/* 5b — Yoon and PI-SPI: layers, not competitors */}
        <Section id="pispi" title={content.pispi.heading} intro={content.pispi.intro}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            {/* The stack: where each piece sits, from your app down to the rails. */}
            <figure className="min-w-0">
              <figcaption className="text-sm font-medium text-muted">
                {content.pispi.stackLabel}
              </figcaption>
              <Reveal as="ol" className="mt-3 space-y-2" stagger>
                {(
                  [
                    ["app", "border-line bg-surface"],
                    ["yoon", "border-accent bg-surface"],
                    ["providers", "border-line bg-surface"],
                    ["rails", "border-line bg-bg"],
                  ] as const
                ).map(([key, cls], i) => {
                  const layer = content.pispi.layers[key];
                  return (
                    <li key={key} className="relative">
                      {i > 0 ? (
                        <span
                          aria-hidden="true"
                          className="mx-auto -mt-2 block h-2 w-0.5 rounded-full bg-accent"
                        />
                      ) : null}
                      <div className={`rounded-xl border-2 p-4 ${cls}`}>
                        <p className="font-semibold">{layer.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{layer.body}</p>
                        {key === "providers" ? (
                          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium">
                              {content.pispi.layers.providers.pispiRoute}
                            </span>
                            <span className="rounded-full border border-accent px-2 py-0.5 font-mono text-xs text-ink">
                              {content.pispi.layers.providers.plannedBadge}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </Reveal>
            </figure>

            <div className="min-w-0 space-y-8">
              <div>
                <h3 className="font-semibold">{content.pispi.compare.heading}</h3>
                {/* Phones: one card per aspect, so no column is ever cut off. */}
                <dl className="mt-3 space-y-3 sm:hidden">
                  {content.pispi.compare.rows.map((row) => (
                    <div key={row.aspect} className="rounded-xl border border-line bg-surface p-4">
                      <dt className="font-medium">{row.aspect}</dt>
                      <dd className="mt-2 text-sm leading-relaxed">
                        <span className="font-semibold">{content.pispi.compare.columns.pispi}</span>{" "}
                        <span className="text-muted">{row.pispi}</span>
                      </dd>
                      <dd className="mt-1 text-sm leading-relaxed">
                        <span className="font-semibold">{content.pispi.compare.columns.yoon}</span>{" "}
                        <span className="text-muted">{row.yoon}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 hidden overflow-x-auto rounded-xl border border-line sm:block">
                  <table className="w-full border-collapse bg-surface text-sm">
                    <thead>
                      <tr className="border-b border-line text-left">
                        <th scope="col" className="px-4 py-3 font-semibold">
                          <span className="sr-only">{content.pispi.compare.columns.aspect}</span>
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          {content.pispi.compare.columns.pispi}
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          {content.pispi.compare.columns.yoon}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.pispi.compare.rows.map((row) => (
                        <tr key={row.aspect} className="border-b border-line last:border-b-0">
                          <th scope="row" className="px-4 py-3 text-left align-top font-medium">
                            {row.aspect}
                          </th>
                          <td className="px-4 py-3 align-top text-muted">{row.pispi}</td>
                          <td className="px-4 py-3 align-top text-muted">{row.yoon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">{content.pispi.use.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  {content.pispi.use.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <p className="rounded-xl border border-accent bg-surface p-4 font-medium">
                  {content.pispi.statusNote}
                </p>
                <p className="text-muted">{content.pispi.caveat}</p>
                <p className="flex flex-wrap gap-x-6 gap-y-2">
                  <a
                    href={pispi.site}
                    className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                  >
                    {content.pispi.links.site} <ExternalArrow />
                  </a>
                  <a
                    href={pispi.developerPortal}
                    className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                  >
                    {content.pispi.links.developer} <ExternalArrow />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 6 — Your code */}
        <Section id="code" title={content.code.heading} intro={content.code.intro}>
          <CodeTabs tabs={tabs} responseHtml={responseHtml} labels={content.code} />
          <p className="mt-4 text-sm text-muted">
            {content.code.contractNote}{" "}
            <a
              href={repo.openapi}
              className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
            >
              api/openapi.yaml <ExternalArrow />
            </a>
          </p>
        </Section>

        {/* 7 — API at a glance */}
        <Section id="api" title={content.api.heading} intro={content.api.intro}>
          <ApiList content={content.api} />
        </Section>

        {/* 8 — Try it in 5 minutes */}
        <Section id="demo" title={content.demo.heading}>
          <p className="max-w-2xl font-medium">{content.demo.firstLine}</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div className="min-w-0 space-y-8">
              <div>
                <h3 className="font-semibold">
                  <span className="mr-2 font-mono text-sm text-accent">1</span>
                  {content.demo.step1Title}
                </h3>
                <p className="mt-1 text-sm text-muted">{content.demo.step1Note}</p>
                <div className="mt-3">
                  <CodeBlock code={demoEnv} lang="ini" labels={content.code} />
                </div>
                <div className="mt-3">
                  <CodeBlock code={demoStepYoon} lang="bash" labels={content.code} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">
                  <span className="mr-2 font-mono text-sm text-accent">2</span>
                  {content.demo.step2Title}
                </h3>
                <p className="mt-1 text-sm text-muted">{content.demo.step2Note}</p>
                <div className="mt-3">
                  <CodeBlock code={demoStepShop} lang="bash" labels={content.code} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">
                  <span className="mr-2 font-mono text-sm text-accent">3</span>
                  {content.demo.step3Title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">{content.demo.step3Body}</p>
                <a
                  href={repo.exampleShop}
                  className="mt-3 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                >
                  {content.demo.linkLabel} <ExternalArrow />
                </a>
              </div>
            </div>
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <Terminal label={content.demo.terminalLabel} />
              <p className="mt-2 text-sm text-muted">{content.demo.terminalNote}</p>
            </div>
          </div>
        </Section>

        {/* 9 — Run it yourself */}
        <Section id="run" title={content.run.heading} intro={content.run.intro}>
          <div className="grid min-w-0 gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <Reveal as="ol" className="space-y-5" stagger>
                {content.run.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent font-mono text-xs text-accent"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </Reveal>
              <a
                href={repo.deploy}
                className="mt-6 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                docs/deploy.md <ExternalArrow />
              </a>

              <h3 className="mt-10 font-semibold">{content.run.composeHeading}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {content.run.composeItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold">{content.run.loadTestHeading}</h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[28rem] border-collapse bg-surface text-sm">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {content.run.columns.rate}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {content.run.columns.errors}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {content.run.columns.create}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {content.run.columns.read}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadTest.rows.map((row) => (
                      <tr key={row.rate} className="border-b border-line last:border-b-0">
                        <th scope="row" className="px-4 py-3 text-left font-mono font-medium">
                          {row.rate}/s
                        </th>
                        <td className="px-4 py-3 text-muted">{row.errors}</td>
                        <td className="px-4 py-3 font-mono text-muted">{row.createP95}</td>
                        <td className="px-4 py-3 font-mono text-muted">{row.readP95}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-muted">{loadTest.hardware}.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.run.loadTestCaveat}
              </p>
              <a
                href={repo.loadTest}
                className="mt-3 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                docs/load-test.md <ExternalArrow />
              </a>
            </div>
          </div>
        </Section>

        {/* 10 — What Yoon is not */}
        <Section id="not" title={content.not.heading}>
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger>
            {content.not.items.map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-surface p-5">
                <h3 className="font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* 11 — Open source */}
        <Section id="opensource" title={content.openSource.heading}>
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{content.openSource.licence.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.openSource.licence.body}
              </p>
              <a
                href={repo.licensing}
                className="mt-3 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                docs/licensing.md <ExternalArrow />
              </a>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{content.openSource.contribute.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.openSource.contribute.body}
              </p>
              <a
                href={repo.contributing}
                className="mt-3 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                CONTRIBUTING.md <ExternalArrow />
              </a>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{content.openSource.security.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.openSource.security.body}
              </p>
              <a
                href={repo.security}
                className="mt-3 inline-block text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                SECURITY.md <ExternalArrow />
              </a>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{content.openSource.commercial.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.openSource.commercial.body}
              </p>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-muted">
            {content.openSource.serverLabel} {licensing.server} · {content.openSource.clientsLabel}{" "}
            {licensing.clients}
          </p>
        </Section>
      </main>
      <Footer content={content} />
      <JsonLd content={content} />
    </>
  );
}
