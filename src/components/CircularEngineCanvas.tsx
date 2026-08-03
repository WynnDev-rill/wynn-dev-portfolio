import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ExperienceSurface } from "../data/experience";
import type { ProjectVisual } from "../types";

interface CanvasProps {
  visual: ProjectVisual;
  accent: string;
  accentSecondary: string;
  activeIndex: number;
  quality: "low" | "high";
  surface: ExperienceSurface;
}

const PETAL_ANGLES = Array.from({ length: 10 }, (_, index) => (index / 10) * Math.PI * 2);

function WireMaterial({
  color,
  surface,
  opacity = 0.38,
}: {
  color: string;
  surface: ExperienceSurface;
  opacity?: number;
}) {
  return (
    <meshStandardMaterial
      color={surface === "light" ? "#272a2d" : color}
      emissive={surface === "dark" ? color : "#000000"}
      emissiveIntensity={surface === "dark" ? 0.42 : 0}
      metalness={0.3}
      roughness={0.56}
      wireframe
      transparent
      opacity={opacity}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
}

function AccentMaterial({ color, surface, opacity = 0.9 }: { color: string; surface: ExperienceSurface; opacity?: number }) {
  return (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={surface === "light" ? Math.min(opacity, 0.82) : opacity}
      depthWrite={false}
      toneMapped={false}
      blending={surface === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
    />
  );
}

function MemoCardCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  const rings = [
    { y: 1.45, radius: 1.08, tube: 0.105 },
    { y: 0.72, radius: 0.88, tube: 0.095 },
    { y: 0.05, radius: 1.16, tube: 0.13 },
    { y: -0.72, radius: 1.02, tube: 0.105 },
    { y: -1.43, radius: 0.76, tube: 0.12 },
  ];
  return (
    <group rotation={[0.08, -0.18, -0.03]}>
      {rings.map((ring, index) => (
        <group position={[0, ring.y, 0]} key={ring.y}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, ring.tube, 10, 96]} />
            <WireMaterial color={index % 2 ? accentSecondary : accent} surface={surface} opacity={surface === "light" ? 0.28 : 0.5} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius + 0.2, 0.012, 5, 96]} />
            <AccentMaterial color={index === 0 ? "#246bff" : index === 3 ? "#ff603d" : index === 4 ? "#a8db00" : accent} surface={surface} opacity={index > 1 ? 0.58 : 0.9} />
          </mesh>
        </group>
      ))}
      <mesh>
        <cylinderGeometry args={[0.2, 0.28, 1.55, 20, 6]} />
        <WireMaterial color={accentSecondary} surface={surface} opacity={0.52} />
      </mesh>
      {[-0.86, -0.43, 0.43, 0.86].map((angle) => (
        <mesh position={[Math.cos(angle) * 0.86, 0.05, Math.sin(angle) * 0.86]} rotation={[0, -angle, 0]} key={angle}>
          <boxGeometry args={[0.34, 0.16, 0.2, 3, 2, 2]} />
          <WireMaterial color={accent} surface={surface} opacity={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function BookCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  return (
    <group rotation={[0.1, -0.15, -0.05]}>
      {[-0.55, -0.28, 0, 0.28, 0.55].map((y, index) => (
        <group position={[0, y, index * -0.08]} key={y}>
          <mesh position={[-0.48, 0, 0]} rotation={[0, 0.22, -0.04]}>
            <boxGeometry args={[0.9, 0.07, 1.25, 5, 1, 7]} />
            <WireMaterial color={accentSecondary} surface={surface} opacity={0.35 + index * 0.025} />
          </mesh>
          <mesh position={[0.48, 0, 0]} rotation={[0, -0.22, 0.04]}>
            <boxGeometry args={[0.9, 0.07, 1.25, 5, 1, 7]} />
            <WireMaterial color={accent} surface={surface} opacity={0.35 + index * 0.025} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[0.1, 1.5, 1.2]} />
        <AccentMaterial color={accent} surface={surface} opacity={0.7} />
      </mesh>
    </group>
  );
}

function FitnessCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  return (
    <group rotation={[0.28, -0.12, -0.34]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.085, 0.085, 2.6, 16, 4]} />
        <WireMaterial color={accentSecondary} surface={surface} opacity={0.6} />
      </mesh>
      {[-1.25, -0.95, -0.68, 0.68, 0.95, 1.25].map((x, index) => (
        <mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} key={x}>
          <cylinderGeometry args={[0.44 - (index % 3) * 0.06, 0.44 - (index % 3) * 0.06, 0.16, 24, 4]} />
          <WireMaterial color={index % 2 ? accent : accentSecondary} surface={surface} opacity={0.58} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.78, 0.035, 8, 72]} />
        <AccentMaterial color="#ff603d" surface={surface} opacity={0.9} />
      </mesh>
    </group>
  );
}

function FlowerCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  return (
    <group rotation={[0.12, -0.08, 0]}>
      {PETAL_ANGLES.map((angle, index) => (
        <mesh
          position={[Math.cos(angle) * (0.92 + (index % 2) * 0.12), Math.sin(angle) * (0.92 + (index % 2) * 0.12), (index % 2) * 0.16]}
          rotation={[0.18, 0.12, angle]}
          scale={[0.56, 0.9, 0.32]}
          key={angle}
        >
          <sphereGeometry args={[0.48, 18, 10]} />
          <WireMaterial color={index % 2 ? accent : accentSecondary} surface={surface} opacity={0.42} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.44, 2]} />
        <WireMaterial color={accent} surface={surface} opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.48, 0.018, 6, 96]} />
        <AccentMaterial color="#246bff" surface={surface} opacity={0.82} />
      </mesh>
    </group>
  );
}

function FlowCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  return (
    <group rotation={[0.18, -0.18, 0.16]}>
      <mesh>
        <torusKnotGeometry args={[0.86, 0.16, 144, 18, 2, 3]} />
        <WireMaterial color={accentSecondary} surface={surface} opacity={0.62} />
      </mesh>
      {[-1.3, -0.65, 0, 0.65, 1.3].map((y, index) => (
        <mesh position={[Math.sin(index * 1.4) * 0.32, y, 0.2]} key={y}>
          <sphereGeometry args={[0.12 + index * 0.018, 16, 10]} />
          <AccentMaterial color={index % 2 ? accent : accentSecondary} surface={surface} opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function PlanetCore({ accent, accentSecondary, surface }: Pick<CanvasProps, "accent" | "accentSecondary" | "surface">) {
  return (
    <group rotation={[0.18, -0.12, -0.18]}>
      <mesh>
        <icosahedronGeometry args={[1.05, 4]} />
        <WireMaterial color={accentSecondary} surface={surface} opacity={0.5} />
      </mesh>
      {[1.35, 1.68, 2.02].map((radius, index) => (
        <mesh rotation={[1.08 + index * 0.18, index * 0.22, 0]} key={radius}>
          <torusGeometry args={[radius, index === 1 ? 0.025 : 0.014, 6, 112]} />
          <AccentMaterial color={index === 1 ? accent : accentSecondary} surface={surface} opacity={0.76 - index * 0.13} />
        </mesh>
      ))}
      <mesh position={[1.38, 0.48, 0.18]}>
        <sphereGeometry args={[0.14, 16, 10]} />
        <AccentMaterial color="#b6f329" surface={surface} opacity={1} />
      </mesh>
    </group>
  );
}

function CenterObject({ visual, accent, accentSecondary, surface }: Pick<CanvasProps, "visual" | "accent" | "accentSecondary" | "surface">) {
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(0);

  useEffect(() => {
    reveal.current = 0;
  }, [visual]);

  useFrame((state, delta) => {
    if (!group.current) return;
    reveal.current = Math.min(1, reveal.current + delta * 2.1);
    const scale = THREE.MathUtils.smootherstep(reveal.current, 0, 1);
    group.current.scale.setScalar(scale);
    group.current.rotation.y += delta * 0.11;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.04;
  });

  let object;
  if (visual === "book") object = <BookCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;
  else if (visual === "fitness") object = <FitnessCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;
  else if (visual === "flower") object = <FlowerCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;
  else if (visual === "flow") object = <FlowCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;
  else if (visual === "planet") object = <PlanetCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;
  else object = <MemoCardCore accent={accent} accentSecondary={accentSecondary} surface={surface} />;

  return <group ref={group} key={visual}>{object}</group>;
}

function makeParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  let seed = 7183;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = 2.45 + random() * 2.25;
    const theta = random() * Math.PI * 2;
    positions[index * 3] = Math.cos(theta) * radius;
    positions[index * 3 + 1] = Math.sin(theta) * radius;
    positions[index * 3 + 2] = (random() - 0.5) * 2.8;
  }
  return positions;
}

function ParticleField({ accent, quality, surface }: Pick<CanvasProps, "accent" | "quality" | "surface">) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => makeParticlePositions(quality === "low" ? 90 : 220), [quality]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.z += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={surface === "light" ? "#34383d" : accent}
        size={surface === "light" ? 0.018 : 0.032}
        transparent
        opacity={surface === "light" ? 0.24 : 0.68}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function RadialTicks({ surface, accent, quality }: Pick<CanvasProps, "surface" | "accent" | "quality">) {
  const count = quality === "low" ? 44 : 76;
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const radius = 3.18;
        const major = index % 8 === 0;
        return (
          <mesh
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
            key={index}
          >
            <boxGeometry args={[major ? 0.17 : 0.075, major ? 0.018 : 0.009, 0.01]} />
            <meshBasicMaterial
              color={surface === "light" ? "#33373b" : accent}
              transparent
              opacity={major ? 0.5 : 0.22}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene({ visual, accent, accentSecondary, activeIndex, quality, surface }: CanvasProps) {
  const scene = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const updateScroll = () => { scrollPosition.current = window.scrollY; };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useFrame((state, delta) => {
    if (scene.current) {
      scene.current.rotation.x = THREE.MathUtils.lerp(scene.current.rotation.x, state.pointer.y * 0.075, 0.035);
      scene.current.rotation.y = THREE.MathUtils.lerp(scene.current.rotation.y, state.pointer.x * 0.09, 0.035);
      scene.current.rotation.z = THREE.MathUtils.lerp(scene.current.rotation.z, scrollPosition.current * 0.00008, 0.025);
    }
    if (ringA.current) ringA.current.rotation.z += delta * (0.08 + activeIndex * 0.004);
    if (ringB.current) ringB.current.rotation.z -= delta * 0.052;
    if (ringC.current) ringC.current.rotation.z += delta * 0.027;
  });

  const graphite = surface === "light" ? "#34383d" : accentSecondary;
  return (
    <group ref={scene} position={[0.42, 0, 0]}>
      <ambientLight intensity={surface === "light" ? 2.2 : 0.6} />
      <pointLight color={accent} position={[3.5, 3, 4]} intensity={surface === "light" ? 4 : 25} distance={10} />
      <pointLight color={accentSecondary} position={[-2.8, -2.2, 3]} intensity={surface === "light" ? 3 : 18} distance={9} />

      <ParticleField accent={accentSecondary} quality={quality} surface={surface} />
      <RadialTicks surface={surface} accent={accent} quality={quality} />

      <mesh ref={ringA}>
        <torusGeometry args={[2.54, 0.014, 6, quality === "low" ? 80 : 144]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.24 : 0.5} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.92, 0.009, 5, quality === "low" ? 80 : 160]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.14 : 0.3} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringC}>
        <torusGeometry args={[3.28, 0.006, 5, quality === "low" ? 80 : 160]} />
        <meshBasicMaterial color={graphite} transparent opacity={surface === "light" ? 0.12 : 0.2} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh rotation={[0, 0, 0.1]}>
        <torusGeometry args={[2.54, 0.035, 8, 38, Math.PI * 0.58]} />
        <AccentMaterial color={accent} surface={surface} opacity={0.9} />
      </mesh>
      <mesh rotation={[0, 0, 3.42]}>
        <torusGeometry args={[2.92, 0.026, 8, 28, Math.PI * 0.3]} />
        <AccentMaterial color="#ff603d" surface={surface} opacity={0.86} />
      </mesh>
      <mesh rotation={[0, 0, 5.18]}>
        <torusGeometry args={[3.28, 0.018, 8, 22, Math.PI * 0.22]} />
        <AccentMaterial color="#a8db00" surface={surface} opacity={0.84} />
      </mesh>

      <mesh>
        <cylinderGeometry args={[0.012, 0.012, 6.4, 8]} />
        <meshBasicMaterial color={graphite} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.009, 0.009, 6.4, 8]} />
        <meshBasicMaterial color={graphite} transparent opacity={0.13} depthWrite={false} />
      </mesh>

      <CenterObject visual={visual} accent={accent} accentSecondary={accentSecondary} surface={surface} />
    </group>
  );
}

export default function CircularEngineCanvas(props: CanvasProps) {
  return (
    <Canvas
      className="engine-canvas"
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      dpr={props.quality === "low" ? 1 : [1, 1.65]}
      camera={{ position: [0, 0, 8.2], fov: 42, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: props.quality === "high", powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = props.surface === "light" ? 1 : 1.2;
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
