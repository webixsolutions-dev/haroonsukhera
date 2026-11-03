/** Titles and meta descriptions — docs/04-seo-ai.md exactly. */

export type PageKey = "home" | "about" | "services" | "work" | "contact" | "privacy";

export const pageMeta: Record<PageKey, { path: string; title: string; description: string; og: string }> = {
  home: {
    path: "/",
    title: "Haroon Sukhera — Full-Stack Developer, Webix Solutions CEO",
    description:
      "Haroon Sukhera is a full-stack web developer and founder & CEO of Webix Solutions. 150+ websites built. Hire him for one task or a full project.",
    og: "/images/og/cover-home.jpg",
  },
  about: {
    path: "/about/",
    title: "About Haroon Sukhera — Full-Stack Developer and CEO",
    description:
      "The official bio of Haroon Sukhera: full-stack developer, founder and CEO of Webix Solutions, 150+ websites built, leading a 20+ person team.",
    og: "/images/og/cover-about.jpg",
  },
  services: {
    path: "/services/",
    title: "Services — Web Development, Stores and AI | Haroon Sukhera",
    description:
      "Full-stack development, WordPress and Shopify sites, online stores, design, video, marketing and AI automation. Hire for one task or a whole project.",
    og: "/images/og/cover-services.jpg",
  },
  work: {
    path: "/work/",
    title: "Work — Websites, Platforms and Stores | Haroon Sukhera",
    description:
      "Websites, online stores, web platforms and AI automations built by Haroon Sukhera and his team. Filter by what you need.",
    og: "/images/og/cover-work.jpg",
  },
  contact: {
    path: "/contact/",
    title: "Contact Haroon Sukhera — Start a Project",
    description:
      "Tell Haroon Sukhera what you need — one task or a whole project. Businesses, individuals, freelancers and agencies welcome. WhatsApp, email or call.",
    og: "/images/og/cover-contact.jpg",
  },
  privacy: {
    path: "/privacy/",
    title: "Privacy Policy | Haroon Sukhera",
    description: "How haroonsukhera.com handles the information you send through its forms and analytics.",
    og: "/images/og/cover-home.jpg",
  },
};
