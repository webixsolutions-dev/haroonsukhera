"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Download } from "lucide-react";
import { bio } from "@/content/facts";
import { aboutCopy } from "@/content/copy/about";

export function AboutBioBlock() {
  const [copiedKey, setCopiedKey] = useState<"short" | "medium" | null>(null);

  const handleCopy = (text: string, key: "short" | "medium") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="space-y-5 lg:col-span-8">
        {/* Short Bio */}
        <div className="rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_45px_-22px_rgba(18,19,23,0.12)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ash/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-molten-ink" />
              <span className="font-display text-sm font-bold text-ink">
                {aboutCopy.bio.shortLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(bio.short, "short")}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-ink/15 bg-bone px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink"
            >
              {copiedKey === "short" ? (
                <>
                  <Check size={14} className="text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> {aboutCopy.bio.copy}
                </>
              )}
            </button>
          </div>
          <p className="t-body mt-4 font-medium leading-relaxed text-ink">
            {bio.short}
          </p>
        </div>

        {/* Medium Bio */}
        <div className="rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_45px_-22px_rgba(18,19,23,0.12)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ash/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-molten-ink" />
              <span className="font-display text-sm font-bold text-ink">
                {aboutCopy.bio.mediumLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(bio.medium, "medium")}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-ink/15 bg-bone px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink"
            >
              {copiedKey === "medium" ? (
                <>
                  <Check size={14} className="text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> {aboutCopy.bio.copy}
                </>
              )}
            </button>
          </div>
          <p className="t-body mt-4 leading-relaxed text-ink">{bio.medium}</p>
        </div>
      </div>

      {/* Official Photo Asset Card */}
      <div className="flex flex-col justify-between rounded-[24px] border border-ink/12 bg-white p-6 shadow-[0_18px_45px_-22px_rgba(18,19,23,0.14)] lg:col-span-4">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-[18px] border border-ink/10 bg-obsidian">
            <Image
              src="/images/photos/haroon-hero-studio.webp"
              alt="Haroon Sukhera official photo"
              fill
              sizes="(max-width: 1024px) 280px, 320px"
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-ink">Haroon Sukhera</p>
              <p className="t-small text-ink-muted">Official studio portrait (WebP)</p>
            </div>
            <span className="rounded-full bg-bone px-2.5 py-1 text-xs font-semibold text-ink-muted">
              1200×1500
            </span>
          </div>
        </div>

        <div className="mt-6 pt-2">
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
