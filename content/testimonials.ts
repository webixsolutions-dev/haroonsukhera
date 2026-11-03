/**
 * Testimonials. Render only entries with verified && permission,
 * and the section only appears when there are 3 or more.
 * Never write a testimonial yourself — empty at launch.
 */

export type Testimonial = {
  name: string;
  company?: string;
  country: string;
  /** Where it came from, e.g. "Upwork review", "Email". */
  source: string;
  quote: string;
  verified: boolean;
  permission: boolean;
};

export const testimonials: Testimonial[] = [];

export const visibleTestimonials = () => {
  const ok = testimonials.filter((t) => t.verified && t.permission);
  return ok.length >= 3 ? ok : [];
};
