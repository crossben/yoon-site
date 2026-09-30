// "Opens elsewhere" arrow. An inline SVG rather than the ↗ character: with the text
// variation selector some platforms still render ↗︎ as a coloured emoji box.
export default function ExternalArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="ml-0.5 inline-block size-[0.7em] align-baseline"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" />
    </svg>
  );
}
