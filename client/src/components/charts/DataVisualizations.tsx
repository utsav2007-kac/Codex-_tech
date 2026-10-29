import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, DollarSign, Award, ShieldCheck } from 'lucide-react';

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
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('placement');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'placement'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-navy-900 border border-gray-200'
          }`}
          aria-pressed={activeTab === 'placement'}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Placement Rate by Track</span>
        </button>

        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('salary');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'salary'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-navy-900 border border-gray-200'
          }`}
          aria-pressed={activeTab === 'salary'}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Compensation Ranges</span>
        </button>

        <button
          onClick={() => {
            setAnimateWidths(false);
            setActiveTab('timeline');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-navy-900 border border-gray-200'
          }`}
          aria-pressed={activeTab === 'timeline'}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Interview Velocity</span>
        </button>
      </div>

      {/* Main Visual Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card max-w-4xl mx-auto">
        {activeTab === 'placement' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-heading font-bold text-base sm:text-lg text-navy-900">
                  Offer Acceptance Rate by Technical Practice
                </h4>
                <p className="text-xs text-slate-500">
                  Percentage of actively coached candidates securing offers within 60 days.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Sample data
              </span>
            </div>

            <div className="space-y-4">
              {metricsData.map((m) => (
                <div key={m.track}>
                  <div className="flex justify-between text-xs font-semibold text-navy-900 mb-1.5">
                    <span>{m.track}</span>
                    <span className="font-numbers font-bold text-orange-600">{m.rate}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 rounded-full transition-all duration-700 ease-out"
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
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-heading font-bold text-base sm:text-lg text-navy-900">
                  Annual Compensation Benchmarks (USD)
                </h4>
                <p className="text-xs text-slate-500">
                  Current median base offer ranges for placed engineers across Tier-1 US markets.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Sample data
              </span>
            </div>

            <div className="space-y-5">
              {metricsData.map((m) => {
                const minPercent = ((m.salaryMin - 100) / 100) * 100;
                const widthPercent = ((m.salaryMax - m.salaryMin) / 100) * 100;

                return (
                  <div key={m.track}>
                    <div className="flex justify-between text-xs font-semibold text-navy-900 mb-1.5">
                      <span>{m.track}</span>
                      <span className="font-numbers font-bold text-emerald-700">
                        ${m.salaryMin}k – ${m.salaryMax}k / yr
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full absolute transition-all duration-700 ease-out"
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
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-gray-100 text-center">
              {/* Radial Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F25C2A"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={animateWidths ? '75' : '251.2'}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-numbers font-black text-navy-900">14</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Days</span>
                </div>
              </div>
              <h5 className="font-heading font-bold text-sm text-navy-900 mt-3">
                Avg. Time to First Interview
              </h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Compared to 45–60 days via direct cold applications.
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Illustration
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h4 className="font-heading font-bold text-base text-navy-900">
                Placement Velocity Milestones
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-navy-900 block font-heading">Days 1 - 5: Positioning & Portfolio</strong>
                    ATS keyword alignment, live code review, and executive resume positioning.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-navy-900 block font-heading">Days 6 - 14: Direct Hiring Manager Pitching</strong>
                    Bypassing HR portals with direct advocacy to 180+ verified partner companies.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-navy-900 block font-heading">Days 15 - 28: Interview Loops & Offer Selection</strong>
                    Technical debriefs, offer comparison, and data-driven salary negotiation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen Reader Accessible Data Table Fallback */}
        <table className="sr-only">
          <caption>Codex Tech-IT Engineering Placement and Compensation Benchmarks</caption>
          <thead>
            <tr>
              <th scope="col">Technical Practice</th>
              <th scope="col">Placement Rate (%)</th>
              <th scope="col">Base Salary Range (USD)</th>
            </tr>
          </thead>
          <tbody>
            {metricsData.map((row) => (
              <tr key={row.track}>
                <td>{row.track}</td>
                <td>{row.rate}%</td>
                <td>
                  ${row.salaryMin},000 - ${row.salaryMax},000
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
