import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Code2, Sparkles, Terminal } from 'lucide-react';

// Lazy load the heavy Three.js / R3F Canvas off the critical path
const CodexMonogramCanvas = React.lazy(() => import('./CodexMonogramCanvas'));

// ── STATIC FALLBACK (High-Fidelity 3D Monogram Render) ─────────────────────────
export function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative pointer-events-none hero-entrance-logo">
      <picture className="w-full h-full flex items-center justify-center">
        <source srcSet="/assets/codex-3d-monogram.webp" type="image/webp" />
        <img
          src="/assets/codex-3d-monogram.png"
          alt="Codex 3D Glass Monogram"
          width="548"
          height="550"
          {...{ fetchpriority: 'high' } as any}
          decoding="sync"
          className="w-full h-full max-w-[548px] max-h-[550px] object-contain pointer-events-none"
        />
      </picture>
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
  const throwAngleRef = useRef({ x: 0, y: 0 });
  const throwVelocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });

  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [activePulse, setActivePulse] = useState(false);
  const [introDone, setIntroDone] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [inView, setInView] = useState(true);
  const [load3D, setLoad3D] = useState(false);
  const [liveReady, setLiveReady] = useState(false);

  const handleLiveFirstFrame = () => {
    // Live R3F frame 1 rendered in buffer; begin 500ms opacity cross-fade
    setLiveReady(true);
  };

  // IntersectionObserver to pause/unmount 3D scene when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Check WebGL, Screen Size and Motion Preferences
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Lazy-load 3D chunk off critical path after hero entrance finishes (1s)
  useEffect(() => {
    if (reducedMotion || !hasWebGL || isMobile) return;

    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(
        () => {
          setLoad3D(true);
        },
        { timeout: 1000 }
      );
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => {
        setLoad3D(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [reducedMotion, hasWebGL, isMobile]);

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle active card pulse after entrance sequence completes (3s delay)
  useEffect(() => {
    if (reducedMotion) return;
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveCardIdx((prev) => (prev + 1) % 4);
        setActivePulse(true);
        setTimeout(() => setActivePulse(false), 900);
      }, 4200);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(initialDelay);
  }, [reducedMotion]);

  // Interactive Drag & Throw Rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    throwVelocityRef.current = { x: 0, y: 0 };
    try {
      containerRef.current?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (!isDraggingRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      mouseRef.current = { x: nx, y: ny };
      return;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    throwAngleRef.current.y += dx * 0.012;
    throwAngleRef.current.x = Math.max(-0.50, Math.min(0.50, throwAngleRef.current.x - dy * 0.008));

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
      containerRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      mouseRef.current = { x: 0.5, y: 0.5 };
    }
  };

  const card1 = jobCardsData[0];
  const card2 = jobCardsData[1];
  const card3 = jobCardsData[2];
  const card4 = jobCardsData[3];

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
        className="relative w-full max-w-[620px] h-[340px] sm:h-[490px] lg:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible touch-pan-y hero-anim-3d"
        aria-label="Codex Tech-IT 3D Glass Monogram Stage"
      >
        {/* ── B. LIGHT WASH (Feathered radial background glows) ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-visible -z-20"
          style={{
            maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
          }}
        >
          <div
            className="absolute bottom-[6%] left-[4%] w-[380px] h-[380px] rounded-full filter blur-[80px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(220, 235, 250, 0.72) 0%, transparent 70%)',
            }}
          />
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
          <g transform={`translate(310, 265) rotate(${-15 + (reducedMotion ? 0 : scrollY * 0.04)})`}>
            <ellipse rx="175" ry="88" stroke="#1F6AA5" strokeWidth="1" strokeOpacity="0.20" strokeDasharray="4 6" />
            {!reducedMotion && (
              <circle cx="175" cy="0" r="3.5" fill="#F15A34" opacity={activeCardIdx === 0 ? 1 : 0.75}>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="48s" repeatCount="indefinite" />
              </circle>
            )}
          </g>

          <g transform={`translate(310, 265) rotate(${22 - (reducedMotion ? 0 : scrollY * 0.03)})`}>
            <ellipse rx="215" ry="112" stroke="#1F6AA5" strokeWidth="1" strokeOpacity="0.16" />
            {!reducedMotion && (
              <circle cx="-215" cy="0" r="3.5" fill="#1F6AA5" opacity={activeCardIdx === 1 ? 1 : 0.75}>
                <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="68s" repeatCount="indefinite" />
              </circle>
            )}
          </g>

          <g transform={`translate(310, 265) rotate(${-30 + (reducedMotion ? 0 : scrollY * 0.025)})`}>
            <ellipse rx="248" ry="128" stroke="#1F6AA5" strokeWidth="1" strokeOpacity="0.12" />
            {!reducedMotion && (
              <circle cx="0" cy="128" r="3.5" fill="#10B981" opacity={activeCardIdx === 3 ? 1 : 0.75}>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="88s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        </svg>

        {/* ── A. THE CENTRAL 3D MONOGRAM CANVAS WITH INSTANT STATIC FALLBACK ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0 filter drop-shadow-[0_18px_40px_rgba(31,106,165,0.18)]"
          style={{
            maskImage:
              'radial-gradient(ellipse 88% 85% at 50% 50%, black 55%, rgba(0, 0, 0, 0.4) 78%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 88% 85% at 50% 50%, black 55%, rgba(0, 0, 0, 0.4) 78%, transparent 100%)',
          }}
        >
          {/* Static High-Fidelity 3D Monogram Fallback rendered instantly at first paint without layout shift */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              liveReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <StaticFallback />
          </div>

          {/* Lazy-loaded live Three.js 3D Canvas */}
          {hasWebGL && !reducedMotion && inView && !isMobile && load3D && (
            <Suspense fallback={null}>
              <div
                className={`w-full h-full transition-opacity duration-500 ease-out ${
                  liveReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <CodexMonogramCanvas
                  mouse={mouseRef}
                  activePulse={activePulse}
                  introDone={introDone}
                  isMobile={isMobile}
                  throwAngle={throwAngleRef}
                  throwVelocity={throwVelocityRef}
                  isDragging={isDraggingRef}
                  onFirstFrameRendered={handleLiveFirstFrame}
                />
              </div>
            </Suspense>
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

          <line x1="200" y1="75" x2="232" y2="148" stroke="url(#lineGradMobile)" strokeWidth="1.2" strokeOpacity={activeCardIdx === 0 ? 0.9 : 0.28} strokeDasharray={activeCardIdx === 0 ? 'none' : '3 4'} />
          <circle cx="232" cy="148" r="3" fill="#F15A34" opacity={activeCardIdx === 0 ? 1 : 0.45} />

          <line x1="418" y1="82" x2="388" y2="148" stroke="url(#lineGradFullstack)" strokeWidth="1.2" strokeOpacity={activeCardIdx === 1 ? 0.9 : 0.28} strokeDasharray={activeCardIdx === 1 ? 'none' : '3 4'} />
          <circle cx="388" cy="148" r="3" fill="#1F6AA5" opacity={activeCardIdx === 1 ? 1 : 0.45} />

          <line x1="205" y1="462" x2="232" y2="388" stroke="url(#lineGradPython)" strokeWidth="1.2" strokeOpacity={activeCardIdx === 2 ? 0.9 : 0.28} strokeDasharray={activeCardIdx === 2 ? 'none' : '3 4'} />
          <circle cx="232" cy="388" r="3" fill="#6366F1" opacity={activeCardIdx === 2 ? 1 : 0.45} />

          <line x1="405" y1="462" x2="382" y2="388" stroke="url(#lineGradAI)" strokeWidth="1.2" strokeOpacity={activeCardIdx === 3 ? 0.9 : 0.28} strokeDasharray={activeCardIdx === 3 ? 'none' : '3 4'} />
          <circle cx="382" cy="388" r="3" fill="#10B981" opacity={activeCardIdx === 3 ? 1 : 0.45} />
        </svg>

        {/* ── 1. JOB CARD 1: MOBILE IOS & ANDROID (Upper-Left Area) ── */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="hero-anim-card-1 absolute top-3 sm:top-5 left-1 sm:left-2 lg:-left-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] hidden sm:flex"
          aria-label={`${card1.role} job opportunity`}
        >
          <div
            className={`hero-card-inner-1 w-full p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(31,106,165,0.08)] transition-all duration-300 ${
              activeCardIdx === 0 ? card1.activeGlow : 'hover:shadow-[0_18px_40px_rgba(31,106,165,0.15)]'
            }`}
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
          </div>
        </div>

        {/* ── 2. JOB CARD 2: FULL STACK ENGINEER (Upper-Right Area) ── */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="hero-anim-card-2 absolute top-5 sm:top-7 right-1 sm:right-2 lg:-right-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] hidden sm:flex"
          aria-label={`${card2.role} job opportunity`}
        >
          <div
            className={`hero-card-inner-2 w-full p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border ${card2.accentBorder} shadow-[0_16px_40px_rgba(31,106,165,0.12)] transition-all duration-300 ${
              activeCardIdx === 1 ? card2.activeGlow : 'hover:shadow-[0_20px_45px_rgba(31,106,165,0.20)]'
            }`}
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
          </div>
        </div>

        {/* ── 3. JOB CARD 3: PYTHON DEVELOPER (Lower-Left Area) ── */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="hero-anim-card-3 absolute bottom-4 sm:bottom-6 left-1 sm:left-2 lg:-left-2 z-20 w-[252px] sm:w-[266px] lg:w-[276px] hidden sm:flex"
          aria-label={`${card3.role} job opportunity`}
        >
          <div
            className={`hero-card-inner-3 w-full p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(99,102,241,0.08)] transition-all duration-300 ${
              activeCardIdx === 2 ? card3.activeGlow : 'hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]'
            }`}
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
          </div>
        </div>

        {/* ── 4. JOB CARD 4: AI / ML ENGINEER (Lower-Right Area) ── */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="hero-anim-card-4 absolute bottom-4 sm:bottom-6 right-2 sm:right-4 lg:right-3 z-20 w-[252px] sm:w-[266px] lg:w-[276px] hidden sm:flex"
          aria-label={`${card4.role} job opportunity`}
        >
          <div
            className={`hero-card-inner-4 w-full p-3 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_14px_35px_rgba(16,185,129,0.08)] transition-all duration-300 ${
              activeCardIdx === 3 ? card4.activeGlow : 'hover:shadow-[0_18px_40px_rgba(16,185,129,0.18)]'
            }`}
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
          </div>
        </div>
      </div>

      {/* ── MOBILE RESPONSIVE STACK (< 640px) ── */}
      <div className="w-full flex sm:hidden flex-col gap-2.5 max-w-[340px] mx-auto px-2 mt-3 mb-6 hero-anim-chips">
        {jobCardsData.map((job, idx) => {
          const Icon = job.icon;
          const isActive = activeCardIdx === idx;
          return (
            <div
              key={job.id}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
