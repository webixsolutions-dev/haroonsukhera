import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { profilePage, breadcrumb, pageGraph } from "@/lib/schema";
import { aboutCopy } from "@/content/copy/about";
import { person, profiles, github, webix } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { AboutBioBlock } from "@/components/about/AboutBioBlock";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata("about");

export default function AboutPage() {
  const schema = pageGraph(
    profilePage("/about/", "About Haroon Sukhera — Full-Stack Developer and CEO"),
    breadcrumb([{ name: "About", path: "/about/" }])
  );

  const allOnlineLinks = [
    ...profiles,
    github,
    { key: "webix", label: "Webix Solutions", url: webix.url },
  ];

  return (
    <>
      <JsonLd data={schema} />

      {/* 1. Header block (Bone) */}
      <Section surface="bone" className="relative overflow-hidden pb-16 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/misc/about-backdrop.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <Container className="relative z-10">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <h1 className="t-h1 text-ink">{aboutCopy.h1}</h1>
              <p className="t-lead mt-5 text-ink-muted leading-relaxed">
                {aboutCopy.answer}
              </p>
            </div>

            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px] border border-ash/80 bg-ash/30 md:col-span-5">
              <Image
                src="/images/photos/haroon-story.webp"
                alt="Haroon Sukhera"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. The story (Obsidian) */}
      <Section surface="obsidian" id="story">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="t-h2 text-white">{aboutCopy.story.h2}</h2>
            <div className="mt-8 space-y-6 text-fog">
              {aboutCopy.story.paragraphs.map((p, idx) => (
                <p key={idx} className="t-lead leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. What I do now (Bone) */}
      <Section surface="bone">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="t-h2 text-ink">{aboutCopy.now.h2}</h2>
            <p className="t-lead mt-5 text-ink-muted leading-relaxed">
              {aboutCopy.now.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {aboutCopy.now.chips.map((chip) => (
                <Chip key={chip} light>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. How I work (Graphite) */}
      <Section surface="graphite">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="t-h2 text-center text-white">{aboutCopy.how.h2}</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {aboutCopy.how.principles.map((pr, idx) => (
                <Glass key={idx} variant="default" className="p-6 md:p-8">
                  <span className="font-mono text-sm font-bold text-molten-soft">
                    0{idx + 1}
                  </span>
                  <h3 className="t-h3 mt-2 text-white">{pr.title}</h3>
                  <p className="t-body mt-2 text-fog">{pr.body}</p>
                </Glass>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Education (Bone) */}
      <Section surface="bone">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="t-h2 text-ink">{aboutCopy.education.h2}</h2>
            <div className="mt-6 rounded-2xl border border-ash/80 bg-white p-6 shadow-sm md:p-8">
              <p className="t-lead font-semibold text-ink">
                {aboutCopy.education.line}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Webix Solutions (Obsidian) */}
      <Section surface="obsidian" className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/webix/webix-company.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Container className="relative z-10">
          <Glass variant="text" className="mx-auto max-w-3xl p-8 md:p-12">
            <span className="text-xs font-bold uppercase tracking-wider text-molten-soft">
              The company I lead
            </span>
            <h2 className="t-h2 mt-2 text-white">Webix Solutions</h2>
            <p className="t-lead mt-4 text-fog">{webix.whatItIs}.</p>
            <div className="mt-8">
              <Button
                href={webix.url}
                variant="primary"
                external
                className="bg-webix-red text-white hover:brightness-110"
              >
                Visit Webix Solutions
              </Button>
            </div>
          </Glass>
        </Container>
      </Section>

      {/* 7. Official bio (Bone) */}
      <Section surface="bone">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="t-h2 mb-4 text-ink">{aboutCopy.bio.h2}</h2>
            <AboutBioBlock />
          </div>
        </Container>
      </Section>

      {/* 8. Find me online (Obsidian) */}
      <Section surface="obsidian">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="t-h2 text-white">{aboutCopy.online.h2}</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {allOnlineLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-line-dark bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-molten hover:bg-white/10"
                >
                  <SocialIcon name={link.key} className="h-4 w-4 text-fog" />
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} className="text-fog" />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. Final CTA */}
      <FinalCta />
    </>
  );
}
