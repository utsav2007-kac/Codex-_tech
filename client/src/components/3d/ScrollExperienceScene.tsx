import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Network,
  Sparkles,
  Zap,
  Award,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import * as THREE from 'three';

interface ScrollExperienceSceneProps {
  onOpenConsultation?: () => void;
}

export const ScrollExperienceScene: React.FC<ScrollExperienceSceneProps> = ({ onOpenConsultation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const phases = [
    {
      number: '01',
      days: 'Days 1–3',
      title: 'Precision Calibration',
      tag: 'Technical Diagnostic',
      icon: Cpu,
      headline: 'Deep Technical Diagnostics & Positioning',
      description:
        'Live system architecture benchmarking, live code reviews, and ATS-proof profile positioning vetted by senior staff engineers.',
      metrics: ['24-Hour Review', 'ATS-Proof Profiling', 'GitHub Code Audit'],
      highlight: 'Staff Engineer Vetting',
    },
    {
      number: '02',
      days: 'Days 4–10',
      title: 'Algorithmic Hiring Match',
      tag: 'Executive Synchronization',
      icon: Network,
      headline: 'Direct Access to VP & Director Hiring Teams',
      description:
        'Skip stale job portals. Your calibrated profile is presented directly to engineering directors and VP-level hiring managers at 120+ enterprises.',
      metrics: ['120+ Enterprise Partners', 'Direct VP Access', 'Zero Cold Inboxes'],
      highlight: 'Direct Hiring Pipeline',
    },
    {
      number: '03',
      days: 'Days 11–18',
      title: 'Velocity Offer & Placement',
      tag: 'Career Acceleration',
      icon: Award,
      headline: '18-Day Average Offer & Onboarding',
      description:
        'Expedited interview loops, compensation benchmarking, negotiation advocacy, and seamless visa/employment onboarding.',
      metrics: ['18-Day Avg Placement', '15–25% Salary Increase', '94.8% Retention'],
      highlight: 'Fast-Track Placement',
    },
  ];

  // Three.js interactive 3D Tech Core setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Verify WebGL capability safely
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      setWebGLFailed(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(canvas.clientWidth || 400, canvas.clientHeight || 400, false);
    } catch (err) {
      console.warn('WebGL initialization failed in 18-Day scene:', err);
      setWebGLFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      (canvas.clientWidth || 400) / Math.max(1, canvas.clientHeight || 400),
      0.1,
      100
    );
    camera.position.set(0, 0, 7.2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    const orangeLight = new THREE.DirectionalLight(0xf25c2a, 2.2);
    orangeLight.position.set(5, 5, 5);
    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    cyanLight.position.set(-5, -4, 4);
    scene.add(ambientLight, orangeLight, cyanLight);

    // Main 3D Tech Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Icosahedron Wireframe
    const icosaGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icosaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
    coreGroup.add(icosaMesh);

    // 2. Inner Glowing Octahedron Core (The "18-Day Engine")
    const coreGeo = new THREE.OctahedronGeometry(0.95, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf25c2a,
      emissive: 0xc2410c,
      emissiveIntensity: 1.1,
      roughness: 0.15,
      metalness: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // 3. Dual Orbital Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.03, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.025, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf25c2a,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 4. Satellite Network Nodes
    const NODE_COUNT = 14;
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.9,
    });
    const satMesh = new THREE.InstancedMesh(satGeo, satMat, NODE_COUNT);
    const dummy = new THREE.Object3D();
    const satPoints: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const r = 2.5;
      const pt = new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      satPoints.push(pt);
      dummy.position.copy(pt);
      dummy.scale.setScalar(i % 2 === 0 ? 1.3 : 0.85);
      dummy.updateMatrix();
      satMesh.setMatrixAt(i, dummy.matrix);
      satMesh.setColorAt(
        i,
        i % 2 === 0 ? new THREE.Color(0xf25c2a) : new THREE.Color(0x38bdf8)
      );
    }
    satMesh.instanceMatrix.needsUpdate = true;
    if (satMesh.instanceColor) satMesh.instanceColor.needsUpdate = true;
    coreGroup.add(satMesh);

    // Connecting Network Lines
    const linePoints: THREE.Vector3[] = [];
    satPoints.forEach((p, idx) => {
      linePoints.push(new THREE.Vector3(0, 0, 0));
      linePoints.push(p);
      const next = (idx + 1) % satPoints.length;
      linePoints.push(p);
      linePoints.push(satPoints[next]);
    });
    const linesGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    coreGroup.add(lines);

    // 5. Ambient Micro-particles
    const PARTICLE_COUNT = 180;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xf25c2a,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!canvas || !renderer) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!renderer) return;
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      targetRotY += (mouseX * 0.45 - targetRotY) * 0.05;
      targetRotX += (-mouseY * 0.35 - targetRotX) * 0.05;

      coreGroup.rotation.y = elapsed * 0.22 + targetRotY;
      coreGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.15 + targetRotX;

      // Pulse core scale
      const pulse = 1 + Math.sin(elapsed * 2.8) * 0.07;
      coreMesh.scale.setScalar(pulse);
      icosaMesh.rotation.z = elapsed * 0.12;

      // Orbiting rings
      ring1.rotation.z = -elapsed * 0.4;
      ring2.rotation.y = elapsed * 0.3;

      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
      }

      icosaGeo.dispose();
      coreGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      satGeo.dispose();
      linesGeo.dispose();
      particleGeo.dispose();

      icosaMat.dispose();
      coreMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      satMat.dispose();
      linesMat.dispose();
      particleMat.dispose();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#070E1A] text-white py-16 sm:py-24 my-0 selection:bg-orange-500/30 selection:text-orange-400 border-t border-b border-white/10"
      aria-label="18-Day Advantage Placement Program"
    >
      {/* Background Lighting Gradients */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 -z-10"
        style={{
          background: 'radial-gradient(circle, #F25C2A 0%, rgba(242, 92, 42, 0) 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, rgba(56, 189, 248, 0) 70%)',
        }}
      />

      {/* Subtle Tech Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-custom relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs font-semibold text-orange-400 mb-4 shadow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>The 18-Day Fast-Track Placement</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight mb-4">
            Ready to Experience the{' '}
            <span className="text-brand-gradient">18-Day Advantage?</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard IT recruiting drags on for 45 to 60 days. With our proprietary candidate calibration and direct VP-level enterprise network, we take qualified tech talent from initial review to signed offer in 18 days average.
          </p>
        </div>

        {/* Central 3D Interactive Stage + Telemetry Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Column: Telemetry Stats & Value Prop */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">18 Days</div>
                  <div className="text-xs text-slate-400 font-medium">Average Time to Signed Offer</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                68% faster than traditional corporate ATS queues and third-party vendor pipelines.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">15–25%</div>
                  <div className="text-xs text-slate-400 font-medium">Compensation Benchmark Uplift</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expert offer negotiations backed by verified regional tech salary telemetry.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">94.8%</div>
                  <div className="text-xs text-slate-400 font-medium">12-Month Placement Retention</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Culture, stack, and seniority fit verified before first client interview.
              </p>
            </div>
          </div>

          {/* Center Column: Interactive 3D Tech Core */}
          <div className="lg:col-span-8 relative">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-900/80 to-[#0A1224] shadow-2xl backdrop-blur-xl flex items-center justify-center">
              {/* Three.js Canvas */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing ${
                  webGLFailed ? 'hidden' : 'block'
                }`}
                aria-label="Interactive 3D Tech Core Visualization"
              />

              {/* Graceful Fallback if WebGL is disabled or failed */}
              {webGLFailed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/40 animate-spin [animation-duration:18s]" />
                    <div className="absolute inset-3 rounded-full border border-sky-400/40 animate-spin [animation-duration:12s] [animation-direction:reverse]" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
                      <Cpu className="w-10 h-10" />
                    </div>
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white mb-1">
                    Calibrated Talent Engine
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Real-time technical benchmarking connecting pre-screened talent with active hiring managers.
                  </p>
                </div>
              )}

              {/* Floating Live Badges over 3D Stage */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Talent Calibration Core
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 hidden sm:block">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-[11px] font-mono text-orange-400 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive · Drag & Tilt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The 3-Phase Accelerator Roadmap Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
              The 3-Phase Acceleration Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Engineered to eliminate friction, cold applications, and recruiter gatekeeping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((phase, idx) => {
              const Icon = phase.icon;
              const isActive = activePhase === idx;

              return (
                <div
                  key={phase.number}
                  onClick={() => setActivePhase(idx)}
                  className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900/90 border-orange-500 shadow-xl shadow-orange-500/10 -translate-y-1'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold font-mono tracking-wider">
                      PHASE {phase.number} · {phase.days}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-heading font-bold text-white mb-2 leading-snug">
                    {phase.headline}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {phase.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-white/10">
                    {phase.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-300 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Impact Bottom Conversion Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 border border-white/15 bg-gradient-to-r from-slate-900/90 via-[#0E1B33] to-slate-900/90 backdrop-blur-xl shadow-2xl text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Your IT Career</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Claim Your Free Career & Profile Calibration
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Speak 1-on-1 with our veteran technical advisors. We’ll audit your resume against Tier-1 ATS benchmarks and map you to verified active requisitions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              onClick={onOpenConsultation}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Free Calibration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/careers"
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              View Open Tech Roles
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              100% Free for Tech Candidates
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              Confidential & Direct
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              120+ Active Hiring Partners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
