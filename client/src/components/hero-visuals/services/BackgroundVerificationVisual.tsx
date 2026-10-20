import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock, Lock, FileCheck, Building2 } from 'lucide-react';

const CHECKS = [
  { title: 'SSN & Identity Validation', agency: 'E-Verify & SSA Database', status: 'Cleared', time: 'Instant' },
  { title: 'Multi-State Criminal History', agency: 'Federal & County Courthouses', status: 'Cleared', time: '12h' },
  { title: 'Previous Employment Verification', agency: 'Direct HR & Payroll Cross-Check', status: 'Verified', time: '24h' },
  { title: 'Academic Degree & Credential', agency: 'National Student Clearinghouse', status: 'Confirmed', time: '18h' },
];

export const BackgroundVerificationVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Enterprise Screening Dossier</div>
              <div className="text-[10px] text-slate-500">FCRA & SOC2 Type II Certified</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            <Lock className="w-3 h-3 text-emerald-600" /> 100% Verified
          </span>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-2.5 mb-4">
          {CHECKS.map((chk, i) => (
            <motion.div
              key={chk.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-heading font-bold text-[#0B1B2E]">{chk.title}</div>
                  <div className="text-[10px] text-slate-500">{chk.agency}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-emerald-200 text-emerald-700 shadow-2xs">
                  {chk.status}
                </span>
                <div className="text-[9px] text-slate-400 mt-0.5">{chk.time}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SLA & Compliance Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#1F6AA5]" />
            <span>24 to 48-Hour Turnaround SLA</span>
          </div>
          <span className="font-heading font-bold text-emerald-700">Audit-Ready</span>
        </div>
      </div>
    </div>
  );
};
