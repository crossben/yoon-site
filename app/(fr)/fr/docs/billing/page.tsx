import { fr as content } from "@/content/fr";
import { docsMetadata } from "@/lib/docsPages";
import { BillingDoc } from "@/components/docs/DocsPages";

export const metadata = docsMetadata(
  content,
  "billing",
  content.docs.billing.title,
  content.docs.billing.description,
);

export default function Page() {
  return <BillingDoc content={content} />;
}
