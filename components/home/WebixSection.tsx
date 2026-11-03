import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

export function WebixSection() {
  const { webix } = homeCopy;

  return (
    <Section surface="obsidian" className="overflow-hidden">
      {/* Ambient background Webix color field for glass refraction */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35 blur-sm">
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
          {/* Left: Liquid Glass Executive Panel */}
          <div className="lg:col-span-7">
            <Glass
              variant="text"
              refract
              className="relative overflow-hidden p-7 sm:p-10 md:p-12"
            >
              {/* Webix Red top accent hairline */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-webix-red via-webix-red/70 to-transparent"
              />

              <Kicker>{webix.kicker}</Kicker>
              <h2 className="t-h2 mt-2.5 text-white">{webix.h2}</h2>

              <p className="t-lead mt-5 text-white/85">{webix.body}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                <Button
                  href={webix.button.href}
                  variant="primary"
                  external
                  className="bg-webix-red text-white shadow-[0_14px_34px_-10px_rgba(237,28,36,0.65)] hover:bg-webix-red hover:brightness-110"
                >
                  {webix.button.label}
                </Button>
                <span className="text-sm text-fog">
                  Lahore HQ · Serving 6 countries
                </span>
              </div>
            </Glass>
          </div>

          {/* Right: Crisp 3D Architectural Glass Showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/15 bg-obsidian shadow-[0_28px_70px_-20px_rgba(237,28,36,0.28)]">
              <Image
                src="/images/webix/webix-company.webp"
                alt="Webix Solutions"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
