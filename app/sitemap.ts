import type { MetadataRoute } from "next";
import { docsHref, docsSlugs } from "@/lib/docsPages";

export const dynamic = "force-static";

const SITE = "https://yoonpay.benhattab.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${SITE}/`, fr: `${SITE}/fr/` };
  const docs = docsSlugs.flatMap((slug) => {
    const alternates = {
      languages: { en: `${SITE}${docsHref("en", slug)}`, fr: `${SITE}${docsHref("fr", slug)}` },
    };
    return (["en", "fr"] as const).map((lang) => ({
      url: `${SITE}${docsHref(lang, slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates,
    }));
  });
  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE}/fr/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
    ...docs,
  ];
}
