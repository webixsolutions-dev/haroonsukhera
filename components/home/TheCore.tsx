"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { homeCopy } from "@/content/copy/home";
import { publishedWork } from "@/content/work";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Glass } from "@/components/glass/Glass";
import { OrbitHView } from "@/components/three/OrbitHView";
import { cn } from "@/lib/utils";

const rotationAngles = [
  0,
  Math.PI / 3,
  (2 * Math.PI) / 3,
  Math.PI,
  (4 * Math.PI) / 3,
  (5 * Math.PI) / 3,
];

export function TheCore() {
  const { core } = homeCopy;
  const [activeIndex, setActiveIndex] = useState(0);
  const allProjects = publishedWork();

  return (
    <Section surface="graphite" id="core" className="overflow-hidden">
      {/* Ambient glass light field so the Core glass panel refracts rich color */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-45">
        <Image
          src="/images/hero/hero-glass-field.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-grid-dark mask-radial-fade opacity-65"
      />

      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="t-h2 text-white">{core.h2}</h2>
            <p className="t-lead mt-3 text-fog">{core.intro}</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-medium text-fog lg:self-auto">
            <span className="h-2 w-2 rounded-full bg-molten" />
            <span>
              0{activeIndex + 1} / 0{core.panels.length} · Interactive capability console
            </span>
          </div>
        </div>

        {/* 6 Capability Navigation Chips */}
        <div
          className="mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap"
          role="tablist"
          aria-label="Capabilities"
        >
          {core.panels.map((p, idx) => {
            const active = activeIndex === idx;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={active}
                aria-controls={`core-panel-${p.id}`}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "group inline-flex min-h-[46px] items-center gap-2.5 rounded-full border px-4 py-2 text-left text-sm font-medium transition-all duration-200",
                  active
                    ? "border-molten bg-molten/20 text-white shadow-[0_0_28px_-6px_rgba(255,90,31,0.55)]"
                    : "border-white/14 bg-white/[0.04] text-fog hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "font-display text-xs font-bold",
                    active ? "text-molten-soft" : "text-fog/60"
                  )}
                >
                  0{idx + 1}
                </span>
                <span className="truncate">{p.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: 3D Orbit H rotating to angle */}
          <div className="relative hidden h-[460px] lg:col-span-5 lg:block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-10 rounded-full border border-white/[0.07]"
            />
            <OrbitHView targetRotation={rotationAngles[activeIndex]} />
          </div>

          {/* Right: Glass Panels — All 6 rendered in HTML for bots/AI */}
          <div className="lg:col-span-7">
            {core.panels.map((p, idx) => {
              const samples = p.filter
                ? allProjects.filter((w) => w.filters.includes(p.filter!)).slice(0, 3)
                : [];
              const isActive = activeIndex === idx;

              return (
                <div
                  key={p.id}
                  id={`core-panel-${p.id}`}
                  role="tabpanel"
                  className={isActive ? "block" : "hidden"}
                >
                  <Glass
                    variant="text"
                    refract
                    className="relative overflow-hidden p-6 sm:p-8 md:p-10"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-lg">
                        <div className="inline-flex items-center gap-2 rounded-full border border-molten/35 bg-molten/10 px-3 py-1 text-xs font-bold text-molten-soft">
                          <span>0{idx + 1}</span>
                          <span>·</span>
                          <span>Capability</span>
                        </div>
                        <h3 className="t-h3 mt-3 text-white">{p.title}</h3>
                        <p className="t-body mt-3 text-white/85">{p.line}</p>
                      </div>

                      {/* Floating 3D Glass Sculpture */}
                      <div className="relative h-28 w-28 shrink-0 self-center rounded-2xl border border-white/12 bg-obsidian/60 p-2 shadow-[0_20px_45px_-12px_rgba(255,90,31,0.35)] sm:h-32 sm:w-32">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-2 rounded-full bg-molten/25 blur-xl"
                        />
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="128px"
                          className="object-contain p-2 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]"
                        />
                      </div>
                    </div>

                    {/* Sample project thumbnails */}
                    {samples.length > 0 && (
                      <div className="mt-7 border-t border-white/10 pt-6">
                        <p className="mb-3 text-xs font-medium text-fog">
                          Delivered work in this category
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {samples.map((s) => (
                            <Link
                              key={s.slug}
                              href={`/work/#${s.slug}`}
                              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/14 bg-obsidian transition-all duration-300 hover:-translate-y-0.5 hover:border-molten/50"
                            >
                              <Image
                                src={s.image}
                                alt={s.title}
                                fill
                                sizes="(max-width: 768px) 90vw, 18vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-2.5">
                                <p className="truncate text-xs font-bold text-white">
                                  {s.title}
                                </p>
                                <p className="truncate text-[11px] text-fog">
                                  {s.label}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                      <Link href={p.href} className="btn btn--primary">
                        {p.linkLabel} →
                      </Link>
                      <span className="text-xs text-fog">
                        Direct founder oversight + 20+ person team
                      </span>
                    </div>
                  </Glass>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
