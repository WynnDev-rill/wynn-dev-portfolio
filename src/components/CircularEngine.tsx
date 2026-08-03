import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { experienceProjects, type ExperienceProject } from "../data/experience";

const CircularEngineCanvas = lazy(() => import("./CircularEngineCanvas"));
const SYSTEM_STEPS = ["CAPTURE", "PROCESS", "SCHEDULE", "REVIEW", "ANALYZE", "RETAIN"] as const;

interface CircularEngineProps {
  project: ExperienceProject;
  activeIndex: number;
  forceLite: boolean;
  onSelectProject: (index: number) => void;
}

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

class EngineBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // A real image fallback keeps the composition usable when WebGL is unavailable.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function detectReducedExperience() {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMemory = typeof navigatorWithMemory.deviceMemory === "number" && navigatorWithMemory.deviceMemory <= 4;
  const fewCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const saveData = navigatorWithMemory.connection?.saveData === true;
  return { reducedMotion, weakDevice: lowMemory || fewCores || saveData };
}

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function StaticEngine({ project }: { project: ExperienceProject }) {
  const source = project.slug === "memocard" ? "/images/engine/memocard-blueprint.webp" : project.icon;
  return (
    <div className={"engine-fallback " + (project.slug === "memocard" ? "is-blueprint" : "is-icon")}>
      <img src={source} alt="" width={project.slug === "memocard" ? 1254 : 256} height={project.slug === "memocard" ? 1254 : 256} />
    </div>
  );
}

export function CircularEngine({ project, activeIndex, forceLite, onSelectProject }: CircularEngineProps) {
  const [experience, setExperience] = useState({ reducedMotion: false, weakDevice: false, webglAvailable: false });

  useEffect(() => {
    setExperience({ ...detectReducedExperience(), webglAvailable: detectWebGL() });
  }, []);

  const staticFallback = <StaticEngine project={project} />;
  const useStatic = forceLite || experience.reducedMotion || !experience.webglAvailable;
  const quality = experience.weakDevice ? "low" : "high";
  const isMemoCard = project.slug === "memocard";

  return (
    <div
      className={"orbital-engine surface-" + project.surface}
      style={{
        "--project-accent": project.accent,
        "--project-accent-secondary": project.accentSecondary,
      } as React.CSSProperties}
    >
      <nav className="engine-project-rail" aria-label="Pilih proyek aktif">
        {experienceProjects.map((item, index) => (
          <button
            type="button"
            className={activeIndex === index ? "is-active" : ""}
            aria-current={activeIndex === index ? "true" : undefined}
            aria-label={"Tampilkan " + item.name}
            onClick={() => onSelectProject(index)}
            key={item.slug}
          >
            <span>{String(index + 1).padStart(2, "0")}</span><i />
          </button>
        ))}
      </nav>

      <div className="engine-angle engine-angle-top" aria-hidden="true">22.5°</div>
      <div className="engine-angle engine-angle-bottom" aria-hidden="true">22.5°</div>
      <div className="engine-angle engine-angle-left" aria-hidden="true">45°</div>
      <div className="engine-angle engine-angle-right" aria-hidden="true">45°</div>

      <div className="engine-viewport" aria-hidden="true">
        {useStatic ? staticFallback : (
          <EngineBoundary fallback={staticFallback}>
            <Suspense fallback={staticFallback}>
              <CircularEngineCanvas
                visual={project.visual}
                accent={project.accent}
                accentSecondary={project.accentSecondary}
                activeIndex={activeIndex}
                quality={quality}
                surface={project.surface}
              />
            </Suspense>
          </EngineBoundary>
        )}
      </div>

      <div className="engine-system-readout">
        <strong>{project.systemLabel}</strong>
        {SYSTEM_STEPS.map((step, index) => (
          <span key={step}>{String(index + 1).padStart(2, "0")}&nbsp;&nbsp; {step}</span>
        ))}
      </div>

      <div className="engine-field-readout">
        <strong>{project.fieldLabel}</strong>
        {isMemoCard ? (
          <><span>ALGORITMA ADAPTIF</span><span>PERSONALIZED INTERVALS</span><span>RETENSI OPTIMAL</span></>
        ) : (
          <><span>{project.technologies[0]}</span><span>{project.technologies[1]}</span><span>ADAPTIVE OUTPUT</span></>
        )}
      </div>

      <div className="engine-signal-readout">
        <strong>{project.signalLabel}</strong>
        {isMemoCard ? (
          <><span>EASE FACTOR</span><span>STABILITY</span><span>RETRIEVAL RATE</span></>
        ) : (
          <><span>{project.status}</span><span>{quality === "low" ? "ADAPTIVE QUALITY" : "REALTIME RENDER"}</span></>
        )}
      </div>

      <div className="engine-active-index" aria-hidden="true">
        <strong>{String(activeIndex + 1).padStart(2, "0")}</strong><span>/ 06</span>
      </div>

      <div className="engine-scroll-label" aria-hidden="true">
        <span>{useStatic ? "STATIC FALLBACK" : "SCROLL + POINTER"}</span><i />
      </div>
    </div>
  );
}
