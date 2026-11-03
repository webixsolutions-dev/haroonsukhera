import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

export function MeetHaroon() {
  const { meet } = homeCopy;

  return (
    <Section surface="bone" id="meet" className="overflow-hidden">
      {/* Subtle architectural blueprint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Framed Editorial Portrait */}
          <div className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-[24px] border border-ink/12 bg-obsidian p-2.5 shadow-[0_28px_60px_-20px_rgba(18,19,23,0.22)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px]">
                <Image
                  src="/images/photos/haroon-at-work.webp"
                  alt="Haroon Sukhera at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/15 bg-obsidian/75 px-3.5 py-2 text-xs text-white backdrop-blur-md">
                  <span className="font-medium">Haroon Sukhera</span>
                  <span className="text-fog">Building since 2020</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative + Numbered Spec Cards */}
          <div className="lg:col-span-7">
            <h2 className="t-h2 text-ink">{meet.h2}</h2>
            <div className="mt-5 space-y-4 text-ink-muted">
              {meet.body.map((p, idx) => (
                <p key={idx} className="t-lead">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {meet.chips.map((chip, idx) => (
                <div
                  key={chip}
                  className="flex flex-col justify-between rounded-[20px] border border-ink/10 bg-white/85 p-4 shadow-[0_10px_28px_-14px_rgba(18,19,23,0.1)]"
                >
                  <span className="font-display text-xs font-bold text-molten-ink">
                    0{idx + 1}
                  </span>
                  <p className="mt-2 font-display text-[15px] font-bold leading-snug text-ink">
                    {chip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
