import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { About } from "../components/About";
import { CircularEngine } from "../components/CircularEngine";
import { Footer } from "../components/Footer";
import { ProjectArchive } from "../components/ProjectArchive";
import { experienceProjects } from "../data/experience";

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  liteMode: boolean;
}

export function HomePage({ liteMode }: HomePageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const reduceEffects = Boolean(reducedMotion || liteMode);
  const activeProject = experienceProjects[activeIndex] ?? experienceProjects[0];

  useLayoutEffect(() => {
    document.documentElement.dataset.palette = activeProject.surface;
    document.documentElement.style.setProperty("--active-accent", activeProject.accent);
    document.documentElement.style.setProperty("--active-accent-secondary", activeProject.accentSecondary);
  }, [activeProject]);

  useLayoutEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;

    const updateProgress = (progress: number) => {
      const normalized = Math.min(1, Math.max(0, progress));
      progressRef.current = normalized;
      sequence.style.setProperty("--sequence-progress", String(normalized));
      const nextIndex = Math.min(
        experienceProjects.length - 1,
        Math.round(normalized * (experienceProjects.length - 1)),
      );
      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    };

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sequence,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onRefresh: (self) => updateProgress(self.progress),
        onUpdate: (self) => updateProgress(self.progress),
      });
    }, sequence);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh).catch(() => undefined);
    window.addEventListener("orientationchange", refresh);
    return () => {
      window.removeEventListener("orientationchange", refresh);
      context.revert();
    };
  }, []);

  const selectProject = (index: number) => {
    const sequence = sequenceRef.current;
    if (!sequence || !experienceProjects[index]) return;
    const sequenceTop = sequence.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(sequence.offsetHeight - window.innerHeight, 1);
    const progress = index / Math.max(experienceProjects.length - 1, 1);
    window.scrollTo({
      top: sequenceTop + travel * progress,
      behavior: reduceEffects ? "auto" : "smooth",
    });
  };

  return (
    <main
      id="main-content-home"
      tabIndex={-1}
      className={"portfolio-home immersive-home surface-" + activeProject.surface}
      style={{
        "--project-accent": activeProject.accent,
        "--project-accent-secondary": activeProject.accentSecondary,
      } as React.CSSProperties}
    >
      <section
        className="motion-sequence"
        id="projects"
        aria-label="Enam proyek dalam mesin visual interaktif"
        ref={sequenceRef}
      >
        <div className="motion-stage">
          <CircularEngine
            project={activeProject}
            activeIndex={activeIndex}
            progressRef={progressRef}
            forceLite={liteMode}
            onSelectProject={selectProject}
          />

          <AnimatePresence initial={false} mode="wait">
            <motion.article
              className={`stage-project-copy is-${activeIndex % 2 === 0 ? "left" : "right"}`}
              key={activeProject.slug}
              initial={reduceEffects ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceEffects ? undefined : { opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: reduceEffects ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="stage-project-identity">
                <img src={activeProject.icon} alt="" width="48" height="48" />
                <span>
                  <small>{String(activeIndex + 1).padStart(2, "0")} / 06</small>
                  <strong>{activeProject.name}</strong>
                </span>
              </div>

              <p className="stage-kicker"><i />{activeProject.category}</p>
              <h1>
                {activeProject.headlineLines.map((line, index) => (
                  <span className={index === 2 ? "is-muted" : undefined} key={line}>{line}</span>
                ))}
              </h1>
              <p className="stage-motion-note">{activeProject.motionNote}</p>
              <p className="stage-description">{activeProject.description}</p>
              <Link className="stage-project-link" to={`/projects/${activeProject.slug}`}>
                Lihat sistem {activeProject.name}<ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </motion.article>
          </AnimatePresence>

          <div className="stage-chapter-count" aria-hidden="true">
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span>/ 06<br />PROYEK AKTIF</span>
          </div>
          <div className="stage-scroll-cue" aria-hidden="true"><span>SCROLL / EXPLORE</span><i /></div>
        </div>

        <ol className="sequence-accessible-list">
          {experienceProjects.map((project) => (
            <li key={project.slug}>{project.name}: {project.description}</li>
          ))}
        </ol>
      </section>
      <ProjectArchive projects={experienceProjects} />
      <About />
      <Footer />
    </main>
  );
}
