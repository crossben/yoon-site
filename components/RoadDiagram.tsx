"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import type { Content } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

type Labels = Content["hero"]["scene"]["labels"];

/**
 * "How a payment travels" — the signature diagram (website/PLAN.md §5.3).
 * The server-rendered SVG is the finished diagram; when motion is allowed, GSAP
 * scrubs it back to a blank road and draws it as you scroll: the intent travels
 * to Yoon, a branch lights up, and a timed-out payment stops mid-road and waits —
 * it never forks to another provider.
 * With prefers-reduced-motion or without JavaScript: nothing moves, the finished
 * diagram just sits there. Screen readers get the text description.
 */
export default function RoadDiagram({
  content,
  labels,
}: {
  content: Content["how"];
  labels: Labels;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = sectionRef.current;
      if (!root) return;

      const roads = gsap.utils.toArray<SVGPathElement>("[data-road]", root);
      const dashes = gsap.utils.toArray<SVGPathElement>("[data-dash]", root);
      const chip = root.querySelector<SVGGElement>("[data-chip]");
      const chosenPacket = root.querySelector<SVGCircleElement>("[data-packet-chosen]");
      const timeoutPacket = root.querySelector<SVGCircleElement>("[data-packet-timeout]");
      const ping = root.querySelector<SVGCircleElement>("[data-ping]");
      const chosenLabel = root.querySelector<SVGGElement>("[data-label-chosen]");
      const timeoutLabel = root.querySelector<SVGGElement>("[data-label-timeout]");
      const yoonLabel = root.querySelector<SVGTextElement>("[data-yoon]");
      const midPath = root.querySelector<SVGPathElement>("[data-road='mid']");

      // initial state: a blank road (the SVG itself is the finished diagram)
      gsap.set(roads, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(
        [
          dashes,
          chip,
          chosenLabel,
          timeoutLabel,
          yoonLabel,
          chosenPacket,
          timeoutPacket,
          ping,
        ].flat(),
        {
          opacity: 0,
        },
      );
      // the ping sits where the timed-out packet stops (72 % along the middle branch)
      if (midPath && ping) {
        const stop = midPath.getPointAtLength(midPath.getTotalLength() * 0.72);
        gsap.set(ping, { attr: { cx: stop.x, cy: stop.y } });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top 78%", end: "+=560", scrub: 0.5 },
      });

      tl.to("[data-road='trunk']", { strokeDashoffset: 0, duration: 0.5 })
        .to(chip, { opacity: 1, duration: 0.12 }, "<0.25")
        .to(chip, { y: 74, duration: 0.55 }, ">")
        .to(chip, { opacity: 0, duration: 0.1 }, ">-0.05")
        .to(yoonLabel, { opacity: 1, duration: 0.1 }, "<")
        .to("[data-road='top']", { strokeDashoffset: 0, duration: 0.5 }, "<")
        .to("[data-road='mid']", { strokeDashoffset: 0, duration: 0.5 }, "<")
        .to("[data-road='bottom']", { strokeDashoffset: 0, duration: 0.5 }, "<")
        .to(dashes, { opacity: 1, duration: 0.25 }, ">")
        .to(chosenPacket, { opacity: 1, duration: 0.01 })
        .to(
          chosenPacket,
          {
            motionPath: {
              path: "[data-route-chosen]",
              start: 0.02,
              end: 1,
              align: "[data-route-chosen]",
              alignOrigin: [0.5, 0.5],
            },
            duration: 1.1,
          },
          "<",
        )
        .to(chosenLabel, { opacity: 1, duration: 0.15 }, ">-0.1")
        .to(timeoutPacket, { opacity: 1, duration: 0.01 }, ">")
        .to(
          timeoutPacket,
          {
            motionPath: {
              path: "[data-route-timeout]",
              start: 0.02,
              end: 0.72,
              align: "[data-route-timeout]",
              alignOrigin: [0.5, 0.5],
            },
            duration: 0.85,
          },
          "<",
        )
        // it does not continue: it pulses twice and waits — no other provider is tried
        .to(ping, { opacity: 0.7, attr: { r: 6 }, duration: 0.08 }, ">")
        .to(ping, { attr: { r: 20 }, opacity: 0, duration: 0.3 }, ">")
        .to(ping, { opacity: 0.7, attr: { r: 6 }, duration: 0.08 }, ">")
        .to(ping, { attr: { r: 20 }, opacity: 0, duration: 0.3 }, ">")
        .to(timeoutLabel, { opacity: 1, duration: 0.2 }, "<");
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="mx-auto max-w-xl">
      <svg viewBox="0 0 520 430" className="w-full" role="img" aria-label={content.srDescription}>
        {/* roads: accent stroke + sand centre dash, like the logo mark */}
        <g fill="none" stroke="var(--accent)" strokeWidth="13" strokeLinecap="round">
          <path data-road="trunk" pathLength={1} d="M230 70 V210" />
          <path data-road="top" pathLength={1} d="M230 210 C230 246 320 170 383 150" />
          <path data-road="mid" pathLength={1} d="M230 210 C230 248 320 240 413 252" />
          <path
            data-road="bottom"
            pathLength={1}
            d="M230 210 C230 248 310 300 383 358"
            opacity="0.4"
          />
        </g>
        <g
          fill="none"
          stroke="var(--bg)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="5 8"
        >
          <path data-dash="" d="M230 70 V210" />
          <path data-dash="" d="M230 210 C230 246 320 170 383 150" />
          <path data-dash="" d="M230 210 C230 248 320 240 413 252" />
          <path data-dash="" d="M230 210 C230 248 310 300 383 358" />
        </g>

        {/* routes the packets follow (invisible guides) */}
        <path
          data-route-chosen=""
          fill="none"
          stroke="none"
          d="M230 70 V210 C230 246 320 170 383 150"
        />
        <path
          data-route-timeout=""
          fill="none"
          stroke="none"
          d="M230 70 V210 C230 248 320 240 413 252"
        />

        {/* app node */}
        <rect
          x="170"
          y="18"
          width="120"
          height="52"
          rx="12"
          fill="var(--surface)"
          stroke="var(--line)"
        />
        <text
          x="230"
          y="50"
          textAnchor="middle"
          fontSize="17"
          fontWeight="600"
          fill="var(--ink)"
          fontFamily="inherit"
        >
          {labels.app}
        </text>

        {/* provider nodes */}
        <g fill="var(--surface)" stroke="var(--accent)" strokeWidth="3">
          <circle cx="393" cy="150" r="10" />
          <circle cx="423" cy="252" r="10" />
          <circle cx="393" cy="358" r="10" />
        </g>

        {/* packets */}
        <circle data-packet-chosen="" r="8" fill="var(--ink)" opacity="0" />
        <circle data-packet-timeout="" r="8" fill="var(--ink)" opacity="0" />
        <circle
          data-ping=""
          r="6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          opacity="0"
        />

        {/* intent chip (travels down the trunk) */}
        <g data-chip="">
          <rect
            x="152"
            y="100"
            width="156"
            height="34"
            rx="17"
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <text
            x="230"
            y="122"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--ink)"
            fontFamily="inherit"
          >
            {content.intent}
          </text>
        </g>

        {/* labels */}
        <g fontFamily="inherit">
          <text
            data-yoon=""
            x="208"
            y="216"
            textAnchor="end"
            fontSize="18"
            fontWeight="700"
            fill="var(--accent)"
          >
            {labels.yoon}
          </text>
          <g data-label-chosen="">
            <text x="403" y="128" textAnchor="middle" fontSize="13" fill="var(--accent)">
              {content.outcome}
            </text>
          </g>
          <g data-label-timeout="">
            <text x="352" y="230" textAnchor="end" fontSize="13" fontWeight="600" fill="var(--ink)">
              {content.timeout}
            </text>
            <text x="352" y="248" textAnchor="end" fontSize="13" fill="var(--muted)">
              {content.timeoutOutcome}
            </text>
          </g>
          <text x="413" y="155" fontSize="15" fill="var(--ink)">
            {labels.providers[0]}
          </text>
          <text x="443" y="257" fontSize="15" fill="var(--ink)">
            {labels.providers[1]}
          </text>
          <text x="413" y="363" fontSize="15" fill="var(--ink)">
            {labels.providers[2]}
          </text>
        </g>
      </svg>
    </div>
  );
}
