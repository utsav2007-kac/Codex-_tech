import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Network,
  Sparkles,
  Award,
} from 'lucide-react';

interface ScrollExperienceSceneProps {
  onOpenConsultation?: () => void;
}

export const ScrollExperienceScene: React.FC<ScrollExperienceSceneProps> = ({ onOpenConsultation }) => {
  const [activePhase, setActivePhase] = useState(0);

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

  return (
    <section
      className="relative overflow-hidden bg-[#070E1A] text-white py-16 sm:py-24 my-0 selection:bg-orange-500/30 selection:text-orange-400 border-t border-b border-white/10"
      aria-label="3-Phase Acceleration Engine"
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
        {/* The 3-Phase Accelerator Roadmap Cards */}
        <div className="mb-14">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs font-semibold text-orange-400 mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Engineered Placement Process</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight">
              The 3-Phase Acceleration Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
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
