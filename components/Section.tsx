import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export default function Section({
  id,
  title,
  intro,
  children,
  wide,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line first:border-t-0">
      <div className={`mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 ${wide ? "" : ""}`}>
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{title}</h2>
          {intro ? <div className="mt-4 max-w-2xl leading-relaxed text-muted">{intro}</div> : null}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
