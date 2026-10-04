import { fr as content } from "@/content/fr";
import { docsMetadata } from "@/lib/docsPages";
import { QuickstartDoc } from "@/components/docs/DocsPages";

export const metadata = docsMetadata(
  content,
  "quickstart",
  content.docs.quickstart.title,
  content.docs.quickstart.description,
);

export default function Page() {
  return <QuickstartDoc content={content} />;
}
