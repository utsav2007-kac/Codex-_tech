import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Users,
  Sparkles,
  Building2,
  Clock,
  Compass,
  Zap,
  Globe2,
  Briefcase,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { PageHero } from '../components/layout/PageHero';

export const About: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const stats = [
    { value: '18 Days', label: 'Average Time to Offer', desc: 'vs. 45-day industry average' },
    { value: '2,400+', label: 'Engineers Placed', desc: 'Across Tier-1 & Fortune 500 teams' },
    { value: '94.8%', label: '12-Month Retention', desc: 'Long-term mutual cultural fit' },
    { value: '120+', label: 'Enterprise Partners', desc: 'Direct access to hiring decision-makers' },
  ];

  const pillars = [
    {
      icon: CpuIcon,
      title: 'Engineer-Led Calibration',
      description:
        'Our technical recruiters are paired directly with staff engineers. We assess real-world system design, production code quality, and architectural thinking—never just keyword matching.',
    },
    {
      icon: HeartHandshake,
      title: 'Radical Transparency',
      description:
        'No hidden fee deductions, no unrealistic promises, and zero bait-and-switch. Candidates receive transparent bill rates, genuine visa support, and unvarnished client feedback.',
    },
    {
      icon: Zap,
      title: 'Speed Without Chaos',
      description:
        'Our proprietary talent bench is pre-screened and pre-vetted. When an enterprise opens a requisition, we deliver high-fit, interview-ready shortlists within 48 hours.',
    },
    {
      icon: TrendingUp,
      title: 'Candidate-First Advocacy',
      description:
        'We view placements as multi-year career compounding events. We negotiate aggressive compensation packages, guide counteroffers, and mentor engineers post-placement.',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Founded in Plano, Texas',
      desc: 'Launched by veteran cloud architects and IT staffing leaders frustrated with transactional recruiter spam.',
    },
    {
      year: '2023',
      title: 'Crossed 1,000 Placements',
      desc: 'Expanded into direct Tier-1 vendor status across Fortune 500 FinTech, Healthcare, and Enterprise SaaS clients.',
    },
    {
      year: '2025',
      title: 'Hyderabad Global Delivery Hub',
      desc: 'Inaugurated our 24/7 global talent screening hub in HITEC City, expanding technical training and mock interview operations.',
    },
    {
      year: '2026',
      title: 'AI Diagnostic Benchmarking',
      desc: 'Launched real-time interview telemetry, ATS calibration diagnostics, and accelerated 18-day placement delivery.',
    },
  ];

  const leadership = [
    {
      name: 'Vikram Mehta',
      role: 'Co-Founder & Head of Technical Staffing',
      bio: 'Former Enterprise Cloud Solutions Architect with 16+ years building distributed systems across AWS and hybrid banking clouds.',
      tags: ['Cloud Strategy', 'Executive Search', 'Plano, TX'],
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Talent Acquisition & Placement',
      bio: '12+ years in technical recruitment. Scaled engineering organizations from Series A through public enterprise listings.',
      tags: ['Engineering Leadership', 'Diversity Hiring', 'Dallas, TX'],
    },
    {
      name: 'Karthik Raman',
      role: 'Director of Engineering Mentorship',
      bio: 'Senior Staff Engineer and mentor who has coached over 800+ candidates through FAANG and Fortune 100 technical coding rounds.',
      tags: ['System Design', 'Algorithmic Coaching', 'Hyderabad, IN'],
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Employer Partnerships',
      bio: 'Enterprise client relationship leader specializing in dedicated team scaling, SOW delivery, and contract-to-hire programs.',
      tags: ['Client Success', 'Vendor Management', 'Plano, TX'],
    },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="About Us | Codex Tech-IT - We Deliver Jobs Faster"
        description="Learn about Codex Tech-IT's mission, our engineer-led talent calibration model, our global delivery footprint in Dallas and Hyderabad, and why 2,400+ engineers trust us."
        canonical="/about"
      />

      {/* ── 1. CUSTOM DEEP NAVY TO BLUE GRADIENT HERO ── */}
      <section className="relative bg-gradient-to-br from-[#060D24] via-[#0A173D] to-[#0E2A66] text-white pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden border-b border-white/10">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs & Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'About Us' }]} className="text-blue-200/80" />
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>About Codex Tech-IT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Frosted Capsule Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                ABOUT CODEX TECH-IT · SINCE 2021
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] text-white">
                Connecting Talent with Opportunity{' '}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  Since 2021.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-normal max-w-2xl">
                We are a premier technical staffing and career solutions ecosystem dedicated to empowering ambitious engineers and connecting innovative enterprise companies with pre-vetted, high-impact talent across North America and India.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="shadow-lg shadow-orange-500/25 group"
                >
                  <span>Join Our Team</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link
                  to="/services"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm transition-all border border-white/20 backdrop-blur-md hover:border-white/40 flex items-center justify-center"
                >
                  Explore Services
                </Link>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-orange-400">18 Days</div>
                  <div className="text-xs text-slate-300 font-medium">Avg Offer Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-blue-300">2,400+</div>
                  <div className="text-xs text-slate-300 font-medium">Engineers Placed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-emerald-400">94.8%</div>
                  <div className="text-xs text-slate-300 font-medium">12-Mo Retention</div>
                </div>
              </div>
            </div>

            {/* Right Visual Column: Large Original Connected People SVG Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
                {/* Rotating background orbital glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 via-blue-500/20 to-purple-500/20 blur-2xl animate-pulse" />

                {/* Original SVG: Interlocking Ribbons with Stylized Connected Avatars */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full drop-shadow-2xl relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Connected engineering talent network illustration"
                >
                  <defs>
                    <linearGradient id="aboutRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F25C2A" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="aboutRibbon2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                    <linearGradient id="aboutRibbon3" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="aboutRibbon4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Outer Intertwined Torus Ribbon Paths */}
                  <g filter="url(#shadowFilter)">
                    {/* Ring 1 - Orange Arch */}
                    <path
                      d="M 120,250 C 120,150 200,90 280,110 C 360,130 400,210 380,290 C 360,370 280,410 200,390"
                      fill="none"
                      stroke="url(#aboutRibbon1)"
                      strokeWidth="38"
                      strokeLinecap="round"
                    />
                    {/* Ring 2 - Blue Interlock */}
                    <path
                      d="M 380,250 C 380,150 300,90 220,110 C 140,130 100,210 120,290 C 140,370 220,410 300,390"
                      fill="none"
                      stroke="url(#aboutRibbon2)"
                      strokeWidth="34"
                      strokeLinecap="round"
                      opacity="0.95"
                    />
                    {/* Ring 3 - Emerald Accent */}
                    <path
                      d="M 250,110 C 340,110 400,180 390,260 C 380,340 310,400 230,390"
                      fill="none"
                      stroke="url(#aboutRibbon3)"
                      strokeWidth="24"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </g>

                  {/* Center Core Badge */}
                  <circle cx="250" cy="250" r="48" fill="#0A173D" stroke="#38BDF8" strokeWidth="3" />
                  <circle cx="250" cy="250" r="38" fill="#060D24" />
                  <text x="250" y="244" textAnchor="middle" fill="#F25C2A" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                    CODEX
                  </text>
                  <text x="250" y="262" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    2021-2026
                  </text>

                  {/* Stylized Avatars positioned on the ribbon nodes */}
                  {/* Top Avatar (Engineer 1) */}
                  <g transform="translate(250, 75)">
                    <circle cx="0" cy="0" r="28" fill="#FFF3E8" stroke="#F25C2A" strokeWidth="3.5" />
                    {/* Head/Hair */}
                    <path d="M -16,-6 C -16,-22 16,-22 16,-6 Z" fill="#F25C2A" />
                    <circle cx="0" cy="-2" r="14" fill="#FCD34D" />
                    <circle cx="-5" cy="-2" r="2.5" fill="#0F172A" />
                    <circle cx="5" cy="-2" r="2.5" fill="#0F172A" />
                    <path d="M -4,5 Q 0,9 4,5" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                    {/* Glasses */}
                    <circle cx="-5" cy="-2" r="5" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="5" cy="-2" r="5" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    <line x1="-0.5" y1="-2" x2="0.5" y2="-2" stroke="#2563EB" strokeWidth="1.5" />
                  </g>

                  {/* Right Avatar (Candidate 2) */}
                  <g transform="translate(405, 230)">
                    <circle cx="0" cy="0" r="28" fill="#EEF0FF" stroke="#2563EB" strokeWidth="3.5" />
                    <path d="M -18,-4 C -18,-20 18,-20 18,-4 Z" fill="#1E293B" />
                    <circle cx="0" cy="0" r="14" fill="#FBBF24" />
                    <circle cx="-5" cy="0" r="2" fill="#0F172A" />
                    <circle cx="5" cy="0" r="2" fill="#0F172A" />
                    <path d="M -4,6 Q 0,10 4,6" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Bottom Avatar (Candidate 3) */}
                  <g transform="translate(250, 425)">
                    <circle cx="0" cy="0" r="28" fill="#E3F6EC" stroke="#10B981" strokeWidth="3.5" />
                    <path d="M -16,-8 C -16,-24 16,-24 16,-8 Z" fill="#065F46" />
                    <circle cx="0" cy="0" r="14" fill="#FDE68A" />
                    <circle cx="-5" cy="0" r="2" fill="#0F172A" />
                    <circle cx="5" cy="0" r="2" fill="#0F172A" />
                    <path d="M -4,6 Q 0,10 4,6" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Left Avatar (Candidate 4) */}
                  <g transform="translate(95, 250)">
                    <circle cx="0" cy="0" r="28" fill="#FFE6E6" stroke="#EC4899" strokeWidth="3.5" />
                    <path d="M -18,-6 C -18,-22 18,-22 18,-6 Z" fill="#9D174D" />
                    <circle cx="0" cy="0" r="14" fill="#FED7AA" />
                    <circle cx="-5" cy="0" r="2" fill="#0F172A" />
                    <circle cx="5" cy="0" r="2" fill="#0F172A" />
                    <path d="M -4,6 Q 0,10 4,6" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Orbiting Connection Nodes */}
                  <circle cx="160" cy="140" r="8" fill="#38BDF8" />
                  <circle cx="340" cy="360" r="8" fill="#F25C2A" />
                  <circle cx="340" cy="140" r="7" fill="#10B981" />
                  <circle cx="160" cy="360" r="7" fill="#F59E0B" />
                </svg>

                {/* Floating pill badge on the illustration */}
                <div className="absolute -bottom-4 right-2 sm:right-6 bg-navy-900/90 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3 z-20">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Active Placement Mesh</div>
                    <div className="text-[11px] text-slate-300">USA & India Teams Connected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner Section */}
      <section className="py-12 bg-slate-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <SectionReveal key={i} variant="tiltUp" delay={i * 0.08} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-numbers font-black text-navy-900 tracking-tight">
                  <span className="text-brand-gradient">{s.value}</span>
                </div>
                <div className="text-sm font-heading font-bold text-navy-900">{s.label}</div>
                <div className="text-xs text-slate-500 font-medium">{s.desc}</div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Story & Why We Exist */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <SectionReveal variant="tiltLeft" className="lg:col-span-6 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <div className="eyebrow">The Origin Story</div>
              <h2 className="text-h2 text-navy-900 leading-tight">
                Bridging the Gap Between <span className="text-brand-gradient">Talent & Real Demand.</span>
              </h2>
              <p>
                In 2021, an enterprise team of cloud architects and talent executives in Texas noticed a severe paradox: companies were suffering from prolonged engineering shortages, yet thousands of qualified software engineers, DevOps specialists, and data engineers were struggling to break through algorithmic resume filters.
              </p>
              <p>
                Traditional staffing agencies relied on brute-force keyword matching without evaluating code or architecture. Codex Tech-IT was engineered from day one to break this cycle through a **dual-engine model**: rigorous technical calibration paired with direct, advocate-led placement into pre-vetted corporate teams.
              </p>
              <p>
                Today, operating across dual headquarters in Plano, Texas, and Hyderabad, India, we have facilitated over 2,400 successful placements, averaging an offer turnaround of just 18 days.
              </p>
            </SectionReveal>

            <SectionReveal variant="tiltRight" className="lg:col-span-6 bg-navy-900 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Our Guiding Mission</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "To create meaningful, life-changing employment by connecting qualified engineers with the right companies—faster, fairer, and with total transparency."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Our Operating Vision</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    To remain the premier technical staffing and career acceleration ecosystem across North America and India, known for relentless candidate advocacy and elite technical quality.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="primary" size="md" onClick={onOpenConsultation}>
                    Partner with Codex Tech-IT <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </Scroll3DSection>

      {/* 4 Foundational Operating Pillars */}
      <Scroll3DSection preset="tilt" className="section-padding bg-slate-50 border-y border-gray-200/70">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">How We Operate</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Our 4 Foundational <span className="text-brand-gradient">Pillars.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              The non-negotiable standards that govern every candidate recommendation and enterprise relationship.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              // Card styles with one highlighted card (index 1) for strong visual hierarchy
              const isHighlighted = idx === 1;
              const cardStyles = isHighlighted
                ? 'bg-[#0F172A] text-white border-blue-500/30 shadow-xl ring-1 ring-blue-500/20'
                : idx === 0
                ? 'bg-[#EEF0FF] text-navy-900 border-[#D8DBFF]'
                : idx === 2
                ? 'bg-[#E3F6EC] text-navy-900 border-[#C4EED8]'
                : 'bg-[#FFF3E8] text-navy-900 border-[#FFE3CA]';

              const iconStyles = isHighlighted
                ? 'bg-blue-500/20 text-blue-300'
                : idx === 0
                ? 'bg-blue-600/10 text-blue-700'
                : idx === 2
                ? 'bg-emerald-600/10 text-emerald-700'
                : 'bg-orange-600/10 text-orange-700';

              return (
                <Scroll3DCard
                  key={idx}
                  index={idx}
                  className={`p-6 sm:p-7 rounded-3xl border shadow-xs flex flex-col justify-between hover:shadow-md transition-all h-full ${cardStyles}`}
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${iconStyles} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold font-numbers tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                        isHighlighted ? 'bg-white/10 text-blue-200' : 'bg-black/5 text-slate-600'
                      }`}>
                        Pillar 0{idx + 1}
                      </span>
                    </div>
                    <h3 className={`font-heading font-bold text-lg mb-2 min-h-[3.25rem] flex items-start ${
                      isHighlighted ? 'text-white' : 'text-navy-900'
                    }`}>
                      {pillar.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal flex-1 ${
                      isHighlighted ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {pillar.description}
                    </p>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </Scroll3DSection>

      {/* Journey Timeline */}
      <Scroll3DSection preset="lift" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="eyebrow justify-center">Milestones & Growth</div>
            <h2 className="text-h2 text-navy-900 mb-2 sm:mb-3">
              The Codex <span className="text-brand-gradient">Trajectory.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From our initial cohort of engineers to a recognized cross-continental staffing powerhouse.
            </p>
          </SectionReveal>

          {/* Desktop Timeline Horizontal Track */}
          <div className="hidden lg:block relative mb-6 px-6">
            <div className="absolute top-3 left-12 right-12 h-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/70 to-orange-500/20" />
            <div className="relative grid grid-cols-4 gap-6 text-center z-10">
              {milestones.map((m, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  </div>
                  <span className="text-xs font-bold font-numbers text-orange-600 mt-1.5 tracking-wider">
                    MILESTONE {m.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Cards Container with Mobile Vertical Spine Line */}
          <div className="relative pl-7 sm:pl-9 lg:pl-0">
            {/* Mobile Vertical Continuous Timeline Spine Line */}
            <div
              className="lg:hidden absolute left-2.5 sm:left-3 top-4 bottom-8 w-0.5 bg-gradient-to-b from-orange-500/40 via-orange-500 to-orange-500/30"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative flex flex-col h-full">
                  {/* Mobile Timeline Node (Dot) connecting to the vertical spine */}
                  <div
                    className="lg:hidden absolute -left-[1.85rem] sm:-left-[2.1rem] top-7 w-5 h-5 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center shadow-sm z-10"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>

                  <Scroll3DCard
                    index={idx}
                    className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-gray-200/90 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full flex-1"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-numbers font-black text-orange-600">
                          {m.year}
                        </span>
                        <span className="text-xs font-bold font-numbers text-slate-500 uppercase tracking-wider">
                          Phase 0{idx + 1}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-navy-900 mb-2 min-h-[3rem] flex items-start leading-snug">
                        {m.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                        {m.desc}
                      </p>
                    </div>
                  </Scroll3DCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Scroll3DSection>

      {/* Leadership & Advisory Team */}
      <Scroll3DSection preset="lift" className="section-padding bg-slate-50 border-t border-gray-200/70">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">Meet the Leadership</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Veterans of <span className="text-brand-gradient">Engineering & Staffing.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A leadership team combining deep systems engineering expertise with senior executive search leadership.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {leadership.map((leader, i) => (
              <Scroll3DCard
                key={i}
                index={i}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full"
              >
                <div className="flex-1 flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-navy-900 text-orange-400 font-bold font-heading text-xl flex items-center justify-center mb-4 shadow-sm shrink-0">
                    {leader.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-0.5">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-orange-600 mb-3">{leader.role}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 flex-1">{leader.bio}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {leader.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Global Footprint */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-white">
        <div className="container-custom">
          <div className="p-8 sm:p-12 rounded-3xl bg-navy-900 text-white relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <SectionReveal variant="tiltLeft" className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold">
                  <Globe2 className="w-3.5 h-3.5" /> Global Infrastructure
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  Headquartered in Texas. Operating Globally.
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Our dual-hub model provides clients and candidates continuous, 24/7 staffing velocity. Client account management and technical interviews are anchored in Plano, Texas, supported by our global recruitment and training center in Hyderabad.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-bold text-sm text-white mb-1">🇺🇸 Plano, Texas (USA)</div>
                    <div className="text-xs text-slate-300">
                      North America Client Services, Executive Search, E-Verify Operations
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-bold text-sm text-white mb-1">🇮🇳 Hyderabad (India)</div>
                    <div className="text-xs text-slate-300">
                      HITEC City Technical Evaluation Hub, 24/7 Sourcing & IT Training
                    </div>
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal variant="tiltRight" className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-3xl font-numbers font-bold text-orange-400 mb-1">100%</div>
                <div className="text-sm font-bold text-white mb-2">Dedicated Placement Advocacy</div>
                <p className="text-xs text-slate-300 mb-6">
                  Ready to accelerate your engineering career or scale your technical team?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button variant="primary" size="md" className="flex-1 justify-center" onClick={onOpenConsultation}>
                    Talk to an Advisor
                  </Button>
                  <Link
                    to="/careers"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center transition-colors border border-white/20 flex items-center justify-center"
                  >
                    Explore Open Jobs
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </Scroll3DSection>
    </div>
  );
};

function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}
