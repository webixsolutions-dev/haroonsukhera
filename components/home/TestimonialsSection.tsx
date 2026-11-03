import { visibleTestimonials } from "@/content/testimonials";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

export function TestimonialsSection() {
  const items = visibleTestimonials();

  // Rule 04: Section only appears when there are 3 or more verified testimonials
  if (items.length < 3) return null;

  return (
    <Section surface="bone" id="testimonials">
      <Container>
        <h2 className="t-h2 text-center text-ink">What clients say</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t, idx) => (
            <div key={idx} className="rounded-2xl border border-ash/80 bg-white p-6 shadow-sm">
              <p className="t-body italic text-ink">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 border-t border-ash/40 pt-4">
                <p className="font-display font-bold text-ink">{t.name}</p>
                <p className="text-xs text-ink-muted">
                  {t.company ? `${t.company} · ` : ""}
                  {t.country} ({t.source})
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
