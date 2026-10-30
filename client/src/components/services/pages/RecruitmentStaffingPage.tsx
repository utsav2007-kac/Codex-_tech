import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Briefcase,
  Users,
  Clock,
  Layers,
  ShieldCheck,
  Building2,
  Award,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSitePositioning } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

type HiringModel = 'contract' | 'contract-to-hire' | 'direct-hire';

export const RecruitmentStaffingPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Interactive Model Selector
  const [activeModel, setActiveModel] = useState<HiringModel>('contract');
  // In-page navigation via Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'process' | 'rubric'>('comparison');

  const modelsData: Record<
    HiringModel,
    {
      title: string;
      badge: string;
      headline: string;
      description: string;
      timeToDeploy: string;
      onboardingFriction: string;
      payrollHandling: string;
      idealFor: string;
      effortScore: number;
      complianceScore: number;
      speedScore: number;
    }
  > = {
    contract: {
      title: 'Contract Staffing (W-2 & C2C)',
      badge: 'Rapid Bandwidth',
      headline: 'Deploy vetted engineers for critical sprints and roadmap delivery.',
      description: 'Ideal when you need specialized engineering firepower immediately without long-term headcount liability.',
      timeToDeploy: '48 – 72 Hours',
      onboardingFriction: 'Zero (Codex manages paperwork)',
      payrollHandling: 'Codex Tech-IT handles payroll, benefits & worker comp',
      idealFor: 'Product launches, migration sprints, parental leaves & surge capacity',
      effortScore: 92,
      complianceScore: 100,
      speedScore: 96,
    },
    'contract-to-hire': {
      title: 'Contract-to-Hire',
      badge: 'Low-Risk Evaluation',
      headline: 'Evaluate real-world engineering fit on active codebases before direct conversion.',
      description: 'A 3- to 6-month trial window to observe candidate system architecture, sprint velocity, and team collaboration.',
      timeToDeploy: '3 – 5 Business Days',
      onboardingFriction: 'Low (Structured conversion milestones)',
      payrollHandling: 'Codex until converted to full-time client payroll',
      idealFor: 'De-risking critical senior hires, culture-fit validation & flexible budgeting',
      effortScore: 78,
      complianceScore: 94,
      speedScore: 85,
    },
    'direct-hire': {
      title: 'Direct Hire Placement',
      badge: 'Core Leadership',
      headline: 'Full-time core engineering leaders built for multi-year tenure.',
      description: 'Retained or contingency search targeting high-impact engineering directors, staff architects, and tech leads.',
      timeToDeploy: '7 – 14 Business Days',
      onboardingFriction: 'Direct to client HR & payroll',
      payrollHandling: 'Client payroll with Codex replacement guarantee window',
      idealFor: 'Core foundational hires, engineering managers & architectural champions',
      effortScore: 65,
      complianceScore: 90,
      speedScore: 72,
    },
  };

  const currentModelData = modelsData[activeModel];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: BUTTER TINT (#FFF4D6) SPLIT SCREEN WITH MODEL SELECTOR
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#FFF4D6] via-[#FFF8E6] to-[#FAFAF9] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Technical Recruitment & Staffing</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>Enterprise Technical Staffing Solutions</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Technical Staffing That <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                  Accelerates Roadmaps.
                </span>
              </h1>

              {/* Positioning statement from old site */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
                <p className="text-xs text-[#0F172A] font-semibold italic">
                  "{oldSitePositioning.statement}"
                </p>
                <p className="text-xs text-[#475569] mt-1">
                  We match vetted engineers to your exact tech stacks with calibrated code defense.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Engineering leaders cannot afford multi-month hiring delays or candidates who fail basic live coding rounds. We pre-screen candidates against Tier-1 enterprise architecture standards and deliver a calibrated shortlist within 48 to 72 hours.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Request Technical Talent <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <a
                  href="#comparison"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs"
                >
                  Compare Engagement Models
                </a>
              </div>
            </div>

            {/* Right Hero Column: Interactive Model Selector (Split Screen) */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Model Selector</span>
                  <span className="text-xs text-slate-600 font-mono">Select to configure</span>
                </div>

                {/* 3 Selector Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {(['contract', 'contract-to-hire', 'direct-hire'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveModel(m)}
                      className={`p-3 rounded-xl text-center transition-all border text-xs font-bold capitalize ${
                        activeModel === m
                          ? 'bg-[#FFF4D6] border-amber-400 text-amber-900 ring-2 ring-amber-300/40 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>

                {/* Selected Model Preview Card */}
                <div className="space-y-4 p-5 rounded-2xl bg-[#FFFDF7] border border-amber-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">{currentModelData.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {currentModelData.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">{currentModelData.headline}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-600 block text-[10px]">Shortlist Turnaround</span>
                      <span className="font-bold text-[#0F172A]">{currentModelData.timeToDeploy}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-600 block text-[10px]">Administrative Burden</span>
                      <span className="font-bold text-emerald-700">{currentModelData.onboardingFriction}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      onClick={onOpenConsultation}
                      className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                    >
                      Inquire About {currentModelData.title}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. IN-PAGE NAVIGATION (TABS)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'comparison', label: 'Hiring Model Comparison' },
              { id: 'process', label: '48-72h Shortlist SLA' },
              { id: 'rubric', label: 'Technical Vetting Standards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById(tab.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#FFF4D6] text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2 px-4 shrink-0"
          >
            Book a Free Call
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SIGNATURE COMPONENT: HIRING MODEL COMPARISON TABLE & EFFORT BARS
          ───────────────────────────────────────────────────────────── */}
      <section id="comparison" className="py-16 scroll-mt-36">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Side-by-Side Calibration</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Hiring Model Comparison Matrix
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Analyze speed, compliance handling, and employer responsibilities across each engagement structure.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF7] border-b border-amber-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Attribute</th>
                  <th className="py-4 px-5">Contract (W-2 / C2C)</th>
                  <th className="py-4 px-5">Contract-to-Hire</th>
                  <th className="py-4 px-5">Direct Hire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-[#0F172A]">Speed to First Interview</td>
                  <td className="py-3.5 px-5 text-[#2563EB] font-bold">24 – 48 Hours</td>
                  <td className="py-3.5 px-5">48 – 72 Hours</td>
                  <td className="py-3.5 px-5">3 – 5 Days</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-[#0F172A]">Payroll & Benefits</td>
                  <td className="py-3.5 px-5 text-emerald-700 font-bold">Managed 100% by Codex</td>
                  <td className="py-3.5 px-5">Codex during trial</td>
                  <td className="py-3.5 px-5">Client HR from Day 1</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-[#0F172A]">Trial Period</td>
                  <td className="py-3.5 px-5">Flexible project duration</td>
                  <td className="py-3.5 px-5 text-[#2563EB] font-bold">3 – 6 Months</td>
                  <td className="py-3.5 px-5">Standard probation</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-[#0F172A]">Best Fit Requisition</td>
                  <td className="py-3.5 px-5">Surge sprints & niche skills</td>
                  <td className="py-3.5 px-5">De-risking permanent hires</td>
                  <td className="py-3.5 px-5">Staff architects & managers</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Effort & Metric Bars for Active Model */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="font-heading font-bold text-sm text-[#0F172A]">
              Velocity & Operational Telemetry for <span className="text-[#C2410C] capitalize">{activeModel.replace(/-/g, ' ')}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Deployment Speed</span>
                  <span>{currentModelData.speedScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${currentModelData.speedScore}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Turnkey Employer Ease</span>
                  <span>{currentModelData.effortScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${currentModelData.effortScore}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Compliance & Governance</span>
                  <span>{currentModelData.complianceScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${currentModelData.complianceScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. 48-72h SHORTLIST SLA PROCESS
          ───────────────────────────────────────────────────────────── */}
      <section id="process" className="py-16 bg-white border-y border-slate-200 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Rapid Execution</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Our 48 – 72 Hour Shortlist SLA
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              We eliminate recruiter spam by delivering 2 to 4 calibrated, interview-ready engineering dossiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Req Intake & Stack Calibration',
                desc: 'Deep dive with your engineering manager into architecture patterns, team velocity, and must-have tools.',
              },
              {
                step: '02',
                title: 'Live Technical Pre-Screen',
                desc: 'Our senior engineers conduct code defense and algorithmic checks to ensure zero false positives.',
              },
              {
                step: '03',
                title: 'Dossier Delivery (48-72h)',
                desc: 'You receive calibrated candidate profiles with recorded interview notes, GitHub specs, and availability.',
              },
              {
                step: '04',
                title: 'Interview & Seamless Day-1',
                desc: 'We coordinate feedback loops, handle paperwork, background checks, and post-offer integration.',
              },
            ].map((p) => (
              <div key={p.step} className="p-6 rounded-2xl bg-[#FAFAF9] border border-slate-200 space-y-2 shadow-xs">
                <div className="text-2xl font-numbers font-black text-amber-600">{p.step}</div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{p.title}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNICAL VETTING STANDARDS RUBRIC
          ───────────────────────────────────────────────────────────── */}
      <section id="rubric" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Quality Assurance</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Tier-1 Technical Calibration Standards
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Every candidate submitted to your desk is evaluated across four core competency vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'System Architecture & Concurrency',
                detail: 'Microservices resilience, distributed caching, partition tolerance, and event-driven architectures.',
              },
              {
                title: 'Live Production Code Quality',
                detail: 'Clean modular code, unit & integration test coverage, linting hygiene, and idiomatic patterns.',
              },
              {
                title: 'Cloud & Infrastructure Literacy',
                detail: 'Containerization, Kubernetes, Terraform IaC, CI/CD telemetry, and multi-region failover.',
              },
              {
                title: 'Engineering Leadership & Communication',
                detail: 'Concise technical defense, asynchronous collaboration, mentor mindset, and cross-functional empathy.',
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-[#0F172A]">{item.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLOSING CTA BANNER (Butter Split Card)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom pb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FFF4D6] via-[#FFF9EC] to-white border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Have an Open Engineering Requisition?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Deliver your specs to our staffing desk. Receive pre-screened, interview-ready candidate profiles in 48 to 72 hours.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Submit Requisition Specs <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
