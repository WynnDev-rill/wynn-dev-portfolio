import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ExperienceProject } from "../data/experience";

interface ProjectArchiveProps {
  projects: ExperienceProject[];
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="project-index" aria-labelledby="project-index-title">
      <header className="project-index-heading">
        <div>
          <p className="eyebrow">SYSTEM INDEX / 02</p>
          <h2 id="project-index-title">Enam produk.<br />Enam cara bergerak.</h2>
        </div>
        <p>
          Seluruh visual di atas dibentuk secara generatif dari logika produknya—bukan screenshot aplikasi.
          Pilih satu sistem untuk membaca detail keputusan produk dan teknisnya.
        </p>
      </header>

      <div className="project-index-list">
        {projects.map((project, index) => (
          <motion.article
            className="project-index-row"
            style={{ "--row-accent": project.accent } as React.CSSProperties}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, delay: reducedMotion ? 0 : index * 0.035 }}
            key={project.slug}
          >
            <Link to={`/projects/${project.slug}`} aria-label={`Buka studi kasus ${project.name}`}>
              <span className="project-row-number">{String(index + 1).padStart(2, "0")}</span>
              <img className="project-row-icon" src={project.icon} alt="" width="56" height="56" loading="lazy" decoding="async" />
              <span className="project-row-title">
                <small>{project.category}</small>
                <strong>{project.name}</strong>
              </span>
              <span className="project-row-description">{project.description}</span>
              <span className="project-row-stack">{project.technologies.slice(0, 2).join(" + ")}</span>
              <ArrowUpRight className="project-row-arrow" size={24} aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
