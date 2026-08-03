import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ExperienceProject } from "../data/experience";
import { FlowlyPreview } from "./FlowlyPreview";

interface ProjectArchiveProps {
  projects: ExperienceProject[];
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  return (
    <section className="project-archive" aria-labelledby="archive-title">
      <header className="archive-heading">
        <div>
          <p className="eyebrow">ARCHIVE / 02</p>
          <h2 id="archive-title">Enam sistem, satu cara berpikir.</h2>
        </div>
        <p>Setiap proyek diperlakukan sebagai produk nyata—bukan sekadar eksperimen visual.</p>
      </header>

      <div className="archive-grid">
        {projects.map((project, index) => (
          <article className="archive-card" key={project.slug}>
            <Link className="archive-visual" to={"/projects/" + project.slug} aria-label={"Lihat " + project.name}>
              {project.screenshot ? (
                <img
                  src={project.screenshot}
                  alt={"Tampilan " + project.name}
                  width="1280"
                  height="880"
                  loading="lazy"
                  decoding="async"
                />
              ) : <FlowlyPreview compact />}
              <span>{String(index + 1).padStart(2, "0")} / 06</span>
            </Link>
            <div className="archive-card-copy">
              <p>{project.eyebrow}</p>
              <h3>{project.name}</h3>
              <Link to={"/projects/" + project.slug} aria-label={"Buka studi kasus " + project.name}>
                <ArrowUpRight size={22} weight="regular" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
