import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { experienceProjects, type ExperienceSurface } from "../data/experience";
import type { ProjectVisual } from "../types";

export interface CircularEngineCanvasProps {
  activeIndex: number;
  progressRef: MutableRefObject<number>;
  quality: "low" | "high";
  surface: ExperienceSurface;
  motionEnabled: boolean;
  ariaLabel: string;
  compact?: boolean;
}

const CYAN = "#36d9ff";
const GREEN = "#83f461";
const YELLOW = "#e9f350";
const RED = "#ff4e68";

function seededRandom(seed = 90210) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeShape(visual: ProjectVisual, count: number) {
  const positions = new Float32Array(count * 3);
  const random = seededRandom(visual.length * 1103 + count);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const t = index / count;
    let x = 0;
    let y = 0;
    let z = 0;

    if (visual === "book") {
      const side = index % 2 === 0 ? -1 : 1;
      const across = ((index * 29) % count) / count;
      const down = ((index * 73) % count) / count;
      x = side * (0.12 + across * 1.55);
      y = (down - 0.5) * 2.35;
      z = -0.58 * Math.pow(1 - across, 1.7) + Math.sin(down * Math.PI) * 0.12;
      y += Math.sin(across * Math.PI) * 0.16;
    } else if (visual === "cards") {
      const layer = index % 5;
      const angle = t * Math.PI * 10 + layer * 0.17;
      const radii = [1.48, 1.08, 1.62, 1.28, 0.92];
      const levels = [1.46, 0.73, 0.02, -0.76, -1.48];
      const jitter = (random() - 0.5) * 0.13;
      x = Math.cos(angle) * (radii[layer] + jitter);
      y = levels[layer] + Math.sin(angle * 2) * 0.045;
      z = Math.sin(angle) * (radii[layer] * 0.48);
    } else if (visual === "fitness") {
      const disc = index % 4;
      const angle = t * Math.PI * 18;
      if (index % 5 === 0) {
        x = (t - 0.5) * 3.45;
        y = Math.sin(t * Math.PI * 6) * 0.04;
        z = (random() - 0.5) * 0.08;
      } else {
        const side = index % 2 === 0 ? -1 : 1;
        const center = side * (1.04 + disc * 0.14);
        const radius = 0.38 + disc * 0.09;
        x = center + (random() - 0.5) * 0.16;
        y = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
      }
      const rotatedX = x * 0.92 - y * 0.38;
      y = x * 0.38 + y * 0.92;
      x = rotatedX;
    } else if (visual === "flower") {
      const angle = t * Math.PI * 2;
      const petal = 0.62 + Math.abs(Math.cos(angle * 5)) * 1.15;
      const lane = 0.82 + (index % 5) * 0.045;
      x = Math.cos(angle) * petal * lane;
      y = Math.sin(angle) * petal * lane;
      z = Math.sin(angle * 10) * 0.38 + (random() - 0.5) * 0.08;
    } else if (visual === "flow") {
      const angle = t * Math.PI * 6;
      const radial = 1.08 + 0.36 * Math.cos(angle * 3);
      x = radial * Math.cos(angle * 2);
      y = radial * Math.sin(angle * 2);
      z = 0.65 * Math.sin(angle * 3);
      const wave = (index % 7) * 0.025;
      x += Math.cos(angle) * wave;
      y += Math.sin(angle) * wave;
    } else {
      if (index % 3 === 0) {
        const phi = Math.acos(1 - 2 * ((index + 0.5) / count));
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        x = Math.cos(theta) * Math.sin(phi) * 1.12;
        y = Math.cos(phi) * 1.12;
        z = Math.sin(theta) * Math.sin(phi) * 1.12;
      } else {
        const orbit = index % 3;
        const angle = t * Math.PI * 14;
        const radius = 1.48 + orbit * 0.34;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius * (0.34 + orbit * 0.08);
        z = Math.sin(angle) * radius * 0.46 + (orbit - 1) * 0.18;
      }
    }

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
  }

  return positions;
}

function makeAmbientParticles(count: number) {
  const random = seededRandom(7474 + count);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 2.5 + random() * 1.7;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius;
    positions[index * 3 + 2] = (random() - 0.5) * 2.8;
  }
  return positions;
}

