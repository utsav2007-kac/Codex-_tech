import React from 'react';
import {
  Compass,
  Clock,
  Briefcase,
  ShieldCheck,
  Star,
  CheckCircle2,
  Award,
  Zap,
  Users,
  Layers,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const ThreeColumnHighlight: React.FC = () => {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="eyebrow justify-center">Strategic Advantages</div>
        <h2 className="text-h2 text-navy-900 mb-3">
          Why Job Seekers & Employers <span className="text-brand-gradient">Choose Codex Tech-IT</span>
        </h2>
        <p className="text-slate-600 text-sm">
          A balanced, high-integrity talent ecosystem engineered to eliminate recruiting friction for both candidates and enterprise hiring managers.
        </p>
      </div>

      {/* 3-Column Grid matching Reference Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Column 1: For Job Seekers (Soft Card) */}
        <div className="rounded-3xl p-8 bg-slate-50/90 border border-gray-200 shadow-sm flex flex-col justify-between h-full hover:border-gray-300 transition-colors">
          <div>
            {/* Pill Badge Header */}
            <div className="inline-block px-3.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 text-[11px] font-bold uppercase tracking-wider mb-6 shadow-xs">
              For Job Seekers
            </div>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Personalized Job Matching
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    We connect you with roles that build long-term careers, not just quick short-term placements.
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Faster Interview Scheduling
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Our direct client relationships secure interviews within 10–21 days, so you're not stuck waiting.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    End-to-End Placement Support
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    From ATS resume reconstruction to offer benchmarking and salary negotiation, we guide every step.
                  </p>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Access to Verified US Employers
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Work exclusively with vetted companies across finance, cloud, and healthcare nationwide.
                  </p>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Confidence Before Interviews
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Live coding walkthroughs and STAR behavioral mock sessions guarantee you walk in prepared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Center HIGHLIGHTED LIGHT CARD (Soft Sky/Butter, 2px Orange Border, Our Edge Chip) */}
        <div className="rounded-3xl p-8 bg-gradient-to-b from-[#E8F2FF] via-[#FFF4D6]/40 to-white text-[#0F172A] border-2 border-[#F25C2A] shadow-xl ring-4 ring-orange-500/10 relative flex flex-col justify-between h-full transform lg:-translate-y-2">
          {/* Subtle Warm Ambiance */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-orange-400/10 rounded-full filter blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Center Pill Badge & "Our edge" Chip */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] border border-orange-300 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Our edge
              </span>
              <span className="text-xs font-semibold text-slate-600">
                What makes Codex different
              </span>
            </div>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] mb-1">
                    Quality Over Random Applications
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    We never spam job portals. Every application is surgically tailored to candidate strengths and client needs.
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] mb-1">
                    Service Level Refund Assurances
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    If recruitment milestones aren't fulfilled under our agreed terms, our SLA includes guaranteed protection.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] mb-1">
                    Direct Full-Time & Contract Roles
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    We focus on stable roles with legitimate companies offering high compensation and visa compliance.
                  </p>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] mb-1">
                    Interview-Ready Candidates
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    Every professional passes technical assessment rounds and communications coaching before meeting clients.
                  </p>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] mb-1">
                    Speed Without Chaos
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    Our recruiters operate methodically, securing client offers faster without sacrificing architectural depth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: For Employers (Soft Card) */}
        <div className="rounded-3xl p-8 bg-slate-50/90 border border-gray-200 shadow-sm flex flex-col justify-between h-full hover:border-gray-300 transition-colors">
          <div>
            {/* Pill Badge Header */}
            <div className="inline-block px-3.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 text-[11px] font-bold uppercase tracking-wider mb-6 shadow-xs">
              For Employers
            </div>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">
                    Industry-Focused Hiring
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    We understand cloud, data, and dev architecture deeply to deliver candidates who hit the ground running.
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">
                    Pre-Screened Candidates
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Save engineering interview cycles by reviewing only thoroughly vetted, coding-assessed talent.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">
                    Faster Hiring Cycles
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Our 48-hour shortlists eliminate requisition drag, cutting typical 60-day hiring cycles in half.
                  </p>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">
                    Flexible Workforce Solutions
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    From direct hire and C2H to full recruitment process outsourcing (RPO) pods, we scale to your need.
                  </p>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">
                    Compliance & Payroll Support
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Multi-state tax compliance, E-Verify validation, and background checks handled end-to-end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
