/**
 * Typed JSON-LD helpers (adapted from reference/webix/lib/schema.ts) for the @graph in docs/04-seo-ai.md.
 * Only mark up what is visible and true. Never Review/AggregateRating. Never offers/prices.
 */
import type {
  BreadcrumbList,
  CollectionPage,
  ContactPage,
  FAQPage,
  Graph,
  ItemList,
  Organization,
  Person,
  ProfilePage,
  Thing,
  WebPage,
  WebSite,
} from "schema-dts";
import { SITE_URL, person, contact, profiles, github, webix, knowsAbout, bio } from "@/content/facts";
import type { Faq } from "@/content/faq";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = webix.orgId;

const abs = (path: string) => new URL(path, SITE_URL).toString();

export function personNode(): Person {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateName,
    jobTitle: [...person.jobTitles],
    description: bio.medium,
    url: `${SITE_URL}/`,
    image: abs("/images/photos/haroon-hero-studio.webp"),
    email: contact.emailHref,
    telephone: contact.phoneE164,
    nationality: { "@type": "Country", name: "Pakistan" },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: person.basedIn.region,
        addressCountry: person.basedIn.countryCode,
      },
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: person.education.school },
    worksFor: { "@id": ORG_ID },
    knowsAbout,
    sameAs: profiles.map((p) => p.url),
  };
}

export function organizationNode(): Organization {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: webix.name,
    url: webix.url,
    founder: { "@id": PERSON_ID },
    sameAs: [github.url],
  };
}

export function websiteNode(): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: person.name,
    publisher: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

/** Site-wide @graph, injected once in app/layout.tsx. */
export function siteGraph(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), organizationNode(), websiteNode()],
  };
}

export function breadcrumb(items: { name: string; path: string }[]): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqPage(faqs: Faq[], path: string): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function profilePage(path: string, name: string): ProfilePage {
  return {
    "@type": "ProfilePage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function contactPage(path: string, name: string): ContactPage {
  return {
    "@type": "ContactPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    about: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function webPage(path: string, name: string): WebPage {
  return {
    "@type": "WebPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function serviceList(
  path: string,
  items: { id: string; name: string; description: string }[],
): ItemList {
  return {
    "@type": "ItemList",
    "@id": `${abs(path)}#services`,
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        "@id": `${abs(path)}#${s.id}`,
        name: s.name,
        description: s.description,
        url: `${abs(path)}#${s.id}`,
        provider: { "@id": PERSON_ID },
      },
    })),
  };
}

export function collectionPage(
  path: string,
  name: string,
  items: { name: string; description: string; image: string; url?: string }[],
): CollectionPage {
  return {
    "@type": "CollectionPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((w, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: w.name,
          description: w.description,
          image: abs(w.image),
          ...(w.url ? { url: w.url } : {}),
          creator: { "@id": PERSON_ID },
        },
      })),
    },
  };
}

/** Wrap page-level nodes into a graph for <JsonLd />. */
export function pageGraph(...nodes: Thing[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes as Graph["@graph"] };
}