function MorphField({ progressRef, quality, surface, motionEnabled }: Pick<CircularEngineCanvasProps, "progressRef" | "quality" | "surface" | "motionEnabled">) {
  const count = quality === "low" ? 360 : 640;
  const shapes = useMemo(
    () => experienceProjects.map((project) => makeShape(project.visual, count)),
    [count],
  );
  const current = useMemo(() => shapes[0].slice(), [shapes]);
  const wireCurrent = useMemo(() => shapes[0].slice(), [shapes]);
  const pointGeometry = useRef<THREE.BufferGeometry>(null);
  const wireGeometry = useRef<THREE.BufferGeometry>(null);
  const group = useRef<THREE.Group>(null);
  const pointsMaterial = useRef<THREE.PointsMaterial>(null);
  const wireMaterial = useRef<THREE.LineBasicMaterial>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const fromColor = useMemo(() => new THREE.Color(), []);
  const toColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const raw = THREE.MathUtils.clamp(progressRef.current, 0, 1) * (shapes.length - 1);
    const fromIndex = Math.floor(raw);
    const toIndex = Math.min(shapes.length - 1, Math.ceil(raw));
    const localProgress = THREE.MathUtils.smootherstep(raw - fromIndex, 0, 1);
    const from = shapes[fromIndex];
    const to = shapes[toIndex];
    const response = 1 - Math.exp(-delta * 10);

    for (let index = 0; index < current.length; index += 1) {
      const target = THREE.MathUtils.lerp(from[index], to[index], localProgress);
      current[index] = THREE.MathUtils.lerp(current[index], target, response);
      wireCurrent[index] = current[index];
    }

    const pointAttribute = pointGeometry.current?.getAttribute("position") as THREE.BufferAttribute | undefined;
    const wireAttribute = wireGeometry.current?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (pointAttribute) pointAttribute.needsUpdate = true;
    if (wireAttribute) wireAttribute.needsUpdate = true;

    fromColor.set(experienceProjects[fromIndex].accent);
    toColor.set(experienceProjects[toIndex].accent);
    targetColor.copy(fromColor).lerp(toColor, localProgress);
    pointsMaterial.current?.color.lerp(targetColor, response);
    wireMaterial.current?.color.lerp(targetColor, response);

    if (group.current) {
      const pointerX = state.pointer.x * 0.12;
      const pointerY = state.pointer.y * 0.08;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointerX, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointerY, 0.04);
      if (motionEnabled) group.current.rotation.z += delta * 0.035;
      group.current.position.y = motionEnabled ? Math.sin(state.clock.elapsedTime * 0.62) * 0.045 : 0;
    }

    if (pulse.current) {
      const scale = motionEnabled ? 0.82 + Math.sin(state.clock.elapsedTime * 2.1) * 0.14 : 0.9;
      pulse.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry ref={pointGeometry}>
          <bufferAttribute attach="attributes-position" args={[current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMaterial}
          color={experienceProjects[0].accent}
          size={quality === "low" ? 0.032 : 0.025}
          transparent
          opacity={surface === "light" ? 0.8 : 0.92}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
          blending={surface === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={wireGeometry}>
          <bufferAttribute attach="attributes-position" args={[wireCurrent, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={wireMaterial}
          color={experienceProjects[0].accent}
          transparent
          opacity={surface === "light" ? 0.2 : 0.32}
          depthWrite={false}
          toneMapped={false}
          blending={surface === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>

      <mesh ref={pulse}>
        <icosahedronGeometry args={[0.18, 2]} />
        <meshBasicMaterial color={RED} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function AmbientField({ quality, surface, motionEnabled }: Pick<CircularEngineCanvasProps, "quality" | "surface" | "motionEnabled">) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => makeAmbientParticles(quality === "low" ? 90 : 180), [quality]);

  useFrame((_, delta) => {
    if (points.current && motionEnabled) points.current.rotation.z -= delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={surface === "light" ? "#20252a" : "#8af5ff"}
        size={quality === "low" ? 0.015 : 0.019}
        transparent
        opacity={surface === "light" ? 0.18 : 0.46}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function TechnicalFrame({ quality, surface, motionEnabled }: Pick<CircularEngineCanvasProps, "quality" | "surface" | "motionEnabled">) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const tickCount = quality === "low" ? 40 : 64;
  const graphite = surface === "light" ? "#24292d" : "#75909d";

  useFrame((_, delta) => {
    if (!motionEnabled) return;
    if (ringA.current) ringA.current.rotation.z += delta * 0.055;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.038;
    if (ringC.current) ringC.current.rotation.z += delta * 0.022;
  });

  return (
    <group>
      <mesh ref={ringA}>
        <torusGeometry args={[2.42, 0.012, 6, quality === "low" ? 88 : 148]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.24 : 0.42} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0, 0, 0.12]}>
        <torusGeometry args={[2.78, 0.007, 5, quality === "low" ? 96 : 164]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.14 : 0.27} depthWrite={false} />
      </mesh>
      <mesh ref={ringC} rotation={[0, 0, -0.08]}>
        <torusGeometry args={[3.12, 0.006, 5, quality === "low" ? 96 : 176]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.12 : 0.19} depthWrite={false} />
      </mesh>

      <mesh rotation={[0, 0, 0.18]}>
        <torusGeometry args={[2.42, 0.035, 8, 48, Math.PI * 0.52]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.93} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, 1.94]}>
        <torusGeometry args={[2.78, 0.025, 8, 36, Math.PI * 0.31]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, 3.68]}>
        <torusGeometry args={[3.12, 0.022, 8, 30, Math.PI * 0.25]} />
        <meshBasicMaterial color={YELLOW} transparent opacity={0.88} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, 5.28]}>
        <torusGeometry args={[2.78, 0.025, 8, 28, Math.PI * 0.22]} />
        <meshBasicMaterial color={RED} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>

      {Array.from({ length: tickCount }, (_, index) => {
        const angle = (index / tickCount) * Math.PI * 2;
        const major = index % 8 === 0;
        const radius = 3.35;
        return (
          <mesh
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
            key={index}
          >
            <boxGeometry args={[major ? 0.19 : 0.08, major ? 0.018 : 0.008, 0.008]} />
            <meshBasicMaterial color={graphite} transparent opacity={major ? 0.55 : 0.22} depthWrite={false} />
          </mesh>
        );
      })}

      <mesh>
        <boxGeometry args={[0.009, 6.55, 0.009]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.16 : 0.2} depthWrite={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[6.55, 0.009, 0.009]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.1 : 0.14} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene(props: CircularEngineCanvasProps) {
  const scene = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!scene.current) return;
    const pointerX = props.motionEnabled ? state.pointer.x * 0.035 : 0;
    const pointerY = props.motionEnabled ? state.pointer.y * 0.028 : 0;
    scene.current.rotation.y = THREE.MathUtils.lerp(scene.current.rotation.y, pointerX, 0.025);
    scene.current.rotation.x = THREE.MathUtils.lerp(scene.current.rotation.x, -pointerY, 0.025);
  });

  return (
    <group ref={scene} scale={props.compact ? 0.9 : 1}>
      <AmbientField quality={props.quality} surface={props.surface} motionEnabled={props.motionEnabled} />
      <TechnicalFrame quality={props.quality} surface={props.surface} motionEnabled={props.motionEnabled} />
      <MorphField
        progressRef={props.progressRef}
        quality={props.quality}
        surface={props.surface}
        motionEnabled={props.motionEnabled}
      />
    </group>
  );
}

export default function CircularEngineCanvas(props: CircularEngineCanvasProps) {
  return (
    <Canvas
      className="engine-canvas"
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      dpr={props.quality === "low" ? 1 : [1, 1.6]}
      camera={{ position: [0, 0, props.compact ? 8.6 : 7.9], fov: 45, near: 0.1, far: 30 }}
      gl={{
        alpha: true,
        antialias: props.quality === "high",
        powerPreference: props.quality === "high" ? "high-performance" : "low-power",
      }}
      frameloop={props.motionEnabled ? "always" : "demand"}
      performance={{ min: 0.55 }}
      role="img"
      aria-label={props.ariaLabel}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
        gl.setClearAlpha(0);
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
