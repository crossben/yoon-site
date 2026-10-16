import { en as content } from "@/content/en";
import { docsMetadata } from "@/lib/docsPages";
import { McpDoc } from "@/components/docs/DocsPages";

export const metadata = docsMetadata(
  content,
  "mcp",
  content.docs.mcp.title,
  content.docs.mcp.description,
);

export default function Page() {
  return <McpDoc content={content} />;
}
