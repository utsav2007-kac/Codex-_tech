import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  DollarSign,
  FileText,
  HelpCircle,
  Video,
  Download,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

// 1. Resources Hub Visual (/resources)
export const ResourcesHubVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Engineering Career Vault</div>
              <div className="text-[10px] text-slate-500">Free Tools, Frameworks & Guides</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#F15A34] text-[10px] font-bold">
            100% Free Access
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-emerald-700 font-heading font-bold mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> 2026 Salary Guide
            </div>
            <div className="text-[10px] text-slate-500">Detailed US tech compensation by metro & tier.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[#1F6AA5] font-heading font-bold mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> ATS Resume Kit
            </div>
            <div className="text-[10px] text-slate-500">Proven templates tested across Taleo & Greenhouse.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-purple-700 font-heading font-bold mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> 500+ Question Bank
            </div>
            <div className="text-[10px] text-slate-500">System design & algorithm questions with solutions.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-orange-600 font-heading font-bold mb-1 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> Live Tech Webinars
            </div>
            <div className="text-[10px] text-slate-500">Weekly masterclasses with Staff Engineers.</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <Download className="w-3.5 h-3.5" /> 16,800+ Guides Downloaded
          </span>
          <span className="font-heading font-bold text-[#F15A34]">Updated Weekly</span>
        </div>
      </div>
    </div>
  );
};

// 2. Salary Guide Visual (/resources/salary-guide)
export const SalaryGuideVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">2026 US Tech Compensation Benchmarks</div>
              <div className="text-[10px] text-slate-500">Base Salary, Bonus & Equity Distributions</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Real Market Data
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-[#0B1B2E]">Senior Cloud SRE / DevOps</div>
              <div className="text-[10px] text-slate-500">Austin, Dallas, Remote (Tier 1-2)</div>
            </div>
            <div className="font-heading font-extrabold text-emerald-700">$145k – $185k</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-[#0B1B2E]">Full Stack Java / Spring Microservices</div>
              <div className="text-[10px] text-slate-500">New York, Chicago, Charlotte</div>
            </div>
            <div className="font-heading font-extrabold text-emerald-700">$130k – $165k</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-[#0B1B2E]">Data Platform & AI Engineer</div>
              <div className="text-[10px] text-slate-500">San Francisco, Seattle, Remote</div>
            </div>
            <div className="font-heading font-extrabold text-emerald-700">$150k – $210k</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Calibrated against 2,400+ offers</span>
          <span className="font-heading font-bold text-[#1F6AA5]">Includes Negotiation Scripts</span>
        </div>
      </div>
    </div>
  );
};

// 3. Resume Templates Visual (/resources/resume-templates)
export const ResumeTemplatesVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">ATS-Compliant Engineering Templates</div>
              <div className="text-[10px] text-slate-500">Tested on Workday, Greenhouse & Taleo</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            98% Parse Rate
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-3.5">
          <div className="text-xs font-heading font-bold text-[#0B1B2E] mb-1">Standard 1-Page Minimalist Technical Format</div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
            Clean typography hierarchy, zero multi-column parsing errors, and structured bullet formulas designed for engineering recruiters.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
              .docx Included
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
              LaTeX Ready
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
              Google Docs
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant Free Download
          </span>
          <span className="font-heading font-bold text-[#F15A34]">No Login Required</span>
        </div>
      </div>
    </div>
  );
};

// 4. Interview Question Bank Visual (/resources/interview-question-bank)
export const InterviewBankVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">500+ Technical Interview Flashcards</div>
              <div className="text-[10px] text-slate-500">System Design & Live Coding Rubrics</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
            Curated 2026
          </span>
        </div>

        <div className="space-y-2 mb-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
              System Design
            </span>
            <div className="font-heading font-bold text-[#0B1B2E] mt-1">Design a Distributed Rate Limiter (Token Bucket vs Leaky Bucket)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
              Concurrency
            </span>
            <div className="font-heading font-bold text-[#0B1B2E] mt-1">Java Virtual Threads vs Platform Threads under High I/O</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-slate-500">Includes complete code solutions</span>
          <span className="font-heading font-bold text-[#1F6AA5]">Full Solutions Deck</span>
        </div>
      </div>
    </div>
  );
};

// 5. Webinars Visual (/resources/webinars)
export const WebinarsVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Weekly Live Engineering Masterclasses</div>
              <div className="text-[10px] text-slate-500">Live Q&A with Senior Tech Leaders</div>
            </div>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live Stream
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white mb-3.5 shadow-md">
          <div className="text-[10px] uppercase font-bold text-orange-400 mb-1">Upcoming Masterclass</div>
          <div className="text-sm font-heading font-bold mb-1.5">
            Cracking Tier-1 System Design: Microservices to Serverless
          </div>
          <div className="text-[11px] text-slate-300">
            Hosted by Principal Infrastructure Architect · Ex-AWS
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Free RSVP Open
          </span>
          <span className="font-heading font-bold text-[#F15A34]">Interactive Q&A</span>
        </div>
      </div>
    </div>
  );
};
