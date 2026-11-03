"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { homeCopy } from "@/content/copy/home";
import { featuredWork } from "@/content/work";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function SelectedWorkCarousel() {
  const { selectedWork } = homeCopy;
  const items = featuredWork();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Section surface="bone" id="work" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
      />

      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="t-h2 text-ink">{selectedWork.h2}</h2>
            <p className="t-lead mt-3 text-ink-muted">{selectedWork.intro}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              aria-label="Previous project"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Next project"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
            <Button href={selectedWork.button.href} variant="outline-light">
              {selectedWork.button.label}
            </Button>
          </div>
        </div>

        {/* Embla carousel viewport */}
        <div className="mt-11 overflow-hidden py-2" ref={emblaRef}>
          <div className="-ml-6 flex">
            {items.map((item, idx) => (
              <div
                key={item.slug}
                className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_82%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  href={`/work/#${item.slug}`}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-ink/10 bg-white p-4 shadow-[0_20px_50px_-22px_rgba(18,19,23,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_28px_60px_-20px_rgba(18,19,23,0.22)]"
                >
                  <div>
                    {/* Obsidian Studio Viewport Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-ink/10 bg-obsidian">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-obsidian/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                        <span className="text-molten">0{idx + 1}</span>
                        <span>·</span>
                        <span>Featured</span>
                      </div>
                      <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-obsidian/80 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>

                    <div className="mt-5 px-1">
                      <p className="text-xs font-semibold text-molten-ink">
                        {item.label}
                      </p>
                      <h3 className="t-h3 mt-1 text-ink">{item.title}</h3>
                      <p className="t-small mt-2 line-clamp-2 text-ink-muted">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-ash/60 px-1 pt-3.5">
                    {item.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-bone px-2.5 py-1 text-[11px] font-medium text-ink-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
