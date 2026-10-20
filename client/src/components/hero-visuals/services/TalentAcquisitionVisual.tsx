import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

const FUNNEL_STAGES = [
  { label: 'Outbound Sourced', count: '164', pct: '100%', color: 'bg-blue-500' },
  { label: 'Technical Assessment', count: '48', pct: '29%', color: 'bg-blue-600' },
  { label: 'Hiring Manager Rounds', count: '14', pct: '9%', color: 'bg-[#F15A34]' },
  { label: 'Direct Offers Accepted', count: '6', pct: '4%', color: 'bg-emerald-500' },
];

export const TalentAcquisitionVisual: React.FC = () => {
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
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Embedded RPO Talent Engine</div>
              <div className="text-[10px] text-slate-500">Dedicated Technical Recruiting Pod</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            Live ATS Sync
          </span>
        </div>

        {/* Metric Triplet */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-[10px] text-slate-500 font-medium">Avg Time-to-Hire</div>
            <div className="text-sm font-heading font-extrabold text-[#1F6AA5] flex items-center justify-center gap-0.5 mt-0.5">
              <Clock className="w-3 h-3 text-[#1F6AA5]" /> 16 Days
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-[10px] text-slate-500 font-medium">Cost Savings</div>
            <div className="text-sm font-heading font-extrabold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
              <DollarSign className="w-3 h-3 text-emerald-600" /> -58%
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-[10px] text-slate-500 font-medium">Offer Acceptance</div>
            <div className="text-sm font-heading font-extrabold text-[#F15A34] flex items-center justify-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3 text-[#F15A34]" /> 92.4%
            </div>
          </div>
        </div>

        {/* Visual Funnel */}
        <div className="mb-4">
          <div className="text-[11px] font-heading font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>Engineering Pipeline Throughput</span>
            <span className="text-[10px] text-slate-400 font-normal">Sprint 42 Calibration</span>
          </div>

          <div className="space-y-2">
            {FUNNEL_STAGES.map((stg, i) => (
              <div key={stg.label} className="flex items-center gap-2.5">
                <div className="w-28 text-[11px] font-medium text-slate-600 truncate">{stg.label}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stg.pct }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${stg.color}`}
                  />
                </div>
                <div className="w-9 text-right text-xs font-heading font-bold text-[#0B1B2E]">{stg.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Badges */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="text-[10px] text-slate-500 font-medium">ATS Integrations:</span>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
            <span className="px-2 py-0.5 rounded bg-slate-100">Greenhouse</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">Lever</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">Workday</span>
          </div>
        </div>
      </div>
    </div>
  );
};
