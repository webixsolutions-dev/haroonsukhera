import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { OrbitHView } from "@/components/three/OrbitHView";

export function HomeHero() {
  const { hero } = homeCopy;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-obsidian pb-20 pt-28 md:min-h-screen md:pb-28 md:pt-32">
      {/* Background glass color field */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-65 md:opacity-80">
        <Image
          src="/images/hero/hero-glass-field.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Architectural precision grid + radial molten pools */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 z-0 h-[420px] w-[420px] rounded-full bg-molten/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-1/3 z-0 h-[460px] w-[460px] rounded-full bg-molten/18 blur-[140px]"
      />

      {/* Mobile Orbit H background render */}
      <div className="pointer-events-none absolute right-[-22%] top-[6%] z-0 h-[420px] w-[420px] opacity-35 md:hidden">
        <Image
          src="/images/hero/hero-orbit-mobile.webp"
          alt=""
          fill
          priority
          sizes="420px"
          className="object-contain"
        />
      </div>

      <div className="container-site relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Sculpted Liquid Glass Command Card */}
          <div className="relative lg:col-span-7">
            <Glass
              variant="text"
              refract
              className="relative overflow-hidden p-6 sm:p-8 md:p-11 lg:p-12"
            >
              {/* Subtle top specular molten glow inside the card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-molten/15 blur-3xl"
              />

              {/* Top Founder Dossier Header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2.5 text-sm font-medium text-white/85">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-molten opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-molten" />
                  </span>
                  <span>Founder &amp; CEO · Webix Solutions</span>
                </div>
                <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs font-medium text-fog">
                  Lahore, Pakistan
                </span>
              </div>

              <h1 className="t-h1 text-white">
                <span className="t-signature mb-2 block text-[clamp(3rem,2.1rem+3.6vw,5.25rem)] font-normal leading-[0.95] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                  {hero.h1Name}
                </span>
                <span className="block text-[clamp(1.85rem,1.35rem+2.2vw,3.15rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                  {hero.h1Line}
                </span>
              </h1>

              <p className="t-lead mt-5 max-w-[58ch] text-white/90">{hero.sub}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button href={hero.primary.href} variant="primary">
                  {hero.primary.label}
                </Button>
                <Button href={hero.secondary.href} variant="glass">
                  {hero.secondary.label}
                </Button>
              </div>

              {/* Integrated Founder Portrait & Proof Bar (zero overlapping text) */}
              <div className="mt-9 border-t border-white/12 pt-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-molten/50 bg-obsidian shadow-[0_12px_30px_-8px_rgba(255,90,31,0.45)] sm:h-[72px] sm:w-[72px]">
                    <Image
                      src="/images/photos/haroon-hero-studio.webp"
                      alt="Haroon Sukhera"
                      fill
                      priority
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {hero.chips.map((chip) => (
                        <Chip key={chip}>{chip}</Chip>
                      ))}
                    </div>
                    <p className="t-small mt-2.5 text-fog">{hero.clientsLine}</p>
                  </div>
                </div>
              </div>
            </Glass>
          </div>

          {/* Right: 3D Orbit H Stage (desktop) */}
          <div className="relative hidden h-[520px] lg:col-span-5 lg:block xl:h-[600px]">
            {/* Architectural orbital rings behind the 3D object */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full border border-white/[0.06]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-20 rounded-full border border-dashed border-molten/20"
            />
            <OrbitHView />
          </div>
        </div>
      </div>
    </section>
  );
}
