import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FlowlyPreview } from "../components/FlowlyPreview";
import { Footer } from "../components/Footer";
import { ArrowIcon, ExternalIcon, GithubIcon } from "../components/Icons";
import { experienceProjects } from "../data/experience";
import { projectBySlug } from "../data/projects";
import { NotFoundPage } from "./NotFoundPage";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = slug ? projectBySlug.get(slug) : undefined;

  useEffect(() => {
    if (!project) return;
    document.documentElement.dataset.palette = "light";
    document.title = `${project.name} — Wynn Dev`;
    return () => {
      document.title = "Wynn Dev — Independent App Developer";
      delete document.documentElement.dataset.palette;
    };
  }, [project]);

  if (!project) return <NotFoundPage />;

  const projectIndex = experienceProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = experienceProjects[(projectIndex + 1) % experienceProjects.length] ?? experienceProjects[0];

  return (
    <>
      <main
        id={`main-content-project-${project.slug}`}
        tabIndex={-1}
        className="detail-page"
        style={{
          "--project-accent": project.accent,
          "--project-accent-secondary": project.accentSecondary,
        } as React.CSSProperties}
      >
        <div className="detail-orbit orbit-a" />
        <div className="detail-orbit orbit-b" />

        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Portfolio</Link><span>/</span><Link to="/#projects">Projects</Link><span>/</span><strong>{project.name}</strong>
        </nav>

        <section className="detail-hero">
          <div className="detail-copy">
            <div className="detail-icon"><img src={project.icon} alt="" width="92" height="92" /></div>
            <p className="eyebrow">CASE STUDY / 0{projectIndex + 1}</p>
            <p className="detail-category">{project.category}</p>
            <h1>{project.name}</h1>
            <p className="detail-lead">{project.longDescription}</p>
            <div className="detail-actions">
              {project.demo ? (
                <a className="button primary-button" href={project.demo.url} target="_blank" rel="noreferrer">
                  {project.demo.label} <ExternalIcon />
                </a>
              ) : (
                <span className="button disabled-button" aria-disabled="true">Demo belum tersedia</span>
              )}
              <a className="button ghost-button" href={project.repository.url} target="_blank" rel="noreferrer">
                <GithubIcon /> {project.repository.label}
              </a>
            </div>
          </div>

          <div className="detail-status-card">
            <div className="detail-status-top"><span className={`status-dot ${project.statusTone}`}>{project.status}</span><span>{project.year}</span></div>
            <dl>
              <div><dt>Source</dt><dd>{project.repository.note ?? "Repository"}</dd></div>
              <div><dt>Demo</dt><dd>{project.demo ? "Production live" : "Temporarily unavailable"}</dd></div>
              <div><dt>APK</dt><dd>{project.apk ? project.apk.note ?? "Build available" : "Belum dipublikasikan"}</dd></div>
            </dl>
            {project.apk ? (
              <a className="audit-link" href={project.apk.url} target="_blank" rel="noreferrer">
                {project.apk.label} <ExternalIcon />
              </a>
            ) : <span className="audit-link is-disabled">APK belum memiliki tautan publik</span>}
          </div>
        </section>

        <section className="detail-preview" aria-labelledby="preview-title">
          <header>
            <div><p className="eyebrow">PRODUCT VIEW</p><h2 id="preview-title">Tampilan produk</h2></div>
            <p>{project.screenshot ? "Screenshot dari production deployment." : "Preview direkonstruksi dari source karena public build belum memuat bundle."}</p>
          </header>
          <div className="detail-preview-frame">
            {project.screenshot ? (
              <img src={project.screenshot} alt={`Tampilan production ${project.name}`} width="1280" height="880" />
            ) : <FlowlyPreview />}
          </div>
        </section>

        <section className="detail-facts">
          {project.highlights.map((highlight) => (
            <div key={highlight.label}><strong>{highlight.value}</strong><span>{highlight.label}</span></div>
          ))}
        </section>

        <section className="detail-content-grid">
          <div className="feature-section">
            <p className="eyebrow">CAPABILITIES</p>
            <h2>Apa yang produk ini lakukan.</h2>
            <ol className="feature-list">
              {project.features.map((feature, index) => (
                <li key={feature}><span>0{index + 1}</span><p>{feature}</p></li>
              ))}
            </ol>
          </div>

          <aside className="stack-section">
            <p className="eyebrow">SYSTEM STACK</p>
            <h2>Teknologi</h2>
            <div className="detail-tech-list">
              {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
            <div className="build-note">
              <span>AUDIT NOTE</span>
              <p>{project.buildNote}</p>
            </div>
          </aside>
        </section>

        <Link className="next-project" to={`/projects/${nextProject.slug}`}>
          <span><small>PROYEK BERIKUTNYA</small><strong>{nextProject.name}</strong></span>
          <ArrowIcon size={32} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
