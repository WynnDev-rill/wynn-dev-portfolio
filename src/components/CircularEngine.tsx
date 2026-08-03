import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import type { Project } from "../types";

const CircularEngineCanvas = lazy(() => import("./CircularEngineCanvas"));

interface CircularEngineProps {
  project: Project;
  activeIndex: number;
  forceLite: boolean;
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
    // The CSS engine remains fully usable when WebGL cannot initialize.
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

function StaticEngine({ project }: { project: Project }) {
  return (
    <div className="static-engine" style={{ "--project-accent": project.accent, "--project-accent-secondary": project.accentSecondary } as React.CSSProperties}>
      <div className="static-grid" />
      <div className="static-ring ring-one" />
      <div className="static-ring ring-two" />
      <div className="static-ring ring-three" />
      <div className="static-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--particle": index } as React.CSSProperties} />)}
      </div>
      <div className="static-core">
        <img src={project.icon} alt="" width="116" height="116" />
      </div>
    </div>
  );
}

export function CircularEngine({ project, activeIndex, forceLite }: CircularEngineProps) {
  const [experience, setExperience] = useState({ reducedMotion: false, weakDevice: false });

  useEffect(() => {
    setExperience(detectReducedExperience());
  }, []);

  const staticFallback = <StaticEngine project={project} />;
  const useStatic = forceLite || experience.reducedMotion;
  const quality = experience.weakDevice ? "low" : "high";

  return (
    <div
      className="engine-panel"
      style={{ "--project-accent": project.accent, "--project-accent-secondary": project.accentSecondary } as React.CSSProperties}
    >
      <div className="engine-meta top-meta">
        <span>ORBITAL ENGINE</span>
        <span>0{activeIndex + 1} / 06</span>
      </div>
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
              />
            </Suspense>
          </EngineBoundary>
        )}
      </div>
      <div className="engine-readout">
        <div>
          <span>ACTIVE SYSTEM</span>
          <strong>{project.name}</strong>
        </div>
        <div className="engine-signal" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      <div className="engine-meta bottom-meta">
        <span>{useStatic ? "STATIC FALLBACK" : quality === "low" ? "ADAPTIVE / LOW" : "WEBGL / ACTIVE"}</span>
        <span>SCROLL + POINTER</span>
      </div>
    </div>
  );
}
