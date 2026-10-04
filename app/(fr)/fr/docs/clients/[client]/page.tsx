import type { Metadata } from "next";
import { fr as content } from "@/content/fr";
import { clientOrder, docsMetadata } from "@/lib/docsPages";
import { ClientDoc } from "@/components/docs/DocsPages";

type Params = { client: (typeof clientOrder)[number] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return clientOrder.map((client) => ({ client }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { client } = await params;
  const title = content.docs.client.titles[client];
  return docsMetadata(
    content,
    `clients/${client}`,
    title,
    content.docs.client.description.replace("{client}", title),
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { client } = await params;
  return <ClientDoc content={content} client={client} />;
}
