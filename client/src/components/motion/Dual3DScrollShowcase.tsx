import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  useInView,
  useReducedMotion,
  wrap,
} from 'framer-motion';
import {
  Cloud,
  Database,
  ShieldCheck,
  Zap,
  Sparkles,
  Cpu,
  Layers,
  Server,
  TrendingUp,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Compass,
} from 'lucide-react';

interface PartnerItem {
  id: string;
  name: string;
  category: string;
  openings: string;
  badge: string;
  icon: React.ElementType;
}

interface RoleItem {
  id: string;
  role: string;
  track: string;
  compensation: string;
  timeline: string;
  tag: string;
  accent: string;
  icon: React.ElementType;
}

const enterprisePartners: PartnerItem[] = [
  {
    id: 'p1',
    name: 'CloudScale Systems',
    category: 'Enterprise Cloud & DevOps',
    openings: '14 Active Roles',
    badge: 'Tier-1 Partner',
    icon: Cloud,
  },
  {
    id: 'p2',
    name: 'FinTech Global',
    category: 'Algorithmic Banking',
    openings: '9 Active Roles',
    badge: 'Direct Client',
    icon: TrendingUp,
  },
  {
    id: 'p3',
    name: 'Apex Healthcare IT',
    category: 'HIPAA Cloud Infrastructure',
    openings: '11 Active Roles',
    badge: 'Vetted Sponsor',
    icon: ShieldCheck,
  },
  {
    id: 'p4',
    name: 'Synapse Distributed AI',
    category: 'LLM & ML Inference Ops',
    openings: '8 Active Roles',
    badge: 'High Growth',
    icon: Cpu,
  },
  {
    id: 'p5',
    name: 'OmniLogistics Core',
    category: 'Real-time Supply Chain',
    openings: '16 Active Roles',
    badge: 'Enterprise',
    icon: Server,
  },
  {
    id: 'p6',
    name: 'SecureCore CyberTech',
    category: 'Zero-Trust Defense',
    openings: '7 Active Roles',
    badge: 'Priority Requisition',
    icon: ShieldCheck,
  },
  {
    id: 'p7',
    name: 'Starlight Data Labs',
    category: 'Distributed Analytics',
    openings: '12 Active Roles',
    badge: 'Top Tier',
    icon: Database,
  },
  {
    id: 'p8',
    name: 'Nexus Capital Tech',
    category: 'High-Frequency Systems',
    openings: '10 Active Roles',
    badge: 'Exclusive',
    icon: Building2,
  },
];

const featuredRoles: RoleItem[] = [
  {
    id: 'r1',
    role: 'Principal Cloud Architect',
    track: 'AWS / Multi-Cloud Terraform',
    compensation: '$150k - $185k',
    timeline: '10-18 Days to Offer',
    tag: 'Direct Placement',
    accent: 'border-orange-200 bg-orange-50/50 text-orange-700',
    icon: Cloud,
  },
  {
    id: 'r2',
    role: 'Staff Full-Stack Engineer',
    track: 'React 19, TypeScript, Node',
    compensation: '$135k - $165k',
    timeline: '12-21 Days to Offer',
    tag: 'Fast-Track',
    accent: 'border-sky-200 bg-sky-50/50 text-sky-700',
    icon: Layers,
  },
  {
    id: 'r3',
    role: 'Lead Data Engineer',
    track: 'Snowflake, PySpark & dbt',
    compensation: '$140k - $175k',
    timeline: '14-20 Days to Offer',
    tag: 'Bench Priority',
    accent: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
    icon: Database,
  },
  {
    id: 'r4',
    role: 'Kubernetes Platform SRE',
    track: 'CI/CD, ArgoCD, Observability',
    compensation: '$145k - $170k',
    timeline: '11-16 Days to Offer',
    tag: 'Visa Friendly',
    accent: 'border-purple-200 bg-purple-50/50 text-purple-700',
    icon: Server,
  },
  {
    id: 'r5',
    role: 'AI / Machine Learning Engineer',
    track: 'Vector Embeddings, RAG, PyTorch',
    compensation: '$160k - $195k',
    timeline: '15-24 Days to Offer',
    tag: 'High Demand',
    accent: 'border-rose-200 bg-rose-50/50 text-rose-700',
    icon: Cpu,
  },
  {
    id: 'r6',
    role: 'DevSecOps Security Engineer',
    track: 'Cloud Security & Compliance',
    compensation: '$135k - $160k',
    timeline: '12-19 Days to Offer',
    tag: 'Enterprise',
    accent: 'border-amber-200 bg-amber-50/50 text-amber-700',
    icon: ShieldCheck,
  },
  {
    id: 'r7',
    role: 'Distributed Backend Developer',
    track: 'Golang, gRPC & Kafka',
    compensation: '$140k - $170k',
    timeline: '10-15 Days to Offer',
    tag: 'Immediate Fill',
    accent: 'border-teal-200 bg-teal-50/50 text-teal-700',
    icon: Zap,
  },
  {
    id: 'r8',
    role: 'Engineering Manager',
    track: 'Cross-functional Agile Squads',
    compensation: '$170k - $210k',
    timeline: '18-28 Days to Offer',
    tag: 'Executive Search',
    accent: 'border-blue-200 bg-blue-50/50 text-blue-700',
    icon: Compass,
  },
];

