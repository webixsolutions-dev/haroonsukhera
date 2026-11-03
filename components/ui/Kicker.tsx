import { cn } from "@/lib/utils";

/** Small label above a heading. Max 3 per page (design rule). */
export function Kicker({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("kicker", className)}>{children}</p>;
}
