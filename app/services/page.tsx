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
      <Section surface="obsidian" className="relative overflow-hidden pb-20 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-45">
          <Image
            src="/images/hero/hero-glass-field.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-75"
        />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-fog">
              <span className="h-2 w-2 rounded-full bg-molten" />
              <span>6 Core Capabilities · Founder-led delivery</span>
            </div>
            <h1 className="t-h1 text-white">{servicesCopy.h1}</h1>
            <p className="t-lead mt-5 leading-relaxed text-white/85">
              {servicesCopy.answer}
            </p>

            {/* Numbered Jump Chips */}
            <div className="mt-9 flex flex-wrap gap-2.5">
              {services.map((s, idx) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/90 transition-all hover:-translate-y-0.5 hover:border-molten/60 hover:bg-molten/15 hover:text-white"
                >
                  <span className="font-display text-xs font-bold text-molten-soft">
                    0{idx + 1}
                  </span>
                  <span>{s.short}</span>
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
          <Section
            key={svc.id}
            surface={surface}
            id={svc.id}
            className="overflow-hidden"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 mask-radial-fade ${
                isBone ? "bg-grid-light opacity-70" : "bg-grid-dark opacity-60"
              }`}
            />

            <Container className="relative z-10">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* 3D Glass Sculpture Studio Pedestal */}
                <div
                  className={`lg:col-span-5 ${
                    !isBone ? "lg:order-2" : ""
                  }`}
                >
                  <div className="group relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-[28px] border border-white/15 bg-obsidian p-6 shadow-[0_30px_70px_-20px_rgba(12,13,16,0.45)]">
                    {/* Warm radial molten studio spotlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-90"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(255, 90, 31, 0.32), rgba(255, 138, 92, 0.1) 48%, transparent 72%)",
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-display text-xs font-extrabold text-molten-soft">
                        0{idx + 1} / 06
                      </span>
                      <span className="text-xs font-medium text-fog">{svc.short}</span>
                    </div>

                    <div className="relative inset-0 mt-2 h-[82%] w-full">
                      <Image
                        src={svc.image}
                        alt={svc.title}
                        fill
                        sizes="(max-width: 768px) 85vw, 380px"
                        className="object-contain p-4 drop-shadow-[0_24px_38px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Content & Deliverables */}
                <div
                  className={`lg:col-span-7 ${
                    !isBone ? "lg:order-1" : ""
                  }`}
                >
                  <div className="mb-3 inline-flex items-center gap-2">
                    <span
                      className={`font-display text-xs font-extrabold ${
                        isBone ? "text-molten-ink" : "text-molten-soft"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isBone ? "text-ink-muted" : "text-fog"
                      }`}
                    >
                      · {svc.short}
                    </span>
                  </div>

                  <h2 className={`t-h2 ${isBone ? "text-ink" : "text-white"}`}>
                    {svc.title}
                  </h2>
                  <p
                    className={`t-lead mt-4 leading-relaxed ${
                      isBone ? "text-ink-muted" : "text-white/85"
                    }`}
                  >
                    {svc.answer}
                  </p>

                  {/* What you get — 2-column checklist cards */}
                  <div className="mt-7">
                    <p
                      className={`mb-3 text-xs font-bold ${
                        isBone ? "text-molten-ink" : "text-molten-soft"
                      }`}
                    >
                      {servicesCopy.whatYouGet}
                    </p>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {svc.whatYouGet.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                            isBone
                              ? "border-ink/10 bg-white shadow-sm"
                              : "border-white/10 bg-white/[0.04]"
                          }`}
                        >
                          <CheckCircle2
                            size={18}
                            className={`shrink-0 ${
                              isBone ? "text-molten-ink" : "text-molten"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isBone ? "text-ink" : "text-white"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample thumbnails pulled from work registry */}
                  {samples.length > 0 && (
                    <div
                      className={`mt-8 border-t pt-6 ${
                        isBone ? "border-ink/10" : "border-white/10"
                      }`}
                    >
                      <p
                        className={`t-small mb-3 font-semibold ${
                          isBone ? "text-ink-muted" : "text-fog"
                        }`}
                      >
                        Delivered projects in this category
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {samples.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/work/#${s.slug}`}
                            className={`group block overflow-hidden rounded-2xl border p-2 transition-all duration-300 hover:-translate-y-0.5 ${
                              isBone
                                ? "border-ink/10 bg-white shadow-sm hover:border-ink/25"
                                : "border-white/12 bg-obsidian hover:border-molten/50"
                            }`}
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-obsidian">
                              <Image
                                src={s.image}
                                alt={s.title}
                                fill
                                sizes="(max-width: 768px) 90vw, 15vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="mt-2 px-1">
                              <p
                                className={`truncate text-xs font-bold ${
                                  isBone ? "text-ink" : "text-white"
                                }`}
                              >
                                {s.title}
                              </p>
                              <p
                                className={`truncate text-[11px] ${
                                  isBone ? "text-ink-muted" : "text-fog"
                                }`}
                              >
                                {s.label}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links to Webix service pages */}
                  <div className="mt-7 flex flex-wrap gap-3 pt-1">
                    {svc.webixLinks.map((key) => {
                      const link = webix.pages[key];
                      return (
                        <a
                          key={key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 ${
                            isBone
                              ? "border-ink/15 bg-white text-ink hover:border-webix-red"
                              : "border-white/15 bg-white/[0.04] text-white hover:border-webix-red"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-webix-red" />
                          <span>{link.label} at Webix Solutions</span>
                          <ArrowUpRight size={13} />
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

      {/* 3. For freelancers and agencies (Molten-tinted glass over light field on Obsidian) */}
      <Section surface="obsidian" id="freelancers" className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
          <Image
            src="/images/misc/cta-light-field.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Container className="relative z-10">
          <Glass
            variant="molten"
            refract
            className="mx-auto max-w-5xl overflow-hidden p-7 sm:p-10 md:p-14"
          >
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-molten/40 bg-molten/15 px-3.5 py-1 text-xs font-bold text-molten-soft">
                  White-label &amp; NDA partner
                </span>
                <h2 className="t-h2 mt-3 text-white">
                  {servicesCopy.freelancers.h2}
                </h2>
                <p className="t-lead mt-4 leading-relaxed text-white/90">
                  {servicesCopy.freelancers.body}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    href={servicesCopy.freelancers.primary.href}
                    variant="primary"
                  >
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
              </div>

              <div className="relative mx-auto aspect-square w-48 lg:col-span-4 lg:w-56">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-molten/30 blur-2xl"
                />
                <Image
                  src="/images/work-with-me/door-freelancer.webp"
                  alt="Partner with us"
                  fill
                  sizes="224px"
                  className="object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.75)]"
                />
              </div>
            </div>
          </Glass>
        </Container>
      </Section>

      {/* 4. How a project runs (Bone) */}
      <Section surface="bone" id="process" className="overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="t-h2 text-ink">{servicesCopy.process.h2}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_40px_-22px_rgba(18,19,23,0.12)]"
              >
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-molten-ink/25 bg-molten-ink/10 font-display text-base font-extrabold text-molten-ink">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="t-small mt-2.5 leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
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
