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
    <footer className="surface-dark relative overflow-hidden border-t border-line-dark bg-obsidian pb-28 pt-16 text-white md:pb-10 md:pt-24">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4">
              <OrbitH className="h-12 w-12 md:h-14 md:w-14" />
              <p className="t-signature text-[clamp(2.6rem,1.6rem+4vw,5rem)] leading-[0.95]">{person.name}</p>
            </div>
            <p className="mt-5 max-w-md text-fog">{person.shortLine}.</p>
            <a
              href={webix.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[44px] items-center gap-1 font-medium text-white underline decoration-webix-red decoration-2 underline-offset-[6px] hover:text-white/80"
            >
              {footerCopy.webixLink}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <p className="t-small mb-3 text-fog">Pages</p>
            <ul className="space-y-1">
              {footerNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-[40px] items-center hover:text-molten-soft">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="t-small mb-3 text-fog">Contact</p>
            <ul className="space-y-1">
              <li>
                <a href={contact.emailHref} className="inline-flex min-h-[40px] items-center break-all hover:text-molten-soft">
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 hover:text-molten-soft"
                >
                  <WhatsAppIcon className="h-4 w-4" /> {contact.phoneDisplay}
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Profiles">
              {allProfiles.map((p) => (
                <li key={p.key}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={p.label}
                    title={p.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-dark text-fog transition-colors hover:border-white/40 hover:text-white"
                  >
                    <SocialIcon name={p.key} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line-dark pt-6 text-sm text-fog md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {person.name}
          </p>
          <div className="flex items-center gap-5">
            {legalNav.map((n) => (
              <Link key={n.href} href={n.href} className="inline-flex min-h-[40px] items-center hover:text-white">
                {n.label}
              </Link>
            ))}
            <CookieSettingsTrigger />
            <a
              href="#main"
              className="inline-flex min-h-[40px] items-center gap-1 hover:text-white"
              aria-label="Back to top"
            >
              Top <ArrowUpRight size={14} className="-rotate-45" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
