"use client";

import { useEffect, useState } from "react";

/**
 * Progressive enhancement: SVG displacement filter for backdrop-filter on desktop Chromium.
 * Feature-detected; everyone else keeps the blur recipe. Applied only to `.glass--refract`
 * (hero card, header pill) — never to panels with body text.
 */
export function RefractionFilter() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isChromium = /Chrome\/\d+|Edg\/|OPR\//.test(ua) && !/Firefox|FxiOS|CriOS/.test(ua);
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    const reduced =
      window.matchMedia("(prefers-reduced-transparency: reduce)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsUrl = CSS.supports("backdrop-filter", "url(#liquid) blur(1px)");
    if (isChromium && desktop && !reduced && supportsUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOn(true);
      document.documentElement.classList.add("has-refraction");
    }
    return () => document.documentElement.classList.remove("has-refraction");
  }, []);

  if (!on) return null;
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
      <filter id="liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="18" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
