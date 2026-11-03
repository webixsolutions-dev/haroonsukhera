"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { servicesFaq } from "@/content/faq";
import { servicesCopy } from "@/content/copy/services";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function ServicesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section surface="obsidian" id="faq" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark mask-radial-fade opacity-60"
      />

      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="t-h2 text-white">{servicesCopy.faq.h2}</h2>
              <p className="t-body mt-4 text-fog">
                Straight answers on scope, ownership, platforms, and how my team and I deliver.
              </p>
              <div className="mt-8 rounded-[20px] border border-white/12 bg-white/[0.03] p-6">
                <p className="font-display text-base font-bold text-white">
                  Need a custom scope?
                </p>
                <p className="t-small mt-1.5 text-fog">
                  Send your brief and I will reply personally within 24 hours.
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

          <div className="space-y-3.5 lg:col-span-8">
            {servicesFaq.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={cn(
                    "overflow-hidden rounded-[20px] border transition-all duration-200",
                    isOpen
                      ? "border-molten/50 bg-graphite shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
                      : "border-white/10 bg-graphite/60 hover:border-white/20 hover:bg-graphite"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-faq-answer-${idx}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-display text-xs font-extrabold text-molten-soft">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-lg font-bold text-white sm:text-xl">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "border-molten bg-molten text-ink rotate-180"
                          : "border-white/15 bg-white/5 text-fog"
                      )}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  <div
                    id={`svc-faq-answer-${idx}`}
                    className={cn(
                      "overflow-hidden px-5 pb-5 text-fog transition-all duration-300 md:px-6 md:pb-6",
                      isOpen ? "block" : "hidden"
                    )}
                  >
                    <p className="t-body border-t border-white/10 pl-7 pt-4 leading-relaxed">
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
