import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

export function WebixSection() {
  const { webix } = homeCopy;

  return (
    <Section surface="obsidian" className="overflow-hidden">
      {/* Background Webix render */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25">
        <Image
          src="/images/webix/webix-company.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-10">
        <Glass variant="text" className="mx-auto max-w-4xl p-8 md:p-14">
          <Kicker>{webix.kicker}</Kicker>
          <h2 className="t-h2 mt-2 text-white">
            <span className="text-white">{webix.h2}</span>
          </h2>

          <p className="t-lead mt-5 text-fog">{webix.body}</p>

          <div className="mt-8 flex items-center gap-4">
            <Button
              href={webix.button.href}
              variant="primary"
              external
              className="bg-webix-red text-white hover:brightness-110"
            >
              {webix.button.label}
            </Button>
          </div>
        </Glass>
      </Container>
    </Section>
  );
}
