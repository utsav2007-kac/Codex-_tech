import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Code2, Sparkles, Terminal } from 'lucide-react';

// ── 3D MONOGRAM GEOMETRY BUILDERS ─────────────────────────────────────────────

// Helper: 2D Capsule shape
function createCapsuleShape(length: number, width: number): THREE.Shape {
  const shape = new THREE.Shape();
  const radius = width / 2;
  const halfLen = (length - width) / 2;

  shape.absarc(0, halfLen, radius, 0, Math.PI, false);
  shape.absarc(0, -halfLen, radius, Math.PI, 2 * Math.PI, false);
  shape.closePath();
  return shape;
}

// Helper: 2D "C" Arc Shape with rounded end caps
function createCShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerR = 1.35;
  const innerR = 0.85;
  const capR = (outerR - innerR) / 2;
  const midR = (outerR + innerR) / 2;

  // 260 degree arc with opening on right
  const startAngle = (50 * Math.PI) / 180;
  const endAngle = (310 * Math.PI) / 180;

  // Outer Arc counter-clockwise from start to end
  shape.absarc(0, 0, outerR, startAngle, endAngle, false);

  // Bottom rounded cap connecting outer to inner
  const botCapCenterX = midR * Math.cos(endAngle);
  const botCapCenterY = midR * Math.sin(endAngle);
  shape.absarc(botCapCenterX, botCapCenterY, capR, endAngle, endAngle - Math.PI, true);

  // Inner Arc clockwise from end back to start
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);

  // Top rounded cap connecting inner to outer
  const topCapCenterX = midR * Math.cos(startAngle);
  const topCapCenterY = midR * Math.sin(startAngle);
  shape.absarc(topCapCenterX, topCapCenterY, capR, startAngle - Math.PI, startAngle, true);

  shape.closePath();
  return shape;
}

// ── 3D MONOGRAM MESH ASSEMBLY ─────────────────────────────────────────────────

interface MonogramProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  activePulse: boolean;
  introDone: boolean;
  isMobile: boolean;
  throwAngle: React.MutableRefObject<{ x: number; y: number }>;
  throwVelocity: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
}

