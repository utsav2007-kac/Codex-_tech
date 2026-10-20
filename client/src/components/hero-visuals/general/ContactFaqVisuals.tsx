import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, Phone, MessageSquare, Clock, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

// FAQ Companion Visual
export const FaqHelperVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F15A34]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Instant Knowledge Base</div>
              <div className="text-[10px] text-slate-500">Fast Answers & Candidate Guidance</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Live Support
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="font-heading font-bold text-[#0B1B2E] mb-1">
              "Is standard job placement really 100% free for candidates?"
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Yes. Partner employers pay recruitment search fees upon successful hiring. You never pay a candidate placement fee.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="font-heading font-bold text-[#0B1B2E] mb-1">
              "How quickly do I get introduced to hiring managers?"
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Once your resume is optimized and mock rounds are complete, candidate profiles are typically pitched within 48 to 72 business hours.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Need specific answers?</span>
          <span className="font-heading font-bold text-[#F15A34]">Chat via WhatsApp</span>
        </div>
      </div>
    </div>
  );
};

// Contact Companion Visual
export const ContactVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Direct Advisory Desk</div>
              <div className="text-[10px] text-slate-500">Connect with an Engineering Career Director</div>
            </div>
          </div>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> &lt;2h Response
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#F15A34]" />
              <div>
                <div className="font-heading font-bold text-[#0B1B2E]">United States Headquarters</div>
                <div className="text-[10px] text-slate-500">Richardson, TX 75080 · +1 (972) 808-7278</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              HQ
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#1F6AA5]" />
              <div>
                <div className="font-heading font-bold text-[#0B1B2E]">Candidate Inquiries</div>
                <div className="text-[10px] text-slate-500">info@codextechit.com</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Email
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultation is 100% confidential</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">Book Call</span>
        </div>
      </div>
    </div>
  );
};
