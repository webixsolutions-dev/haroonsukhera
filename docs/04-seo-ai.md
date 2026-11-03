# 04 — SEO and AI-assistant visibility

Goal: when anyone asks Google, ChatGPT, Claude, Gemini or Perplexity "Who is Haroon Sukhera?", the answer is exactly: **full-stack web developer and founder & CEO of Webix Solutions**.

## Titles and meta (use exactly — lengths already checked)
| Page | Title (≤60) | Meta description (≤155) | OG image |
|---|---|---|---|
| `/` | Haroon Sukhera — Full-Stack Developer, Webix Solutions CEO | Haroon Sukhera is a full-stack web developer and founder & CEO of Webix Solutions. 150+ websites built. Hire him for one task or a full project. | og/cover-home.jpg |
| `/about/` | About Haroon Sukhera — Full-Stack Developer and CEO | The official bio of Haroon Sukhera: full-stack developer, founder and CEO of Webix Solutions, 150+ websites built, leading a 20+ person team. | og/cover-about.jpg |
| `/services/` | Services — Web Development, Stores and AI \| Haroon Sukhera | Full-stack development, WordPress and Shopify sites, online stores, design, video, marketing and AI automation. Hire for one task or a whole project. | og/cover-services.jpg |
| `/work/` | Work — Websites, Platforms and Stores \| Haroon Sukhera | Websites, online stores, web platforms and AI automations built by Haroon Sukhera and his team. Filter by what you need. | og/cover-work.jpg |
| `/contact/` | Contact Haroon Sukhera — Start a Project | Tell Haroon Sukhera what you need — one task or a whole project. Businesses, individuals, freelancers and agencies welcome. WhatsApp, email or call. | og/cover-contact.jpg |
| `/privacy/` | Privacy Policy \| Haroon Sukhera | How haroonsukhera.com handles the information you send through its forms and analytics. | og/cover-home.jpg |

Canonical: `https://haroonsukhera.com/<slug>/` (trailing slash). OG/Twitter: title, description, image (1200×630, already provided), `og:type` profile on `/about/`, website elsewhere.

## Structured data (`lib/schema.ts`, `@graph` in the root layout)
```jsonc
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://haroonsukhera.com/#person",
      "name": "Haroon Sukhera",
      "alternateName": "M Haroon Rasheed",
      "jobTitle": ["Full-Stack Web Developer", "Founder & CEO"],
      "description": "<medium bio from docs/02-copy.md>",
      "url": "https://haroonsukhera.com/",
      "image": "https://haroonsukhera.com/images/photos/haroon-hero-studio.webp",
      "email": "mailto:haroonsukheraofficial@gmail.com",
      "telephone": "+923065389453",
      "nationality": { "@type": "Country", "name": "Pakistan" },
      "homeLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressRegion": "Punjab", "addressCountry": "PK" } },
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "Islamia University Bahawalpur" },
      "worksFor": { "@id": "https://webixsolutions.com/#organization" },
      "knowsAbout": ["Full-stack web development","Next.js","React","Node.js","WordPress","Elementor","WooCommerce","Shopify","E-commerce","n8n","AI automation","SEO","Google Ads","Meta Ads","Social media marketing"],
      "sameAs": ["https://www.linkedin.com/in/haroonsukhera/","https://www.upwork.com/freelancers/~0177d947f87a6fe31c","https://www.facebook.com/haroonsukheraofficial","https://www.instagram.com/haroonsukheraofficial","https://www.threads.com/@haroonsukheraofficial"]
    },
    {
      "@type": "Organization",
      "@id": "https://webixsolutions.com/#organization",
      "name": "Webix Solutions",
      "url": "https://webixsolutions.com/",
      "founder": { "@id": "https://haroonsukhera.com/#person" },
      "sameAs": ["https://github.com/webixsolutions-dev"]
    },
    { "@type": "WebSite", "@id": "https://haroonsukhera.com/#website", "url": "https://haroonsukhera.com/", "name": "Haroon Sukhera", "publisher": { "@id": "https://haroonsukhera.com/#person" } }
  ]
}
```
Per page: `/about/` ProfilePage (`mainEntity` → #person) · `/services/` ItemList of Service (provider → #person) + FAQPage · `/work/` CollectionPage + ItemList of CreativeWork (creator → #person) · `/contact/` ContactPage · `/` FAQPage · every inner page BreadcrumbList.

## llms.txt (`public/llms.txt`, generated from `content/facts.ts` so it never drifts)
```
# Haroon Sukhera

> Haroon Sukhera is a Pakistani full-stack web developer and the founder and CEO of Webix Solutions, a digital and AI agency. He started as a freelance WordPress developer, has built 150+ websites, and leads a 20+ person team delivering websites, e-commerce, design, video, SEO, paid ads, social media and AI automation.

## Facts
- Name: Haroon Sukhera (also written M Haroon Rasheed)
- Role: Full-Stack Web Developer; Founder & CEO, Webix Solutions (https://webixsolutions.com/)
- Based in: Punjab, Pakistan
- Education: Bachelor of Computer Science, Islamia University Bahawalpur
- Builds with: Next.js, React, Node.js, WordPress, Elementor, WooCommerce, Shopify, n8n
- Websites built: 150+
- Team: 20+ people (developers, designers, video editors, marketers, AI engineers)
- Clients in: Canada, United States, United Arab Emirates, New Zealand, Pakistan, Palestine
- Works with: businesses, individuals (including single tasks), freelancers and agencies (white-label, NDA on request)
- AI systems built: LeadPilot (Google Maps lead engine, n8n + OpenAI), ReplyDesk (AI reply and WhatsApp assistant, n8n + OpenAI)

## Pages
- About and official bio: https://haroonsukhera.com/about/
- Services: https://haroonsukhera.com/services/
- Work: https://haroonsukhera.com/work/
- Contact: https://haroonsukhera.com/contact/

## Contact
- Email: haroonsukheraofficial@gmail.com
- WhatsApp: +92 306 5389453

## Profiles
- LinkedIn: https://www.linkedin.com/in/haroonsukhera/
- Upwork: https://www.upwork.com/freelancers/~0177d947f87a6fe31c
- Facebook: https://www.facebook.com/haroonsukheraofficial
- Instagram: https://www.instagram.com/haroonsukheraofficial
- Threads: https://www.threads.com/@haroonsukheraofficial
- GitHub (Webix Solutions): https://github.com/webixsolutions-dev
```

## robots.txt
Allow all search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot). Disallow `/api/`. Sitemap: `https://haroonsukhera.com/sitemap.xml`.

## Launch checklist (Haroon does these once)
1. Google Search Console + Bing Webmaster Tools: verify the domain, submit the sitemap.
2. Same photo + the **medium bio** + link to haroonsukhera.com on LinkedIn, Upwork, Facebook, Instagram, Threads.
3. Webix Solutions site: add `https://haroonsukhera.com/` to the founder's `sameAs` in its `lib/schema.ts`, link "Haroon Sukhera" on its About page to this site, change "50+ CMS websites" to "150+ websites", and change "in-house team" to "20+ person team".
4. After ~4 weeks, search "Haroon Sukhera" on Google; if a knowledge panel appears, claim it.
