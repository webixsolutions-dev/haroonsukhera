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

const rotationAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

export function TheCore() {
  const { core } = homeCopy;
  const [activeIndex, setActiveIndex] = useState(0);
  const allProjects = publishedWork();

  return (
    <Section surface="graphite" id="core">
      <Container>
        <div className="max-w-2xl">
          <h2 className="t-h2 text-white">{core.h2}</h2>
          <p className="t-lead mt-3 text-fog">{core.intro}</p>
        </div>

        {/* 6 Capability Navigation Chips */}
        <div className="mt-8 flex flex-wrap gap-2.5" role="tablist" aria-label="Capabilities">
          {core.panels.map((p, idx) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={activeIndex === idx}
              aria-controls={`core-panel-${p.id}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeIndex === idx
                  ? "border-molten bg-molten/15 text-white"
                  : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
              )}
            >
              <span className="relative h-4 w-4 overflow-hidden rounded-full">
                <Image src={p.image} alt="" fill sizes="16px" className="object-cover" />
              </span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: 3D Orbit H rotating to angle */}
          <div className="relative hidden h-[420px] lg:col-span-5 lg:block">
            <OrbitHView targetRotation={rotationAngles[activeIndex]} />
          </div>

          {/* Right: Glass Panels — All 6 rendered in HTML for bots/AI */}
          <div className="lg:col-span-7">
            {core.panels.map((p, idx) => {
              const samples = p.filter ? allProjects.filter((w) => w.filters.includes(p.filter!)).slice(0, 3) : [];
              const isActive = activeIndex === idx;

              return (
                <div
                  key={p.id}
                  id={`core-panel-${p.id}`}
                  role="tabpanel"
                  className={isActive ? "block" : "hidden"}
                >
                  <Glass variant="default" className="p-6 md:p-8">
                    <h3 className="t-h3 text-white">{p.title}</h3>
                    <p className="t-body mt-3 text-fog">{p.line}</p>

                    {/* Sample thumbnails */}
                    {samples.length > 0 && (
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {samples.map((s) => (
                          <div
                            key={s.slug}
                            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black/40"
                          >
                            <Image
                              src={s.image}
                              alt={s.title}
                              fill
                              sizes="(max-width: 768px) 30vw, 15vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-[11px] font-medium text-white line-clamp-1">
                              {s.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                      <Link
                        href={p.href}
                        className="btn btn--primary"
                      >
                        {p.linkLabel} →
                      </Link>
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
