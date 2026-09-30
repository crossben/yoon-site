"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { terminalLines } from "@/lib/snippets";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The demo commands type themselves into a terminal-styled block when it scrolls
 * into view, once (website/PLAN.md §5a "Terminal typing"). The full text is
 * server-rendered, so the block works with JavaScript disabled and under
 * prefers-reduced-motion it simply never gets cleared and retyped. It is
 * decorative (aria-hidden): the real, copyable commands sit next to it, and the
 * API key line shows the masked `yk_…` form only.
 */
export default function Terminal({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = rootRef.current;
      if (!root) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);

      // hide everything (the server-rendered text is the fallback state)
      gsap.set(rows, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
      let gap = 0;
      rows.forEach((row, i) => {
        const kind = row.dataset.row as "cmd" | "out";
        const textEl = row.querySelector("[data-text]") as HTMLElement | null;
        if (kind === "cmd" && textEl) {
          const full = textEl.dataset.full ?? "";
          const proxy = { n: 0 };
          tl.set(row, { opacity: 1 }, gap);
          tl.to(
            proxy,
            {
              n: full.length,
              duration: Math.max(0.35, full.length * 0.028),
              ease: "none",
              onUpdate: () => {
                textEl.textContent = full.slice(0, Math.round(proxy.n));
              },
            },
            gap,
          );
          gap += Math.max(0.35, full.length * 0.028) + 0.15;
        } else {
          tl.set(row, { opacity: 1 }, gap);
          gap += i % 2 === 0 ? 0.22 : 0.1;
        }
      });
    },
    { scope: rootRef },
  );

  let key = 0;
  return (
    <figure>
      <figcaption className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
        {label}
      </figcaption>
      <div
        ref={rootRef}
        aria-hidden="true"
        className="overflow-x-auto rounded-xl border border-line bg-surface p-4 font-mono text-[13px] leading-6"
      >
        {terminalLines.map((line) => {
          const cmdRow = (
            <div key={key++} data-row="cmd">
              <span className="select-none text-accent">$ </span>
              <span data-text="" data-full={line.cmd}>
                {line.cmd}
              </span>
            </div>
          );
          const outRows = line.output.map((out) => (
            <div key={key++} data-row="out" className="text-muted">
              {out}
            </div>
          ));
          return [cmdRow, ...outRows];
        })}
      </div>
    </figure>
  );
}
