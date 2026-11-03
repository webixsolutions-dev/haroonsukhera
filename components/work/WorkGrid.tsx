"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { X, ExternalLink } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (f && workFilters.some((wf) => wf.key === f)) {
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

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.filters.includes(activeFilter));

  return (
    <>
      {/* Sticky Glass Filter Bar */}
      <div className="sticky top-[72px] z-30 -mt-6 pb-6 pt-4">
        <div className="container-site">
          <div className="glass glass--text no-scrollbar flex items-center gap-2 overflow-x-auto rounded-full p-2">
            {workFilters.map((wf) => {
              const isSelected = activeFilter === wf.key;
              return (
                <button
                  key={wf.key}
                  type="button"
                  onClick={() => handleFilterClick(wf.key)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-molten text-ink font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {wf.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Projects (Bone Surface) */}
      <div className="container-site mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => {
            const isVisible =
              activeFilter === "all" || project.filters.includes(activeFilter);

            return (
              <article
                key={project.slug}
                id={project.slug}
                className={cn(
                  "group flex flex-col justify-between overflow-hidden rounded-[20px] border border-ash/80 bg-white p-4 shadow-sm transition-all hover:shadow-lg",
                  !isVisible && "hidden"
                )}
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-ash/30">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-molten-ink">
                      {project.label}
                    </p>
                    <h2 className="t-h3 mt-1 text-ink">{project.title}</h2>
                    <p className="t-small mt-2 line-clamp-2 text-ink-muted leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-ash/60 pt-4">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <Chip key={s} light className="text-xs">
                        {s}
                      </Chip>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="btn btn--outline-light w-full text-sm"
                  >
                    View project details
                  </button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />

          <Glass
            variant="text"
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 text-white md:p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-molten-soft">
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

            <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>

            <div className="mt-6 space-y-4 text-fog">
              <p className="t-lead text-white/90 leading-relaxed">
                {selectedProject.summary}
              </p>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-fog">
                  Stack & Architecture
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
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
                <p className="text-xs text-fog italic">
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
