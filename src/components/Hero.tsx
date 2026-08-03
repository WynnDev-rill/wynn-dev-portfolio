import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { ArrowIcon } from "./Icons";

interface HeroProps {
  activeIndex: number;
  onSelectProject: (index: number) => void;
}

export function Hero({ activeIndex, onSelectProject }: HeroProps) {
  const featured = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => project.featured)
    .slice(0, 3);

  const selectFeatured = (index: number) => {
    onSelectProject(index);
    document.getElementById(`project-${projects[index]?.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="hero" id="top">
      <motion.div
        className="hero-intro"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="availability-pill">
          <span /> Independent developer · Indonesia
        </div>
        <p className="hero-kicker">ANDROID / WEB / INTERACTIVE SYSTEMS</p>
        <h1>
          Sistem kecil.
          <span>Pengalaman yang hidup.</span>
        </h1>
        <p className="hero-copy">
          Aku membangun aplikasi untuk belajar, bergerak, menulis, dan menjaga kebiasaan—dengan antarmuka yang terasa personal, bukan sekadar fungsional.
        </p>
        <div className="hero-actions">
          <a className="button primary-button" href="#projects">
            Jelajahi proyek <ArrowIcon />
          </a>
          <a className="button ghost-button" href="#about">Tentang Wynn</a>
        </div>
        <div className="hero-metrics" aria-label="Ringkasan portfolio">
          <div><strong>06</strong><span>produk pilihan</span></div>
          <div><strong>03</strong><span>kategori sistem</span></div>
          <div><strong>01</strong><span>fokus: pengalaman</span></div>
        </div>
      </motion.div>

      <div className="featured-block" aria-labelledby="featured-title">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">SELECTED / 01</p>
            <h2 id="featured-title">Proyek unggulan</h2>
          </div>
          <span className="heading-note">Pilih untuk mengubah engine</span>
        </div>
        <div className="featured-list">
          {featured.map(({ project, index }, order) => (
            <button
              type="button"
              className={`featured-row ${activeIndex === index ? "is-active" : ""}`}
              key={project.slug}
              onClick={() => selectFeatured(index)}
              onFocus={() => onSelectProject(index)}
              style={{ "--project-accent": project.accent } as React.CSSProperties}
            >
              <span className="featured-number">0{order + 1}</span>
              <img src={project.icon} alt="" width="52" height="52" />
              <span className="featured-copy">
                <strong>{project.name}</strong>
                <small>{project.eyebrow}</small>
              </span>
              <span className="featured-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <Link className="text-link" to={`/projects/${projects[activeIndex]?.slug ?? "habitverse"}`}>
          Lihat detail proyek aktif <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}
