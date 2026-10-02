"use client";

import { useEffect, useRef, useState } from "react";
import CopyButton from "@/components/CopyButton";

/**
 * The demo settings block, editable in place (website/PLAN.md §5a: the "Try it in
 * five minutes" section hands the reader a working .env). The secrets are the only
 * values the randomiser touches — every other line is left as the reader typed it,
 * so a customised setup survives a re-randomise.
 *
 * This is a demo: the values are not real credentials, so they are shown in the
 * clear. The reader pastes them into their own .env files.
 */
const SECRET_KEYS = ["POSTGRES_PASSWORD", "YOON_APPS_SHOP_WEBHOOK_SECRET"];

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function randomSecret(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Regenerate the value after the first `=` on every secret line; leave the rest alone. */
function randomise(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const key = SECRET_KEYS.find((k) => line.startsWith(k + "="));
      if (!key) return line;
      const value = key.includes("PASSWORD") ? randomPassword() : randomSecret();
      return `${key}=${value}`;
    })
    .join("\n");
}

export default function EditableEnv({
  initial,
  labels,
}: {
  initial: string;
  labels: { copy: string; copied: string; randomise: string; reset: string; hint: string };
}) {
  const [value, setValue] = useState(initial);
  const [justReset, setJustReset] = useState(false);
  const resetTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  function doRandomise() {
    setValue(randomise(value));
  }

  function doReset() {
    setValue(initial);
    setJustReset(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setJustReset(false), 1400);
  }

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="font-mono text-xs text-muted">{labels.hint}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={doRandomise}
            className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {labels.randomise}
          </button>
          <button
            type="button"
            onClick={doReset}
            className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {labels.reset}
          </button>
          <CopyButton text={value} label={labels.copy} copiedLabel={labels.copied} />
        </div>
      </div>
      <textarea
        spellCheck={false}
        aria-label={labels.hint}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        className="w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-6 text-ink outline-none"
      />
      {justReset ? (
        <div className="border-t border-line px-4 py-1.5 font-mono text-xs text-accent">
          {labels.reset}
        </div>
      ) : null}
    </div>
  );
}