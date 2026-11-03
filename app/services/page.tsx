import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { serviceList, faqPage, breadcrumb, pageGraph } from "@/lib/schema";
import { servicesCopy } from "@/content/copy/services";
import { processSteps } from "@/content/copy/shared";
import { services } from "@/content/services";
import { webix } from "@/content/facts";
import { publishedWork } from "@/content/work";
import { Section, type Surface } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServicesFaq } from "@/components/services/ServicesFaq";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata("services");

export default function ServicesPage() {
  const allProjects = publishedWork();

  const schema = pageGraph(
    serviceList(
      "/services/",
      services.map((s) => ({ id: s.id, name: s.title, description: s.answer }))
    ),
    faqPage([], "/services/"),
    breadcrumb([{ name: "Services", path: "/services/" }])
  );

  return (
    <>
      <JsonLd data={schema} />

      {/* 1. Header (Obsidian) */}
      <Section surface="obsidian" className="pb-16 pt-28 md:pt-36">
        <Container>
          <div className="max-w-3xl">
            <h1 className="t-h1 text-white">{servicesCopy.h1}</h1>
            <p className="t-lead mt-5 text-fog leading-relaxed">
              {servicesCopy.answer}
            </p>

            {/* Jump chips */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {services.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="chip border-white/15 bg-white/5 text-white/90 hover:border-white/30 hover:text-white"
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Six Service Blocks alternating Bone / Graphite */}
      {services.map((svc, idx) => {
        const isBone = idx % 2 === 0;
        const surface: Surface = isBone ? "bone" : "graphite";
        const samples = svc.sampleFilter
          ? allProjects.filter((w) => w.filters.includes(svc.sampleFilter!)).slice(0, 3)
          : [];

        return (
          <Section key={svc.id} surface={surface} id={svc.id}>
            <Container>
              <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                {/* Visual / Image */}
                <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border ${
                  isBone ? "border-ash/80 bg-ash/30" : "border-line-dark bg-obsidian"
                } md:col-span-5`}>
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-7">
                  <h2 className={`t-h2 ${isBone ? "text-ink" : "text-white"}`}>
                    {svc.title}
                  </h2>
                  <p className={`t-lead mt-4 leading-relaxed ${isBone ? "text-ink-muted" : "text-fog"}`}>
                    {svc.answer}
                  </p>

                  {/* What you get */}
                  <div className="mt-6">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isBone ? "text-molten-ink" : "text-molten-soft"}`}>
                      {servicesCopy.whatYouGet}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {svc.whatYouGet.map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <CheckCircle2
                            size={18}
                            className={isBone ? "text-molten-ink" : "text-molten"}
                          />
                          <span className={`t-body font-medium ${isBone ? "text-ink" : "text-white"}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample thumbnails pulled from work registry */}
                  {samples.length > 0 && (
                    <div className="mt-8 border-t border-current/10 pt-6">
                      <p className={`t-small mb-3 font-semibold ${isBone ? "text-ink-muted" : "text-fog"}`}>
                        Sample builds
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {samples.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/work/#${s.slug}`}
                            className={`group block overflow-hidden rounded-xl border p-2 transition-shadow ${
                              isBone
                                ? "border-ash/80 bg-white hover:shadow-md"
                                : "border-line-dark bg-obsidian hover:border-white/30"
                            }`}
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/20">
                              <Image
                                src={s.image}
                                alt={s.title}
                                fill
                                sizes="(max-width: 768px) 30vw, 15vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <p className={`mt-2 truncate text-xs font-semibold ${isBone ? "text-ink" : "text-white"}`}>
                              {s.title}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links to Webix service pages */}
                  <div className="mt-8 flex flex-wrap gap-4 pt-2">
                    {svc.webixLinks.map((key) => {
                      const link = webix.pages[key];
                      return (
                        <a
                          key={key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-2 underline-offset-4 hover:opacity-80 ${
                            isBone ? "text-molten-ink decoration-molten-ink" : "text-molten-soft decoration-molten-soft"
                          }`}
                        >
                          {link.label} at Webix Solutions <ArrowUpRight size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* 3. For freelancers and agencies (Molten-tinted glass on Obsidian) */}
      <Section surface="obsidian" id="freelancers">
        <Container>
          <Glass variant="molten" className="mx-auto max-w-4xl p-8 md:p-14">
            <h2 className="t-h2 text-white">
              {servicesCopy.freelancers.h2}
            </h2>
            <p className="t-lead mt-5 text-white/90 leading-relaxed">
              {servicesCopy.freelancers.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={servicesCopy.freelancers.primary.href} variant="primary">
                {servicesCopy.freelancers.primary.label}
              </Button>
              <Button
                href={webix.pages.whiteLabel.url}
                variant="glass"
                external
              >
                {servicesCopy.freelancers.secondary.label} →
              </Button>
            </div>
          </Glass>
        </Container>
      </Section>

      {/* 4. How a project runs (Bone) */}
      <Section surface="bone" id="process">
        <Container>
          <div className="text-center">
            <h2 className="t-h2 text-ink">{servicesCopy.process.h2}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-ash/80 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-molten-ink/10 font-mono text-base font-bold text-molten-ink">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="t-small mt-2 text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. FAQ (Obsidian) */}
      <ServicesFaq />

      {/* 6. Final CTA */}
      <FinalCta />
    </>
  );
}
