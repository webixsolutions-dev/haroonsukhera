"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Download } from "lucide-react";
import { bio } from "@/content/facts";
import { aboutCopy } from "@/content/copy/about";
import { Button } from "@/components/ui/Button";

export function AboutBioBlock() {
  const [copiedKey, setCopiedKey] = useState<"short" | "medium" | null>(null);

  const handleCopy = (text: string, key: "short" | "medium") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-6 lg:col-span-8">
        {/* Short Bio */}
        <div className="rounded-2xl border border-ash/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-molten-ink">
              {aboutCopy.bio.shortLabel}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bio.short, "short")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
            >
              {copiedKey === "short" ? (
                <>
                  <Check size={14} className="text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> {aboutCopy.bio.copy}
                </>
              )}
            </button>
          </div>
          <p className="t-body mt-3 font-medium text-ink">{bio.short}</p>
        </div>

        {/* Medium Bio */}
        <div className="rounded-2xl border border-ash/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-molten-ink">
              {aboutCopy.bio.mediumLabel}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bio.medium, "medium")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
            >
              {copiedKey === "medium" ? (
                <>
                  <Check size={14} className="text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> {aboutCopy.bio.copy}
                </>
              )}
            </button>
          </div>
          <p className="t-body mt-3 leading-relaxed text-ink">{bio.medium}</p>
        </div>
      </div>

      {/* Official Photo Asset */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-ash/80 bg-white p-6 text-center shadow-sm lg:col-span-4">
        <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full border border-ash/80">
          <Image
            src="/images/photos/haroon-hero-studio.webp"
            alt="Haroon Sukhera official photo"
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <p className="font-display font-bold text-ink">Haroon Sukhera</p>
        <p className="t-small text-ink-muted">High-res studio photo for media & press</p>
        <div className="mt-5 w-full">
          <a
            href="/images/photos/haroon-hero-studio.webp"
            download="haroon-sukhera.webp"
            className="btn btn--outline-light w-full gap-2 text-sm"
          >
            <Download size={16} />
            {aboutCopy.bio.download}
          </a>
        </div>
      </div>
    </div>
  );
}
