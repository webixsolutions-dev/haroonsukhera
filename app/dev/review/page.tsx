import type { Metadata } from "next";
import Image from "next/image";
import { work } from "@/content/work";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Chip } from "@/components/ui/Chip";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Portfolio Review & Selection | Private QA",
  robots: { index: false, follow: false },
};

export default function PortfolioReviewPage() {
  const confirms = [
    {
      item: "Partner Projects live links",
      note: "sparkcharge.au, bondiscreens.com.au — hidden per default rule: partnerPermission=false, showLink=false, generic titles used.",
    },
    {
      item: "Coded Projects live domains",
      note: "Jooblie, LaptopSouq, Zelvomart, University Portal — showLink=false until production custom domains are verified.",
    },
    {
      item: "Webix CRM Screenshots",
      note: "Kept published=false until demo data dataset is approved.",
    },
    {
      item: "Design & Video assets",
      note: "Kept published=false until 8-12 design assets and 4-6 video reels are supplied by the Webix creative team.",
    },
  ];

  return (
    <div className="pb-32 pt-24">
      <Section surface="obsidian">
        <Container>
          <Kicker>Portfolio Pipeline Review</Kicker>
          <h1 className="t-h1 mt-2 text-white">Project Mockups & Featured Picks</h1>
          <p className="t-lead mt-3 text-fog">
            Review of all composed project mockups. The default 6 featured picks from docs/05-portfolio.md are highlighted.
          </p>

          {/* CONFIRM Block */}
          <div className="mt-8 rounded-2xl border border-molten/30 bg-molten/5 p-6">
            <h2 className="font-display text-xl font-bold text-molten-soft">Pending Confirmation Items ([[CONFIRM]])</h2>
            <ul className="mt-4 space-y-2 text-sm text-fog">
              {confirms.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-molten">•</span>
                  <span>
                    <strong className="text-white">{c.item}:</strong> {c.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mockup Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {work.map((item) => (
              <Glass key={item.slug} variant="default" className="flex flex-col overflow-hidden p-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {item.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-molten px-3 py-1 text-xs font-bold text-ink shadow-lg">
                      Featured Pick
                    </span>
                  )}
                  {!item.published && (
                    <span className="absolute left-3 top-3 rounded-full bg-line-dark px-3 py-1 text-xs font-semibold text-white/70">
                      Unpublished
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="t-h3 text-white">{item.title}</h3>
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-fog">
                      <input
                        type="checkbox"
                        defaultChecked={item.featured}
                        className="accent-molten"
                        readOnly
                      />
                      <span>Featured</span>
                    </label>
                  </div>

                  <p className="mt-2 text-xs font-medium text-molten-soft">{item.label}</p>
                  <p className="t-small mt-2 line-clamp-3 text-fog">{item.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.filters.map((f) => (
                      <Chip key={f} className="text-xs">
                        {f}
                      </Chip>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1 border-t border-white/10 pt-3 text-xs text-white/50">
                    {item.stack.map((s, idx) => (
                      <span key={s}>
                        {s}
                        {idx < item.stack.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
