import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { OrbitHView } from "@/components/three/OrbitHView";

export function HomeHero() {
  const { hero } = homeCopy;

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-obsidian pb-16 pt-24 md:min-h-screen md:pb-24 md:pt-28">
      {/* Background glass color field */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 md:opacity-60">
        <Image
          src="/images/hero/hero-glass-field.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Mobile Orbit H background render */}
      <div className="pointer-events-none absolute right-[-20%] top-[10%] z-0 h-[480px] w-[480px] opacity-25 md:hidden">
        <Image
          src="/images/hero/hero-orbit-mobile.webp"
          alt=""
          fill
          priority
          sizes="480px"
          className="object-contain"
        />
      </div>

      <div className="container-site relative z-10 flex flex-col justify-center">
        {/* Mobile photo on top (studio version) */}
        <div className="mx-auto mb-6 flex justify-center md:hidden">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-molten/40 shadow-xl">
            <Image
              src="/images/photos/haroon-hero-studio.webp"
              alt="Haroon Sukhera"
              fill
              priority
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          {/* Left: Text & Glass Card */}
          <div className="relative md:col-span-7">
            <Glass variant="text" refract className="p-6 md:p-10 lg:p-12">
              <h1 className="t-h1 text-white">
                <span className="t-signature mb-2 block text-[clamp(2.8rem,2rem+3.5vw,5rem)] font-normal not-italic tracking-normal text-white">
                  {hero.h1Name}
                </span>
                <span className="block text-[clamp(1.85rem,1.3rem+2.2vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight text-white">
                  {hero.h1Line}
                </span>
              </h1>

              <p className="t-lead mt-5 text-white/90">{hero.sub}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={hero.primary.href} variant="primary">
                  {hero.primary.label}
                </Button>
                <Button href={hero.secondary.href} variant="glass">
                  {hero.secondary.label}
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {hero.chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </div>

              <p className="t-small mt-4 text-fog">{hero.clientsLine}</p>
            </Glass>

            {/* Desktop Cutout photo overlapping bottom-left */}
            <div className="pointer-events-none absolute -bottom-6 -left-6 z-20 hidden h-44 w-44 lg:block">
              <div className="relative h-full w-full drop-shadow-2xl">
                <Image
                  src="/images/photos/haroon-hero-cutout.webp"
                  alt="Haroon Sukhera"
                  fill
                  priority
                  sizes="176px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right: 3D Orbit H (desktop) */}
          <div className="relative hidden h-[540px] md:col-span-5 md:block lg:h-[620px]">
            <OrbitHView />
          </div>
        </div>
      </div>
    </section>
  );
}
