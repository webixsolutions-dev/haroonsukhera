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

export const work: WorkItem[] = [
  {
    slug: "jooblie",
    title: "Jooblie",
    label: "Job platform, Canada — web app, admin panel and mobile app",
    summary:
      "A scalable recruitment ecosystem built for the Canadian tech sector. Comprises an employer portal, applicant dashboard, unified administrative console, and cross-platform mobile client.",
    filters: ["coded"],
    stack: ["Next.js", "React", "Node.js", "PostgreSQL", "Flutter"],
    showLink: false,
    image: "/images/work/jooblie.webp",
    featured: true,
    published: true,
  },
  {
    slug: "laptopsouq",
    title: "LaptopSouq.ae",
    label: "E-commerce platform, UAE — online store and inventory back end",
    summary:
      "Custom e-commerce platform built for electronics retail in the United Arab Emirates. Engineered with custom catalog management, fast search, and direct WhatsApp checkout integration.",
    filters: ["coded", "stores"],
    stack: ["Next.js", "React", "Node.js", "Tailwind CSS"],
    showLink: false,
    image: "/images/work/laptopsouq.webp",
    featured: true,
    published: true,
  },
  {
    slug: "zelvomart",
    title: "Zelvomart",
    label: "E-commerce platform, Pakistan — online store and custom back end",
    summary:
      "A custom-coded multi-category online store engineered for high-volume consumer traffic in Pakistan. Features instant cash-on-delivery order flows, real-time catalog sync, and mobile speed optimization.",
    filters: ["coded", "stores"],
    stack: ["Next.js", "Node.js", "MongoDB", "Express"],
    showLink: false,
    image: "/images/work/zelvomart.webp",
    featured: true,
    published: true,
  },
  {
    slug: "ccog-portal",
    title: "University Portal",
    label: "University portal, United States — student and faculty portal",
    summary:
      "Centralized academic dashboard facilitating student enrollment, department administration, and grading records. Built with role-based authentication and real-time attendance management.",
    filters: ["coded"],
    stack: ["Next.js", "React", "Node.js", "PostgreSQL"],
    showLink: false,
    image: "/images/work/ccog-portal.webp",
    featured: true,
    published: true,
  },
  {
    slug: "beorganichealth",
    title: "Be Organic Health",
    label: "Organic wellness store, United States — e-commerce build",
    summary:
      "Clean, mobile-first e-commerce website for an American health and wellness brand. Configured with structured product catalogs, streamlined checkout, and subscription ordering.",
    filters: ["cms", "stores"],
    stack: ["WordPress", "WooCommerce", "Elementor"],
    url: "https://beorganichealth.com/",
    showLink: true,
    image: "/images/work/beorganichealth.webp",
    featured: true,
    published: true,
  },
  {
    slug: "leadpilot",
    title: "LeadPilot",
    label: "AI lead generation engine — maps data and outreach automation",
    summary:
      "Autonomous lead generation pipeline. Finds businesses on Google Maps by niche and geography, verifies contact data, generates personalized introductory outreach with AI, and syncs batches into CRM storage.",
    filters: ["ai"],
    stack: ["n8n", "OpenAI", "Google Maps data"],
    showLink: false,
    image: "/images/ai-systems/ai-leadpilot.webp",
    featured: true,
    published: true,
  },
  {
    slug: "replydesk",
    title: "ReplyDesk",
    label: "AI reply desk — lead qualification and automated WhatsApp scheduling",
    summary:
      "Conversational qualification assistant that monitors incoming inquiries from web forms, ads, and WhatsApp. Replies instantly in the brand's tone, collects qualification criteria, and coordinates meeting slots.",
    filters: ["ai"],
    stack: ["n8n", "OpenAI", "WhatsApp"],
    showLink: false,
    image: "/images/ai-systems/ai-replydesk.webp",
    featured: false,
    published: true,
  },
  {
    slug: "hciorlando",
    title: "HCI Orlando",
    label: "Healthcare training institute, United States — corporate website",
    summary:
      "Modern institutional web presence for a Florida healthcare training academy. Includes program information architecture, enrollment inquiry forms, and search engine optimization.",
    filters: ["cms"],
    stack: ["WordPress", "Elementor"],
    url: "https://hciorlando.com/",
    showLink: true,
    image: "/images/work/hciorlando.webp",
    featured: false,
    published: true,
  },
  {
    slug: "clubc-education",
    title: "Club C Education",
    label: "Education platform, United States — course and learning hub",
    summary:
      "Course discovery and student community website designed for streamlined mobile navigation, curriculum previews, and educational enrollment.",
    filters: ["cms"],
    stack: ["WordPress", "Elementor"],
    url: "https://clubc.education/",
    showLink: true,
    image: "/images/work/clubc-education.webp",
    featured: false,
    published: true,
  },
  {
    slug: "vivonow",
    title: "Vivonow",
    label: "Digital health brand, United States — corporate website",
    summary:
      "Responsive marketing platform for a digital healthcare initiative. Features clean typography, structured service pages, and rapid mobile page load times.",
    filters: ["cms"],
    stack: ["WordPress", "Elementor"],
    url: "https://vivonow.com/",
    showLink: true,
    image: "/images/work/vivonow.webp",
    featured: false,
    published: true,
  },
  {
    slug: "partner-solar-au",
    title: "Solar company, Australia",
    label: "Solar company, Australia — WordPress website, delivered with a freelance partner",
    summary:
      "Commercial and residential solar installation website delivered in partnership with an Australian freelance agency. High-speed quote inquiry flows and clean technical presentation.",
    filters: ["partner", "cms"],
    stack: ["WordPress", "Elementor"],
    partnerPermission: false,
    showLink: false,
    image: "/images/work/partner-solar-au.webp",
    featured: false,
    published: true,
  },
  {
    slug: "partner-screens-au",
    title: "Security screens manufacturer, Australia",
    label: "Security screens manufacturer, Australia — website, delivered with a freelance partner",
    summary:
      "Architectural security screen and barrier door product showcase. Delivered white-label for an Australian agency partner with full specification downloads.",
    filters: ["partner", "cms"],
    stack: ["WordPress", "Elementor"],
    partnerPermission: false,
    showLink: false,
    image: "/images/work/partner-screens-au.webp",
    featured: false,
    published: true,
  },
  {
    slug: "webix-crm",
    title: "Webix CRM",
    label: "Agency CRM, Pakistan — internal operations platform",
    summary: "Agency client and pipeline tracking software. Screen demo data required before publishing.",
    filters: ["coded"],
    stack: ["Next.js", "Node.js", "PostgreSQL"],
    showLink: false,
    image: "/images/work/ccog-portal.webp",
    featured: false,
    published: false,
  },
];

export const publishedWork = () => work.filter((w) => w.published);
export const featuredWork = () => publishedWork().filter((w) => w.featured).slice(0, 6);
export const workByFilter = (f: WorkFilter, limit?: number) => {
  const items = publishedWork().filter((w) => w.filters.includes(f));
  return typeof limit === "number" ? items.slice(0, limit) : items;
};
