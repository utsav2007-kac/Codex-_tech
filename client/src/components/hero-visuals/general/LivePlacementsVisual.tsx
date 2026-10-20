import React from 'react';
import { motion } from 'framer-motion';
import { Radio, MapPin, DollarSign, Clock, ShieldCheck, Zap } from 'lucide-react';

const RECENT_FEED = [
  { role: 'Cloud DevOps Engineer', loc: 'Dallas, TX', pkg: '$152,000', ago: '18m ago', type: 'Direct Hire' },
  { role: 'Senior Python / AI Engineer', loc: 'Austin, TX', pkg: '$168,000', ago: '1h ago', type: 'Contract' },
  { role: 'Full Stack Java Developer', loc: 'Remote (US)', pkg: '$140,000', ago: '3h ago', type: 'Contract-to-Hire' },
  { role: 'Data Platform Architect', loc: 'New York, NY', pkg: '$175,000', ago: '5h ago', type: 'Direct Hire' },
];

export const LivePlacementsVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Live Placement Stream</div>
              <div className="text-[10px] text-slate-500">Real-Time Offers & Client Placements</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Streaming Live
          </div>
        </div>

        {/* Live Ticker Feed */}
        <div className="space-y-2 mb-3.5">
          {RECENT_FEED.map((item, idx) => (
            <motion.div
              key={item.role + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-heading font-bold text-[#0B1B2E]">{item.role}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {item.loc}
                  </span>
                  <span>•</span>
                  <span className="text-[#1F6AA5] font-medium">{item.type}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                  {item.pkg}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">{item.ago}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate Ticker Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-[#F15A34]" />
            <span>Avg 18 Days from Intake to Signed Offer</span>
          </div>
          <span className="font-heading font-bold text-[#1F6AA5]">E-Verified</span>
        </div>
      </div>
    </div>
  );
};
