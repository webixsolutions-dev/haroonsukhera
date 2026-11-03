"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Section surface="bone" id="work">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="t-h2 text-ink">{selectedWork.h2}</h2>
            <p className="t-lead mt-3 text-ink-muted">{selectedWork.intro}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              aria-label="Previous project"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ash/80 bg-white text-ink transition-colors hover:border-ink disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Next project"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ash/80 bg-white text-ink transition-colors hover:border-ink disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
            <Button href={selectedWork.button.href} variant="outline-light">
              {selectedWork.button.label}
            </Button>
          </div>
        </div>

        {/* Embla carousel viewport */}
        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {items.map((item) => (
              <div
                key={item.slug}
                className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_80%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  href={`/work/#${item.slug}`}
                  className="group block overflow-hidden rounded-[20px] border border-ash/80 bg-white p-4 transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-ash/30">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-molten-ink">
                      {item.label}
                    </p>
                    <h3 className="t-h3 mt-1 text-ink">{item.title}</h3>
                    <p className="t-small mt-2 line-clamp-2 text-ink-muted">{item.summary}</p>
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
