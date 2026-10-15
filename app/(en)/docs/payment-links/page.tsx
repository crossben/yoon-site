import { en as content } from "@/content/en";
import { docsMetadata } from "@/lib/docsPages";
import { PaymentLinksDoc } from "@/components/docs/DocsPages";

export const metadata = docsMetadata(
  content,
  "payment-links",
  content.docs.paymentLinks.title,
  content.docs.paymentLinks.description,
);

export default function Page() {
  return <PaymentLinksDoc content={content} />;
}
