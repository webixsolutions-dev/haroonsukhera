import Link from "next/link";
import { cn } from "@/lib/utils";
import { person } from "@/content/facts";

/** "Orbit H" icon: two rounded bars, Molten crossbar, thin ring, Molten dot top-right. */
export function OrbitH({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.75" />
      <rect x="19.5" y="17" width="7.5" height="30" rx="3.75" fill="currentColor" />
      <rect x="37" y="17" width="7.5" height="30" rx="3.75" fill="currentColor" />
      <rect x="24" y="28.75" width="16" height="6.5" rx="3.25" fill="#FF5A1F" />
      <circle cx="51.1" cy="12.9" r="4.25" fill="#FF5A1F" />
    </svg>
  );
}

/** Header/footer logo: icon + "Haroon Sukhera" signature. */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-full", className)}
      aria-label={`${person.name} — home`}
    >
      <OrbitH className={size === "lg" ? "h-11 w-11" : "h-9 w-9"} />
      <span className={cn("t-signature leading-none", size === "lg" ? "text-[1.9rem]" : "text-[1.45rem]")}>
        {person.name}
      </span>
    </Link>
  );
}
