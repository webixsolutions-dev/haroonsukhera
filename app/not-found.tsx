import Link from "next/link";
import Image from "next/image";
import { notFoundCopy } from "@/content/copy/shared";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section surface="obsidian" className="flex min-h-[75vh] items-center justify-center">
      <Container className="text-center">
        <div className="relative mx-auto mb-8 h-48 w-48 max-w-full">
          <Image
            src="/images/misc/not-found-pieces.webp"
            alt=""
            fill
            sizes="192px"
            className="object-contain"
            priority
          />
        </div>
        <h1 className="t-h1 mb-4 text-white">{notFoundCopy.h1}</h1>
        <p className="t-lead mx-auto mb-8 text-fog">{notFoundCopy.body}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={notFoundCopy.home.href} variant="primary">
            {notFoundCopy.home.label}
          </Button>
          <Button href={notFoundCopy.work.href} variant="glass">
            {notFoundCopy.work.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
