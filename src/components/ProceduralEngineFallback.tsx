import { useEffect, useRef } from "react";
import type { ExperienceProject } from "../data/experience";

interface ProceduralEngineFallbackProps {
  project: ExperienceProject;
  motionEnabled: boolean;
}

export function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function ellipse(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation = 0,
) {
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  context.stroke();
}

function drawCore(
  context: CanvasRenderingContext2D,
  project: ExperienceProject,
  radius: number,
  time: number,
) {
  context.save();
  context.rotate(Math.sin(time * 0.35) * 0.07);
  context.strokeStyle = project.surface === "light" ? "rgba(20,24,28,.55)" : project.accent;
  context.lineWidth = 1;
  context.globalAlpha = project.surface === "light" ? 0.58 : 0.82;

  if (project.visual === "book") {
    for (let lane = 0; lane < 8; lane += 1) {
      const offset = (lane - 3.5) * radius * 0.055;
      context.beginPath();
      context.moveTo(0, -radius * 0.48 + offset);
      context.bezierCurveTo(-radius * 0.18, -radius * 0.62 + offset, -radius * 0.7, -radius * 0.44 + offset, -radius * 0.78, radius * 0.54 + offset);
      context.bezierCurveTo(-radius * 0.42, radius * 0.35 + offset, -radius * 0.18, radius * 0.42 + offset, 0, radius * 0.58 + offset);
      context.stroke();
      context.beginPath();
      context.moveTo(0, -radius * 0.48 + offset);
      context.bezierCurveTo(radius * 0.18, -radius * 0.62 + offset, radius * 0.7, -radius * 0.44 + offset, radius * 0.78, radius * 0.54 + offset);
      context.bezierCurveTo(radius * 0.42, radius * 0.35 + offset, radius * 0.18, radius * 0.42 + offset, 0, radius * 0.58 + offset);
      context.stroke();
    }
  } else if (project.visual === "cards") {
    const levels = [-0.62, -0.31, 0, 0.34, 0.66];
    const widths = [0.62, 0.47, 0.73, 0.58, 0.43];
    levels.forEach((level, index) => {
      ellipse(context, 0, radius * level, radius * widths[index], radius * 0.15, Math.sin(time * 0.4 + index) * 0.025);
      ellipse(context, 0, radius * level, radius * (widths[index] + 0.11), radius * 0.19);
    });
    context.beginPath();
    context.moveTo(0, -radius * 0.48);
    context.lineTo(0, radius * 0.46);
    context.stroke();
  } else if (project.visual === "fitness") {
    context.rotate(-0.36);
    context.beginPath();
    context.moveTo(-radius * 0.88, 0);
    context.lineTo(radius * 0.88, 0);
    context.stroke();
    [-0.72, -0.58, -0.45, 0.45, 0.58, 0.72].forEach((position, index) => {
      ellipse(context, radius * position, 0, radius * 0.08, radius * (0.31 - (index % 3) * 0.035));
    });
    ellipse(context, 0, 0, radius * 0.38, radius * 0.38);
  } else if (project.visual === "flower") {
    for (let index = 0; index < 10; index += 1) {
      context.save();
      context.rotate((index / 10) * Math.PI * 2 + time * 0.05);
      ellipse(context, 0, -radius * 0.48, radius * 0.18, radius * 0.48, 0);
      context.restore();
    }
    ellipse(context, 0, 0, radius * 0.22, radius * 0.22);
  } else if (project.visual === "flow") {
    context.beginPath();
    for (let index = 0; index <= 320; index += 1) {
      const angle = (index / 320) * Math.PI * 6 + time * 0.16;
      const radial = radius * (0.42 + 0.14 * Math.cos(angle * 3));
      const x = Math.cos(angle * 2) * radial;
      const y = Math.sin(angle * 2) * radial;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  } else {
    ellipse(context, 0, 0, radius * 0.47, radius * 0.47);
    for (let index = 0; index < 5; index += 1) {
      ellipse(context, 0, 0, radius * (0.62 + index * 0.09), radius * (0.18 + index * 0.045), -0.32 + index * 0.14);
    }
    for (let lane = -2; lane <= 2; lane += 1) {
      ellipse(context, 0, 0, radius * 0.47, radius * (0.11 + Math.abs(lane) * 0.055));
    }
  }

  context.globalAlpha = 1;
  context.fillStyle = "#ff4e68";
  context.beginPath();
  context.arc(0, 0, radius * (0.035 + Math.sin(time * 2) * 0.006), 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export function ProceduralEngineFallback({ project, motionEnabled }: ProceduralEngineFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = (timestamp = 0) => {
      const time = timestamp / 1000;
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const radius = Math.min(width, height) * 0.34;
      const graphite = project.surface === "light" ? "rgba(22,27,31,.34)" : "rgba(174,208,218,.30)";
      context.save();
      context.translate(centerX, centerY);

      context.strokeStyle = graphite;
      context.lineWidth = 1;
      [0.72, 0.83, 0.94].forEach((scale) => ellipse(context, 0, 0, radius * scale, radius * scale));

      const signals = ["#36d9ff", "#83f461", "#e9f350", "#ff4e68"];
      signals.forEach((color, index) => {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = index === 0 ? 4 : 3;
        const start = time * (motionEnabled ? 0.08 * (index % 2 ? -1 : 1) : 0) + index * 1.52;
        context.arc(0, 0, radius * (0.72 + index * 0.073), start, start + 0.72 + index * 0.09);
        context.stroke();
      });

      context.strokeStyle = graphite;
      context.lineWidth = 1;
      for (let index = 0; index < 64; index += 1) {
        const angle = (index / 64) * Math.PI * 2;
        const length = index % 8 === 0 ? radius * 0.075 : radius * 0.035;
        const inner = radius * 1.02;
        context.beginPath();
        context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        context.lineTo(Math.cos(angle) * (inner + length), Math.sin(angle) * (inner + length));
        context.stroke();
      }

      context.globalAlpha = 0.5;
      context.beginPath();
      context.moveTo(-radius * 1.08, 0);
      context.lineTo(radius * 1.08, 0);
      context.moveTo(0, -radius * 1.08);
      context.lineTo(0, radius * 1.08);
      context.stroke();
      context.globalAlpha = 1;

      drawCore(context, project, radius, time);
      context.restore();
      if (motionEnabled) animationFrame = window.requestAnimationFrame(render);
    };

    render();
    return () => {
      observer.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [motionEnabled, project]);

  return (
    <div className="procedural-engine-fallback" role="img" aria-label={`Desain prosedural ${project.name}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
