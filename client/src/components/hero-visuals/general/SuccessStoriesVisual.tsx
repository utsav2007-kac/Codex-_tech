import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Quote, CheckCircle2, TrendingUp, Building2, Sparkles } from 'lucide-react';

const RECENT_PLACEMENTS = [
  {
    name: 'Priya S.',
    from: 'QA Automation → Senior SRE',
    package: '$148,000',
    company: 'FinTech Enterprise',
    days: '19 Days',
  },
  {
    name: 'Marcus K.',
    from: 'Career Gap → Lead Java Dev',
    package: '$162,000',
    company: 'HealthTech SaaS',
    days: '22 Days',
  },
];

export const SuccessStoriesVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Alumni Placement Highlights</div>
              <div className="text-[10px] text-slate-500">Verified Offers & Career Transformations</div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            4.9/5 Rating (450+ Reviews)
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="space-y-3 mb-4">
          {RECENT_PLACEMENTS.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-heading font-bold text-[#0B1B2E]">{p.name}</span>
                <span className="text-xs font-heading font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {p.package} Offer
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium mb-2">{p.from}</div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Building2 className="w-3 h-3 text-[#1F6AA5]" /> {p.company}
                </span>
                <span className="text-orange-600 font-bold">Placed in {p.days}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats Triplet */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-white text-center mb-3.5">
          <div>
            <div className="text-sm font-heading font-extrabold text-orange-400">94.2%</div>
            <div className="text-[9px] text-slate-400">Placement Rate</div>
          </div>
          <div>
            <div className="text-sm font-heading font-extrabold text-blue-400">+38%</div>
            <div className="text-[9px] text-slate-400">Avg Salary Hike</div>
          </div>
          <div>
            <div className="text-sm font-heading font-extrabold text-emerald-400">2,400+</div>
            <div className="text-[9px] text-slate-400">Offers Verified</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documented & verified candidate reviews</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">100% Real Stories</span>
        </div>
      </div>
    </div>
  );
};
