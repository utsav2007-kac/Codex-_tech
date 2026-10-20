import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Globe2, ShieldCheck, CheckCircle2, Building2, Users } from 'lucide-react';

export const AboutJourneyVisual: React.FC = () => {
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
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">The Codex Tech-IT Foundation</div>
              <div className="text-[10px] text-slate-500">Established 2018 · Dual US & Global Presence</div>
            </div>
          </div>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1F6AA5] text-[10px] font-bold">
            <Globe2 className="w-3 h-3 text-[#1F6AA5]" /> US & India
          </span>
        </div>

        {/* Impact Milestones */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-xl font-heading font-extrabold text-[#0B1B2E]">2,400+</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Engineers Placed</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-xl font-heading font-extrabold text-[#F15A34]">180+</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Corporate Partners</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-xl font-heading font-extrabold text-[#1F6AA5]">18 Days</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Average Time-to-Offer</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-xl font-heading font-extrabold text-emerald-600">94%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Placement Success Rate</div>
          </div>
        </div>

        {/* Global Offices */}
        <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs mb-3.5">
          <div>
            <div className="font-heading font-bold text-slate-100">Dallas HQ</div>
            <div className="text-[10px] text-slate-400">Richardson, Texas · USA</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-right">
            <div className="font-heading font-bold text-slate-100">Global Tech Center</div>
            <div className="text-[10px] text-slate-400">Surat, Gujarat · India</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>E-Verify Employer · Equal Opportunity</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">Engineering First</span>
        </div>
      </div>
    </div>
  );
};
