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
    const experience = experienceRef.current;
    const sections = experience?.querySelectorAll<HTMLElement>("[data-engine-index]");
    if (!experience || !sections?.length) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const updateExperience = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const focusLine = viewportHeight * 0.52;
      const experienceRect = experience.getBoundingClientRect();
      const scrollableDistance = Math.max(experienceRect.height - viewportHeight, 1);
      const progress = Math.min(1, Math.max(0, -experienceRect.top / scrollableDistance));

      let closestDistance = Number.POSITIVE_INFINITY;
      let closestIndex = 1;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.5 - focusLine);
        if (distance < closestDistance) {
          const candidate = Number(section.dataset.engineIndex);
          if (Number.isInteger(candidate)) {
            closestDistance = distance;
            closestIndex = candidate;
          }
        }
      });

      setActiveIndex((current) => current === closestIndex ? current : closestIndex);
      experience.style.setProperty("--experience-progress", String(progress));
      const drift = reducedMotionQuery.matches || liteMode ? 0 : Math.sin(progress * Math.PI * 2) * 10;
      experience.style.setProperty("--engine-drift-y", `${drift}px`);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateExperience);
    };

    updateExperience();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotionQuery.addEventListener("change", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotionQuery.removeEventListener("change", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [liteMode]);

  const selectProject = (index: number) => {
    const project = experienceProjects[index];
    if (!project) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("chapter-" + project.slug)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <main
      id="main-content-home"
      tabIndex={-1}
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
          <BlueprintHero project={featuredProject} index={1} liteMode={liteMode} />
          <ProjectJourney projects={experienceProjects} activeIndex={activeIndex} />
        </div>
      </section>
      <ProjectArchive projects={experienceProjects} />
      <About />
      <Footer />
    </main>
  );
}
