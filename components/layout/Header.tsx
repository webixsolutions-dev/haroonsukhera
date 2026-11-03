"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { mainNav, workWithMeCta } from "@/content/navigation";
import { contact } from "@/content/facts";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

/**
 * Transparent on the hero → liquid-glass pill after 80px.
 * Mobile: menu button → glass sheet from the right (80% width) with links + WhatsApp + email.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = sheetRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && sheetRef.current) {
        const els = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a,button"));
        const f = els[0];
        const l = els[els.length - 1];
        if (e.shiftKey && document.activeElement === f) {
          e.preventDefault();
          l.focus();
        } else if (!e.shiftKey && document.activeElement === l) {
          e.preventDefault();
          f.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-molten focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <div
          className={cn(
            "glass glass--text glass--refract mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-full pl-4 pr-2 text-white transition-all duration-300 md:pl-5 md:pr-2.5",
            scrolled
              ? "h-[58px] border-white/20 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)]"
              : "h-[64px] border-white/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)]",
          )}
        >
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[15px] font-medium transition-all duration-200",
                    active
                      ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : "text-white/75 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className="mx-auto mt-0.5 block h-[3px] w-3 rounded-full bg-molten shadow-[0_0_8px_#FF5A1F]"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href={workWithMeCta.href}
              className="btn btn--primary ml-2 min-h-[44px] px-5 text-[15px]"
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-ink/80 shadow-[0_0_0_3px_rgba(18,19,23,0.18)]"
              />
              {workWithMeCta.label}
            </Link>
          </nav>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile sheet — always in the HTML, toggled. */}
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-sheet"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={cn(
          "glass glass--text fixed bottom-3 right-3 top-3 z-[56] flex w-[80%] max-w-[360px] flex-col rounded-[24px] p-6 text-white transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-[110%]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="t-signature text-2xl">Menu</span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-8 flex flex-col">
          {[{ label: "Home", href: "/" }, ...mainNav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="border-b border-white/10 py-4 font-display text-2xl font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn--primary w-full">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp me
          </a>
          <a href={contact.emailHref} className="btn btn--glass w-full text-[15px]">
            <Mail size={18} /> Email me
          </a>
        </div>
      </div>
    </>
  );
}
