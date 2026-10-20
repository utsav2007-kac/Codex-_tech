import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Send, Users, CheckCircle2, Award, Zap, TrendingUp } from 'lucide-react';

const STAGES = [
  { label: 'Targets Curated', count: 32, color: 'border-slate-300 bg-slate-50 text-slate-700' },
  { label: 'Direct Pitching', count: 18, color: 'border-blue-300 bg-blue-50 text-[#1F6AA5]' },
  { label: 'Client Rounds', count: 5, color: 'border-orange-300 bg-orange-50 text-[#F15A34]' },
  { label: 'Offers Secured', count: 2, color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
];

export const JobCampaignsVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F15A34]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Executive Outbound Campaign Board</div>
              <div className="text-[10px] text-slate-500">Reverse-Recruiting & Private Representation</div>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-[10px] font-bold">
            <Zap className="w-3 h-3 text-[#F15A34]" /> Active Campaign
          </span>
        </div>

        {/* Kanban Mini Stage Columns */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {STAGES.map((stg) => (
            <div key={stg.label} className={`p-2 rounded-xl border ${stg.color} text-center`}>
              <div className="text-[10px] font-heading font-bold truncate">{stg.label}</div>
              <div className="text-base font-heading font-extrabold mt-1">{stg.count}</div>
            </div>
          ))}
        </div>

        {/* Live Requisition Highlights */}
        <div className="space-y-2 mb-3.5">
          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-xs font-heading font-bold text-[#0B1B2E]">Principal SRE · FinTech Client</div>
                <div className="text-[10px] text-slate-500">Direct introduction to VP of Infrastructure</div>
              </div>
            </div>
            <span className="text-xs font-heading font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              $165k Offer
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <div className="text-xs font-heading font-bold text-[#0B1B2E]">Lead Data Engineer · HealthTech</div>
                <div className="text-[10px] text-slate-500">Round 3 Completed · Reference Checks</div>
              </div>
            </div>
            <span className="text-xs font-heading font-bold text-[#1F6AA5] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Final Stage
            </span>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Career Director Representation</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">100% Confidential</span>
        </div>
      </div>
    </div>
  );
};
