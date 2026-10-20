import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Gift, ArrowRight, CheckCircle2, Users, Sparkles, Send } from 'lucide-react';

export const ReferEarnVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Referral Equity Engine</div>
              <div className="text-[10px] text-slate-500">Uncapped Cash Rewards for Tech Talent</div>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            $1,000 / Placement
          </span>
        </div>

        {/* 3 Step Visual */}
        <div className="space-y-2 mb-3.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1F6AA5] flex items-center justify-center text-xs font-bold shrink-0">
              1
            </div>
            <div className="text-xs">
              <div className="font-heading font-bold text-[#0B1B2E]">Share Your Referral Link</div>
              <div className="text-[10px] text-slate-500">Send your custom link to friends, peers, or alumni.</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F15A34] flex items-center justify-center text-xs font-bold shrink-0">
              2
            </div>
            <div className="text-xs">
              <div className="font-heading font-bold text-[#0B1B2E]">Candidate Completes Placement</div>
              <div className="text-[10px] text-slate-500">Our career team advocates, places, and onboards them.</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              3
            </div>
            <div className="text-xs">
              <div className="font-heading font-bold text-emerald-900">Direct $1,000 Payout</div>
              <div className="text-[10px] text-emerald-700">Receive via direct deposit or wire immediately on start.</div>
            </div>
          </div>
        </div>

        {/* Aggregate Payouts Card */}
        <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between mb-3.5">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Referral Payouts in 2026</div>
            <div className="text-xl font-heading font-extrabold text-emerald-400">$128,000+</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Average Payout Time</div>
            <div className="text-xs font-bold text-orange-400">Under 48 Hours</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero limit on the number of referrals you can submit</span>
          </div>
          <span className="font-heading font-bold text-[#1F6AA5]">Instant Tracking</span>
        </div>
      </div>
    </div>
  );
};
