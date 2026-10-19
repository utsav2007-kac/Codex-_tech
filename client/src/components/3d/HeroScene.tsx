import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Monogram & Orbiting Network Nodes
function NodeNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate deterministic network node positions
  const nodes = useMemo(() => {
    const list: [number, number, number][] = [];
    const radius = 1.85;
    const count = 12;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      list.push([
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ]);
    }
    return list;
  }, []);

  // Glowing connection lines
  const linesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    nodes.forEach((n1, idx) => {
      // Connect to center and nearest neighbors
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(...n1));
      if (idx > 0) {
        points.push(new THREE.Vector3(...nodes[idx - 1]));
        points.push(new THREE.Vector3(...n1));
      }
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle rotation + subtle mouse parallax
    groupRef.current.rotation.y = t * 0.22 + pointer.x * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.12 - pointer.y * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central CX Monogram Core */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        {/* Core Orange Node */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.85, 2]} />
          <meshStandardMaterial
            color="#F25C2A"
            roughness={0.15}
            metalness={0.8}
            emissive="#C2410C"
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* Inner Blue Geometric Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[1.2, 0.045, 16, 64]} />
          <meshStandardMaterial color="#1F6AA5" emissive="#1F6AA5" emissiveIntensity={0.7} />
        </mesh>
      </Float>

      {/* Orbiting Satellite Nodes */}
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#F25C2A' : '#38BDF8'}
            emissive={idx % 2 === 0 ? '#F25C2A' : '#1F6AA5'}
            emissiveIntensity={0.85}
          />
        </mesh>
      ))}

      {/* Glowing Connecting Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#38BDF8" transparent opacity={0.35} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// 2D SVG/CSS Fallback for reduced motion, mobile, or low-power WebGL absence
function FallbackScene() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-72 h-72 rounded-full border border-blue-600/30 animate-spin flex items-center justify-center [animation-duration:30s]">
        <div className="w-56 h-56 rounded-full border border-orange-500/40 animate-ping [animation-duration:4s]" />
      </div>
      <div className="absolute w-24 h-24 bg-gradient-to-tr from-orange-500 to-blue-600 rounded-2xl shadow-glow rotate-45 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/20 rounded-lg -rotate-45" />
      </div>
    </div>
  );
}

export const HeroScene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Check WebGL availability and reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }

    // Check small screen mobile performance
    if (window.innerWidth < 640) {
      setIsLowPower(true);
    }
  }, []);

  if (!hasWebGL || isLowPower) {
    return <FallbackScene />;
  }

  return (
    <div
      className="w-full h-[400px] sm:h-[480px] lg:h-[550px] relative overflow-visible"
      style={{
        maskImage: 'radial-gradient(circle at 50% 50%, black 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 70%, transparent 100%)',
      }}
    >
      <Suspense fallback={<FallbackScene />}>
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={1.2} color="#F25C2A" />
          <pointLight position={[5, -5, 5]} intensity={1.2} color="#1F6AA5" />
          <NodeNetwork />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 2.3} />
        </Canvas>
      </Suspense>
    </div>
  );
};
