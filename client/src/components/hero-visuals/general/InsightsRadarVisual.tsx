import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Newspaper, Sparkles, CheckCircle2, Globe2 } from 'lucide-react';

export const InsightsRadarVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Codex Market Intelligence</div>
              <div className="text-[10px] text-slate-500">Tech Hiring Index & Compensation Trends</div>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1F6AA5] text-[10px] font-bold">
            Q4 2026 Analysis
          </span>
        </div>

        {/* Market Trend Snippets */}
        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading font-bold text-[#0B1B2E]">AI & Data Engineering Surges +54%</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">High Demand</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Enterprises shifting budget from legacy maintenance to real-time vector pipelines and LLM inference clusters.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading font-bold text-[#0B1B2E]">SRE & Cloud Cost Governance</span>
              <span className="text-[10px] font-bold text-[#1F6AA5] bg-blue-50 px-1.5 py-0.2 rounded">Core Metric</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Hiring managers prioritizing candidates with demonstrable FinOps cost-reduction records alongside Kubernetes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Authored by Tech Directors & Corporate Recruiters</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">Weekly Intel</span>
        </div>
      </div>
    </div>
  );
};
