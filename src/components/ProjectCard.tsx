import { Link } from "react-router-dom";
import type { Project } from "../types";
import { ArrowIcon } from "./Icons";
import { FlowlyPreview } from "./FlowlyPreview";

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
}

export function ProjectCard({ project, index, isActive, onActivate }: ProjectCardProps) {
  return (
    <article
      id={`project-${project.slug}`}
      data-project-index={index}
      className={`project-card ${isActive ? "is-active" : ""}`}
      onPointerEnter={() => onActivate(index)}
      onFocusCapture={() => onActivate(index)}
      style={{
        "--project-accent": project.accent,
        "--project-accent-secondary": project.accentSecondary,
      } as React.CSSProperties}
    >
      <div className="project-visual">
        {project.screenshot ? (
          <img
            src={project.screenshot}
            alt={`Tampilan ${project.name}`}
            width="1280"
            height="880"
            loading="lazy"
            decoding="async"
          />
        ) : <FlowlyPreview compact />}
        <div className="visual-topline">
          <span>0{index + 1} / 06</span>
          <span className={`status-dot ${project.statusTone}`}>{project.status}</span>
        </div>
        <div className="project-icon-wrap">
          <img src={project.icon} alt="" width="68" height="68" loading="lazy" />
        </div>
      </div>

      <div className="project-content">
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="tech-list" aria-label={`Teknologi ${project.name}`}>
          {project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <Link className="project-link" to={`/projects/${project.slug}`} aria-label={`Lihat studi kasus ${project.name}`}>
          Lihat detail <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
