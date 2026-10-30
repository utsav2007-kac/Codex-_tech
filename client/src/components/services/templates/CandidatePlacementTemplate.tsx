import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Award,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Sliders,
  DollarSign,
  Briefcase,
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

export const CandidatePlacementTemplate: React.FC<ServiceDataProps> = ({ service, onOpenConsultation }) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [targetSalary, setTargetSalary] = useState<number>(145);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Dynamic salary negotiation estimate
  const projectedUplift = Math.round(targetSalary * 0.28);
  const projectedTotal = targetSalary + projectedUplift;

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0F172A] overflow-hidden">
      {/* ── 1. SPLIT-SCREEN INTERACTIVE HERO (LIGHT SKY & CORAL ACCENT) ── */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#F0F7FF] via-[#FFFFFF] to-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE9E6] border border-[#FED7AA] text-[#C2410C] text-xs font-heading font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Career Track · Template A</span>
              </div>

              <h1 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight leading-tight mb-5">
                {service.title}
              </h1>

              <p className="text-lg text-[#C2410C] font-semibold mb-4 leading-snug">
                {service.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-8 max-w-2xl font-normal">
                {service.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-md font-semibold"
                >
                  Book 1-on-1 Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  to="/tools/resume-analyzer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-sm font-bold text-[#0F172A] shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>Free ATS Resume Scan</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-200/80 text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 180+ Enterprise Desks
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> E-Verify Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> 10-21 Day Placement SLA
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Placement & Salary Uplift Simulator */}
            <div className="lg:col-span-5">
              <div className="p-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#BFDBFE] shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-50 text-[#1D4ED8]">
                      <Sliders className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                        Compensation Uplift Calculator
                      </h3>
                      <p className="text-[11px] text-slate-500">Live U.S. Tech Market Projection</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    2026 Data
                  </span>
                </div>

                {/* Interactive Slider */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#475569]">Current Target Base Salary:</span>
                      <span className="text-[#1D4ED8] font-bold text-sm">${targetSalary},000 / yr</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={220}
                      step={5}
                      value={targetSalary}
                      onChange={(e) => setTargetSalary(Number(e.target.value))}
                      className="w-full accent-[#C2410C] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>$100k (Mid-level)</span>
                      <span>$160k (Senior)</span>
                      <span>$220k+ (Staff/Lead)</span>
                    </div>
                  </div>

                  {/* Calculated Output Cards */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C] block mb-1">
                        Est. Negotiation Gain
                      </span>
                      <span className="text-xl font-heading font-extrabold text-[#C2410C]">
                        +${projectedUplift}k
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Average +28% increase</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] block mb-1">
                        Projected Total Offer
                      </span>
                      <span className="text-xl font-heading font-extrabold text-[#1D4ED8]">
                        ${projectedTotal}k
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Base + Bonus Benchmark</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Our candidate advocates handle direct hiring manager submissions and final round compensation defense.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Evaluate My Target Tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. BEFORE VS AFTER ATS RESUME INSPECTOR (SIGNATURE TOOL) ── */}
      <section className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C2410C] mb-2">
                TRANSFORMATION BLUEPRINT
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F172A]">
                Before vs. After Profile Calibration
              </h2>
            </div>
            {/* Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('before')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'before' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Uncalibrated Resume
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('after')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'after' ? 'bg-white text-[#15803D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Codex Optimized (98% Pass)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Interactive Preview Dossier */}
            <div className="lg:col-span-7 p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${activeTab === 'after' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    />
                    <span className="font-heading font-bold text-sm text-[#0F172A]">
                      {activeTab === 'after' ? 'ATS-Optimized Engineering Resume' : 'Standard Cold Application'}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      activeTab === 'after' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {activeTab === 'after' ? 'ATS Score: 98/100' : 'ATS Score: 42/100'}
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono leading-relaxed">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">// Professional Summary:</span>
                    <p className="text-slate-800">
                      {activeTab === 'after'
                        ? 'Senior Distributed Systems Engineer with 6+ years architecting Kafka event streaming, AWS multi-region microservices, and high-throughput low-latency fintech APIs processing $12M daily transactions.'
                        : 'Software engineer looking for an exciting position in a dynamic company where I can apply my skills and grow professionally.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">// Core Technical Keywords:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeTab === 'after'
                        ? ['Kafka', 'AWS Lambda', 'Terraform', 'Kubernetes', 'Golang', 'PostgreSQL', 'Redis', 'CI/CD ArgoCD'].map((kw) => (
                            <span key={kw} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              +{kw}
                            </span>
                          ))
                        : ['Java', 'SQL', 'Coding', 'Hardworking', 'Team Player'].map((kw) => (
                            <span key={kw} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              {kw} (Generic)
                            </span>
                          ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">// Quantified Achievements:</span>
                    <p className="text-slate-800">
                      {activeTab === 'after'
                        ? 'Reduced p99 API latency from 420ms to 68ms; cut AWS RDS spend by $180k/yr via Redis read replicas and connection pooling.'
                        : 'Worked on database queries and improved performance for team tasks.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Direct submission to hiring manager desks</span>
                <span className="font-bold text-[#1D4ED8]">Ready for 180+ Enterprise Requisitions</span>
              </div>
            </div>

            {/* Right: Key Calibration Impact Metrics */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C] block mb-2">
                  Metric 01
                </span>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  3.4x Recruiter Inbound Rate
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tailoring your headline, keyword density, and system design narrative moves your profile from unseen backlogs to top-ranked recruiter search results.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] block mb-2">
                  Metric 02
                </span>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  10 - 21 Days to Client Interview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eliminating third-party intermediaries and HR automated rejection bots connects you directly with technical directors holding active reqs.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                  Metric 03
                </span>
                <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-1">
                  100% Free for Candidates
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Placement representation is completely employer-sponsored. You receive career coaching, mock reviews, and offer negotiation with zero out-of-pocket candidate fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 5-STEP PLACEMENT ESCALATOR (LADDER FORMAT) ── */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
              STEP-BY-STEP CADENCE
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A]">
              The 5-Stage Placement Pipeline
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From intake audit to offer acceptance, our engineering recruiters support you at every milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {service.process.map((p, idx) => (
              <div
                key={p.step}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#C2410C]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#C2410C] font-heading font-extrabold text-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {p.step}
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#0F172A] mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-100 block">
                  Stage {idx + 1} of 5
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHAT'S INCLUDED & WHO IT'S FOR ── */}
      <section className="py-16 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Who It's For */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-heading font-bold text-xl text-[#0F172A]">Who This Service Is For</h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {service.whoItsFor.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Individual Candidate Track</span>
                <span className="font-semibold text-[#0F172A]">E-Verify Aligned</span>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#1D4ED8]" />
                  <h3 className="font-heading font-bold text-xl text-[#0F172A]">What's Included in Scope</h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {service.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>End-to-End Placement Scope</span>
                <span className="font-semibold text-[#1D4ED8]">Zero Hidden Candidate Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. MINI CASE STUDY & FAQ ACCORDION ── */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Case Study */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFF7ED] to-[#FFFFFF] border-2 border-[#FED7AA] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C2410C] block mb-2">
                  VERIFIED CANDIDATE PLACEMENT
                </span>
                <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-1">
                  {service.miniCaseStudy.title}
                </h3>
                <span className="text-xs text-[#C2410C] font-semibold block mb-4">
                  {service.miniCaseStudy.role}
                </span>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-6">
                  <p>
                    <strong className="text-slate-800">Challenge:</strong> {service.miniCaseStudy.challenge}
                  </p>
                  <p>
                    <strong className="text-slate-800">Codex Strategy:</strong> {service.miniCaseStudy.solution}
                  </p>
                  <div className="p-3.5 rounded-xl bg-white border border-orange-200 text-[#0F172A] font-medium">
                    <strong className="text-emerald-700">Outcome:</strong> {service.miniCaseStudy.result}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={onOpenConsultation}
                className="w-full bg-white hover:bg-slate-50 text-xs font-bold font-heading uppercase tracking-wider"
              >
                Discuss My Placement Strategy
              </Button>
            </div>

            {/* FAQs */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                  CANDIDATE QUESTIONS
                </span>
                <h3 className="text-2xl font-heading font-bold text-[#0F172A]">
                  Frequently Asked Questions
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
                          expandedFaq === idx ? 'rotate-180 text-[#C2410C]' : ''
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
          </div>
        </div>
      </section>

      {/* ── 6. BOTTOM CALL TO ACTION ── */}
      <section className="py-14 bg-[#070E1A] text-white">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F25C2A] mb-2 block">
            FAST-TRACK YOUR U.S. CAREER
          </span>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to accelerate your next technical placement?
          </h2>
          <p className="text-sm text-slate-300 mb-8 font-normal leading-relaxed">
            Schedule a confidential 45-minute technical review with our talent directors. We audit your resume, calibrate your compensation, and present immediate requisitions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenConsultation}
              className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold"
            >
              Book Free Career Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm font-semibold text-white transition-colors"
            >
              <span>Browse Active Requisitions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

