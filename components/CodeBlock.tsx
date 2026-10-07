import { highlight } from "@/lib/shiki";
import CopyButton from "@/components/CopyButton";

/** A highlighted code block with a copy button (Shiki at build time, no JS highlighter shipped). */
export default async function CodeBlock({
  code,
  lang,
  labels,
  caption,
}: {
  code: string;
  lang: string;
  labels: { copy: string; copied: string };
  /** Optional label shown in the block's top bar (e.g. a file name or the snippet's source). */
  caption?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 px-3 pt-2">
        <span className="truncate pl-1 font-mono text-xs text-muted">{caption}</span>
        <CopyButton text={code} label={labels.copy} copiedLabel={labels.copied} />
      </div>
      <div
        // Plain text (prompts) wraps so it can be read before copying; code keeps its lines.
        className={`overflow-x-auto px-4 pb-4 pt-1 text-sm ${lang === "text" ? "[&_pre]:whitespace-pre-wrap [&_pre]:break-words" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
