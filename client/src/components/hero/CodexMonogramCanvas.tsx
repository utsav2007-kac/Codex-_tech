import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

function createCapsuleShape(length: number, width: number): THREE.Shape {
  const shape = new THREE.Shape();
  const radius = width / 2;
  const halfLen = (length - width) / 2;
  shape.absarc(0, halfLen, radius, 0, Math.PI, false);
  shape.absarc(0, -halfLen, radius, Math.PI, 2 * Math.PI, false);
  shape.closePath();
  return shape;
}

function createCShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerR = 1.35;
  const innerR = 0.85;
  const capR = (outerR - innerR) / 2;
  const midR = (outerR + innerR) / 2;

  const startAngle = (50 * Math.PI) / 180;
  const endAngle = (310 * Math.PI) / 180;

  shape.absarc(0, 0, outerR, startAngle, endAngle, false);
  const botCapCenterX = midR * Math.cos(endAngle);
  const botCapCenterY = midR * Math.sin(endAngle);
  shape.absarc(botCapCenterX, botCapCenterY, capR, endAngle, endAngle - Math.PI, true);
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);
  const topCapCenterX = midR * Math.cos(startAngle);
  const topCapCenterY = midR * Math.sin(startAngle);
  shape.absarc(topCapCenterX, topCapCenterY, capR, startAngle - Math.PI, startAngle, true);
  shape.closePath();
  return shape;
}

interface MonogramProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  activePulse: boolean;
  introDone: boolean;
  isMobile: boolean;
  throwAngle: React.MutableRefObject<{ x: number; y: number }>;
  throwVelocity: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  onFirstFrameRendered?: () => void;
}

