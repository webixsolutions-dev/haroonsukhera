import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { contactPage, breadcrumb, pageGraph } from "@/lib/schema";
import { contactCopy } from "@/content/copy/contact";
import { contact } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";
import { ContactAdaptiveForm } from "@/components/contact/ContactAdaptiveForm";
import { BookingWidget } from "@/components/contact/BookingWidget";
import { ContactFaq } from "@/components/contact/ContactFaq";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  const schema = pageGraph(
    contactPage("/contact/", "Contact Haroon Sukhera — Start a Project"),
    breadcrumb([{ name: "Contact", path: "/contact/" }])
  );

  return (
    <>
      <JsonLd data={schema} />

      {/* 1. Header & Adaptive Form (Obsidian + Light Field) */}
      <Section surface="obsidian" className="relative overflow-hidden pb-24 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
          <Image
            src="/images/hero/hero-glass-field.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-70"
        />

        <Container className="relative z-10">
          <div className="flex flex-col items-start justify-between gap-8 pb-12 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-fog">
                <span className="h-2 w-2 rounded-full bg-molten" />
                <span>Direct founder response · Within 24 hours</span>
              </div>
              <h1 className="t-h1 text-white">{contactCopy.h1}</h1>
              <p className="t-lead mt-5 leading-relaxed text-white/85">
                {contactCopy.answer}
              </p>
            </div>

            <div className="relative hidden h-36 w-36 shrink-0 md:block lg:h-44 lg:w-44">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-molten/30 blur-2xl"
              />
              <Image
                src="/images/misc/contact-plane.webp"
                alt=""
                fill
                sizes="176px"
                className="object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.75)]"
              />
            </div>
          </div>

          <Suspense fallback={<div className="text-fog">Loading form...</div>}>
            <ContactAdaptiveForm />
          </Suspense>
        </Container>
      </Section>

      {/* 2. Direct: WhatsApp & Email (Bone) */}
      <Section surface="bone" id="direct" className="overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light mask-radial-fade opacity-70"
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="t-h2 text-ink">{contactCopy.direct.h2}</h2>
            <p className="t-body mt-2 text-ink-muted">
              Message me directly on WhatsApp or email for a personal response.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_45px_-22px_rgba(18,19,23,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/12 text-green-600">
                    <WhatsAppIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <strong className="font-display text-lg font-bold text-ink">
                      WhatsApp
                    </strong>
                    <span className="mt-0.5 block text-sm font-medium text-ink-muted">
                      {contact.phoneDisplay}
                    </span>
                  </div>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-bone text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </a>

              <a
                href={contact.emailHref}
                className="group flex items-center justify-between gap-4 rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_45px_-22px_rgba(18,19,23,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-molten-ink/12 text-molten-ink">
                    <Mail size={26} />
                  </div>
                  <div>
                    <strong className="font-display text-lg font-bold text-ink">
                      Email
                    </strong>
                    <span className="mt-0.5 block break-all text-sm font-medium text-ink-muted">
                      {contact.email}
                    </span>
                  </div>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-bone text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Book a Call (Graphite + Light Field so BookingWidget Glass sits on rich dark color) */}
      <Section surface="graphite" id="book" className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-45">
          <Image
            src="/images/misc/cta-light-field.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-60"
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl">
            <BookingWidget />
          </div>
        </Container>
      </Section>

      {/* 4. Small FAQ (Bone) */}
      <ContactFaq />
    </>
  );
}
