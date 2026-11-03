import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/styleguide/", "/dev/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"],
        allow: "/",
        disallow: ["/api/", "/styleguide/", "/dev/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
