import type { Content } from "@/content/types";

export default function Footer({ content }: { content: Content }) {
  return (
    <footer className="border-t border-line">
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
