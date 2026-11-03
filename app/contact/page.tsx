import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { contactPage, breadcrumb, pageGraph } from "@/lib/schema";
import { contactCopy } from "@/content/copy/contact";
import { contact, profiles, github } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/SocialIcon";
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

      {/* 1. Header (Obsidian) */}
      <Section surface="obsidian" className="pb-12 pt-28 md:pt-36">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="t-h1 text-white">{contactCopy.h1}</h1>
              <p className="t-lead mt-5 text-fog leading-relaxed">
                {contactCopy.answer}
              </p>
            </div>

            <div className="relative hidden h-24 w-24 opacity-60 md:block">
              <Image
                src="/images/misc/contact-plane.webp"
                alt=""
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 2 & 3. Who are you? Doors & Adaptive Form (Obsidian) */}
      <Section surface="obsidian" flush className="pb-24 pt-4">
        <Container>
          <Suspense fallback={<div className="text-fog">Loading form...</div>}>
            <ContactAdaptiveForm />
          </Suspense>
        </Container>
      </Section>

      {/* 4. Direct: WhatsApp, Email, Booking (Bone) */}
      <Section surface="bone" id="direct">
        <Container>
          <div className="max-w-3xl">
            <h2 className="t-h2 text-ink">{contactCopy.direct.h2}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-ash/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <strong className="block text-ink">WhatsApp</strong>
                  <span className="text-sm text-ink-muted">{contact.phoneDisplay}</span>
                </div>
              </a>

              <a
                href={contact.emailHref}
                className="flex items-center gap-4 rounded-2xl border border-ash/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-molten/10 text-molten-ink">
                  <Mail size={24} />
                </div>
                <div>
                  <strong className="block text-ink">Email</strong>
                  <span className="text-sm text-ink-muted">{contact.email}</span>
                </div>
              </a>
            </div>

            {/* Booking call block */}
            <div className="mt-10">
              <BookingWidget />
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Small FAQ (Bone) */}
      <ContactFaq />
    </>
  );
}
