import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { collectionPage, breadcrumb, pageGraph } from "@/lib/schema";
import { workCopy } from "@/content/copy/work";
import { publishedWork } from "@/content/work";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { WorkGrid } from "@/components/work/WorkGrid";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata("work");

export default function WorkPage() {
  const items = publishedWork();

  const schema = pageGraph(
    collectionPage(
      "/work/",
      "Work — Websites, Platforms and Stores | Haroon Sukhera",
      items.map((it) => ({
        name: it.title,
        description: it.summary,
        image: it.image,
        url: it.showLink && it.url ? it.url : undefined,
      }))
    ),
    breadcrumb([{ name: "Work", path: "/work/" }])
  );

  return (
    <>
      <JsonLd data={schema} />

      {/* 1. Header (Obsidian) */}
      <Section surface="obsidian" className="relative overflow-hidden pb-16 pt-28 md:pt-36">
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
              <span>150+ websites built · Selected production builds</span>
            </div>
            <h1 className="t-h1 text-white">{workCopy.h1}</h1>
            <p className="t-lead mt-5 leading-relaxed text-white/85">
              {workCopy.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 2 & 3. Sticky Filter Chips & Project Grid (Bone) */}
      <Section surface="bone" flush className="relative overflow-hidden pb-24 pt-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
        />
        <div className="relative z-10">
          <Suspense fallback={<div className="container-site py-12 text-ink-muted">Loading projects...</div>}>
            <WorkGrid items={items} />
          </Suspense>
        </div>
      </Section>

      {/* 4. Partner projects note (Graphite) */}
      <Section surface="graphite" className="py-16 text-center">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-7">
            <p className="t-body leading-relaxed text-fog">
              {workCopy.partnerNote}
            </p>
          </div>
        </Container>
      </Section>

      {/* 5. CTA */}
      <FinalCta />
    </>
  );
}
