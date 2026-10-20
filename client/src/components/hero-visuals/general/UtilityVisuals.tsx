import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, CheckCircle2, Lock, Sparkles, ArrowRight, AlertCircle, Compass } from 'lucide-react';

// Legal Pages Visual
export const LegalShieldVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-slate-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Compliance & Privacy Seal</div>
              <div className="text-[10px] text-slate-500">Enterprise Data Governance & Protection</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Verified Active
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-slate-700">256-Bit TLS / AES Encryption</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Secured</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-[#1F6AA5]" />
              <span className="font-medium text-slate-700">FCRA & Federal Privacy Adherence</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Compliant</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A34]" />
              <span className="font-medium text-slate-700">Zero Third-Party Data Reselling</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Guaranteed</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Regularly audited policies</span>
          <span className="font-heading font-bold text-[#1F6AA5]">Codex Legal</span>
        </div>
      </div>
    </div>
  );
};

// Thank-You Page Visual
export const ThankYouVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Transmission Confirmed</div>
              <div className="text-[10px] text-slate-500">Requisition Queued for Engineering Review</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Step 1 of 3
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-heading font-bold text-emerald-950">Intake Received</div>
              <div className="text-[10px] text-emerald-800">Your profile is registered in our private system.</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
              2
            </div>
            <div>
              <div className="font-heading font-bold text-[#0B1B2E]">Profile Audit & Requisition Match</div>
              <div className="text-[10px] text-slate-500">A Senior Technical Lead reviews your stack in 24 hours.</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
              3
            </div>
            <div>
              <div className="font-heading font-bold text-[#0B1B2E]">1-on-1 Consultation Call</div>
              <div className="text-[10px] text-slate-500">We outline matching opportunities and compensation goals.</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Need urgent assistance?</span>
          <span className="font-heading font-bold text-[#F15A34]">Call (972) 808-7278</span>
        </div>
      </div>
    </div>
  );
};

// 404 Not Found Visual
export const NotFoundVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Route Compass</div>
              <div className="text-[10px] text-slate-500">Status 404 · Unmapped Path</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
            Redirect Ready
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white mb-3.5">
          <div className="text-[10px] text-orange-400 font-mono mb-1">// Error 404: route_not_found</div>
          <div className="text-sm font-heading font-bold mb-1">
            Looking for Codex Tech-IT Career Services?
          </div>
          <div className="text-[11px] text-slate-300">
            Navigate back to our verified engineering placements, training bootcamps, or open career opportunities.
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Let's get you back on track</span>
          <span className="font-heading font-bold text-[#1F6AA5]">Explore Services →</span>
        </div>
      </div>
    </div>
  );
};
