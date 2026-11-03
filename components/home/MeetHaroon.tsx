import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";

export function MeetHaroon() {
  const { meet } = homeCopy;

  return (
    <Section surface="bone" id="meet">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          {/* Photo left */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-ash/70 bg-ash/30 md:col-span-5 lg:col-span-5">
            <Image
              src="/images/photos/haroon-at-work.webp"
              alt="Haroon Sukhera at work"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Intro right */}
          <div className="md:col-span-7 lg:col-span-7">
            <h2 className="t-h2 text-ink">{meet.h2}</h2>
            <div className="mt-5 space-y-4 text-ink-muted">
              {meet.body.map((p, idx) => (
                <p key={idx} className="t-lead">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {meet.chips.map((chip) => (
                <Chip key={chip} light>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
