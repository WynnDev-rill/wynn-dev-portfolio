import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ProjectVisual } from "../types";

interface CanvasProps {
  visual: ProjectVisual;
  accent: string;
  accentSecondary: string;
  activeIndex: number;
  quality: "low" | "high";
}

interface SceneProps extends CanvasProps {}

const PETAL_ANGLES = Array.from({ length: 8 }, (_, index) => (index / 8) * Math.PI * 2);

function CoreMaterial({ color, emissive = color }: { color: string; emissive?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.75}
      metalness={0.68}
      roughness={0.24}
    />
  );
}

function CenterObject({ visual, accent, accentSecondary }: Pick<CanvasProps, "visual" | "accent" | "accentSecondary">) {
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(0);

  useEffect(() => {
    reveal.current = 0;
  }, [visual]);

  useFrame((state, delta) => {
    if (!group.current) return;
    reveal.current = Math.min(1, reveal.current + delta * 2.8);
    const scale = THREE.MathUtils.smoothstep(reveal.current, 0, 1);
    group.current.scale.setScalar(scale);
    group.current.rotation.y += delta * 0.28;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
  });

  let object: React.ReactNode;

  switch (visual) {
    case "book":
      object = (
        <group rotation={[0.08, 0, 0]}>
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0.3, -0.05]}><boxGeometry args={[0.78, 1.12, 0.12]} /><CoreMaterial color={accentSecondary} emissive={accent} /></mesh>
          <mesh position={[0.42, 0, 0]} rotation={[0, -0.3, 0.05]}><boxGeometry args={[0.78, 1.12, 0.12]} /><CoreMaterial color={accentSecondary} emissive={accent} /></mesh>
          <mesh position={[0, -0.02, -0.12]}><boxGeometry args={[0.12, 1.08, 0.15]} /><CoreMaterial color={accent} /></mesh>
        </group>
      );
      break;
    case "fitness":
      object = (
        <group rotation={[0.2, 0.1, -0.35]}>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.12, 1.6, 20]} /><CoreMaterial color={accentSecondary} emissive={accent} /></mesh>
          {[-0.92, -0.68, 0.68, 0.92].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.34, 0.34, 0.22, 24]} /><CoreMaterial color={accent} /></mesh>
          ))}
        </group>
      );
      break;
    case "flower":
      object = (
        <group>
          {PETAL_ANGLES.map((angle) => (
            <mesh key={angle} position={[Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0]} scale={[0.45, 0.72, 0.3]}>
              <sphereGeometry args={[0.45, 18, 12]} />
              <CoreMaterial color={accentSecondary} emissive={accent} />
            </mesh>
          ))}
          <mesh><icosahedronGeometry args={[0.34, 2]} /><CoreMaterial color={accent} /></mesh>
        </group>
      );
      break;
    case "flow":
      object = <mesh rotation={[0.35, 0, 0.2]}><torusKnotGeometry args={[0.62, 0.19, 96, 12, 2, 3]} /><CoreMaterial color={accentSecondary} emissive={accent} /></mesh>;
      break;
    case "planet":
      object = (
        <group rotation={[0.2, 0.1, -0.2]}>
          <mesh><sphereGeometry args={[0.72, 32, 20]} /><CoreMaterial color={accentSecondary} emissive={accent} /></mesh>
          <mesh rotation={[1.25, 0.15, 0]}><torusGeometry args={[1.04, 0.055, 10, 96]} /><CoreMaterial color={accent} /></mesh>
          <mesh position={[0.5, 0.34, 0.52]}><sphereGeometry args={[0.12, 16, 10]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
        </group>
      );
      break;
    case "cards":
    default:
      object = (
        <group rotation={[0.15, -0.18, -0.12]}>
          {[
            { x: -0.26, y: 0.2, z: -0.25, r: -0.12 },
            { x: 0, y: 0, z: 0, r: 0 },
            { x: 0.26, y: -0.2, z: 0.25, r: 0.12 },
          ].map((card, index) => (
            <mesh key={index} position={[card.x, card.y, card.z]} rotation={[0, 0, card.r]}>
              <boxGeometry args={[0.95, 1.28, 0.1]} />
              <CoreMaterial color={index === 1 ? accentSecondary : accent} emissive={accent} />
            </mesh>
          ))}
        </group>
      );
  }

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
    const radius = 1.85 + random() * 1.9;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index * 3 + 2] = (random() - 0.5) * 2.4;
  }
  return positions;
}

function ParticleField({ accent, quality }: Pick<CanvasProps, "accent" | "quality">) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => makeParticlePositions(quality === "low" ? 70 : 180), [quality]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.z += delta * 0.018;
    points.current.rotation.y -= delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={accent} size={quality === "low" ? 0.028 : 0.035} transparent opacity={0.7} sizeAttenuation depthWrite={false} toneMapped={false} />
    </points>
  );
}

function Scene({ visual, accent, accentSecondary, activeIndex, quality }: SceneProps) {
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
    const time = state.clock.elapsedTime;
    if (scene.current) {
      scene.current.rotation.x = THREE.MathUtils.lerp(scene.current.rotation.x, state.pointer.y * 0.16, 0.04);
      scene.current.rotation.y = THREE.MathUtils.lerp(scene.current.rotation.y, state.pointer.x * 0.2, 0.04);
      scene.current.rotation.z = scrollPosition.current * 0.00013;
    }
    if (ringA.current) ringA.current.rotation.z += delta * (0.12 + activeIndex * 0.006);
    if (ringB.current) ringB.current.rotation.y -= delta * 0.09;
    if (ringC.current) ringC.current.rotation.x = time * 0.055 + Math.sin(time * 0.3) * 0.08;
  });

  return (
    <group ref={scene}>
      <ambientLight intensity={0.72} />
      <pointLight color={accent} position={[2.5, 2.8, 3]} intensity={22} distance={8} />
      <pointLight color={accentSecondary} position={[-2.5, -1.5, 2]} intensity={14} distance={7} />

      <ParticleField accent={accentSecondary} quality={quality} />
      <mesh ref={ringA} rotation={[0.18, 0.12, 0]}>
        <torusGeometry args={[1.48, 0.017, 8, quality === "low" ? 64 : 112]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[1.2, 0.2, 0.42]}>
        <torusGeometry args={[1.76, 0.012, 8, quality === "low" ? 64 : 112]} />
        <meshBasicMaterial color={accentSecondary} transparent opacity={0.46} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringC} rotation={[0.58, 1.1, 0]}>
        <torusGeometry args={[2.08, 0.009, 8, quality === "low" ? 64 : 112]} />
        <meshBasicMaterial color={accent} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.2, 0.42, 0]}>
        <icosahedronGeometry args={[2.23, quality === "low" ? 1 : 2]} />
        <meshBasicMaterial color={accentSecondary} wireframe transparent opacity={0.075} depthWrite={false} toneMapped={false} />
      </mesh>
      <CenterObject visual={visual} accent={accent} accentSecondary={accentSecondary} />
    </group>
  );
}

export default function CircularEngineCanvas(props: CanvasProps) {
  return (
    <Canvas
      className="engine-canvas"
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      dpr={props.quality === "low" ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 5.6], fov: 46, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: props.quality === "high", powerPreference: "high-performance" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
