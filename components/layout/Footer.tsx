import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OrbitH } from "./Logo";
import { person, contact, profiles, github, webix } from "@/content/facts";
import { footerNav, legalNav } from "@/content/navigation";
import { footerCopy } from "@/content/copy/shared";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/SocialIcon";
import { CookieSettingsTrigger } from "@/components/analytics/CookieSettingsTrigger";

/** Footer (Obsidian): signature, bio line, links, profiles, Webix link, email, WhatsApp, ©, Privacy. */
export function Footer() {
  const year = new Date().getFullYear();
  const allProfiles = [...profiles, github];
  return (
    <footer className="surface-dark relative overflow-hidden border-t border-white/10 bg-obsidian pb-28 pt-20 text-white md:pb-12 md:pt-28">
      {/* Subtle architectural grid + molten glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark mask-radial-fade opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[360px] w-[620px] rounded-full bg-molten/10 blur-[120px]"
      />
      {/* Monumental watermark signature */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[clamp(5rem,15vw,16rem)] italic leading-none text-white/[0.025]"
      >
        {person.name}
      </div>

      <div className="container-site relative z-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6 lg:col-span-7">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] shadow-[0_0_30px_-5px_rgba(255,90,31,0.3)]">
                <OrbitH className="h-10 w-10" />
              </div>
              <p className="t-signature text-[clamp(2.75rem,1.6rem+4vw,5.25rem)] leading-[0.95] text-white">
                {person.name}
              </p>
            </div>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-fog">
              {person.shortLine}.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={webix.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[15px] font-medium text-white transition-all hover:border-webix-red/60 hover:bg-webix-red/10"
              >
                <span className="h-2 w-2 rounded-full bg-webix-red shadow-[0_0_8px_#ED1C24]" />
                <span className="underline decoration-webix-red decoration-2 underline-offset-[5px]">
                  {footerCopy.webixLink}
                </span>
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <p className="mb-4 text-xs font-medium tracking-[0.08em] text-fog/70">Navigation</p>
            <ul className="space-y-1.5">
              {footerNav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-flex min-h-[40px] items-center text-[15px] font-medium text-white/80 transition-colors hover:text-molten-soft"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4 lg:col-span-3">
            <p className="mb-4 text-xs font-medium tracking-[0.08em] text-fog/70">Direct contact</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={contact.emailHref}
                  className="inline-flex min-h-[40px] items-center break-all text-[15px] font-medium text-white/90 transition-colors hover:text-molten-soft"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2.5 text-[15px] font-medium text-white/90 transition-colors hover:text-molten-soft"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-molten/15 text-molten">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  {contact.phoneDisplay}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Profiles">
              {allProfiles.map((p) => (
                <li key={p.key}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={p.label}
                    title={p.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-fog transition-all duration-200 hover:-translate-y-0.5 hover:border-molten/50 hover:bg-molten/10 hover:text-white"
                  >
                    <SocialIcon name={p.key} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-fog md:flex-row md:items-center md:justify-between">
          <p className="text-fog/80">
            © {year} {person.name} · Lahore, Pakistan
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {legalNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex min-h-[40px] items-center transition-colors hover:text-white"
              >
                {n.label}
              </Link>
            ))}
            <CookieSettingsTrigger />
            <a
              href="#main"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 text-white/85 transition-colors hover:border-white/30 hover:text-white"
              aria-label="Back to top"
            >
              Top <ArrowUpRight size={14} className="-rotate-45 text-molten" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
