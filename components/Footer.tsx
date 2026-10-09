import type { Content } from "@/content/types";

export default function Footer({ content }: { content: Content }) {
  return (
    <footer className="border-t border-line">
      {/* Next project: the three open-source projects link to each other in a ring. */}
      <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
        <a
          href="https://accord.benhattab.pro"
          className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-lg border border-line px-5 py-4 transition-colors hover:border-accent"
        >
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {content.lang === "fr" ? "Projet suivant" : "Next project"}
          </span>
          <span className="flex-1 text-sm">
            <span className="font-medium transition-colors group-hover:text-accent">Accord</span>{" "}
            <span className="text-muted">— {content.lang === "fr" ? "synchronisation hors-ligne qui reste correcte quand le réseau ment" : "offline-first sync that stays correct when the network lies"}</span>
          </span>
          <span aria-hidden="true" className="text-muted transition-colors group-hover:text-accent">→</span>
        </a>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <img src="/brand/mark.svg" alt="" width={40} height={40} className="h-10 w-10" />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {content.footer.meaning} {content.footer.tagline}
          </p>
        </div>
        <nav aria-label={content.lang === "en" ? "Footer" : "Pied de page"}>
          <ul className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm md:justify-end">
            {content.footer.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted md:text-right">{content.footer.copyright}</p>
        </nav>
      </div>
    </footer>
  );
}
