import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { faqPage } from "@/lib/schema";
import { homeFaq } from "@/content/faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { HomeHero } from "@/components/home/HomeHero";
import { MeetHaroon } from "@/components/home/MeetHaroon";
import { WebixSection } from "@/components/home/WebixSection";
import { TheCore } from "@/components/home/TheCore";
import { SelectedWorkCarousel } from "@/components/home/SelectedWorkCarousel";
import { WorkWithMeSection } from "@/components/home/WorkWithMeSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata("home");

export default function HomePage() {
  const faqSchema = faqPage(homeFaq, "/");

  return (
    <>
      <JsonLd data={faqSchema} />
      {/* 1. Hero */}
      <HomeHero />
      {/* 2. Meet Haroon */}
      <MeetHaroon />
      {/* 3. Webix Solutions */}
      <WebixSection />
      {/* 4. The Core */}
      <TheCore />
      {/* 5. Selected work */}
      <SelectedWorkCarousel />
      {/* 6. Work with me */}
      <WorkWithMeSection />
      {/* Testimonials (renders only if >= 3 verified) */}
      <TestimonialsSection />
      {/* 7. FAQ */}
      <HomeFaq />
      {/* 8. Final CTA */}
      <FinalCta />
    </>
  );
}
