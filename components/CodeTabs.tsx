"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CopyButton from "@/components/CopyButton";
import type { Content } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type CodeTab = { id: string; label: string; html: string; raw: string };

/**
 * The "Your code" tabs (website/PLAN.md §5.6). All panels are server-rendered
 * (Shiki highlighting happened at build time); this client component only swaps
 * which one is visible and runs the request/response animation when a tab opens:
 * the request highlights, then the JSON answer streams in line by line (§5a).
 * Every tab gets the same response — it is the same API answering. ARIA tabs
 * pattern with roving tabindex and arrow keys.
 */
export default function CodeTabs({
  tabs,
  responseHtml,
  labels,
}: {
  tabs: CodeTab[];
  responseHtml: ReactNode;
  labels: Pick<Content["code"], "responseLabel" | "copy" | "copied">;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const interacted = useRef(false);

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === active),
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1;
    else if (event.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    interacted.current = true;
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  // When a panel opens: highlight the request, then stream the JSON response in
  // line by line (website/PLAN.md §5a "Request/response"). The panel that is open
  // on load waits until the section scrolls into view, so the animation is seen,
  // not spent off-screen.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = rootRef.current;
      if (!root) return;

      const run = () => {
        const panel = root.querySelector(`[id="panel-${active}"]`);
        if (!panel) return;
        const request = panel.querySelector("[data-request-block]");
        const lines = panel.querySelectorAll("[data-response-block] .line");
        if (request) {
          gsap.fromTo(
            request,
            { boxShadow: "inset 0 0 0 1000px rgba(181, 83, 46, 0.14)" },
            {
              boxShadow: "inset 0 0 0 1000px rgba(181, 83, 46, 0)",
              duration: 0.7,
              ease: "power1.out",
            },
          );
        }
        if (lines.length) {
          gsap.from(lines, { opacity: 0, y: 4, duration: 0.18, stagger: 0.05, ease: "none" });
        }
      };

      if (interacted.current) {
        run();
        return;
      }
      ScrollTrigger.create({ trigger: root, start: "top 75%", once: true, onEnter: run });
    },
    { dependencies: [active], scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div role="tablist" aria-label="Code examples" className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onKeyDown={onKeyDown}
            onClick={() => {
              interacted.current = true;
              setActive(tab.id);
            }}
            className={`rounded-full px-4 py-2 font-mono text-sm transition-colors ${
              active === tab.id
                ? "bg-ink text-bg"
                : "border border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="mt-4"
        >
          <div className="flex justify-end">
            <CopyButton text={tab.raw} label={labels.copy} copiedLabel={labels.copied} />
          </div>
          <div
            data-request-block=""
            className="overflow-x-auto rounded-xl border border-line bg-surface p-4 text-sm"
            dangerouslySetInnerHTML={{ __html: tab.html }}
          />
          <div className="mt-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
              {labels.responseLabel}
            </p>
            <div
              data-response-block=""
              className="overflow-x-auto rounded-xl border border-line bg-surface p-4 text-sm"
              dangerouslySetInnerHTML={{ __html: responseHtml as string }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
