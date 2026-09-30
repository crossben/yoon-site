import type { Content } from "@/content/types";
import HeroSceneMount from "@/components/HeroSceneMount";

export default function Hero({ content }: { content: Content }) {
  const { hero } = content;
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:px-6 md:pb-16 md:pt-20">
        <div className="relative z-10 max-w-xl">
          {/* Wordmark, used as-is from the gateway repository. */}
          <img
            src="/brand/logo.svg"
            alt="Yoon"
            width={234}
            height={84}
            className="h-12 w-auto md:h-14 dark:hidden"
            fetchPriority="high"
          />
          <img
            src="/brand/logo-dark.svg"
            alt="Yoon"
            width={234}
            height={84}
            className="hidden h-12 w-auto md:h-14 dark:block"
            fetchPriority="high"
          />
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{hero.subline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#demo"
              className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              // accent on sand fails AA for body text, so the button label is white on accent (4.95:1 on light)
            >
              {hero.ctaDemo}
            </a>
            <a
              href="https://github.com/crossben/yoonpay"
              className="rounded-full border border-ink px-6 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {hero.ctaGithub}
            </a>
          </div>

          {/* Required status line (website/PLAN.md §5.1). */}
          <p className="mt-5 font-mono text-sm text-muted">{hero.statusLine}</p>
        </div>

        {/* The scene is decorative: fixed-height container (no CLS), text stays the LCP. */}
        <div className="relative h-[300px] sm:h-[360px] md:h-[440px]">
          <HeroSceneMount scene={hero.scene} />
          <p className="sr-only">{hero.scene.description}</p>
        </div>
      </div>
    </section>
  );
}
