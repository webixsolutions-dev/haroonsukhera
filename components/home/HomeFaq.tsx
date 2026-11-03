"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { homeFaq } from "@/content/faq";
import { homeCopy } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section surface="bone" id="faq" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
      />

      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Sticky Header Column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="t-h2 text-ink">{homeCopy.faq.h2}</h2>
              <p className="t-body mt-4 text-ink-muted">
                Direct answers on how I scope, build, and support projects with my team at Webix Solutions.
              </p>

              <div className="mt-8 rounded-[20px] border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-20px_rgba(18,19,23,0.12)]">
                <p className="font-display text-base font-bold text-ink">
                  Have a specific question?
                </p>
                <p className="t-small mt-1.5 text-ink-muted">
                  Send a short note and I will reply personally within 24 hours.
                </p>
                <Link
                  href="/contact/"
                  className="btn btn--primary mt-4 w-full text-sm"
                >
                  Send a message
                </Link>
              </div>
            </div>
          </div>

          {/* Right Numbered Accordion Stack */}
          <div className="space-y-3.5 lg:col-span-8">
            {homeFaq.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={cn(
                    "overflow-hidden rounded-[20px] border transition-all duration-200",
                    isOpen
                      ? "border-ink/25 bg-white shadow-[0_20px_48px_-22px_rgba(18,19,23,0.16)]"
                      : "border-ink/10 bg-white/80 hover:border-ink/20 hover:bg-white"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-display text-xs font-extrabold text-molten-ink">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-lg font-bold text-ink sm:text-xl">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "border-molten bg-molten text-ink rotate-180"
                          : "border-ink/12 bg-bone text-ink-muted"
                      )}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {/* HTML answer is always present for search engines & AI assistants */}
                  <div
                    id={`faq-answer-${idx}`}
                    className={cn(
                      "overflow-hidden px-5 pb-5 text-ink-muted transition-all duration-300 md:px-6 md:pb-6",
                      isOpen ? "block" : "hidden"
                    )}
                  >
                    <p className="t-body border-t border-ash/50 pl-7 pt-4 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
