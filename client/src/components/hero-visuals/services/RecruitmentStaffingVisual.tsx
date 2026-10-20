import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle2, Briefcase, Filter, ChevronRight, Award } from 'lucide-react';

const CANDIDATES = [
  {
    role: 'Lead Cloud / SRE Engineer',
    exp: '7+ yrs exp',
    match: 97,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Golang'],
    status: 'Ready for Interview',
  },
  {
    role: 'Senior Full Stack Java Developer',
    exp: '5+ yrs exp',
    match: 94,
    skills: ['Java 17', 'Spring Boot', 'Kafka', 'React'],
    status: 'Ready for Interview',
  },
  {
    role: 'Data Platform Engineer',
    exp: '6+ yrs exp',
    match: 92,
    skills: ['PySpark', 'Snowflake', 'Airflow', 'Python'],
    status: 'Vetted & Cleared',
  },
];

export const RecruitmentStaffingVisual: React.FC = () => {
  const [activeModel, setActiveModel] = useState<'contract' | 'c2h' | 'direct'>('contract');
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Curated Shortlist Dossier</div>
              <div className="text-[10px] text-slate-500">Requisition #STF-2026-08 · Active</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-[10px] font-bold">
            <Clock className="w-3 h-3 text-[#F15A34]" /> 48-72h SLA
          </div>
        </div>

        {/* Hiring Model Selector Switch */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/80 mb-3.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setActiveModel('contract')}
            className={`py-1.5 rounded-lg text-center font-heading transition-all ${
              activeModel === 'contract'
                ? 'bg-white text-[#1F6AA5] font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contract (W-2)
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('c2h')}
            className={`py-1.5 rounded-lg text-center font-heading transition-all ${
              activeModel === 'c2h'
                ? 'bg-white text-[#1F6AA5] font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contract-to-Hire
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('direct')}
            className={`py-1.5 rounded-lg text-center font-heading transition-all ${
              activeModel === 'direct'
                ? 'bg-white text-[#1F6AA5] font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Hire
          </button>
        </div>

        {/* Candidate Stack */}
        <div className="space-y-2.5 mb-3.5">
          {CANDIDATES.map((cand, idx) => (
            <motion.div
              key={cand.role}
              onClick={() => setSelectedIdx(idx)}
              whileHover={{ scale: 1.01 }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-gradient-to-r from-blue-50/70 to-white border-blue-300/80 shadow-sm'
                  : 'bg-white/80 border-slate-200/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    0{idx + 1}
                  </div>
                  <span className="text-xs font-heading font-bold text-[#0B1B2E]">{cand.role}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {cand.match}% Match
                </span>
              </div>

              {/* Match Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#1F6AA5] to-[#F15A34] h-full rounded-full transition-all duration-500"
                  style={{ width: `${cand.match}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex flex-wrap gap-1 text-slate-500">
                  {cand.skills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-slate-400 font-medium shrink-0 ml-2">{cand.exp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Guarantee Pill */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pre-screened by practicing engineers</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">90-Day Guarantee</span>
        </div>
      </div>
    </div>
  );
};
