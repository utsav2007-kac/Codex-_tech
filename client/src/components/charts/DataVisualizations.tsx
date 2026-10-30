import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, DollarSign } from 'lucide-react';

interface MetricItem {
  track: string;
  rate: number;
  salaryMin: number;
  salaryMax: number;
}

const metricsData: MetricItem[] = [
  { track: 'Cloud Solutions & AWS Architecture', rate: 94, salaryMin: 145, salaryMax: 175 },
  { track: 'DevOps, SRE & Kubernetes', rate: 91, salaryMin: 135, salaryMax: 170 },
  { track: 'Full Stack Java / Node.js', rate: 89, salaryMin: 130, salaryMax: 160 },
  { track: 'Data & AI / Snowflake Engineering', rate: 87, salaryMin: 135, salaryMax: 165 },
  { track: 'QA & Test Automation (Playwright)', rate: 85, salaryMin: 110, salaryMax: 140 },
];

export const DataVisualizations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'placement' | 'salary' | 'timeline'>('placement');
  const [animateWidths, setAnimateWidths] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateWidths(true), 150);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="w-full">
      {/* Metric Tabs Switcher - Light Dark Palette */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('placement');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'placement'
              ? 'bg-[#F15A24] text-white shadow-lg shadow-[#F15A24]/30 border border-[#F15A24]'
              : 'bg-[#243550]/80 hover:bg-[#2C3F60] text-slate-200 hover:text-white border border-slate-600/70 backdrop-blur-sm'
          }`}
          aria-pressed={activeTab === 'placement'}
        >
          <BarChart3 className="w-4 h-4 text-white" />
          <span>Placement Rate by Track</span>
        </button>

        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('salary');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'salary'
              ? 'bg-[#F15A24] text-white shadow-lg shadow-[#F15A24]/30 border border-[#F15A24]'
              : 'bg-[#243550]/80 hover:bg-[#2C3F60] text-slate-200 hover:text-white border border-slate-600/70 backdrop-blur-sm'
          }`}
          aria-pressed={activeTab === 'salary'}
        >
          <DollarSign className="w-4 h-4 text-emerald-300" />
          <span>Compensation Ranges</span>
        </button>

        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('timeline');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'bg-[#F15A24] text-white shadow-lg shadow-[#F15A24]/30 border border-[#F15A24]'
              : 'bg-[#243550]/80 hover:bg-[#2C3F60] text-slate-200 hover:text-white border border-slate-600/70 backdrop-blur-sm'
          }`}
          aria-pressed={activeTab === 'timeline'}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Interview Velocity</span>
        </button>
      </div>

      {/* Main Visual Card - Pure Light-Dark Container */}
      <div className="bg-[#243550]/90 rounded-3xl p-6 sm:p-10 border border-slate-600/80 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto text-white">
        {activeTab === 'placement' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/80">
              <div>
                <h4 className="font-heading font-bold text-base sm:text-lg text-white">
                  Offer Acceptance Rate by Technical Practice
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Percentage of actively coached candidates securing offers within 60 days.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-[#F97316] border border-orange-500/40 text-[10px] font-bold uppercase tracking-wider">
                Benchmark
              </span>
            </div>

            <div className="space-y-4">
              {metricsData.map((m) => (
                <div key={m.track}>
                  <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
                    <span>{m.track}</span>
                    <span className="font-numbers font-bold text-[#F97316] text-sm">{m.rate}%</span>
                  </div>
                  <div className="h-3.5 bg-[#131C2E] rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#F15A24] via-[#EA580C] to-[#3B82F6] rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: animateWidths ? `${m.rate}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/80">
              <div>
                <h4 className="font-heading font-bold text-base sm:text-lg text-white">
                  Annual Compensation Benchmarks (USD)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Current median base offer ranges for placed engineers across Tier-1 US markets.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                Median Base
              </span>
            </div>

            <div className="space-y-5">
              {metricsData.map((m) => {
                const minPercent = ((m.salaryMin - 100) / 100) * 100;
                const widthPercent = ((m.salaryMax - m.salaryMin) / 100) * 100;

                return (
                  <div key={m.track}>
                    <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
                      <span>{m.track}</span>
                      <span className="font-numbers font-bold text-emerald-300 text-sm">
                        ${m.salaryMin}k – ${m.salaryMax}k / yr
                      </span>
                    </div>
                    <div className="h-4 bg-[#131C2E] rounded-full overflow-hidden relative border border-slate-700/80 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#2563EB] to-emerald-400 rounded-full absolute transition-all duration-700 ease-out shadow-sm"
                        style={{
                          left: `${minPercent}%`,
                          width: animateWidths ? `${widthPercent}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#131C2E] rounded-2xl border border-slate-700/80 text-center shadow-lg">
              {/* Radial Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F15A24"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={animateWidths ? '75' : '251.2'}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-numbers font-black text-white">14</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Days</span>
                </div>
              </div>
              <h5 className="font-heading font-bold text-sm text-white mt-3">
                Avg. Time to First Interview
              </h5>
              <p className="text-[11px] text-slate-300 mt-1">
                Compared to 45–60 days via direct cold applications.
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-[#F97316] border border-orange-500/35 text-[10px] font-bold uppercase tracking-wider">
                Benchmark Metric
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h4 className="font-heading font-bold text-base text-white">
                Placement Velocity Milestones
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-[#131C2E] border border-orange-500/40 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F15A24] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-white block font-heading text-sm mb-0.5">
                      Days 1 - 5: Positioning & Portfolio
                    </strong>
                    ATS keyword alignment, live code review, and executive resume positioning.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131C2E] border border-blue-500/40 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-white block font-heading text-sm mb-0.5">
                      Days 6 - 14: Direct Hiring Manager Pitching
                    </strong>
                    Bypassing HR portals with direct advocacy to 180+ verified partner companies.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131C2E] border border-emerald-500/40 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-white block font-heading text-sm mb-0.5">
                      Days 15 - 28: Interview Loops & Offer Selection
                    </strong>
                    Technical debriefs, offer comparison, and data-driven salary negotiation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Aggregated across 2,400+ technical candidate placements</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">2021 – Present · North America</span>
        </div>
      </div>
    </div>
  );
};
