import type { Metadata } from "next";
import { SITE_URL, person } from "@/content/facts";
import { pageMeta, type PageKey } from "@/content/copy/seo";

/** Page metadata from docs/04-seo-ai.md: exact title/meta, absolute canonical, OG + Twitter. */
export function buildMetadata(key: PageKey, opts: { noindex?: boolean } = {}): Metadata {
  const m = pageMeta[key];
  const url = new URL(m.path, SITE_URL).toString();
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: url },
    openGraph: {
      type: key === "about" ? "profile" : "website",
      url,
      siteName: person.name,
      title: m.title,
      description: m.description,
      locale: "en_US",
      images: [{ url: m.og, width: 1200, height: 630, alt: m.title }],
      ...(key === "about" ? { firstName: "Haroon", lastName: "Sukhera" } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [m.og],
    },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
