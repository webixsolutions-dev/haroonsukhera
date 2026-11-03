/** HOME copy — docs/02-copy.md word for word. */
import type { WorkFilter } from "../work";

export const homeCopy = {
  hero: {
    h1Name: "Haroon Sukhera",
    h1Line: "Full-stack developer and founder of Webix Solutions",
    sub: "I build websites, online stores and web platforms — and lead a 20+ person team that designs, markets and automates around them.",
    primary: { label: "Work with me", href: "/contact/" },
    secondary: { label: "See my work", href: "/work/" },
    chips: ["150+ websites built", "20+ person team", "Founder & CEO, Webix Solutions"],
    clientsLine: "Clients in Canada, the US, the UAE, New Zealand, Pakistan and Palestine.",
  },
  meet: {
    h2: "Hi, I'm Haroon",
    body: [
      "I started as a freelance WordPress developer. More than 150 websites later, I write custom platforms in Next.js and React — and I still take on WordPress and Shopify work when it's the right tool for the job.",
      "Today I also run Webix Solutions. So when your project needs design, video, ads or automation, the people who do it are on my team. You still deal with me.",
    ],
    chips: [
      "Full-stack: Next.js, React, Node.js",
      "CMS: WordPress, Shopify, WooCommerce",
      "Automation: n8n + AI",
    ],
  },
  webix: {
    kicker: "The company I lead",
    h2: "Webix Solutions",
    body: "Webix Solutions is the IT company I founded and run as CEO. A 20+ person team of developers, designers, video editors, marketers and AI engineers delivering websites, e-commerce, SEO, paid ads, social media and AI automation for clients in Canada, the United States, the UAE, New Zealand and Pakistan.",
    button: { label: "Visit Webix Solutions", href: "https://webixsolutions.com/" },
  },
  core: {
    h2: "One person to talk to. Every skill your project needs.",
    intro: "I build. My team designs, markets and automates around it. Pick an area to see the work.",
    panels: [
      {
        id: "coded",
        title: "Coded platforms",
        line: "Custom web apps, dashboards, portals and stores written in Next.js, React and Node.js.",
        linkLabel: "See coded work",
        href: "/work/?f=coded",
        filter: "coded",
        image: "/images/services/svc-full-stack.webp",
      },
      {
        id: "cms",
        title: "WordPress & Shopify",
        line: "Business sites, landing pages, WooCommerce and Shopify stores, plus fixes and redesigns of sites you already have.",
        linkLabel: "See CMS work",
        href: "/work/?f=cms",
        filter: "cms",
        image: "/images/services/svc-websites.webp",
      },
      {
        id: "stores",
        title: "Online stores",
        line: "Stores that load fast, look sharp on a phone and make checkout easy.",
        linkLabel: "See stores",
        href: "/work/?f=stores",
        filter: "stores",
        image: "/images/services/svc-ecommerce.webp",
      },
      {
        id: "design",
        title: "Design & video",
        line: "Brand visuals, social posts, ad creatives and reels from my design and video team.",
        linkLabel: "See design and video",
        href: "/work/?f=design",
        filter: "design",
        image: "/images/services/svc-design-video.webp",
      },
      {
        id: "marketing",
        title: "Marketing",
        line: "SEO, Google Maps, Meta and Google ads, and social media handled by my marketing team.",
        linkLabel: "See services",
        href: "/services/#marketing",
        filter: undefined,
        image: "/images/services/svc-marketing.webp",
      },
      {
        id: "ai",
        title: "AI automation",
        line: "n8n workflows and AI assistants that find leads, answer messages and book calls.",
        linkLabel: "See AI work",
        href: "/work/?f=ai",
        filter: "ai",
        image: "/images/services/svc-ai-automation.webp",
      },
    ] as {
      id: string;
      title: string;
      line: string;
      linkLabel: string;
      href: string;
      filter?: WorkFilter;
      image: string;
    }[],
  },
  selectedWork: {
    h2: "Selected work",
    intro: "A few recent builds. Every project here is live or was delivered to a real client.",
    button: { label: "See all work", href: "/work/" },
  },
  workWithMe: {
    h2: "Three ways to work with me",
  },
  faq: { h2: "Questions people ask me" },
  cta: {
    h2: "One task or a whole project — tell me what you need.",
  },
} as const;
