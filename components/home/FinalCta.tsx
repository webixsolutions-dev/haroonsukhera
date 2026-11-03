import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { ctaButtons } from "@/content/copy/shared";
import { contact } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";

export function FinalCta() {
  const { cta } = homeCopy;

  return (
    <Section surface="molten" className="overflow-hidden py-24 md:py-32">
      {/* Background Molten light field */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <Image
          src="/images/misc/cta-light-field.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-10 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2 text-white">{cta.h2}</h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={ctaButtons.message.href} variant="primary">
              {ctaButtons.message.label}
            </Button>
            <Button
              href={contact.whatsappHref}
              variant="glass"
              external
              className="gap-2"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {ctaButtons.whatsapp.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
