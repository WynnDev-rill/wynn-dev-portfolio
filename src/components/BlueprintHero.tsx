import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ExperienceProject } from "../data/experience";

interface BlueprintHeroProps {
  project: ExperienceProject;
  index: number;
}

export function BlueprintHero({ project, index }: BlueprintHeroProps) {
  const lead = project.slug === "memocard"
    ? "MemoCard adalah sistem belajar adaptif berbasis spaced repetition dan metrik retensi. Dibangun untuk membantu siapa pun memahami, mengingat, dan berkembang setiap hari."
    : project.description;

  return (
    <section
      className="blueprint-hero"
      id="top"
      data-engine-index={index}
      aria-labelledby="blueprint-title"
    >
      <motion.div
        className="blueprint-copy"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="blueprint-eyebrow"><i /> {project.category.replace(" & ", " / ")}</p>
        <h1 id="blueprint-title">
          {project.headlineLines.map((line, lineIndex) => (
            <span className={lineIndex === 2 ? "muted-line" : undefined} key={line}>
              {line}{lineIndex < project.headlineLines.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="blueprint-lead">{lead}</p>
        <Link className="blueprint-link" to={"/projects/" + project.slug}>
          Lihat {project.name} <ArrowRight size={18} weight="regular" />
        </Link>
      </motion.div>

      <div className="blueprint-case-count" aria-label={"Proyek " + (index + 1) + " dari 6"}>
        <strong>{String(index + 1).padStart(2, "0")}</strong><span>/ 06</span>
        <small>PROYEK AKTIF</small>
      </div>

      <a className="blueprint-scroll-cue" href="#projects" aria-label="Gulir ke rangkaian proyek">
        <span>SCROLL TO EXPLORE</span><ArrowDown size={16} weight="regular" />
      </a>
    </section>
  );
}
