"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import { workFilters, type WorkFilter, type WorkItem } from "@/content/work";
import { workCopy } from "@/content/copy/work";
import { Glass } from "@/components/glass/Glass";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function WorkGrid({ items }: { items: WorkItem[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = (searchParams.get("f") as WorkFilter) || "all";
  const [activeFilter, setActiveFilter] = useState<WorkFilter | "all">(filterParam);
  const [selectedProject, setSelectedProject] = useState<WorkItem | null>(null);

  useEffect(() => {
    const f = searchParams.get("f") as WorkFilter;
    if (f && workFilters.some((wf) => wf.key === f)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveFilter(f);
    } else {
      setActiveFilter("all");
    }
  }, [searchParams]);

  const handleFilterClick = (filterKey: WorkFilter | "all") => {
    setActiveFilter(filterKey);
    if (filterKey === "all") {
      router.replace("/work/", { scroll: false });
    } else {
      router.replace(`/work/?f=${filterKey}`, { scroll: false });
    }
  };

  return (
    <>
      {/* Sticky Glass Filter Bar */}
      <div className="sticky top-[74px] z-30 pb-4 pt-6">
        <div className="container-site">
          <div className="glass glass--text glass--refract no-scrollbar inline-flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full p-2">
            {workFilters.map((wf) => {
              const isSelected = activeFilter === wf.key;
              const count =
                wf.key === "all"
                  ? items.length
                  : items.filter((item) => item.filters.includes(wf.key as WorkFilter)).length;
              return (
                <button
                  key={wf.key}
                  type="button"
                  onClick={() => handleFilterClick(wf.key)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "bg-molten font-semibold text-ink shadow-[0_6px_20px_-4px_rgba(255,90,31,0.65)]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span>{wf.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
                      isSelected
                        ? "bg-ink/15 text-ink"
                        : "bg-white/10 text-fog"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Projects (Bone Surface) */}
      <div className="container-site mt-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, idx) => {
            const isVisible =
              activeFilter === "all" || project.filters.includes(activeFilter);
            const num = String(idx + 1).padStart(2, "0");

            return (
              <article
                key={project.slug}
                id={project.slug}
                className={cn(
                  "group flex flex-col justify-between overflow-hidden rounded-[24px] border border-ink/12 bg-white p-4 shadow-[0_20px_50px_-22px_rgba(18,19,23,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_28px_60px_-20px_rgba(18,19,23,0.22)]",
                  !isVisible && "hidden"
                )}
              >
                <div>
                  {/* Dark Obsidian Studio Viewport Frame */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[16px] border border-ink/10 bg-obsidian"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-obsidian/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      <span className="text-molten">{num}</span>
                      <span>·</span>
                      <span>{project.featured ? "Featured" : "Case study"}</span>
                    </div>
                  </div>

                  <div className="mt-5 px-1">
                    <p className="text-xs font-semibold text-molten-ink">
                      {project.label}
                    </p>
                    <h2 className="t-h3 mt-1 text-ink">{project.title}</h2>
                    <p className="t-small mt-2 line-clamp-2 leading-relaxed text-ink-muted">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-ash/60 px-1 pt-4">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-bone px-2.5 py-1 text-[11px] font-medium text-ink-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="btn btn--outline-light flex-1 text-sm"
                    >
                      View project details
                    </button>
                    {project.showLink && project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title}`}
                        title={`Visit ${project.title}`}
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-bone text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                      >
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hidden detail panel content in the HTML for bots and search crawlers */}
                <div className="sr-only">
                  <h3>{project.title}</h3>
                  <p>{project.label}</p>
                  <p>{project.summary}</p>
                  <p>Technologies: {project.stack.join(", ")}</p>
                  {project.showLink && project.url && <a href={project.url}>Visit website</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Accessible Glass Detail Modal / Dialog */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          />

          <Glass
            variant="text"
            refract
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 text-white md:p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold text-molten-soft">
                  {selectedProject.label}
                </p>
                <h3 id="modal-project-title" className="t-h3 mt-1 text-white">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close dialog"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-fog hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/12 bg-obsidian">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>

            <div className="mt-6 space-y-4 text-fog">
              <p className="t-lead leading-relaxed text-white/90">
                {selectedProject.summary}
              </p>

              <div>
                <p className="text-xs font-bold text-fog">
                  Stack &amp; Architecture
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedProject.stack.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              {selectedProject.showLink && selectedProject.url ? (
                <Button href={selectedProject.url} variant="primary" external className="gap-2">
                  {workCopy.visitSite} <ExternalLink size={16} />
                </Button>
              ) : (
                <p className="text-xs italic text-fog">
                  Private codebase / internal deployment
                </p>
              )}
              <Button variant="glass" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
            </div>
          </Glass>
        </div>
      )}
    </>
  );
}
