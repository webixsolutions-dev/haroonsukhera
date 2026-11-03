"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { doors, processSteps } from "@/content/copy/shared";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";

export function WorkWithMeSection() {
  const { workWithMe } = homeCopy;
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineDrawn, setLineDrawn] = useState(false);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section surface="obsidian" id="work-with-me" className="overflow-hidden">
      {/* Ambient light field behind the 3 Glass Doors */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-45">
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
        className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-70"
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="t-h2 text-white">{workWithMe.h2}</h2>
        </div>

        {/* 3 Liquid Glass Doors */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {doors.map((door, idx) => (
            <Glass
              key={door.type}
              variant="text"
              refract
              className="group flex flex-col justify-between overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-display text-xs font-bold text-molten-soft">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-fog">Direct engagement</span>
                </div>

                {/* Floating 3D Glass Sculpture Stage */}
                <div className="relative mb-6 aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/12 bg-obsidian/70">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 52%, rgba(255, 90, 31, 0.28), rgba(255, 138, 92, 0.08) 50%, transparent 72%)",
                    }}
                  />
                  <Image
                    src={door.image}
                    alt={door.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4 drop-shadow-[0_18px_28px_rgba(0,0,0,0.75)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="t-h3 text-white">{door.title}</h3>
                <p className="t-body mt-3 text-white/80">{door.body}</p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Button
                  href={`/contact/?type=${door.type}`}
                  variant="primary"
                  className="w-full"
                >
                  {door.button}
                </Button>
              </div>
            </Glass>
          ))}
        </div>

        {/* 4-Step Process Strip */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="t-h3 text-white">How a project runs</h3>
          </div>

          <div ref={lineRef} className="relative mt-12">
            {/* The animated horizontal process line */}
            <div
              className="process-line absolute left-8 right-8 top-7 hidden h-[2px] bg-gradient-to-r from-molten via-molten-soft to-molten/20 md:block"
              data-drawn={lineDrawn}
            />

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-start rounded-[20px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm"
                >
                  <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-molten/60 bg-obsidian font-display text-base font-extrabold text-molten shadow-[0_0_24px_-4px_rgba(255,90,31,0.5)]">
                    0{idx + 1}
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">
                    {step.title}
                  </h4>
                  <p className="t-small mt-2.5 leading-relaxed text-fog">
                    {step.body}
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
