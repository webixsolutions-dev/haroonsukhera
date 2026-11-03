import type { Metadata } from "next";
import { Suspense } from "react";
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
      <Section surface="obsidian" className="pb-12 pt-28 md:pt-36">
        <Container>
          <div className="max-w-3xl">
            <h1 className="t-h1 text-white">{workCopy.h1}</h1>
            <p className="t-lead mt-5 text-fog leading-relaxed">
              {workCopy.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 2 & 3. Sticky Filter Chips & Project Grid (Bone) */}
      <Section surface="bone" flush className="pb-24 pt-4">
        <Suspense fallback={<div className="container-site py-12 text-ink-muted">Loading projects...</div>}>
          <WorkGrid items={items} />
        </Suspense>
      </Section>

      {/* 4. Partner projects note (Graphite) */}
      <Section surface="graphite" className="py-16 text-center">
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className="t-body text-fog leading-relaxed">
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
