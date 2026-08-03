import { AnimatePresence, motion } from "framer-motion";
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ErrorInfo,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { experienceProjects, type ExperienceProject } from "../data/experience";
import { canUseWebGL, ProceduralEngineFallback } from "./ProceduralEngineFallback";

const CircularEngineCanvas = lazy(() => import("./CircularEngineCanvas"));
const SYSTEM_STEPS = ["CAPTURE", "CONNECT", "PROCESS", "ADAPT", "MEASURE", "EVOLVE"] as const;

interface CircularEngineProps {
  project: ExperienceProject;
  activeIndex: number;
  progressRef: MutableRefObject<number>;
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
    // The semantic app identity remains available if WebGL fails at runtime.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function getExperienceProfile() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const compactViewport = window.matchMedia("(max-width: 720px)").matches;
  const weakDevice = connection?.saveData === true
    || (typeof deviceMemory === "number" && deviceMemory <= 2)
    || (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4);

  return { reducedMotion, coarsePointer, compactViewport, weakDevice };
}

export function CircularEngine({
  project,
  activeIndex,
  progressRef,
  forceLite,
  onSelectProject,
}: CircularEngineProps) {
  const [profile, setProfile] = useState({
    reducedMotion: false,
    coarsePointer: false,
    compactViewport: false,
    weakDevice: false,
    webglAvailable: true,
  });

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 720px)"),
    ];
    const webglAvailable = canUseWebGL();
    const update = () => {
      const next = getExperienceProfile();
      setProfile({ ...next, webglAvailable });
      document.documentElement.dataset.input = next.coarsePointer ? "coarse" : "fine";
    };

    update();
    mediaQueries.forEach((query) => query.addEventListener("change", update));
    return () => mediaQueries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  const useStatic = forceLite || profile.reducedMotion || !profile.webglAvailable;
  const quality = profile.weakDevice || (profile.coarsePointer && profile.compactViewport) ? "low" : "high";
  const fallback = (
    <ProceduralEngineFallback
      project={project}
      motionEnabled={!forceLite && !profile.reducedMotion}
    />
  );

  return (
    <aside
      className={`orbital-engine surface-${project.surface}${useStatic ? " is-static-render" : ""}`}
      aria-label={`Mesin visual aktif: ${project.name}`}
      style={{
        "--project-accent": project.accent,
        "--project-accent-secondary": project.accentSecondary,
      } as React.CSSProperties}
    >
      <div className="engine-viewport">
        {useStatic ? fallback : (
          <EngineBoundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <CircularEngineCanvas
                activeIndex={activeIndex}
                progressRef={progressRef}
                quality={quality}
                surface={project.surface}
                motionEnabled
                ariaLabel={`Desain bergerak generatif untuk ${project.name}. Gulir halaman untuk mengubah bentuknya.`}
              />
            </Suspense>
          </EngineBoundary>
        )}
      </div>

      <nav className="engine-project-rail" aria-label="Pilih proyek aktif">
        {experienceProjects.map((item, index) => (
          <button
            type="button"
            className={activeIndex === index ? "is-active" : ""}
            aria-current={activeIndex === index ? "step" : undefined}
            aria-label={`Tampilkan ${item.name}`}
            onClick={() => onSelectProject(index)}
            key={item.slug}
          >
            <span>{String(index + 1).padStart(2, "0")}</span><i />
          </button>
        ))}
      </nav>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className="engine-app-badge"
          key={project.slug}
          initial={profile.reducedMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={profile.reducedMotion ? undefined : { opacity: 0, scale: 0.94, y: -5 }}
          transition={{ duration: profile.reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={project.icon} alt="" width="42" height="42" />
          <span><small>APP / 0{activeIndex + 1}</small><strong>{project.name}</strong></span>
        </motion.div>
      </AnimatePresence>

      <div className="engine-angle engine-angle-top" aria-hidden="true">22.5°</div>
      <div className="engine-angle engine-angle-bottom" aria-hidden="true">22.5°</div>
      <div className="engine-angle engine-angle-left" aria-hidden="true">45°</div>
      <div className="engine-angle engine-angle-right" aria-hidden="true">45°</div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className="engine-system-readout"
          key={`${project.slug}-system`}
          initial={profile.reducedMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={profile.reducedMotion ? undefined : { opacity: 0, x: 8 }}
          transition={{ duration: profile.reducedMotion ? 0 : 0.3 }}
        >
          <strong>{project.systemLabel}</strong>
          {SYSTEM_STEPS.map((step, index) => (
            <span className={index === activeIndex ? "is-active" : ""} key={step}>
              {String(index + 1).padStart(2, "0")}&nbsp;&nbsp; {step}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="engine-field-readout">
        <i />
        <strong>{project.fieldLabel}</strong>
        <span>{project.technologies.slice(0, 2).join(" / ")}</span>
      </div>

      <div className="engine-signal-readout">
        <i />
        <strong>{project.signalLabel}</strong>
        <span>{quality === "low" ? "ADAPTIVE MOBILE RENDER" : "REALTIME GENERATIVE FIELD"}</span>
      </div>
    </aside>
  );
}
