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
    <Section surface="bone" id="contact-faq">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 text-center text-ink">Frequently asked questions</h2>

          <div className="mt-10 space-y-4">
            {contactFaq.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-ash/80 bg-white transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`contact-faq-answer-${idx}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  >
                    <span className="font-display text-lg font-bold text-ink sm:text-xl">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={cn(
                        "shrink-0 text-ink-muted transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <div
                    id={`contact-faq-answer-${idx}`}
                    className={cn(
                      "overflow-hidden px-5 pb-5 text-ink-muted transition-all duration-300 md:px-6 md:pb-6",
                      isOpen ? "block" : "hidden"
                    )}
                  >
                    <p className="t-body border-t border-ash/40 pt-4 leading-relaxed">
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