function MonogramMesh({ mouse, activePulse, isMobile, throwAngle, throwVelocity, isDragging }: MonogramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cRef = useRef<THREE.Mesh>(null);
  const scrollSmoothRef = useRef(0);
  const scrollTargetRef = useRef(0);

  // Extrude configuration
  const extrudeSettings = useMemo(
    () => ({
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 32,
    }),
    []
  );

  // Geometries
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

  // Materials with Glossy Clearcoat & High Reflectivity
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

  // Passive window scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      scrollTargetRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Frame-rate independent exponential smoothing (lerp) for scroll position
    const damp = 1 - Math.exp(-6.5 * Math.min(delta, 0.1));
    scrollSmoothRef.current += (scrollTargetRef.current - scrollSmoothRef.current) * damp;
    const s = scrollSmoothRef.current;

    // ── PROPER 3D DYNAMIC FLOATING & ROTATION ──
    // 1. Organic 3D Float on Y & Z
    const floatY = Math.sin(t * 1.15) * 0.08;
    const floatZ = Math.cos(t * 0.90) * 0.05;

    // 2. Continuous 3D Gyroscopic Tourbillon Sway:
    // Symmetrical periodic rotation around Y (swings smoothly +/- 22 deg = 0.38 rad, centered around 0 upright baseline)
    const swayYaw = Math.sin(t * 0.75) * 0.38;
    // Gentle breathing pitch tilt around X (shows off top bevels & sphere head)
    const swayPitch = Math.sin(t * 0.95) * 0.12;
    // Delicate gyroscopic roll around Z
    const swayRoll = Math.cos(t * 0.65) * 0.04;

    // Mouse parallax (desktop only, subtle follow)
    const targetMouseYaw = isMobile ? 0 : (mouse.current.x - 0.5) * 0.22;
    const targetMousePitch = isMobile ? 0 : -(mouse.current.y - 0.5) * 0.15;

    // ── SCROLL ROTATION & 3D DYNAMICS ──
    const scrollYaw = s * 0.0045;
    const scrollPitch = Math.sin(s * 0.0022) * 0.15;
    const scrollRoll = s === 0 ? 0 : Math.sin(s * 0.0018) * 0.08;
    const scrollDepthZ = Math.sin(s * 0.0015) * 0.25;
    const scrollParallaxY = -Math.min(s * 0.0012, 0.9);

    // ── CURSOR THROW INERTIA & AUTO-RETURN TO ACTUAL POSITION ──
    if (!isDragging.current) {
      const speed = Math.hypot(throwVelocity.current.x, throwVelocity.current.y);
      if (speed > 0.002) {
        throwAngle.current.y += throwVelocity.current.x;
        throwAngle.current.x += throwVelocity.current.y;
        throwAngle.current.x = Math.max(-0.50, Math.min(0.50, throwAngle.current.x));
        throwVelocity.current.x *= 0.92;
        throwVelocity.current.y *= 0.92;
      } else {
        // Zero out residual velocity
        throwVelocity.current.x = 0;
        throwVelocity.current.y = 0;

        // Wrap Y angle to [-PI, PI] to prevent redundant multi-rotation unwinding
        throwAngle.current.y =
          ((((throwAngle.current.y + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

        // Smooth spring-back damp to the actual front-facing upright baseline (0, 0)
        const returnDamp = 1 - Math.exp(-5.5 * Math.min(delta, 0.1));
        throwAngle.current.x += (0 - throwAngle.current.x) * returnDamp;
        throwAngle.current.y += (0 - throwAngle.current.y) * returnDamp;

        if (Math.abs(throwAngle.current.x) < 0.0005) throwAngle.current.x = 0;
        if (Math.abs(throwAngle.current.y) < 0.0005) throwAngle.current.y = 0;
      }
    } else {
      // While dragging, keep pitch clamped within natural upright view cone
      throwAngle.current.x = Math.max(-0.50, Math.min(0.50, throwAngle.current.x));
    }

    // Apply combined transforms to the group
    groupRef.current.position.y = floatY + scrollParallaxY;
    groupRef.current.position.z = floatZ + scrollDepthZ;
    groupRef.current.rotation.y = swayYaw + targetMouseYaw + scrollYaw + throwAngle.current.y;
    groupRef.current.rotation.x = swayPitch + targetMousePitch + scrollPitch + throwAngle.current.x;
    groupRef.current.rotation.z = swayRoll + scrollRoll;

    // Spark node breathing pulse
    if (sparkNodeMat) {
      sparkNodeMat.emissiveIntensity = 0.85 + Math.sin(t * 3.2) * 0.45;
    }

    // Subtle organic flex on the C arc
    if (cRef.current) {
      cRef.current.rotation.z = Math.sin(t * 1.1) * 0.03;
    }
  });

  // Balanced scale: leaves central focal zone completely open for the 4 surrounding cards
  const baseScale = isMobile ? 0.62 : 0.80;

  return (
    <group ref={groupRef} position={[-0.05, 0, 0]} scale={baseScale}>
      {/* 1. C Shape (Orange, Embracing from Left) */}
      <mesh
        ref={cRef}
        geometry={cGeometry}
        material={orangeGlassMat}
        position={[-0.72, 0, 0]}
      />

      {/* 2. X Left Bar (Orange, runs lower-left to upper-right, +38deg) */}
      <mesh
        geometry={xBarGeometry}
        material={orangeGlassMat}
        position={[0.55, 0.06, 0.04]}
        rotation={[0, 0, THREE.MathUtils.degToRad(-38)]}
      />

      {/* 3. X Right Bar (Blue, runs upper-left to lower-right, -38deg) */}
      <mesh
        geometry={xBarGeometry}
        material={blueGlassMat}
        position={[0.55, 0.06, -0.04]}
        rotation={[0, 0, THREE.MathUtils.degToRad(38)]}
      />

      {/* 4. Person Head (White sphere above X with orange rim) */}
      <mesh
        material={headMat}
        position={[0.62, 1.44, 0.02]}
      >
        <sphereGeometry args={[0.29, 32, 32]} />
      </mesh>

      {/* 5. Center Intersection Spark Node */}
      <mesh
        material={sparkNodeMat}
        position={[0.55, 0.06, 0.22]}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
    </group>
  );
}

// ── STATIC FALLBACK (Clean SVG Vector) ─────────────────────────────────────────
function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        className="w-48 h-48 drop-shadow-[0_18px_40px_rgba(31,106,165,0.18)]"
        fill="none"
      >
        <path
          d="M 52 14 C 28 14 12 30 12 50 C 12 70 28 86 52 86 C 63 86 72 81 77 74"
          stroke="#F15A34"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="64" cy="22" r="8.5" fill="#FFFFFF" stroke="#F15A34" strokeWidth="2.5" />
        <path d="M 46 72 L 82 36" stroke="#F15A34" strokeWidth="9" strokeLinecap="round" />
        <path d="M 48 38 L 80 72" stroke="#1F6AA5" strokeWidth="9" strokeLinecap="round" />
        <circle cx="64" cy="54" r="3.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// ── FOUR BALANCED JOB CARDS DATA (4 QUADRANTS) ─────────────────────────────────
const jobCardsData = [
  {
    id: 'mobile-lead',
    role: 'Mobile iOS & Android Lead',
    stack: 'React Native · Swift · Kotlin',
    badge: '98% Match',
    salary: '$155,000 / yr',
    icon: Smartphone,
    accentBorder: 'border-orange-200/80',
    iconBg: 'bg-orange-50 border border-orange-200/80 text-[#F15A34]',
    badgeBg: 'bg-orange-50 text-orange-700 border border-orange-200/80',
    salaryColor: 'text-orange-600',
    activeGlow: 'ring-2 ring-[#F15A34]/50 shadow-[0_18px_45px_rgba(241,90,52,0.22)]',
  },
  {
    id: 'fullstack-dev',
    role: 'Full Stack Engineer',
    stack: 'React · TypeScript · Node.js',
    badge: 'Urgent Hire',
    salary: '$156,000 / yr',
    icon: Code2,
    accentBorder: 'border-blue-200/90',
    iconBg: 'bg-blue-50 border border-blue-200/80 text-[#1F6AA5]',
    badgeBg: 'bg-blue-50 text-[#1F6AA5] border border-blue-200/80',
    salaryColor: 'text-[#1F6AA5]',
    activeGlow: 'ring-2 ring-[#1F6AA5]/50 shadow-[0_18px_45px_rgba(31,106,165,0.24)]',
  },
  {
    id: 'python-dev',
    role: 'Python Developer',
    stack: 'FastAPI · Django · PostgreSQL',
    badge: 'Top Offer',
    salary: '$148,000 / yr',
    icon: Terminal,
    accentBorder: 'border-indigo-200/80',
    iconBg: 'bg-indigo-50 border border-indigo-200/80 text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    salaryColor: 'text-indigo-600',
    activeGlow: 'ring-2 ring-indigo-500/50 shadow-[0_18px_45px_rgba(99,102,241,0.22)]',
  },
  {
    id: 'ai-ml-engineer',
    role: 'AI / ML Engineer',
    stack: 'PyTorch · GenAI · LLMs',
    badge: '99% Match',
    salary: '$178,000 / yr',
    icon: Sparkles,
    accentBorder: 'border-emerald-200/80',
    iconBg: 'bg-emerald-50 border border-emerald-200/80 text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    salaryColor: 'text-emerald-600',
    activeGlow: 'ring-2 ring-emerald-500/50 shadow-[0_18px_45px_rgba(16,185,129,0.22)]',
  },
];

// ── MAIN EXPORT: CODEX MONOGRAM STAGE ─────────────────────────────────────────
export const CodexMonogramStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [activePulse, setActivePulse] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Check WebGL, Screen Size and Motion Preferences
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const timer = setTimeout(() => setIntroDone(true), 1200);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Smooth scroll listener for stage elements (orbits, hairlines)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cohesive rhythmic synchronization: cycles 0 -> 1 -> 3 -> 2 (clockwise constellation)
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setActiveCardIdx((prev) => (prev + 1) % 4);
      setActivePulse(true);
      const pulseTimeout = setTimeout(() => setActivePulse(false), 550);
      return () => clearTimeout(pulseTimeout);
    }, 3000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Cursor Throw & Drag Physics State
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const throwAngleRef = useRef({ x: 0, y: 0 });
  const throwVelocityRef = useRef({ x: 0, y: 0 });

  // Cursor Throw & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    throwVelocityRef.current = { x: 0, y: 0 };
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;

    if (!isDraggingRef.current) {
      if (isMobile || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      mouseRef.current = { x: nx, y: ny };
      return;
    }

    // Interactive Drag Rotation
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    throwAngleRef.current.y += dx * 0.012;
    throwAngleRef.current.x = Math.max(-0.50, Math.min(0.50, throwAngleRef.current.x - dy * 0.008));

    // Throw velocity momentum (spin throw)
    if (dt < 70) {
      throwVelocityRef.current = {
        x: Math.max(-0.20, Math.min(0.20, (dx / dt) * 0.15)),
        y: Math.max(-0.10, Math.min(0.10, -(dy / dt) * 0.09)),
      };
    } else {
      throwVelocityRef.current = { x: 0, y: 0 };
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (performance.now() - lastPointerRef.current.time > 70) {
      throwVelocityRef.current = { x: 0, y: 0 };
    }
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      mouseRef.current = { x: 0.5, y: 0.5 };
    }
  };

  const card1 = jobCardsData[0]; // Mobile iOS & Android (Top-Left)
  const card2 = jobCardsData[1]; // Full Stack Engineer (Top-Right)
  const card3 = jobCardsData[2]; // Python Developer (Bottom-Left - RED CIRCLE)
  const card4 = jobCardsData[3]; // AI / ML Engineer (Bottom-Right)

  return (
    <div className="w-full flex flex-col items-center select-none overflow-visible">
      {/* ── DESKTOP & TABLET STAGE (Interactive 3D + 4 Floating Orbit Cards) ── */}
      <div
        ref={containerRef}
        data-hero-scene="codex-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[620px] h-[340px] sm:h-[490px] lg:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible"
        aria-label="Codex Tech-IT 3D Glass Monogram Stage"
      >
        {/* ── B. LIGHT WASH (Feathered radial background glows) ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden -z-20"
          style={{
            maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
          }}
        >
          {/* Soft Blue #DCEBFA (lower left) */}
          <div
            className="absolute bottom-[6%] left-[4%] w-[380px] h-[380px] rounded-full filter blur-[80px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(220, 235, 250, 0.72) 0%, transparent 70%)',
            }}
          />
          {/* Soft Orange #F15A34 (upper right) */}
          <div
            className="absolute -top-[4%] right-[2%] w-[360px] h-[360px] rounded-full filter blur-[75px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(241, 90, 52, 0.10) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* ── C. HAIRLINE ORBITS & MOVING PARTICLES (Behind monogram, desktop & tablet) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-10 hidden sm:block"
          viewBox="0 0 620 550"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbit 1: Inner Ellipse (tilted -15deg) */}
          <g transform={`translate(310, 265) rotate(${-15 + (reducedMotion ? 0 : scrollY * 0.04)})`}>
            <ellipse
              rx="175"
              ry="88"
              stroke="#1F6AA5"
              strokeWidth="1"
              strokeOpacity="0.20"
              strokeDasharray="4 6"
            />
            {!reducedMotion && (
              <circle cx="175" cy="0" r="3.5" fill="#F15A34" opacity={activeCardIdx === 0 ? 1 : 0.75}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="48s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>

          {/* Orbit 2: Middle Ellipse (tilted +22deg) */}
          <g transform={`translate(310, 265) rotate(${22 - (reducedMotion ? 0 : scrollY * 0.03)})`}>
            <ellipse
              rx="215"
              ry="112"
              stroke="#1F6AA5"
              strokeWidth="1"
              strokeOpacity="0.16"
            />
            {!reducedMotion && (
              <circle cx="-215" cy="0" r="3.5" fill="#1F6AA5" opacity={activeCardIdx === 1 ? 1 : 0.75}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="-360"
                  dur="68s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>

          {/* Orbit 3: Outer Ellipse (tilted -30deg) */}
          <g transform={`translate(310, 265) rotate(${-30 + (reducedMotion ? 0 : scrollY * 0.025)})`}>
            <ellipse
              rx="248"
              ry="128"
              stroke="#1F6AA5"
              strokeWidth="1"
              strokeOpacity="0.12"
            />
            {!reducedMotion && (
              <circle cx="0" cy="128" r="3.5" fill="#10B981" opacity={activeCardIdx === 3 ? 1 : 0.75}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="88s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        </svg>

        {/* ── A. THE CENTRAL 3D MONOGRAM CANVAS ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {hasWebGL && !reducedMotion ? (
            <Suspense fallback={<StaticFallback />}>
              <Canvas
                camera={{ position: [0, 0.15, 12], fov: 30 }}
                dpr={[1, 1.5]}
                gl={{
                  antialias: true,
                  alpha: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.0,
                  powerPreference: 'high-performance',
                }}
                className="w-full h-full pointer-events-none"
              >
                {/* Key Directional Light */}
                <directionalLight position={[4, 6, 6]} intensity={1.2} color="#ffffff" />
                <ambientLight intensity={0.4} />

                {/* Reflection Studio Environment */}
                <Environment resolution={256}>
                  <Lightformer form="rect" intensity={2.5} position={[0, 6, 2]} scale={[8, 4, 1]} color="#ffffff" />
                  <Lightformer form="rect" intensity={3.0} position={[5, 1, 3]} scale={[2, 6, 1]} color="#F15A34" />
                  <Lightformer form="rect" intensity={2.6} position={[-5, -1, 3]} scale={[2, 6, 1]} color="#1F6AA5" />
                  <Lightformer form="circle" intensity={1.8} position={[0, 0, -4]} scale={[4, 4, 1]} color="#DCEBFA" />
                </Environment>

                {/* 3D Monogram Mesh with Cursor Throw Inertia */}
                <MonogramMesh
                  mouse={mouseRef}
                  activePulse={activePulse}
                  introDone={introDone}
                  isMobile={isMobile}
                  throwAngle={throwAngleRef}
                  throwVelocity={throwVelocityRef}
                  isDragging={isDraggingRef}
                />

                {/* Soft Grounding Contact Shadow */}
                <ContactShadows
                  position={[-0.05, -1.8, 0]}
                  opacity={0.22}
                  blur={2.8}
                  far={3}
                  color="#1F6AA5"
                />
              </Canvas>
            </Suspense>
          ) : (
            <StaticFallback />
          )}
        </div>

        {/* ── D. CONNECTING HAIRLINES (Stop cleanly at orbit perimeters) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible hidden sm:block"
          viewBox="0 0 620 550"
          fill="none"
        >
          <defs>
            <linearGradient id="lineGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F15A34" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1F6AA5" stopOpacity="0.30" />
            </linearGradient>
            <linearGradient id="lineGradFullstack" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F6AA5" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1F6AA5" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="lineGradPython" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1F6AA5" stopOpacity="0.30" />
            </linearGradient>
            <linearGradient id="lineGradAI" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1F6AA5" stopOpacity="0.30" />
            </linearGradient>
          </defs>

          {/* Line 1: Upper-Left (Mobile Card) to Orbit 1 */}
          <line
            x1="200"
            y1="75"
            x2="232"
            y2="148"
            stroke="url(#lineGradMobile)"
            strokeWidth="1.2"
            strokeOpacity={activeCardIdx === 0 ? 0.9 : 0.28}
            strokeDasharray={activeCardIdx === 0 ? 'none' : '3 4'}
          />
          <circle cx="232" cy="148" r="3" fill="#F15A34" opacity={activeCardIdx === 0 ? 1 : 0.45} />

          {/* Line 2: Upper-Right (Full Stack Card) to Orbit 2 */}
          <line
            x1="418"
            y1="82"
            x2="388"
            y2="148"
            stroke="url(#lineGradFullstack)"
            strokeWidth="1.2"
            strokeOpacity={activeCardIdx === 1 ? 0.9 : 0.28}
            strokeDasharray={activeCardIdx === 1 ? 'none' : '3 4'}
          />
          <circle cx="388" cy="148" r="3" fill="#1F6AA5" opacity={activeCardIdx === 1 ? 1 : 0.45} />

          {/* Line 3: Lower-Left (Python Dev Card - RED CIRCLE) to Orbit 1 */}
          <line
            x1="205"
            y1="462"
            x2="232"
            y2="388"
            stroke="url(#lineGradPython)"
            strokeWidth="1.2"
            strokeOpacity={activeCardIdx === 2 ? 0.9 : 0.28}
            strokeDasharray={activeCardIdx === 2 ? 'none' : '3 4'}
          />
          <circle cx="232" cy="388" r="3" fill="#6366F1" opacity={activeCardIdx === 2 ? 1 : 0.45} />

          {/* Line 4: Lower-Right (AI/ML Card) to Orbit 3 */}
          <line
            x1="405"
            y1="462"
            x2="382"
            y2="388"
            stroke="url(#lineGradAI)"
            strokeWidth="1.2"
            strokeOpacity={activeCardIdx === 3 ? 0.9 : 0.28}
            strokeDasharray={activeCardIdx === 3 ? 'none' : '3 4'}
          />
          <circle cx="382" cy="388" r="3" fill="#10B981" opacity={activeCardIdx === 3 ? 1 : 0.45} />
        </svg>

        {/* ── 1. JOB CARD 1: MOBILE IOS & ANDROID (Upper-Left Area) ── */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: activeCardIdx === 0 ? 1.03 : 1.0,
            y: reducedMotion ? 0 : [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.15 },
            scale: { duration: 0.35, ease: 'easeOut' },
            y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={`absolute top-3 sm:top-5 left-1 sm:left-2 lg:-left-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(31,106,165,0.08)] transition-all duration-300 hidden sm:flex ${
            activeCardIdx === 0 ? card1.activeGlow : 'hover:shadow-[0_18px_40px_rgba(31,106,165,0.15)]'
          }`}
          aria-label={`${card1.role} job opportunity`}
        >
          <div className={`w-9 h-9 rounded-xl ${card1.iconBg} flex items-center justify-center shrink-0`}>
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="font-heading font-bold text-[12.5px] text-[#0B1B2E] truncate">
                {card1.role}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${card1.badgeBg} shrink-0`}>
                {card1.badge}
              </span>
            </div>
            <div className="font-sans font-medium text-[11px] text-slate-500 truncate flex items-center justify-between">
              <span className="truncate">{card1.stack}</span>
              <span className={`font-numbers font-bold text-[11px] ${card1.salaryColor} ml-1.5 shrink-0`}>
                {card1.salary}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── 2. JOB CARD 2: FULL STACK ENGINEER (Upper-Right Area) ── */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: activeCardIdx === 1 ? 1.03 : 1.0,
            y: reducedMotion ? 0 : [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.30 },
            scale: { duration: 0.35, ease: 'easeOut' },
            y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
          className={`absolute top-5 sm:top-7 right-1 sm:right-2 lg:-right-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border ${card2.accentBorder} shadow-[0_16px_40px_rgba(31,106,165,0.12)] transition-all duration-300 hidden sm:flex ${
            activeCardIdx === 1 ? card2.activeGlow : 'hover:shadow-[0_20px_45px_rgba(31,106,165,0.20)]'
          }`}
          aria-label={`${card2.role} job opportunity`}
        >
          <div className={`w-9 h-9 rounded-xl ${card2.iconBg} flex items-center justify-center shrink-0`}>
            <Code2 className="w-4 h-4" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="font-heading font-bold text-[12.5px] text-[#0B1B2E] truncate">
                {card2.role}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${card2.badgeBg} shrink-0`}>
                {card2.badge}
              </span>
            </div>
            <div className="font-sans font-medium text-[11px] text-slate-500 truncate flex items-center justify-between">
              <span className="truncate">{card2.stack}</span>
              <span className={`font-numbers font-bold text-[11px] ${card2.salaryColor} ml-1.5 shrink-0`}>
                {card2.salary}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── 3. JOB CARD 3: PYTHON DEVELOPER (Lower-Left Area - RED CIRCLE AREA) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: activeCardIdx === 2 ? 1.03 : 1.0,
            y: reducedMotion ? 0 : [0, -7, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.45 },
            scale: { duration: 0.35, ease: 'easeOut' },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
          }}
          className={`absolute bottom-4 sm:bottom-6 left-1 sm:left-2 lg:-left-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(99,102,241,0.08)] transition-all duration-300 hidden sm:flex ${
            activeCardIdx === 2 ? card3.activeGlow : 'hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]'
          }`}
          aria-label={`${card3.role} job opportunity`}
        >
          <div className={`w-9 h-9 rounded-xl ${card3.iconBg} flex items-center justify-center shrink-0`}>
            <Terminal className="w-4 h-4" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="font-heading font-bold text-[12.5px] text-[#0B1B2E] truncate">
                {card3.role}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${card3.badgeBg} shrink-0`}>
                {card3.badge}
              </span>
            </div>
            <div className="font-sans font-medium text-[11px] text-slate-500 truncate flex items-center justify-between">
              <span className="truncate">{card3.stack}</span>
              <span className={`font-numbers font-bold text-[11px] ${card3.salaryColor} ml-1.5 shrink-0`}>
                {card3.salary}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── 4. JOB CARD 4: AI / ML ENGINEER (Lower-Right Area) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: activeCardIdx === 3 ? 1.03 : 1.0,
            y: reducedMotion ? 0 : [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.60 },
            scale: { duration: 0.35, ease: 'easeOut' },
            y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
          }}
          className={`absolute bottom-4 sm:bottom-6 right-2 sm:right-4 lg:right-3 z-20 w-[252px] sm:w-[266px] lg:w-[276px] p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(16,185,129,0.08)] transition-all duration-300 hidden sm:flex ${
            activeCardIdx === 3 ? card4.activeGlow : 'hover:shadow-[0_18px_40px_rgba(16,185,129,0.18)]'
          }`}
          aria-label={`${card4.role} job opportunity`}
        >
          <div className={`w-9 h-9 rounded-xl ${card4.iconBg} flex items-center justify-center shrink-0`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="font-heading font-bold text-[12.5px] text-[#0B1B2E] truncate">
                {card4.role}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${card4.badgeBg} shrink-0`}>
                {card4.badge}
              </span>
            </div>
            <div className="font-sans font-medium text-[11px] text-slate-500 truncate flex items-center justify-between">
              <span className="truncate">{card4.stack}</span>
              <span className={`font-numbers font-bold text-[11px] ${card4.salaryColor} ml-1.5 shrink-0`}>
                {card4.salary}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── MOBILE RESPONSIVE STACK (< 640px) ── */}
      {/* On mobile screens, all 4 cards are neatly stacked below the logo to prevent collisions and ensure 100% readability */}
      <div className="w-full flex sm:hidden flex-col gap-2.5 max-w-[340px] mx-auto px-2 mt-3 mb-6">
        {jobCardsData.map((job, idx) => {
          const Icon = job.icon;
          const isActive = activeCardIdx === idx;
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.10 }}
              className={`p-3 flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_25px_rgba(31,106,165,0.06)] transition-all ${
                isActive ? job.activeGlow : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl ${job.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="leading-tight flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="font-heading font-bold text-[12.5px] text-[#0B1B2E] truncate">
                    {job.role}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-bold ${job.badgeBg} shrink-0`}>
                    {job.badge}
                  </span>
                </div>
                <div className="font-sans font-medium text-[11px] text-slate-500 truncate flex items-center justify-between">
                  <span className="truncate">{job.stack}</span>
                  <span className={`font-numbers font-bold text-[11px] ${job.salaryColor} ml-1.5 shrink-0`}>
                    {job.salary}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
