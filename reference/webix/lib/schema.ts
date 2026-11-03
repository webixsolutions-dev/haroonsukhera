import { SITE_FACTS } from "@/content/site-facts";
import { SITE_URL, ensureTrailingSlash } from "@/config/seo";
import type { ServiceEntry, ServiceFaq } from "@/content/services";

export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide JSON-LD @graph injected once in app/layout.tsx:
 * Organization + Person (Haroon Sukhera) + WebSite.
 * Address is city-level only (Dunyapur, Punjab, PK) — no streetAddress or postalCode.
 */
export function buildSiteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: SITE_FACTS.brandName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo.png`,
        },
        description: SITE_FACTS.disambiguation,
        email: SITE_FACTS.contact.email,
        telephone: SITE_FACTS.contact.phoneE164,
        founder: {
          "@id": FOUNDER_ID,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_FACTS.headquarters.addressLocality,
          addressRegion: SITE_FACTS.headquarters.addressRegion,
          addressCountry: SITE_FACTS.headquarters.addressCountry,
        },
        areaServed: [
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "New Zealand" },
          { "@type": "Country", name: "Pakistan" },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SITE_FACTS.contact.phoneE164,
            email: SITE_FACTS.contact.email,
            contactType: "sales",
            availableLanguage: ["English", "Urdu"],
          },
        ],
        sameAs: [
          SITE_FACTS.socials.facebook,
          SITE_FACTS.socials.instagram,
          SITE_FACTS.socials.linkedin,
          SITE_FACTS.socials.youtube,
          SITE_FACTS.socials.x,
          SITE_FACTS.socials.github,
        ],
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: SITE_FACTS.founder.name,
        jobTitle: SITE_FACTS.founder.role,
        worksFor: {
          "@id": ORG_ID,
        },
        sameAs: [
          SITE_FACTS.founder.linkedin,
          SITE_FACTS.founder.githubPersonal,
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_FACTS.brandName,
        publisher: {
          "@id": ORG_ID,
        },
        inLanguage: "en",
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${ensureTrailingSlash(item.path)}`,
    })),
  };
}

export function buildFaqJsonLd(faqs: readonly ServiceFaq[] | ServiceFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildServiceJsonLd(service: ServiceEntry) {
  const url = `${SITE_URL}/${service.slug}/`;
  const priceNumber = service.startingPrice
    ? service.startingPrice.replace(/[^0-9.]/g, "")
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    description: service.metaDescription,
    url,
    provider: {
      "@id": ORG_ID,
    },
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "New Zealand" },
      { "@type": "Country", name: "Pakistan" },
    ],
    ...(service.confirmedPrice && priceNumber
      ? {
          offers: {
            "@type": "Offer",
            price: priceNumber,
            priceCurrency: "USD",
            url,
          },
        }
      : {}),
  };
}
