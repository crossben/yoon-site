"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/content/types";

function ThemeToggle({ labels }: { labels: Content["header"]["themeToggle"] }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !(dark ?? document.documentElement.dataset.theme === "dark");
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("yoon-theme", next ? "dark" : "light");
    } catch {
      /* private mode: theme just won't persist */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? labels.toLight : labels.toDark}
      title={dark ? labels.toLight : labels.toDark}
      className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {dark === null ? (
        // First paint on the server: render a neutral dot; the real icon appears
        // right after hydration (which happens before the user can click).
        <span className="size-4 rounded-full border border-current" aria-hidden="true" />
      ) : dark ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

function LanguageLink({ other, href }: { other: Content["otherLang"]; href: string }) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    // Keep the current section when switching language.
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <a
      href={href + hash}
      lang={other.href.startsWith("/fr") ? "fr" : "en"}
      className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {other.label}
    </a>
  );
}

export default function Header({
  content,
  onHome = true,
  otherHref,
  current,
}: {
  content: Content;
  /** On the one-page home, section links are bare anchors; elsewhere they lead back home. */
  onHome?: boolean;
  /** The same page in the other language (defaults to its home). */
  otherHref?: string;
  /** Marks the docs link as the current section. */
  current?: "docs";
}) {
  const home = content.lang === "en" ? "/" : "/fr/";
  const anchor = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);
  const nav = [
    [anchor("how"), content.header.nav.how],
    [anchor("guarantees"), content.header.nav.guarantees],
    [anchor("providers"), content.header.nav.providers],
    [anchor("pispi"), content.header.nav.pispi],
    [anchor("code"), content.header.nav.code],
    [anchor("api"), content.header.nav.api],
    [anchor("demo"), content.header.nav.demo],
    [anchor("run"), content.header.nav.run],
  ] as const;
  const docsHref = `${home}docs/`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <a href={home} aria-label={content.header.homeAria} className="flex shrink-0 items-center">
          {/* Brand files are copied verbatim from the gateway repo; never recolour. */}
          <img
            src="/brand/logo.svg"
            alt=""
            width={117}
            height={42}
            className="h-7 w-auto dark:hidden"
          />
          <img
            src="/brand/logo-dark.svg"
            alt=""
            width={117}
            height={42}
            className="hidden h-7 w-auto dark:block"
          />
        </a>

        <nav
          aria-label={content.lang === "en" ? "Sections" : "Sections"}
          className="mx-auto hidden xl:block"
        >
          <ul className="flex items-center gap-1">
            {nav.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={docsHref}
                aria-current={current === "docs" ? "page" : undefined}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
              >
                {content.header.nav.docs}
              </a>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          {/* Below xl the section nav is hidden: keep the docs reachable. */}
          <a
            href={docsHref}
            aria-current={current === "docs" ? "page" : undefined}
            className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent xl:hidden"
          >
            {content.header.nav.docs}
          </a>
          <LanguageLink other={content.otherLang} href={otherHref ?? content.otherLang.href} />
          <ThemeToggle labels={content.header.themeToggle} />
          <a
            href="https://github.com/crossben/yoonpay"
            className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label="GitHub"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-[18px]" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
