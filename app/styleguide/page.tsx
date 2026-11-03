import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Styleguide — Design System QA",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <div className="pb-32 pt-24">
      {/* 1. Header & Tokens */}
      <Section surface="obsidian">
        <Container>
          <Kicker>Design tokens</Kicker>
          <h1 className="t-h1 mt-2 text-white">Styleguide & Token Validation</h1>
          <p className="t-lead mt-4 text-fog">
            Liquid Glass + 3D design system audit. Surfaces, type scale, buttons, chips and glass recipes.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-obsidian border border-line-dark" />
              <p className="mt-2 text-xs font-mono text-fog">--obsidian #0C0D10</p>
            </div>
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-graphite" />
              <p className="mt-2 text-xs font-mono text-fog">--graphite #17191E</p>
            </div>
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-bone" />
              <p className="mt-2 text-xs font-mono text-fog">--bone #F3F1EC</p>
            </div>
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-molten" />
              <p className="mt-2 text-xs font-mono text-fog">--molten #FF5A1F</p>
            </div>
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-molten-ink" />
              <p className="mt-2 text-xs font-mono text-fog">--molten-ink #C2410C</p>
            </div>
            <div className="rounded-xl border border-line-dark p-4">
              <div className="h-12 w-full rounded-md bg-webix-red" />
              <p className="mt-2 text-xs font-mono text-fog">--webix-red #ED1C24</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Type scale */}
      <Section surface="graphite">
        <Container>
          <Kicker>Typography</Kicker>
          <h2 className="t-h2 mt-2 text-white">Cabinet Grotesk, Satoshi & Instrument Serif</h2>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-mono text-fog">t-h1 / clamp(2.5rem, 1.4rem + 4.6vw, 5.25rem)</p>
              <h1 className="t-h1 mt-1 text-white">Full-stack web developer</h1>
            </div>
            <div>
              <p className="text-xs font-mono text-fog">t-signature / Instrument Serif italic</p>
              <p className="t-signature text-5xl text-white">Haroon Sukhera</p>
            </div>
            <div>
              <p className="text-xs font-mono text-fog">t-h2 / clamp(1.9rem, 1.3rem + 2.4vw, 3.4rem)</p>
              <h2 className="t-h2 mt-1 text-white">One person to talk to. Every skill your project needs.</h2>
            </div>
            <div>
              <p className="text-xs font-mono text-fog">t-h3 / clamp(1.2rem, 1.1rem + .5vw, 1.55rem)</p>
              <h3 className="t-h3 mt-1 text-white">Custom web apps, portals and online stores</h3>
            </div>
            <div>
              <p className="text-xs font-mono text-fog">t-lead (19px/1.55, max 66ch)</p>
              <p className="t-lead mt-1 text-fog">
                I build websites, online stores and web platforms — and lead a 20+ person team that designs, markets and automates around them.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-fog">t-body (17px/1.65, max 66ch)</p>
              <p className="t-body mt-1 text-fog">
                I started as a freelance WordPress developer. More than 150 websites later, I write custom platforms in Next.js and React — and I still take on WordPress and Shopify work when it's the right tool for the job.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Surface switch (Bone light surface) */}
      <Section surface="bone">
        <Container>
          <Kicker>Bone surface</Kicker>
          <h2 className="t-h2 mt-2 text-ink">Light surface readability test</h2>
          <p className="t-lead mt-3 text-ink-muted">
            Text on light uses Ink (#121317) and Ink Muted (#5A5E68). Links and buttons use Molten Ink (#C2410C) to guarantee WCAG AA contrast.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary">Primary button</Button>
            <Button variant="outline-light">Outline on light</Button>
            <Chip light>150+ websites built</Chip>
            <Chip light>20+ person team</Chip>
          </div>
        </Container>
      </Section>

      {/* 4. Glass Variants over hero-glass-field.webp */}
      <Section surface="obsidian" className="overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-glass-field.webp"
            alt=""
            fill
            className="object-cover opacity-60"
          />
        </div>
        <Container className="relative z-10">
          <Kicker>Liquid Glass</Kicker>
          <h2 className="t-h2 mt-2 text-white">Glass variants on color field</h2>
          <p className="t-lead mt-2 text-fog">
            Glass always sits on something with color (light field or render), never on flat black.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Glass variant="default" className="p-6">
              <span className="text-xs font-mono text-molten-soft">variant=&quot;default&quot;</span>
              <h3 className="t-h3 mt-2 text-white">Interactive card</h3>
              <p className="t-body mt-2 text-white/80">Specular edge, 20px blur, and pointer-following highlight.</p>
              <div className="mt-4">
                <Button variant="glass" className="w-full">Glass button</Button>
              </div>
            </Glass>

            <Glass variant="text" className="p-6">
              <span className="text-xs font-mono text-molten-soft">variant=&quot;text&quot;</span>
              <h3 className="t-h3 mt-2 text-white">Text-heavy panel</h3>
              <p className="t-body mt-2 text-fog">Darker tinted base ensures WCAG AA compliance on any background.</p>
              <div className="mt-4">
                <Button variant="primary" className="w-full">Work with me</Button>
              </div>
            </Glass>

            <Glass variant="molten" className="p-6">
              <span className="text-xs font-mono text-molten-soft">variant=&quot;molten&quot;</span>
              <h3 className="t-h3 mt-2 text-white">Molten accent</h3>
              <p className="t-body mt-2 text-white/90">Accent tint for callout moments and agency partnership offers.</p>
              <div className="mt-4">
                <Button variant="glass" className="w-full">Partner with me</Button>
              </div>
            </Glass>

            <Glass variant="on-light" className="p-6">
              <span className="text-xs font-mono text-molten-ink">variant=&quot;on-light&quot;</span>
              <h3 className="t-h3 mt-2 text-ink">Light glass panel</h3>
              <p className="t-body mt-2 text-ink-muted">Used when glass overlays bright surfaces.</p>
              <div className="mt-4">
                <Button variant="outline-light" className="w-full">Explore work</Button>
              </div>
            </Glass>
          </div>
        </Container>
      </Section>
    </div>
  );
}
