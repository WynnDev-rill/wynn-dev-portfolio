import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ExperienceProject } from "../data/experience";

interface ProjectJourneyProps {
  projects: ExperienceProject[];
  activeIndex: number;
}

export function ProjectJourney({ projects, activeIndex }: ProjectJourneyProps) {
  return (
    <div className="project-journey" id="projects">
      {projects.map((project, index) => {
        const isActive = activeIndex === index;
        return (
          <section
            className={"project-chapter " + (isActive ? "is-active" : "")}
            id={"chapter-" + project.slug}
            data-engine-index={index}
            aria-labelledby={"chapter-title-" + project.slug}
            key={project.slug}
          >
            <div className="chapter-copy">
              <p className="chapter-kicker">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {project.category}
              </p>
              <h2 id={"chapter-title-" + project.slug}>
                {project.headlineLines.map((line, lineIndex) => (
                  <span key={line}>{line}{lineIndex < project.headlineLines.length - 1 ? " " : null}</span>
                ))}
              </h2>
              <p>{project.description}</p>
              <div className="chapter-tech" aria-label={"Teknologi utama " + project.name}>
                {project.technologies.slice(0, 3).map((technology) => <span key={technology}>{technology}</span>)}
              </div>
              <Link className="chapter-link" to={"/projects/" + project.slug}>
                Studi kasus {project.name} <ArrowUpRight size={18} weight="regular" />
              </Link>
            </div>
            <div className="chapter-status" aria-hidden="true">
              <span>{project.systemLabel}</span>
              <strong>{project.status}</strong>
            </div>
          </section>
        );
      })}
    </div>
  );
}
