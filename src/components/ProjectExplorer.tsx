import { useEffect, useMemo, useRef, useState } from "react";
import { categoryOrder, projects } from "../data/projects";
import type { ProjectCategory } from "../types";
import { ProjectCard } from "./ProjectCard";

interface ProjectExplorerProps {
  activeIndex: number;
  onActivate: (index: number) => void;
}

type Filter = "Semua" | ProjectCategory;

export function ProjectExplorer({ activeIndex, onActivate }: ProjectExplorerProps) {
  const [filter, setFilter] = useState<Filter>("Semua");
  const explorerRef = useRef<HTMLDivElement>(null);
  const filters: Filter[] = ["Semua", ...categoryOrder];
  const visibleCategories = useMemo(
    () => filter === "Semua" ? categoryOrder : [filter],
    [filter],
  );

  useEffect(() => {
    const cards = explorerRef.current?.querySelectorAll<HTMLElement>("[data-project-index]");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.projectIndex);
        if (Number.isInteger(index)) onActivate(index);
      },
      { rootMargin: "-28% 0px -42%", threshold: [0.1, 0.35, 0.65] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [filter, onActivate]);

  return (
    <div className="project-explorer" id="projects" ref={explorerRef}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">ARCHIVE / 02</p>
          <h2>Enam produk, tiga medan masalah.</h2>
        </div>
        <p className="heading-note">Setiap produk diaudit dari source dan deployment terbaru.</p>
      </div>

      <div className="category-filters" role="group" aria-label="Filter kategori proyek">
        {filters.map((item) => (
          <button
            type="button"
            key={item}
            className={filter === item ? "is-selected" : ""}
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => {
        const categoryProjects = projects
          .map((project, index) => ({ project, index }))
          .filter(({ project }) => project.category === category);
        const categoryId = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

        return (
          <section className="project-group" key={category} aria-labelledby={categoryId}>
            <header className="project-group-header">
              <h3 id={categoryId}>{category}</h3>
              <span>{String(categoryProjects.length).padStart(2, "0")} PROJECTS</span>
            </header>
            <div className="project-stack">
              {categoryProjects.map(({ project, index }) => (
                <ProjectCard
                  project={project}
                  index={index}
                  isActive={activeIndex === index}
                  onActivate={onActivate}
                  key={project.slug}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
