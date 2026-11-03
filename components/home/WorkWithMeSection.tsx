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
    <Section surface="obsidian" id="work-with-me">
      <Container>
        <div className="text-center">
          <h2 className="t-h2 text-white">{workWithMe.h2}</h2>
        </div>

        {/* 3 Glass Doors */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {doors.map((door) => (
            <Glass
              key={door.type}
              variant="default"
              className="flex flex-col justify-between overflow-hidden p-6 md:p-8"
            >
              <div>
                <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <Image
                    src={door.image}
                    alt={door.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="t-h3 text-white">{door.title}</h3>
                <p className="t-body mt-3 text-fog">{door.body}</p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Button href={`/contact/?type=${door.type}`} variant="primary" className="w-full">
                  {door.button}
                </Button>
              </div>
            </Glass>
          ))}
        </div>

        {/* 4-Step Process Strip */}
        <div className="mt-20 border-t border-line-dark pt-16">
          <h3 className="t-h3 text-center text-white">How a project runs</h3>

          <div ref={lineRef} className="relative mt-12">
            {/* The animated horizontal process line */}
            <div
              className="process-line absolute left-6 right-6 top-6 hidden h-0.5 bg-gradient-to-r from-molten via-molten/80 to-molten/20 md:block"
              data-drawn={lineDrawn}
            />

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-start">
                  <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-molten bg-obsidian text-lg font-bold text-molten shadow-lg">
                    {idx + 1}
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">{step.title}</h4>
                  <p className="t-small mt-2 text-fog">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
