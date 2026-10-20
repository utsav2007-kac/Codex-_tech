import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle2, Shield, Calendar, Building, Landmark } from 'lucide-react';

export const PayrollTaxesVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Multi-State Employer of Record</div>
              <div className="text-[10px] text-slate-500">All 50 US States · W-2, 1099, C2C</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            <Shield className="w-3 h-3 text-emerald-600" /> 100% Tax Compliant
          </span>
        </div>

        {/* Live Pay-Run Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-navy-900 text-white mb-3.5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Current Pay Cycle</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Direct Deposit Active
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="text-xl font-heading font-extrabold text-white">$482,650.00</div>
              <div className="text-[10px] text-slate-400">Total Bi-Weekly Payroll Disbursed</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-orange-400">100% On-Time</div>
              <div className="text-[10px] text-slate-400">0 Overdue Filings</div>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#F15A34] to-emerald-400 h-full rounded-full w-full" />
          </div>
        </div>

        {/* Compliance Tax Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">State & Local Withholding</div>
            <div className="text-xs font-heading font-bold text-[#0B1B2E] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Automated 50 States
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">Year-End Tax Forms</div>
            <div className="text-xs font-heading font-bold text-[#0B1B2E] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> W-2 & 1099-NEC Digital
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="text-[10px] text-slate-500">Penalty-free payroll guarantee</span>
          <span className="font-heading font-bold text-[#F15A34]">Insured & Bonded</span>
        </div>
      </div>
    </div>
  );
};
