"use client";

import { useEffect } from "react";

/**
 * One listener for every .glass panel: sets --mx/--my so the highlight follows the pointer.
 * Desktop only (fine pointer + hover), off for reduced motion.
 */
export function GlassPointer() {
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let raf = 0;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = (e.target as Element | null)?.closest?.(".glass") as HTMLElement | null;
        if (last && last !== el) {
          last.style.removeProperty("--mx");
          last.style.removeProperty("--my");
        }
        last = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
