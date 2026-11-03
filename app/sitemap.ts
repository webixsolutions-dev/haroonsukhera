import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/facts";
import { sitemapRoutes } from "@/content/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitemapRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}
