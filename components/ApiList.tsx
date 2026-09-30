import ExternalArrow from "@/components/ExternalArrow";
import { apiGroups } from "@/lib/openapi";
import type { Content } from "@/content/types";
import { repo } from "@/content/facts";

/**
 * "API at a glance" (website/PLAN.md §5.7). The list is generated from the
 * gateway's api/openapi.yaml at build time — never hand-written. Provider-callback
 * and Admin routes are excluded (they are not for applications).
 */
export default function ApiList({ content }: { content: Content["api"] }) {
  const groups = apiGroups();
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.tag} className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">{group.tag}</h3>
            <ul className="mt-3 space-y-2.5">
              {group.operations.map((op) => (
                <li
                  key={`${op.method} ${op.path}`}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                >
                  <span
                    className={`inline-block min-w-[3.2rem] rounded px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold leading-4 ${
                      op.method === "POST"
                        ? "bg-accent text-white"
                        : "border border-line text-muted"
                    }`}
                  >
                    {op.method}
                  </span>
                  <code className="font-mono text-[13px]">{op.path}</code>
                  <span className="w-full text-[13px] text-muted sm:w-auto">{op.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        {content.generatedNote}{" "}
        <a
          href={repo.openapi}
          className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
        >
          {content.referenceLabel} <ExternalArrow />
        </a>
      </p>
    </div>
  );
}
