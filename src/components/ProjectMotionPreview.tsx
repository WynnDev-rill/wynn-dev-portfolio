import { lazy, Suspense, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { ExperienceProject } from "../data/experience";
import { canUseWebGL, ProceduralEngineFallback } from "./ProceduralEngineFallback";

const CircularEngineCanvas = lazy(() => import("./CircularEngineCanvas"));

interface ProjectMotionPreviewProps {
  project: ExperienceProject;
  index: number;
}

export function ProjectMotionPreview({ project, index }: ProjectMotionPreviewProps) {
  const reducedMotion = useReducedMotion();
  const progressRef = useRef(index / 5);
  const compactDevice = window.matchMedia("(max-width: 720px)").matches;
  const webglAvailable = canUseWebGL();

  return (
    <div
      className={`project-motion-preview surface-${project.surface}`}
      style={{
        "--project-accent": project.accent,
        "--project-accent-secondary": project.accentSecondary,
      } as React.CSSProperties}
    >
      {!webglAvailable ? (
        <ProceduralEngineFallback project={project} motionEnabled={!reducedMotion} />
      ) : <Suspense
        fallback={(
          <div className="project-motion-fallback">
            <img src={project.icon} alt="" width="128" height="128" />
            <span>Memuat sistem visual {project.name}</span>
          </div>
        )}
      >
        <CircularEngineCanvas
          activeIndex={index}
          progressRef={progressRef}
          quality={compactDevice ? "low" : "high"}
          surface={project.surface}
          motionEnabled={!reducedMotion}
          ariaLabel={`Desain bergerak generatif ${project.name}: ${project.motionNote}`}
          compact
        />
      </Suspense>}
      <div className="project-motion-caption">
        <img src={project.icon} alt="" width="44" height="44" />
        <span><small>GENERATIVE SYSTEM / 0{index + 1}</small><strong>{project.systemLabel}</strong></span>
      </div>
      <p>{project.motionNote}</p>
    </div>
  );
}
