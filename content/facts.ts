/**
 * Mirror of docs/site-facts.md — the ONLY source for facts, numbers, names and links.
 * Anything not here is not published. Change the doc first, then this file.
 */

export const SITE_URL = "https://haroonsukhera.com";

export const person = {
  name: "Haroon Sukhera",
  /** Schema only — never render visibly. */
  alternateName: "M Haroon Rasheed",
  title: "Full-Stack Web Developer · Founder & CEO, Webix Solutions",
  jobTitles: ["Full-Stack Web Developer", "Founder & CEO"],
  shortLine: "Full-stack web developer and founder of Webix Solutions",
  basedIn: { region: "Punjab", country: "Pakistan", countryCode: "PK", label: "Punjab, Pakistan" },
  education: {
    degree: "Bachelor of Computer Science (BCompSc)",
    school: "Islamia University Bahawalpur",
  },
  startedAs: "Freelance WordPress developer",
  buildsWith: {
    code: ["Next.js", "React", "Node.js"],
    cms: ["WordPress", "Elementor", "WooCommerce", "Shopify"],
    ai: ["n8n", "OpenAI"],
  },
  websitesBuilt: "150+",
  team: "20+ person team",
  teamSize: "20+",
  teamRoles: ["developers", "designers", "video editors", "marketers", "AI engineers"],
  clientsIn: ["Canada", "the United States", "the United Arab Emirates", "New Zealand", "Pakistan", "Palestine"],
  clientsInPlain: ["Canada", "United States", "United Arab Emirates", "New Zealand", "Pakistan", "Palestine"],
  /** Never counted as "clients in". */
  partnerCountries: ["Australia", "the United Kingdom", "Germany", "Ecuador"],
  worksWith: [
    "Businesses and companies",
    "Individuals (including single small tasks)",
    "Freelancers and agencies (white-label, under their name, NDA on request)",
  ],
} as const;

export const contact = {
  email: "haroonsukheraofficial@gmail.com",
  emailHref: "mailto:haroonsukheraofficial@gmail.com",
  phoneDisplay: "+92 306 5389453",
  phoneE164: "+923065389453",
  whatsappHref: "https://wa.me/923065389453",
  booking: { minutes: 20, label: "20-minute call with Haroon" },
} as const;

export type Profile = { key: string; label: string; url: string };

/** sameAs — same order everywhere. GitHub belongs to the Organization in schema. */
export const profiles: Profile[] = [
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/haroonsukhera/" },
  { key: "upwork", label: "Upwork", url: "https://www.upwork.com/freelancers/~0177d947f87a6fe31c" },
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com/haroonsukheraofficial" },
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/haroonsukheraofficial" },
  { key: "threads", label: "Threads", url: "https://www.threads.com/@haroonsukheraofficial" },
];

export const github: Profile = { key: "github", label: "GitHub", url: "https://github.com/webixsolutions-dev" };

export const webix = {
  name: "Webix Solutions",
  role: "Founder & CEO",
  url: "https://webixsolutions.com/",
  orgId: "https://webixsolutions.com/#organization",
  team: "20+ person team",
  markets: ["Canada", "the United States", "the UAE", "New Zealand", "Pakistan"],
  whatItIs:
    "Full-service digital and AI agency: websites and web apps, e-commerce, design and video, SEO, paid ads, social media, Google Business Profile, AI automation and chatbots; white-label delivery for agencies",
  pages: {
    webDesign: { label: "Web design & development", url: "https://webixsolutions.com/web-design-development-service/" },
    shopify: { label: "Shopify stores", url: "https://webixsolutions.com/shopify-store-development-services/" },
    mobileApps: { label: "Mobile apps", url: "https://webixsolutions.com/mobile-app-development-services/" },
    aiEcommerce: { label: "AI e-commerce automation", url: "https://webixsolutions.com/ai-ecommerce-automation/" },
    creative: { label: "Creative services", url: "https://webixsolutions.com/creative-services/" },
    aiVideo: { label: "AI video production", url: "https://webixsolutions.com/ai-video-production-services/" },
    seo: { label: "SEO", url: "https://webixsolutions.com/seo-services/" },
    ads: { label: "Paid advertising", url: "https://webixsolutions.com/paid-advertising-services/" },
    social: { label: "Social media management", url: "https://webixsolutions.com/social-media-management/" },
    gbp: { label: "Google Business Profile", url: "https://webixsolutions.com/google-business-profile-optimization/" },
    aiAutomation: { label: "AI automation", url: "https://webixsolutions.com/ai-automation-services/" },
    aiChatbots: { label: "AI chatbots", url: "https://webixsolutions.com/ai-chatbot-development/" },
    whiteLabel: { label: "White-label partners", url: "https://webixsolutions.com/white-label-partners/" },
  },
} as const;

export type WebixPageKey = keyof typeof webix.pages;

/** Real AI systems. No usage numbers until Haroon provides real ones. */
export const aiSystems = [
  {
    slug: "leadpilot",
    name: "LeadPilot",
    what: "Finds businesses on Google Maps by niche and city, enriches them (website, email, rating), writes a personalised first line with AI, saves them to a sheet/CRM and sends outreach in batches",
    stack: ["n8n", "OpenAI", "Google Maps data"],
    image: "/images/ai-systems/ai-leadpilot.webp",
  },
  {
    slug: "replydesk",
    name: "ReplyDesk",
    what: "Takes new leads from ads, website and WhatsApp, drafts a reply in the brand's tone, asks qualifying questions, then books a call or alerts the team",
    stack: ["n8n", "OpenAI", "WhatsApp"],
    image: "/images/ai-systems/ai-replydesk.webp",
  },
] as const;

/** Official bios (docs/02-copy.md → ABOUT → Official bio). */
export const bio = {
  short: "Haroon Sukhera is a full-stack web developer and the founder and CEO of Webix Solutions.",
  medium:
    "Haroon Sukhera is a Pakistani full-stack web developer and the founder and CEO of Webix Solutions, a digital and AI agency. He started as a freelance WordPress developer, has built 150+ websites, and now leads a 20+ person team delivering websites, e-commerce, design, video, SEO, paid ads, social media and AI automation for clients in Canada, the United States, the UAE, New Zealand, Pakistan and beyond.",
} as const;

export const knowsAbout = [
  "Full-stack web development",
  "Next.js",
  "React",
  "Node.js",
  "WordPress",
  "Elementor",
  "WooCommerce",
  "Shopify",
  "E-commerce",
  "n8n",
  "AI automation",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "Social media marketing",
];
