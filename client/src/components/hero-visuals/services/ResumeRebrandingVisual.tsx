import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, CheckCircle2, XCircle, TrendingUp, Sparkles } from 'lucide-react';

export const ResumeRebrandingVisual: React.FC = () => {
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');

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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">ATS Optimization Engine</div>
              <div className="text-[10px] text-slate-500">Executive Technical Resume Audit</div>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setViewMode('before')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'before'
                  ? 'bg-rose-100 text-rose-800 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setViewMode('after')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'after'
                  ? 'bg-emerald-100 text-emerald-800 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              After (Codex)
            </button>
          </div>
        </div>

        {/* ATS Score Comparison Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 mb-3.5">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              {viewMode === 'after' ? 'Codex Rebranded Profile' : 'Original Cold Resume'}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              {viewMode === 'after'
                ? 'High-impact quantifiable metrics & keywords'
                : 'Generic job descriptions & missing ATS parsers'}
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl font-heading font-extrabold text-base flex items-center gap-1 ${
              viewMode === 'after'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{viewMode === 'after' ? '96%' : '51%'}</span>
            <span className="text-[10px] font-sans font-medium">ATS</span>
          </div>
        </div>

        {/* Content Snippet Comparison */}
        <div className="space-y-2 mb-3.5 text-xs">
          {viewMode === 'after' ? (
            <>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                <div className="flex items-center gap-1.5 text-emerald-800 font-heading font-bold text-xs mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Architecture & Latency Impact</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                  "Architected distributed Kafka microservices processing 4.2M events/day, reducing p99 latency from 450ms to 62ms."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                <div className="flex items-center gap-1.5 text-emerald-800 font-heading font-bold text-xs mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cloud Cost Optimization</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                  "Led multi-region AWS EKS migration with Terraform, saving $140K annual infrastructure spend."
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                <div className="flex items-center gap-1.5 text-rose-800 font-heading font-bold text-xs mb-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Vague Responsibility (No Metrics)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  "Responsible for building microservices using Java and working with database systems."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                <div className="flex items-center gap-1.5 text-rose-800 font-heading font-bold text-xs mb-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Missing Keyword Density</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  "Helped with deployment scripts and worked with the cloud team on maintenance."
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Metric */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>4.8x Higher Recruiter Interview Requests</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">LinkedIn SEO Included</span>
        </div>
      </div>
    </div>
  );
};
