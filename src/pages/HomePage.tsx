import { useState } from "react";
import { About } from "../components/About";
import { CircularEngine } from "../components/CircularEngine";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { ProjectExplorer } from "../components/ProjectExplorer";
import { projects } from "../data/projects";

interface HomePageProps {
  liteMode: boolean;
}

export function HomePage({ liteMode }: HomePageProps) {
  const [activeIndex, setActiveIndex] = useState(4);
  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <main>
      <section className="experience-grid" aria-label="Portfolio Wynn Dev">
        <Hero activeIndex={activeIndex} onSelectProject={setActiveIndex} />
        <aside className="engine-dock" aria-label={`Visual aktif: ${activeProject.name}`}>
          <CircularEngine project={activeProject} activeIndex={activeIndex} forceLite={liteMode} />
        </aside>
        <ProjectExplorer activeIndex={activeIndex} onActivate={setActiveIndex} />
      </section>
      <About />
      <Footer />
    </main>
  );
}
