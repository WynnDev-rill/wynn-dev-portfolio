import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
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
  const touchPreview = import.meta.env.DEV && new URLSearchParams(window.location.search).get("touch-preview") === "1";
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches || touchPreview;
  const compactViewport = window.matchMedia("(max-width: 1200px)").matches;
  const lowMemory = typeof navigatorWithMemory.deviceMemory === "number" && navigatorWithMemory.deviceMemory <= 4;
  const fewCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const saveData = navigatorWithMemory.connection?.saveData === true;
  return { reducedMotion, coarsePointer, compactViewport, weakDevice: lowMemory || fewCores || saveData };
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
  const engineControls = useAnimationControls();
  const [experience, setExperience] = useState({
    reducedMotion: false,
    coarsePointer: false,
    compactViewport: false,
    weakDevice: false,
    webglAvailable: false,
  });

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const compactViewportQuery = window.matchMedia("(max-width: 1200px)");
    const webglAvailable = detectWebGL();
    const updateExperience = () => {
      const nextExperience = detectReducedExperience();
      setExperience({ ...nextExperience, webglAvailable });
      document.documentElement.dataset.input = nextExperience.coarsePointer ? "coarse" : "fine";
    };

    updateExperience();
    reducedMotionQuery.addEventListener("change", updateExperience);
    coarsePointerQuery.addEventListener("change", updateExperience);
    compactViewportQuery.addEventListener("change", updateExperience);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateExperience);
      coarsePointerQuery.removeEventListener("change", updateExperience);
      compactViewportQuery.removeEventListener("change", updateExperience);
    };
  }, []);

  const staticFallback = <StaticEngine project={project} />;
  const touchOptimized = experience.coarsePointer && experience.compactViewport;
  const useStatic = forceLite || experience.reducedMotion || touchOptimized || !experience.webglAvailable;
  const quality = experience.weakDevice ? "low" : "high";
  const isMemoCard = project.slug === "memocard";
  const staticTransition = {
    duration: experience.reducedMotion ? 0 : forceLite ? 0.22 : 0.36,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  useEffect(() => {
    if (experience.reducedMotion || useStatic) {
      engineControls.set({ opacity: 1, scale: 1, y: 0 });
      return;
    }

    engineControls.stop();
    engineControls.set({ opacity: 0.42, scale: 0.972, y: 12 });
    void engineControls.start({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    });
  }, [activeIndex, engineControls, experience.reducedMotion, useStatic]);

  return (
    <div
      className={
        "orbital-engine surface-" + project.surface +
        (touchOptimized ? " is-touch-optimized" : "") +
        (useStatic ? " is-static-render" : "")
      }
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
        {useStatic ? (
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              className="engine-visual-state"
              key={project.slug}
              initial={experience.reducedMotion ? false : { opacity: 0, scale: 0.985, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={experience.reducedMotion ? undefined : { opacity: 0, scale: 1.008, y: -4 }}
              transition={staticTransition}
            >
              {staticFallback}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div className="engine-visual-state" animate={engineControls} initial={{ opacity: 1, scale: 1, y: 0 }}>
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
          </motion.div>
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
        <span>{touchOptimized ? "TOUCH MOTION" : useStatic ? "STATIC FALLBACK" : "SCROLL + POINTER"}</span><i />
      </div>
    </div>
  );
}
