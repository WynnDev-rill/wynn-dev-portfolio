import { Link, useLocation } from "react-router-dom";
import { GithubIcon, MotionIcon } from "./Icons";

interface HeaderProps {
  liteMode: boolean;
  onToggleLite: () => void;
}

export function Header({ liteMode, onToggleLite }: HeaderProps) {
  const { pathname } = useLocation();
  const homePrefix = pathname === "/" ? "" : "/";
  const projectSlug = pathname.startsWith("/projects/") ? pathname.split("/").filter(Boolean).at(-1) : undefined;
  const mainTarget = pathname === "/"
    ? "main-content-home"
    : projectSlug
      ? `main-content-project-${projectSlug}`
      : "main-content-not-found";

  return (
    <header className="site-header">
      <a className="skip-link" href={`#${mainTarget}`}>Lewati navigasi</a>
      <Link to="/" className="wordmark" aria-label="Wynn Dev — beranda">
        <span className="wordmark-mark">W</span>
        <span>WYNN / DEV</span>
      </Link>

      <nav className="header-nav" aria-label="Navigasi utama">
        <a href={`${homePrefix}#projects`}>Proyek</a>
        <a href={`${homePrefix}#about`}>Tentang</a>
        <a href={`${homePrefix}#contact`}>Kontak</a>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="icon-button motion-toggle"
          onClick={onToggleLite}
          aria-pressed={liteMode}
          aria-label={liteMode ? "Aktifkan animasi penuh" : "Aktifkan mode ringan"}
          title={liteMode ? "Animasi penuh" : "Mode ringan"}
        >
          <MotionIcon />
          <span>{liteMode ? "Lite" : "Motion"}</span>
        </button>
        <a
          className="icon-button github-button"
          href="https://github.com/WynnDev-rill"
          target="_blank"
          rel="noreferrer"
          aria-label="Profil GitHub Wynn Dev"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  );
}
