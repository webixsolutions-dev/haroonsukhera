import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { profilePage, breadcrumb, pageGraph } from "@/lib/schema";
import { aboutCopy } from "@/content/copy/about";
import { profiles, github, webix } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/ui/JsonLd";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { AboutBioBlock } from "@/components/about/AboutBioBlock";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata("about");

const storyYears = ["2020 · Origins", "2023 · Webix Solutions", "Today · Global delivery"];

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
      <Section surface="bone" className="relative overflow-hidden pb-20 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <Image
            src="/images/misc/about-backdrop.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-grid-light mask-radial-fade opacity-75"
        />

        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink">
                <span className="h-2 w-2 rounded-full bg-molten-ink" />
                <span>Founder &amp; CEO · Webix Solutions</span>
              </div>
              <h1 className="t-h1 text-ink">{aboutCopy.h1}</h1>
              <p className="t-lead mt-6 leading-relaxed text-ink-muted">
                {aboutCopy.answer}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6">
                <div className="rounded-2xl border border-ink/10 bg-white/80 p-3.5">
                  <p className="font-display text-xl font-extrabold text-ink sm:text-2xl">150+</p>
                  <p className="text-xs font-medium text-ink-muted">Websites built</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/80 p-3.5">
                  <p className="font-display text-xl font-extrabold text-ink sm:text-2xl">20+</p>
                  <p className="text-xs font-medium text-ink-muted">Person team</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/80 p-3.5">
                  <p className="font-display text-xl font-extrabold text-ink sm:text-2xl">6</p>
                  <p className="text-xs font-medium text-ink-muted">Countries served</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-md overflow-hidden rounded-[24px] border border-ink/12 bg-obsidian p-2.5 shadow-[0_30px_70px_-20px_rgba(18,19,23,0.28)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px]">
                  <Image
                    src="/images/photos/haroon-story.webp"
                    alt="Haroon Sukhera"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-xl border border-white/15 bg-obsidian/80 px-4 py-2.5 text-xs text-white backdrop-blur-md">
                    <span className="font-display font-bold">Haroon Sukhera</span>
                    <span className="text-fog">Lahore, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. The story (Obsidian) */}
      <Section surface="obsidian" id="story" className="overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark mask-radial-fade opacity-65"
        />
        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h2 className="t-h2 text-white">{aboutCopy.story.h2}</h2>
                <p className="t-small mt-3 text-fog">
                  From writing code solo in 2020 to leading a 20+ person engineering and growth team in Lahore.
                </p>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-8">
              {aboutCopy.story.paragraphs.map((p, idx) => (
                <div
                  key={idx}
                  className="relative rounded-[24px] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-molten/15 font-display text-xs font-extrabold text-molten">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-fog">
                      {storyYears[idx]}
                    </span>
                  </div>
                  <p className="t-lead leading-relaxed text-white/90">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. What I do now (Bone) */}
      <Section surface="bone" className="overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
        />
        <Container className="relative z-10">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="t-h2 text-ink">{aboutCopy.now.h2}</h2>
              <p className="t-lead mt-5 leading-relaxed text-ink-muted">
                {aboutCopy.now.body}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              {aboutCopy.now.chips.map((chip, idx) => (
                <div
                  key={chip}
                  className="flex flex-col justify-between rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_40px_-22px_rgba(18,19,23,0.12)]"
                >
                  <span className="font-display text-xs font-extrabold text-molten-ink">
                    0{idx + 1}
                  </span>
                  <p className="mt-4 font-display text-lg font-bold text-ink">
                    {chip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. How I work (Graphite + Light Field) */}
      <Section surface="graphite" className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/hero/hero-glass-field.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-60"
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="t-h2 text-white">{aboutCopy.how.h2}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {aboutCopy.how.principles.map((pr, idx) => (
              <Glass
                key={idx}
                variant="text"
                refract
                className="flex flex-col justify-between p-7 md:p-9"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-molten/40 bg-molten/15 font-display text-xs font-extrabold text-molten-soft">
                    0{idx + 1}
                  </span>
                  <h3 className="t-h3 mt-5 text-white">{pr.title}</h3>
                  <p className="t-body mt-2.5 text-white/80">{pr.body}</p>
                </div>
              </Glass>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Education (Bone) */}
      <Section surface="bone">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col justify-between gap-6 rounded-[24px] border border-ink/12 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(18,19,23,0.14)] sm:p-10 md:flex-row md:items-center">
              <div>
                <h2 className="t-h2 text-ink">{aboutCopy.education.h2}</h2>
                <p className="t-lead mt-3 font-medium text-ink-muted">
                  {aboutCopy.education.line}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-ink/10 bg-bone px-5 py-4 text-left md:text-right">
                <p className="font-display text-lg font-extrabold text-ink">BCompSc</p>
                <p className="text-xs font-medium text-molten-ink">Islamia University Bahawalpur</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Webix Solutions (Obsidian) */}
      <Section surface="obsidian" className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30 blur-sm">
          <Image
            src="/images/webix/webix-company.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/60"
        />

        <Container className="relative z-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Glass
                variant="text"
                refract
                className="relative overflow-hidden p-7 sm:p-10 md:p-12"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-webix-red via-webix-red/70 to-transparent"
                />
                <Kicker>The company I lead</Kicker>
                <h2 className="t-h2 mt-2 text-white">Webix Solutions</h2>
                <p className="t-lead mt-4 text-white/85">{webix.whatItIs}.</p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <Button
                    href={webix.url}
                    variant="primary"
                    external
                    className="bg-webix-red text-white shadow-[0_14px_34px_-10px_rgba(237,28,36,0.65)] hover:bg-webix-red hover:brightness-110"
                  >
                    Visit Webix Solutions
                  </Button>
                </div>
              </Glass>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/15 bg-obsidian shadow-[0_28px_70px_-20px_rgba(237,28,36,0.28)]">
                <Image
                  src="/images/webix/webix-company.webp"
                  alt="Webix Solutions"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Official bio (Bone) */}
      <Section surface="bone">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 max-w-2xl">
              <h2 className="t-h2 text-ink">{aboutCopy.bio.h2}</h2>
              <p className="t-body mt-2 text-ink-muted">
                Approved biography and studio portrait for podcasts, articles, and event introductions.
              </p>
            </div>
            <AboutBioBlock />
          </div>
        </Container>
      </Section>

      {/* 8. Find me online (Obsidian) */}
      <Section surface="obsidian">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="t-h2 text-white">{aboutCopy.online.h2}</h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {allOnlineLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-white/14 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-molten/60 hover:bg-molten/10"
                >
                  <SocialIcon name={link.key} className="h-4 w-4 text-molten-soft" />
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