// Single 3D Tilt Card Component with interactive cursor glare
const TiltCard3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}> = ({ children, className = '', borderColor = 'hover:border-orange-400' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, scale: 1 });
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setTilt({
      rotX: Number(rotX.toFixed(2)),
      rotY: Number(rotY.toFixed(2)),
      scale: 1.04,
    });
    setGlare({
      opacity: 0.22,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotX: 0, rotY: 0, scale: 1 });
    setGlare({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer transition-all duration-200 select-none ${borderColor} ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1) translateZ(16px)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Specular glare following mouse */}
      <div
        className="pointer-events-none absolute -inset-full transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)`,
        }}
      />
      {children}
    </div>
  );
};

// Reversible, Velocity-driven 3D Scrolling Track
interface StreamRowProps {
  baseVelocity: number; // Negative for left, positive for right
  isPaused: boolean;
  onHoverStateChange?: (hovered: boolean) => void;
  children: React.ReactNode;
}

const StreamRow: React.FC<StreamRowProps> = ({
  baseVelocity = -1,
  isPaused,
  onHoverStateChange,
  children,
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Low mass (0.1) and responsive damping for instant start & crisp stop
  const smoothVelocity = useSpring(scrollVelocity, { damping: 24, stiffness: 480, mass: 0.1 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-3.5, 0, 3.5], {
    clamp: false,
  });

  // Track wrapped percentage between -33.333% and 0%
  const x = useTransform(baseX, (v) => `${wrap(-33.333333, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (isPaused) return;

    // Normal scrolling velocity response:
    // Scrolling down produces positive velocity, scrolling up produces negative velocity
    // Reacts immediately with zero lag or lingering delay
    const vFactor = velocityFactor.get();
    let moveBy = baseVelocity;

    if (Math.abs(vFactor) > 0.01) {
      moveBy += (vFactor * 0.45) * (baseVelocity > 0 ? 1 : -1);
    }

    // Clamp delta to prevent frame spikes on tab resume/scroll start
    const safeDelta = Math.min(delta, 32);
    baseX.set(baseX.get() + moveBy * (safeDelta / 1000) * 1.8);
  });

  return (
    <div
      className="overflow-hidden flex flex-nowrap"
      onMouseEnter={() => onHoverStateChange?.(true)}
      onMouseLeave={() => onHoverStateChange?.(false)}
    >
      <motion.div
        className="flex shrink-0 items-center gap-6"
        style={{ x, willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const Dual3DScrollShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Expand margin to 350px so streams are already moving smoothly when entering viewport (zero start delay)
  const isInView = useInView(containerRef, { margin: '350px 0px 350px 0px' });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPaused = !isInView || !!shouldReduceMotion || isHovered || isFocused;

  // Real-time scroll velocity for 3D stage tilt response with instant reaction
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 22, stiffness: 450, mass: 0.1 });

  // Dynamically tilt the 3D stage based on scroll direction:
  const dynamicTiltX = useTransform(smoothVelocity, [-1000, 0, 1000], [5, 12, 17]);
  const dynamicZ = useTransform(smoothVelocity, [-1000, 0, 1000], [-30, 0, 40]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      aria-label="Interactive 3D Ecosystem Showcase (pauses on hover and focus)"
      className="relative w-full py-12 lg:py-18 overflow-hidden select-none bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 border-y border-gray-200/80 outline-none"
    >
      {/* Background Spatial Glow Accents */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[650px] h-[340px] bg-orange-500/6 rounded-full filter blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[340px] bg-blue-500/6 rounded-full filter blur-[100px] pointer-events-none"
      />

      {/* Header */}
      <div className="container-custom relative z-10 mb-8 sm:mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
              <span>Bidirectional 3D Motion Grid</span>
            </div>
            <h2 className="text-h2 text-navy-900 leading-tight">
              Enterprise Ecosystem & <span className="text-brand-gradient">Active Bench Cohorts</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
              Streams react in real time to your scroll direction—gliding normally on scroll down, and smoothly reversing when you scroll up.
            </p>
          </div>
        </div>
      </div>

      {/* 3D PERSPECTIVE STAGE CONTAINER */}
      <div
        className="w-full relative overflow-visible"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Soft edge masking for smooth fade into screen boundaries */}
        <motion.div
          className="w-full transition-all duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            rotateX: dynamicTiltX,
            rotateZ: -1.8,
            z: dynamicZ,
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* ── ROW 1: TOP TRACK (FLOWS NORMALLY LEFT ←, REVERSES RIGHT →) ── */}
          <div className="relative mb-6">
            <div className="flex items-center mb-2 px-8">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Stream 01 · Enterprise Client Network (Flowing Left ←)
              </span>
            </div>

            <StreamRow
              baseVelocity={-1.5}
              isPaused={isPaused}
            >
              {/* Duplicate cards 3x for continuous infinite wrapping */}
              {[...enterprisePartners, ...enterprisePartners, ...enterprisePartners].map((partner, idx) => {
                const IconComponent = partner.icon;
                return (
                  <TiltCard3D
                    key={`${partner.id}-${idx}`}
                    borderColor="hover:border-orange-400"
                    className="shrink-0 w-[300px] sm:w-[340px] p-4 sm:p-5 rounded-2xl bg-white/95 border border-gray-200/90 shadow-md hover:shadow-xl group/card backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-navy-900 group-hover/card:bg-orange-50 group-hover/card:text-orange-600 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-gray-200">
                        {partner.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-navy-900 mb-1 group-hover/card:text-orange-600 transition-colors flex items-center justify-between">
                      <span>{partner.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover/card:text-orange-500 transition-colors" />
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{partner.category}</p>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {partner.openings}
                      </span>
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Hiring</span>
                    </div>
                  </TiltCard3D>
                );
              })}
            </StreamRow>
          </div>

          {/* ── ROW 2: BOTTOM TRACK (FLOWS NORMALLY RIGHT →, REVERSES LEFT ←) ── */}
          <div className="relative">
            <div className="flex items-center mb-2 px-8">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Stream 02 · In-Demand Technical Cohorts (Flowing Right →)
              </span>
            </div>

            <StreamRow
              baseVelocity={1.5}
              isPaused={isPaused}
            >
              {/* Duplicate cards 3x for continuous infinite wrapping */}
              {[...featuredRoles, ...featuredRoles, ...featuredRoles].map((role, idx) => {
                const IconComponent = role.icon;
                return (
                  <TiltCard3D
                    key={`${role.id}-${idx}`}
                    borderColor="hover:border-blue-400"
                    className="shrink-0 w-[310px] sm:w-[350px] p-4 sm:p-5 rounded-2xl bg-white/95 border border-gray-200/90 shadow-md hover:shadow-xl group/card backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-numbers font-bold text-navy-900 bg-slate-100/90 px-3 py-1 rounded-lg border border-gray-200">
                        {role.compensation}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${role.accent}`}>
                        {role.tag}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-sm text-navy-900 leading-snug group-hover/card:text-blue-600 transition-colors">
                          {role.role}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{role.track}</p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        {role.timeline}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Sample Role</span>
                    </div>
                  </TiltCard3D>
                );
              })}
            </StreamRow>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
