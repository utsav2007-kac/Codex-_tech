import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  Layers,
  ChevronDown,
  Calculator,
  Briefcase,
  FileCheck2,
  Compass,
  Zap,
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface ServiceDataProps {
  service: {
    slug: string;
    title: string;
    tagline: string;
    overview: string;
    whoItsFor: string[];
    whatsIncluded: string[];
    process: { step: string; title: string; desc: string }[];
    benefits: { title: string; desc: string }[];
    miniCaseStudy: { title: string; role: string; challenge: string; solution: string; result: string };
    faqs: { q: string; a: string }[];
  };
  onOpenConsultation: () => void;
}

export const EnterpriseStaffingTemplate: React.FC<ServiceDataProps> = ({ service, onOpenConsultation }) => {
  const [headcount, setHeadcount] = useState<number>(3);
  const [modelType, setModelType] = useState<'contract' | 'c2h' | 'direct'>('contract');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Requisition speed calculation based on model
  const slaDays = modelType === 'contract' ? '48-72 Hours' : modelType === 'c2h' ? '5-7 Days' : '10-14 Days';
  const estimatedWeeklyVelocity = headcount * 40;

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0F172A] overflow-hidden">
      {/* ── 1. ARCHITECTURAL BLUEPRINT ENTERPRISE HERO (DARK NAVY ACCENT BAND) ── */}
      <section className="relative pt-14 pb-20 bg-[#070E1A] text-white border-b border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Enterprise Positioning */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise Technical Workforce · Template B</span>
              </div>

              <h1 className="text-h1 font-heading font-extrabold text-white tracking-tight leading-tight mb-5">
                {service.title}
              </h1>

              <p className="text-lg text-emerald-400 font-semibold mb-4 leading-snug">
                {service.tagline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
                {service.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Request Dedicated Pod <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  to="/employers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-sm font-semibold text-white transition-colors"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Employer Solutions Deck</span>
                </Link>
              </div>

              {/* SLA Indicators */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 w-full text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">SLA Delivery</span>
                  <span className="font-heading font-bold text-white text-sm">48-72h Shortlists</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Compliance</span>
                  <span className="font-heading font-bold text-emerald-400 text-sm">Multi-State W-2</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Pass Rate</span>
                  <span className="font-heading font-bold text-white text-sm">89% Interview Pass</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Pod Scaling & Requisition Matrix */}
            <div className="lg:col-span-5">
              <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Calculator className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">
                        Requisition Pod Estimator
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">Enterprise Headcount Calibration</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Live SLA
                  </span>
                </div>

                {/* Model Selector Tabs */}
                <div className="mb-5">
                  <label className="text-xs text-slate-400 mb-2 block font-medium">Engagement Architecture:</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setModelType('contract')}
                      className={`py-1.5 rounded-lg transition-colors ${
                        modelType === 'contract' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Contract (W-2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelType('c2h')}
                      className={`py-1.5 rounded-lg transition-colors ${
                        modelType === 'c2h' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Contract-to-Hire
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelType('direct')}
                      className={`py-1.5 rounded-lg transition-colors ${
                        modelType === 'direct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Direct Placement
                    </button>
                  </div>
                </div>

                {/* Headcount Slider */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Engineering Squad Size:</span>
                    <span className="text-emerald-400 font-bold text-sm">{headcount} Engineers</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 (Specialist)</span>
                    <span>5 (Feature Pod)</span>
                    <span>15+ (Full RPO Desk)</span>
                  </div>
                </div>

                {/* Output Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">First Candidate Dossier</span>
                    <span className="text-lg font-heading font-extrabold text-white">{slaDays}</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Guaranteed SLA</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Sprint Bandwidth</span>
                    <span className="text-lg font-heading font-extrabold text-white">{estimatedWeeklyVelocity} hrs/wk</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Dedicated Capacity</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Deploy {headcount} Engineer Pod</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MULTI-STATE COMPLIANCE & VETTING MATRIX ── */}
      <section className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-700 mb-2 block">
              ENTERPRISE GOVERNANCE & RIGOR
            </span>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A]">
              Full-Spectrum Engineering Due Diligence
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every presented engineer undergoes multi-tier technical defense, identity screening, and employment compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4 font-bold">
                  01
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0F172A] mb-2">
                  Technical Architecture Defense
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Candidates complete live hands-on pair programming and system design challenges conducted by practicing Principal Engineers before client introduction.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-700">
                  ✓ GitOps, AWS Architecture & Low-latency code verified
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1D4ED8] flex items-center justify-center mb-4 font-bold">
                  02
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0F172A] mb-2">
                  Multi-State Legal & E-Verify
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full background screening covering federal identity, criminal history, degree credentials, and automated E-Verify authorization.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-700">
                  ✓ 50-State W-2 payroll, insurance & statutory coverage
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4 font-bold">
                  03
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0F172A] mb-2">
                  90-Day Retention Guarantee
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Our placements carry a comprehensive satisfaction guarantee with zero-friction candidate replacement if performance metrics deviate.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-700">
                  ✓ Dedicated client account director & SLA check-ins
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PROCESS TIMELINE & SQUAD DEPLOYMENT ── */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                SPEED TO BENCHMARK
              </span>
              <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-4">
                Structured Requisition Execution Cadence
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                From initial scoping call to Day 1 onboarding, we bypass bureaucratic recruitment lag to staff high-velocity technical teams.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={onOpenConsultation}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Schedule Technical Scoping Call
              </Button>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {service.process.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-4 hover:border-emerald-300 transition-colors"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-heading font-bold text-sm flex items-center justify-center shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ENTERPRISE SCOPE & CASE STUDY ── */}
      <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Scope Checklist */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs">
              <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Enterprise Delivery Capabilities Included</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700">
                {service.whatsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Study */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                  ENTERPRISE CASE STUDY
                </span>
                <h4 className="font-heading font-bold text-lg text-white mb-1">
                  {service.miniCaseStudy.title}
                </h4>
                <span className="text-xs text-emerald-300 font-semibold block mb-4">
                  {service.miniCaseStudy.role}
                </span>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
                  <p>
                    <strong className="text-white">Challenge:</strong> {service.miniCaseStudy.challenge}
                  </p>
                  <p>
                    <strong className="text-white">Solution:</strong> {service.miniCaseStudy.solution}
                  </p>
                  <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium">
                    <strong className="text-emerald-300">Result:</strong> {service.miniCaseStudy.result}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Discuss Requisition Requirements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ENTERPRISE FAQ ACCORDION ── */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1 block">
              HIRING DESK FAQ
            </span>
            <h3 className="text-2xl font-heading font-bold text-[#0F172A]">
              Enterprise Staffing Questions
            </h3>
          </div>

          <div className="space-y-3">
            {service.faqs.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-heading font-bold text-sm text-[#0F172A] pr-4">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      expandedFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

