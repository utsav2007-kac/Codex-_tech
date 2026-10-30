import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Repeat,
  Globe2,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileCheck,
  Search,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const WorkforceTalentEcosystem: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number>(84);

  const audienceCards = [
    {
      num: '01',
      tag: 'EARLY CAREER',
      title: 'Students & Fresh Graduates',
      desc: 'Build your resume, professional profile, interview confidence, and a clear path toward your first U.S. technical opportunity.',
      link: '/services/job-placement',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
    },
    {
      num: '02',
      tag: 'SENIOR TECH',
      title: 'Experienced Professionals',
      desc: 'Position your experience for higher-compensation roles, senior cloud architecture, and direct negotiation representation.',
      link: '/services/job-placement',
      icon: Briefcase,
      color: 'text-[#C2410C]',
      bg: 'bg-orange-50/70',
      border: 'border-orange-100',
    },
    {
      num: '03',
      tag: 'CAREER PIVOT',
      title: 'Career Switchers',
      desc: 'Translate your existing professional experience into in-demand tech skill sets with portfolio building and interview coaching.',
      link: '/services/it-training',
      icon: Repeat,
      color: 'text-purple-600',
      bg: 'bg-purple-50/70',
      border: 'border-purple-100',
    },
    {
      num: '04',
      tag: 'GLOBAL TALENT',
      title: 'International Talent',
      desc: 'Navigate U.S. tech hiring expectations with compliant resume positioning, targeted employer outreach, and e-verified visa guidance.',
      link: '/services/job-placement',
      icon: Globe2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
    },
  ];

  return (
    <div id="workforce-talent-ecosystem" className="w-full">
      {/* ─────────────────────────────────────────────────────────────────
          PART 1: LIGHT SECTION — WHO CODEX TECH-IT IS BUILT FOR (4 CARDS)
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#FFFFFF]">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                01 / TARGETED CAREER TRACKS
              </div>
              <h2 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Who Codex Tech-IT <br className="hidden sm:inline" />
                <span className="text-[#C2410C]">Is Built For</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] max-w-md font-normal leading-relaxed">
              Codex Tech-IT supports students, international talent, career switchers, and experienced engineers who want to build a faster, stronger path into the U.S. tech job market.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.num}
                  className={`p-7 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs hover:shadow-lg hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">
                        {card.num} / {card.tag}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center ${card.color} group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-3 leading-snug group-hover:text-[#1D4ED8] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-6 font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A] group-hover:text-[#C2410C] transition-colors pt-4 border-t border-slate-100"
                  >
                    <span>Explore support</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PART 2: HIGH-CONTRAST DARK SPLIT RIBBON BANNER (AS IN IMAGE 3)
          ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#070E1A] text-white border-y border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Candidate Side */}
            <Link
              to="/careers"
              className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-slate-900/60 transition-colors"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#F25C2A] block mb-2">
                  FOR INDIVIDUALS & TALENTED PROFESSIONALS
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-[#F25C2A] transition-colors leading-snug">
                  Looking for your next US opportunity?
                </h3>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                <span>Browse 140+ active requisitions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F25C2A]" />
              </div>
            </Link>

            {/* Employer Side */}
            <Link
              to="/employers"
              className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-slate-900/60 transition-colors"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] block mb-2">
                  FOR EMPLOYERS & EXECUTIVE PARTNERS
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                  Looking for skilled tech talent?
                </h3>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                <span>Request pre-screened candidate cohorts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#38BDF8]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PART 3: WARM PEACH / BUTTER LIGHT SECTION — US CAREER READINESS
          (MATCHING THE DIAGNOSTIC GAUGE & ORBITAL RADAR IN IMAGE 3)
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FFF7ED] border-b border-[#FED7AA]">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C2410C] mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>02 / CAREER INTELLIGENCE SYSTEM</span>
              </div>
              <h2 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Get ready for the US market. <br />
                <span className="text-[#C2410C]">Know what to improve.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] max-w-md font-normal leading-relaxed">
              We help you evaluate how your resume, technical stack, and interview performance stack up against active U.S. hiring manager criteria—then build a practical roadmap to maximize your placement velocity.
            </p>
          </div>

          {/* Interactive Diagnostic Showcase Card (Matching Image 3) */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#FED7AA] shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Overall Score */}
              <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">
                    US CAREER READINESS
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-heading font-extrabold text-6xl sm:text-7xl text-[#0F172A] tabular-nums">
                      {selectedScore}
                    </span>
                    <span className="font-heading font-bold text-2xl text-slate-400">
                      /100
                    </span>
                  </div>
                  {/* Score Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#C2410C] rounded-full transition-all duration-500"
                      style={{ width: `${selectedScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed mb-6 font-normal">
                    <strong>Strong technical foundation.</strong> Your profile has core architectural strengths. Calibrating system design defense and ATS keywords will unlock premium engineering compensation bands.
                  </p>
                </div>

                <Link
                  to="/tools/interview-readiness"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F172A] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Improve My US Career Readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Center Column: Orbital Radar "Career Signals" */}
              <div className="lg:col-span-4 flex items-center justify-center py-6">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none pointer-events-none">
                  {/* Concentric Ellipses / Orbitals */}
                  <div
                    className="absolute inset-0 rounded-full border border-orange-200/80 animate-spin-slow"
                    style={{ animationDuration: '30s' }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border border-dashed border-slate-200"
                    style={{ transform: 'rotate(25deg)' }}
                  />
                  <div
                    className="absolute inset-10 rounded-full border border-blue-200/70"
                    style={{ transform: 'rotate(-45deg)' }}
                  />

                  {/* Pulsing Signal Nodes on Orbit */}
                  <div className="absolute top-4 left-1/3 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-md animate-ping" />
                  <div className="absolute bottom-8 right-10 w-2 h-2 rounded-full bg-blue-600 shadow-md" />
                  <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-emerald-500 shadow-md" />

                  {/* Center Core Badge */}
                  <div className="relative z-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-md text-center max-w-[140px]">
                    <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-slate-400 block mb-1">
                      DIAGNOSTIC
                    </span>
                    <span className="font-heading font-bold text-xs text-[#0F172A] block leading-snug">
                      CAREER SIGNALS
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Diagnostic Progress Meters */}
              <div className="lg:col-span-4 space-y-4 pl-0 lg:pl-4">
                {/* Meter 1 */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#0F172A]">
                      Profile & ATS Keyword Match
                    </span>
                    <span className="text-sm font-heading font-extrabold text-[#C2410C]">
                      84%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-[#C2410C] rounded-full w-[84%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Optimized against Tier-1 enterprise ATS algorithms
                  </span>
                </div>

                {/* Meter 2 */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#0F172A]">
                      Technical Skill Calibration
                    </span>
                    <span className="text-sm font-heading font-extrabold text-[#2563EB]">
                      91%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full w-[91%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Hands-on cloud & distributed architecture defense ready
                  </span>
                </div>

                {/* Meter 3 */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#0F172A]">
                      US Market Demand Alignment
                    </span>
                    <span className="text-sm font-heading font-extrabold text-[#15803D]">
                      76%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-[#15803D] rounded-full w-[76%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    High-demand requisitions active in Texas, NY, and Remote
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PART 4: CLEAN WHITE SECTION — FROM TALENT TO OPPORTUNITY PIPELINE
          (MATCHING THE 3 CONNECTED NODES IN IMAGE 3)
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF]">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                03 / THE WORKFORCE CONNECTION
              </div>
              <h2 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight leading-tight">
                From talent <br className="hidden sm:inline" />
                <span className="text-[#C2410C]">to opportunity.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] max-w-md font-normal leading-relaxed">
              Codex Tech-IT turns technical potential into real market opportunity—connecting vetted talent with the right career path and corporate requisitions.
            </p>
          </div>

          {/* 3 Connected Nodes Pipeline */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
              {/* Node 1: Your Skills */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative z-10">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center mb-4 relative">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-[#C2410C] flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
                </div>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  Your Skills
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Experience · Potential · Ambition
                </p>
              </div>

              {/* Node 2: Connection Center */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-[#FFF7ED] to-[#FFFFFF] border-2 border-[#FED7AA] shadow-md relative z-10">
                <div className="w-20 h-20 rounded-full border-2 border-[#C2410C] flex items-center justify-center mb-4 relative bg-white shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  We Create the Connection
                </h4>
                <p className="text-xs text-[#C2410C] font-semibold">
                  Mentorship · Pipeline · Guidance
                </p>
              </div>

              {/* Node 3: Career Opportunity */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative z-10">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-300 flex items-center justify-center mb-4 relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  Career Opportunity
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Right Role · Right Support · Long-Term
                </p>
              </div>
            </div>

            {/* 4 Bottom Footnotes (Matching Image 3) */}
            <div className="mt-10 pt-8 border-t border-slate-200/70 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A]">01</span>
                <span>Talent drives the path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A]">02</span>
                <span>Direct employer push</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A]">03</span>
                <span>Vetted market alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F172A]">04</span>
                <span>Sustainable career future</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
