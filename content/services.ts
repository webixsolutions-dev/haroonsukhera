/**
 * Services registry. Copy from docs/02-copy.md (SERVICES) word for word.
 * Each service links to matching Webix pages (docs/site-facts.md).
 */
import type { WebixPageKey } from "./facts";
import type { WorkFilter } from "./work";

export type Service = {
  id: "full-stack" | "websites" | "stores" | "design" | "marketing" | "ai";
  title: string;
  /** Short name for chips/Core. */
  short: string;
  answer: string;
  whatYouGet: string[];
  webixLinks: WebixPageKey[];
  image: string;
  /** Pull samples from content/work.ts by this filter. */
  sampleFilter?: WorkFilter;
};

export const services: Service[] = [
  {
    id: "full-stack",
    title: "Full-stack development",
    short: "Full-stack",
    answer:
      "Custom web apps, portals, dashboards and stores written in Next.js, React and Node.js, with their own back end and admin panel.",
    whatYouGet: ["Code you own", "Fast, mobile-first pages", "Admin panel your team can use"],
    webixLinks: ["webDesign"],
    image: "/images/services/svc-full-stack.webp",
    sampleFilter: "coded",
  },
  {
    id: "websites",
    title: "Websites on WordPress and Shopify",
    short: "WordPress & Shopify",
    answer:
      "Business sites, landing pages and redesigns on WordPress (Elementor) and Shopify — plus fixes, speed work and new pages for sites you already have.",
    whatYouGet: ["Editable by you", "Mobile-ready", "Built for search"],
    webixLinks: ["webDesign", "shopify"],
    image: "/images/services/svc-websites.webp",
    sampleFilter: "cms",
  },
  {
    id: "stores",
    title: "Online stores",
    short: "Online stores",
    answer:
      "WooCommerce, Shopify and custom stores with clean product pages, simple checkout and the payment and shipping setup your market needs.",
    whatYouGet: ["Product pages that sell", "Smooth checkout", "Easy to manage"],
    webixLinks: ["shopify", "aiEcommerce"],
    image: "/images/services/svc-ecommerce.webp",
    sampleFilter: "stores",
  },
  {
    id: "design",
    title: "Design and video",
    short: "Design & video",
    answer: "Brand visuals, social posts, ad creatives, reels and edited videos from my design and video team.",
    whatYouGet: ["On-brand visuals", "Formats for every platform", "Fast revisions"],
    webixLinks: ["creative", "aiVideo"],
    image: "/images/services/svc-design-video.webp",
    sampleFilter: "design",
  },
  {
    id: "marketing",
    title: "Marketing",
    short: "Marketing",
    answer: "SEO, Google Business Profile, Meta and Google ads, and social media management run by my marketing team.",
    whatYouGet: ["Found on Google and Maps", "Ads that are tracked", "Consistent social presence"],
    webixLinks: ["seo", "ads", "social", "gbp"],
    image: "/images/services/svc-marketing.webp",
  },
  {
    id: "ai",
    title: "AI automation",
    short: "AI automation",
    answer:
      "n8n workflows and AI assistants that take repetitive work off your team — finding leads, replying to messages, qualifying and booking.",
    whatYouGet: ["Fewer manual tasks", "Faster replies", "Works with your current tools"],
    webixLinks: ["aiAutomation", "aiChatbots"],
    image: "/images/services/svc-ai-automation.webp",
    sampleFilter: "ai",
  },
];