function MonogramMesh({ mouse, activePulse, isMobile, throwAngle, throwVelocity, isDragging, onFirstFrameRendered }: MonogramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cRef = useRef<THREE.Mesh>(null);
  const scrollSmoothRef = useRef(0);
  const scrollTargetRef = useRef(0);
  const hasReportedFirstFrame = useRef(false);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 24,
    }),
    []
  );

  const cGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(createCShape(), extrudeSettings);
    geo.center();
    return geo;
  }, [extrudeSettings]);

  const xBarGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(createCapsuleShape(2.2, 0.42), extrudeSettings);
    geo.center();
    return geo;
  }, [extrudeSettings]);

  const orangeGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F15A34'),
        roughness: 0.10,
        metalness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        reflectivity: 0.95,
        ior: 1.38,
        emissive: new THREE.Color('#C2410C'),
        emissiveIntensity: activePulse ? 0.65 : 0.06,
      }),
    [activePulse]
  );

  const blueGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1F6AA5'),
        roughness: 0.10,
        metalness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        reflectivity: 0.95,
        ior: 1.38,
        emissive: new THREE.Color('#0A3A60'),
        emissiveIntensity: activePulse ? 0.65 : 0.06,
      }),
    [activePulse]
  );

  const headMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFFFFF'),
        roughness: 0.08,
        metalness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissive: new THREE.Color('#F15A34'),
        emissiveIntensity: activePulse ? 0.85 : 0.22,
      }),
    [activePulse]
  );

  const sparkNodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFFFF'),
        emissive: new THREE.Color('#DCEBFA'),
        emissiveIntensity: activePulse ? 1.4 : 0.85,
        roughness: 0.1,
      }),
    [activePulse]
  );

  useEffect(() => {
    return () => {
      cGeometry.dispose();
      xBarGeometry.dispose();
      orangeGlassMat.dispose();
      blueGlassMat.dispose();
      headMat.dispose();
      sparkNodeMat.dispose();
    };
  }, [cGeometry, xBarGeometry, orangeGlassMat, blueGlassMat, headMat, sparkNodeMat]);

  useEffect(() => {
    const handleScroll = () => {
      scrollTargetRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!hasReportedFirstFrame.current) {
      hasReportedFirstFrame.current = true;
      if (onFirstFrameRendered) {
        onFirstFrameRendered();
      }
    }
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const damp = 1 - Math.exp(-6.5 * Math.min(delta, 0.1));
    scrollSmoothRef.current += (scrollTargetRef.current - scrollSmoothRef.current) * damp;
    const s = scrollSmoothRef.current;

    // Hold exact rest pose (sway = 0, float = 0) during cross-fade window (first 1.5s)
    const motionWeight = Math.min(1, Math.max(0, (t - 1.5) / 1.2));

    const floatY = Math.sin(t * 1.15) * 0.08 * motionWeight;
    const floatZ = Math.cos(t * 0.90) * 0.05 * motionWeight;
    const swayYaw = Math.sin(t * 0.75) * 0.38 * motionWeight;
    const swayPitch = Math.sin(t * 0.95) * 0.12 * motionWeight;
    const swayRoll = Math.cos(t * 0.65) * 0.04 * motionWeight;

    const targetMouseYaw = isMobile ? 0 : (mouse.current.x - 0.5) * 0.22 * motionWeight;
    const targetMousePitch = isMobile ? 0 : -(mouse.current.y - 0.5) * 0.15 * motionWeight;

    const scrollYaw = s * 0.0045;
    const scrollPitch = Math.sin(s * 0.0022) * 0.15;
    const scrollRoll = s === 0 ? 0 : Math.sin(s * 0.0018) * 0.08;
    const scrollDepthZ = Math.sin(s * 0.0015) * 0.25;
    const scrollParallaxY = -Math.min(s * 0.0012, 0.9);

    if (!isDragging.current) {
      const speed = Math.hypot(throwVelocity.current.x, throwVelocity.current.y);
      if (speed > 0.002) {
        throwAngle.current.y += throwVelocity.current.x;
        throwAngle.current.x += throwVelocity.current.y;
        throwAngle.current.x = Math.max(-0.50, Math.min(0.50, throwAngle.current.x));
        throwVelocity.current.x *= 0.92;
        throwVelocity.current.y *= 0.92;
      } else {
        throwVelocity.current.x = 0;
        throwVelocity.current.y = 0;
        throwAngle.current.y =
          ((((throwAngle.current.y + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
        const returnDamp = 1 - Math.exp(-5.5 * Math.min(delta, 0.1));
        throwAngle.current.x += (0 - throwAngle.current.x) * returnDamp;
        throwAngle.current.y += (0 - throwAngle.current.y) * returnDamp;
        if (Math.abs(throwAngle.current.x) < 0.0005) throwAngle.current.x = 0;
        if (Math.abs(throwAngle.current.y) < 0.0005) throwAngle.current.y = 0;
      }
    } else {
      throwAngle.current.x = Math.max(-0.50, Math.min(0.50, throwAngle.current.x));
    }

    groupRef.current.position.y = floatY + scrollParallaxY;
    groupRef.current.position.z = floatZ + scrollDepthZ;
    groupRef.current.rotation.y = swayYaw + targetMouseYaw + scrollYaw + throwAngle.current.y;
    groupRef.current.rotation.x = swayPitch + targetMousePitch + scrollPitch + throwAngle.current.x;
    groupRef.current.rotation.z = swayRoll + scrollRoll;

    if (sparkNodeMat) {
      sparkNodeMat.emissiveIntensity = 0.85 + Math.sin(t * 3.2) * 0.45 * motionWeight;
    }
    if (cRef.current) {
      cRef.current.rotation.z = Math.sin(t * 1.1) * 0.03 * motionWeight;
    }
  });

  const baseScale = isMobile ? 0.62 : 0.80;

  return (
    <group ref={groupRef} position={[-0.05, 0, 0]} scale={baseScale}>
      <mesh ref={cRef} geometry={cGeometry} material={orangeGlassMat} position={[-0.72, 0, 0]} />
      <mesh
        geometry={xBarGeometry}
        material={orangeGlassMat}
        position={[0.55, 0.06, 0.04]}
        rotation={[0, 0, THREE.MathUtils.degToRad(-38)]}
      />
      <mesh
        geometry={xBarGeometry}
        material={blueGlassMat}
        position={[0.55, 0.06, -0.04]}
        rotation={[0, 0, THREE.MathUtils.degToRad(38)]}
      />
      <mesh material={headMat} position={[0.62, 1.44, 0.02]}>
        <sphereGeometry args={[0.29, 24, 24]} />
      </mesh>
      <mesh material={sparkNodeMat} position={[0.55, 0.06, 0.22]}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
    </group>
  );
}

export interface CodexMonogramCanvasProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  activePulse: boolean;
  introDone: boolean;
  isMobile: boolean;
  throwAngle: React.MutableRefObject<{ x: number; y: number }>;
  throwVelocity: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  onFirstFrameRendered?: () => void;
}

export const CodexMonogramCanvas: React.FC<CodexMonogramCanvasProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 12], fov: 30 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl, scene, camera }) => {
        // Pre-compile shaders immediately to prevent any frame drops or long tasks
        gl.compile(scene, camera);
      }}
      className="w-full h-full pointer-events-none"
    >
      <directionalLight position={[4, 6, 6]} intensity={1.2} color="#ffffff" />
      <ambientLight intensity={0.4} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.5} position={[0, 6, 2]} scale={[8, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3.0} position={[5, 1, 3]} scale={[2, 6, 1]} color="#F15A34" />
        <Lightformer form="rect" intensity={2.6} position={[-5, -1, 3]} scale={[2, 6, 1]} color="#1F6AA5" />
        <Lightformer form="circle" intensity={1.8} position={[0, 0, -4]} scale={[4, 4, 1]} color="#DCEBFA" />
      </Environment>

      <MonogramMesh {...props} />
    </Canvas>
  );
};

export default CodexMonogramCanvas;
