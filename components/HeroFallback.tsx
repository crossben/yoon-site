import type { Content } from "@/content/types";

/**
 * Static SVG of the same composition as the three.js scene: the road from your
 * app to the Y fork, then on to the three providers. Shown until the scene has
 * loaded, and forever when WebGL is missing, motion is reduced, or Save-Data is on.
 * Drawn from mark.svg (the road-Y of the logo), in theme colours.
 */
export default function HeroFallback({
  labels,
  hidden,
}: {
  labels: Content["hero"]["scene"]["labels"];
  hidden: boolean;
}) {
  return (
    <svg
      viewBox="0 0 560 400"
      className={`h-full w-full transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* ground hint */}
      <ellipse cx="290" cy="210" rx="252" ry="180" fill="var(--line)" opacity="0.28" />

      {/* roads: accent with a sand centre line, like the logo mark */}
      <g fill="none" stroke="var(--accent)" strokeWidth="13" strokeLinecap="round">
        <path d="M114 217 H250" />
        <path d="M250 217 C310 217 330 122 420 112" />
        <path d="M250 217 C320 217 340 217 428 217" />
        <path d="M250 217 C310 217 330 312 420 322" />
      </g>
      <g
        fill="none"
        stroke="var(--bg)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 8"
      >
        <path d="M114 217 H250" />
        <path d="M250 217 C310 217 330 122 420 112" />
        <path d="M250 217 C320 217 340 217 428 217" />
        <path d="M250 217 C310 217 330 312 420 322" />
      </g>

      {/* app node */}
      <rect
        x="30"
        y="190"
        width="84"
        height="54"
        rx="12"
        fill="var(--surface)"
        stroke="var(--line)"
      />
      <path
        d="M56 232 V224 M56 224 C56 216 48 212 44 204 M56 224 C56 216 64 212 68 204"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* provider nodes */}
      <g fill="var(--surface)" stroke="var(--accent)" strokeWidth="3">
        <circle cx="430" cy="112" r="11" />
        <circle cx="440" cy="217" r="11" />
        <circle cx="430" cy="322" r="11" />
      </g>

      {/* labels */}
      <g fontFamily="inherit" fontSize="15" fill="var(--ink)">
        <text x="72" y="270" textAnchor="middle">
          {labels.app}
        </text>
        <text x="250" y="260" textAnchor="middle" fill="var(--accent)" fontWeight="600">
          {labels.yoon}
        </text>
        <text x="452" y="117">
          {labels.providers[0]}
        </text>
        <text x="462" y="222">
          {labels.providers[1]}
        </text>
        <text x="452" y="327">
          {labels.providers[2]}
        </text>
      </g>
    </svg>
  );
}
