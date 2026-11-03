/**
 * Portfolio registry. Types from docs/05-portfolio.md.
 * `published: false` never renders and never appears in the sitemap.
 */

export type WorkFilter = "coded" | "cms" | "stores" | "design" | "ai" | "partner";

export type WorkItem = {
  slug: string;
  /** Site/brand name — or a generic label when the name can't be shown. */
  title: string;
  /** "Industry, Country — scope" */
  label: string;
  /** 2–4 lines for the detail panel (what was built, for whom, what's special). */
  summary: string;
  filters: WorkFilter[];
  stack: string[];
  url?: string;
  /** false for partner work without permission, staging links, etc. */
  showLink: boolean;
  /** Partner projects only: true = may show name + link. */
  partnerPermission?: boolean;
  /** Composed mockup in /images/work/ (or /images/ai-systems/ for AI). */
  image: string;
  /** Max 6 — home "Selected work". */
  featured?: boolean;
  published: boolean;
};

export const workFilters: { key: WorkFilter | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "coded", label: "Coded platforms" },
  { key: "cms", label: "WordPress & Shopify" },
  { key: "stores", label: "Online stores" },
  { key: "design", label: "Design & video" },
  { key: "ai", label: "AI automation" },
  { key: "partner", label: "Partner projects" },
];

export const work: WorkItem[] = [];

export const publishedWork = () => work.filter((w) => w.published);
export const featuredWork = () => publishedWork().filter((w) => w.featured).slice(0, 6);
export const workByFilter = (f: WorkFilter, limit?: number) => {
  const items = publishedWork().filter((w) => w.filters.includes(f));
  return typeof limit === "number" ? items.slice(0, limit) : items;
};
