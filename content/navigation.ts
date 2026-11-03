/** Site navigation. Header, footer and sitemap read from here. */

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Work", href: "/work/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNav: NavItem[] = [{ label: "Home", href: "/" }, ...mainNav];

export const legalNav: NavItem[] = [{ label: "Privacy", href: "/privacy/" }];

/** Public, indexable routes (sitemap). */
export const sitemapRoutes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about/", priority: 0.9 },
  { path: "/services/", priority: 0.8 },
  { path: "/work/", priority: 0.8 },
  { path: "/contact/", priority: 0.7 },
  { path: "/privacy/", priority: 0.2 },
];

export const workWithMeCta: NavItem = { label: "Work with me", href: "/contact/" };
