"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { contactFaq } from "@/content/faq";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section surface="bone" id="contact-faq" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
      />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 text-center text-ink">Frequently asked questions</h2>

          <div className="mt-10 space-y-3.5">
            {contactFaq.map((faq, idx) => {
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
                    aria-controls={`contact-faq-answer-${idx}`}
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

                  <div
                    id={`contact-faq-answer-${idx}`}
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
