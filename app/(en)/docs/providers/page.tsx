import { en as content } from "@/content/en";
import { docsMetadata } from "@/lib/docsPages";
import { ProvidersDoc } from "@/components/docs/DocsPages";

export const metadata = docsMetadata(
  content,
  "providers",
  content.docs.providers.title,
  content.docs.providers.description,
);

export default function Page() {
  return <ProvidersDoc content={content} />;
}
