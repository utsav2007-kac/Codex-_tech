import React from 'react';
import { Calendar, CheckCircle2, TrendingUp, Award, Sparkles } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  desc: string;
  badge: string;
}

const milestones: Milestone[] = [
  {
    year: '2021',
    title: 'Founded in Plano, Texas',
    desc: 'Launched by veteran cloud architects and technical recruiting leaders to replace mass application spam with direct hiring manager advocacy.',
    badge: 'Inception',
  },
  {
    year: '2023',
    title: 'Crossed 1,000 Placements',
    desc: 'Expanded into direct Tier-1 vendor partnerships across Fortune 500 FinTech, Healthcare, and Enterprise Cloud sectors.',
    badge: '1,000+ Placed',
  },
  {
    year: '2025',
    title: 'Hyderabad Global Delivery Hub',
    desc: 'Inaugurated our 24/7 global talent screening and IT bootcamp center in HITEC City, scaling mock interview and training capacity.',
    badge: 'Global Scale',
  },
  {
    year: '2026',
    title: 'AI Diagnostic Benchmarking',
    desc: 'Launched live ATS calibration diagnostics, interview telemetry scoring, and expanded to 180+ active hiring partners nationwide.',
    badge: 'Present Day',
  },
];

export const Since2021Timeline: React.FC = () => {
  return (
    <div className="w-full">
      {/* Top Experience Counter Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 pb-6 border-b border-gray-200/80 gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Since 2021 Milestone Trajectory</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">
            5+ Years of Technical Placement Excellence
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Built from enterprise engineering frustrations into a high-velocity, dual-continent talent infrastructure.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-navy-900 to-navy-800 text-white p-5 rounded-2xl shadow-md shrink-0">
          <div className="text-4xl font-numbers font-black text-orange-400">5+</div>
          <div className="text-xs font-heading font-semibold leading-snug">
            Years of Proven <br />
            <span className="text-slate-300 font-normal">Direct Corporate Placements</span>
          </div>
        </div>
      </div>

      {/* Horizontal / Responsive Timeline Grid */}
      <div className="relative">
        {/* Connecting Progress Bar Line (Desktop) */}
        <div
          className="hidden lg:block absolute top-12 left-10 right-10 h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-emerald-500 rounded-full z-0 pointer-events-none opacity-40"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {milestones.map((m, idx) => (
            <div
              key={m.year}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-orange-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Year Marker & Node */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-numbers font-black text-navy-900 group-hover:text-orange-600 transition-colors">
                    {m.year}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-gray-200">
                    {m.badge}
                  </span>
                </div>

                {/* Node Dot */}
                <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-100 mb-4 transition-transform group-hover:scale-125" />

                <h4 className="font-heading font-bold text-base text-navy-900 mb-2 leading-snug">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {m.desc}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-orange-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Verified Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
