import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { ctaButtons } from "@/content/copy/shared";
import { contact } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { OrbitH } from "@/components/layout/Logo";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";

export function FinalCta() {
  const { cta } = homeCopy;

  return (
    <Section surface="molten" className="overflow-hidden py-24 md:py-32">
      {/* Background Molten light field */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-85">
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
        <Glass
          variant="text"
          refract
          className="mx-auto max-w-4xl overflow-hidden p-8 text-center sm:p-12 md:p-16"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-molten/40 bg-molten/10 shadow-[0_0_32px_-4px_rgba(255,90,31,0.55)]">
            <OrbitH className="h-9 w-9" />
          </div>

          <h2 className="t-h2 mx-auto max-w-2xl text-white">{cta.h2}</h2>

          <p className="t-body mx-auto mt-4 max-w-xl text-fog">
            Direct communication from first call to launch. Reply within 24 hours.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={ctaButtons.message.href} variant="primary">
              {ctaButtons.message.label}
            </Button>
            <Button
              href={contact.whatsappHref}
              variant="glass"
              external
              className="gap-2.5"
            >
              <WhatsAppIcon className="h-5 w-5 text-molten" />
              {ctaButtons.whatsapp.label}
            </Button>
          </div>
        </Glass>
      </Container>
    </Section>
  );
}
