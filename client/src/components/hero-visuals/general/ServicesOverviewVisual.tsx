import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, GraduationCap, ArrowRight, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

export const ServicesOverviewVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F15A34]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Codex Services Architecture</div>
              <div className="text-[10px] text-slate-500">Enterprise Staffing & Candidate Advocacy</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1F6AA5] text-[10px] font-bold">
            9 Specialized Solutions
          </span>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-2.5 mb-4">
          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-[#F15A34] flex items-center justify-center border border-orange-200 shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-heading font-bold text-[#0B1B2E]">Candidate Career Acceleration</div>
                <div className="text-[10px] text-slate-500">Placement, Rebranding & Reverse Recruiting</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded border border-orange-200">
              18 Days Avg
            </span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-[#1F6AA5] flex items-center justify-center border border-blue-200 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-heading font-bold text-[#0B1B2E]">Enterprise Technical Staffing</div>
                <div className="text-[10px] text-slate-500">Contract, C2H, Direct Hire & RPO Pods</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#1F6AA5] bg-white px-2 py-0.5 rounded border border-blue-200">
              48-72h Shortlist
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-heading font-bold text-[#0B1B2E]">Production IT Bootcamps</div>
                <div className="text-[10px] text-slate-500">Java, Python, AWS, DevOps & Data Platforms</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              100% Labs
            </span>
          </div>
        </div>

        {/* Global Impact Stat Bar */}
        <div className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-around text-center mb-3.5">
          <div>
            <div className="text-sm font-heading font-extrabold text-orange-400">2,400+</div>
            <div className="text-[9px] text-slate-400">Total Placed</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="text-sm font-heading font-extrabold text-blue-400">180+</div>
            <div className="text-[9px] text-slate-400">Employer Partners</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="text-sm font-heading font-extrabold text-emerald-400">$142,000</div>
            <div className="text-[9px] text-slate-400">Avg Tech Offer</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>E-Verify & Certified Corporate Network</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">US & Global</span>
        </div>
      </div>
    </div>
  );
};
