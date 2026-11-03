import type { Metadata } from "next";
import { cabinet, satoshi, instrument } from "./fonts";
import { SITE_URL, person } from "@/content/facts";
import { siteGraph } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GlassPointer } from "@/components/glass/GlassPointer";
import { RefractionFilter } from "@/components/glass/RefractionFilter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Haroon Sukhera — Full-Stack Developer, Webix Solutions CEO",
    template: "%s | Haroon Sukhera",
  },
  description:
    "Haroon Sukhera is a full-stack web developer and founder & CEO of Webix Solutions. 150+ websites built. Hire him for one task or a full project.",
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  publisher: person.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/images/photos/haroon-hero-studio.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const graph = siteGraph();

  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${satoshi.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={graph} />
      </head>
      <body className="min-h-screen bg-obsidian text-white antialiased selection:bg-molten selection:text-ink">
        <RefractionFilter />
        <GlassPointer />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <ConsentBanner />
      </body>
    </html>
  );
}
