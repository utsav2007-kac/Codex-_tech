import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, CheckCircle2, Award, Globe2, Briefcase } from 'lucide-react';

export const CareersLifeVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F15A34]">
              <Heart className="w-4 h-4 text-[#F15A34]" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Life at Codex Tech-IT</div>
              <div className="text-[10px] text-slate-500">Internal Culture & Team Openings</div>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            We're Hiring
          </span>
        </div>

        {/* Culture Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-[#1F6AA5] font-heading font-bold mb-1">
              <Globe2 className="w-3.5 h-3.5" /> Remote-First
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Work from anywhere with home office stipends and flexible working hours.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-emerald-600 font-heading font-bold mb-1">
              <Award className="w-3.5 h-3.5" /> Uncapped Bonuses
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Industry-leading commissions for recruiters, account managers & mentors.
            </p>
          </div>
        </div>

        {/* Active Openings Preview */}
        <div className="p-3 rounded-xl bg-slate-900 text-white mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Featured Internal Openings</span>
            <span className="text-[10px] text-orange-400 font-bold">4 Roles Open</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="font-semibold text-slate-200">Senior Technical Recruiter</span>
              <span className="text-[10px] text-slate-400">Full-Time · Remote</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-slate-200">Cloud & DevOps Instructor</span>
              <span className="text-[10px] text-slate-400">Part-Time / Contract</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Equal opportunity employer with healthcare & 401(k)</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">Join Our Pod</span>
        </div>
      </div>
    </div>
  );
};
