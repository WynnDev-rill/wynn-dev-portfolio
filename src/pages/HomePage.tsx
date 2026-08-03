import { useEffect, useRef, useState } from "react";
import { About } from "../components/About";
import { BlueprintHero } from "../components/BlueprintHero";
import { CircularEngine } from "../components/CircularEngine";
import { Footer } from "../components/Footer";
import { ProjectArchive } from "../components/ProjectArchive";
import { ProjectJourney } from "../components/ProjectJourney";
import { experienceProjects } from "../data/experience";

interface HomePageProps {
  liteMode: boolean;
}

export function HomePage({ liteMode }: HomePageProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const experienceRef = useRef<HTMLElement>(null);
  const activeProject = experienceProjects[activeIndex] ?? experienceProjects[1];
  const featuredProject = experienceProjects[1];

  useEffect(() => {
    document.documentElement.dataset.palette = activeProject.surface;
    document.documentElement.style.setProperty("--active-accent", activeProject.accent);
    document.documentElement.style.setProperty("--active-accent-secondary", activeProject.accentSecondary);
  }, [activeProject]);

  useEffect(() => {
    const sections = experienceRef.current?.querySelectorAll<HTMLElement>("[data-engine-index]");
    if (!sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const focused = entries.find((entry) => entry.isIntersecting);
        if (!focused) return;
        const nextIndex = Number((focused.target as HTMLElement).dataset.engineIndex);
        if (Number.isInteger(nextIndex)) setActiveIndex(nextIndex);
      },
      { rootMargin: "-46% 0px -46%", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const selectProject = (index: number) => {
    const project = experienceProjects[index];
    if (!project) return;
    document.getElementById("chapter-" + project.slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      className={"portfolio-home surface-" + activeProject.surface}
      style={{
        "--project-accent": activeProject.accent,
        "--project-accent-secondary": activeProject.accentSecondary,
      } as React.CSSProperties}
    >
      <section className="kinetic-experience" aria-label="Portfolio interaktif Wynn Dev" ref={experienceRef}>
        <aside className="engine-sticky" aria-label={"Visual aktif: " + activeProject.name}>
          <CircularEngine
            project={activeProject}
            activeIndex={activeIndex}
            forceLite={liteMode}
            onSelectProject={selectProject}
          />
        </aside>
        <div className="experience-copy-layer">
          <BlueprintHero project={featuredProject} index={1} />
          <ProjectJourney projects={experienceProjects} activeIndex={activeIndex} />
        </div>
      </section>
      <ProjectArchive projects={experienceProjects} />
      <About />
      <Footer />
    </main>
  );
}
