import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  DollarSign,
  Calculator,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle,
  Clock,
  Layers,
  Check,
  Scale,
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const PayrollTaxesPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Gross-to-Net Explainer (Illustration Only)
  const [contractType, setContractType] = useState<'w2' | 'c2c' | '1099'>('w2');

  const breakdowns = {
    w2: {
      title: 'W-2 Hourly Placement',
      gross: 85,
      federalWithholding: 18.7,
      ficaTax: 6.5,
      stateTax: 4.2,
      netEstimated: 55.6,
      benefits: 'Health, Dental, Vision & 401(k) eligibility provided through Codex',
      handling: 'Codex Tech-IT remits all employer-side taxes, worker compensation & unemployment insurance.',
    },
    c2c: {
      title: 'Corp-to-Corp (C2C) Vendor Contract',
      gross: 95,
      federalWithholding: 0,
      ficaTax: 0,
      stateTax: 0,
      netEstimated: 95,
      benefits: 'Managed via Candidate Corporate Entity (LLC / Inc)',
      handling: 'Candidate corporation manages business filings, quarterly estimated taxes, and corporate insurance.',
    },
    '1099': {
      title: '1099 Independent Contractor',
      gross: 90,
      federalWithholding: 0,
      ficaTax: 0,
      stateTax: 0,
      netEstimated: 90,
      benefits: 'Self-procured healthcare and retirement plans',
      handling: 'Candidate receives 1099-NEC at year-end and remits self-employment taxes directly to IRS.',
    },
  };

  const currentCalc = breakdowns[contractType];

  return (
    <div className="w-full bg-[#FFFDF9] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: CREAM TINT (#FFF7ED) WITH LEDGER LAYOUT HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#FFF7ED] via-[#FFFBF5] to-[#FFFDF9] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Payroll & Compliance</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Scope */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>Multi-State Employer-of-Record (EOR) Facilitation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Compliant Payroll, Taxes & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#C2410C]">
                  Onboarding Governance.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Streamline contractor compensation, statutory withholdings, multi-state tax nexus, and post-offer documentation across all 50 US states with transparent payroll administration.
              </p>

              {/* Mandatory Statutory Notice */}
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-[#475569] leading-relaxed">
                  <strong className="text-[#0F172A]">General Information Notice:</strong> All details provided on this page are for informational and operational overview purposes only, not formal legal or tax advice. Consult certified CPAs or legal counsel for individual tax filing determinations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Schedule Payroll Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <a
                  href="#calculator"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs"
                >
                  Inspect Sample Ledger
                </a>
              </div>
            </div>

            {/* Right Column: Ledger Hero Layout */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <span className="font-heading font-bold text-sm text-[#0F172A]">Sample Disbursement Ledger</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-200">
                    Sample Ledger • Illustration
                  </span>
                </div>

                {/* Ledger Rows */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">Standard Hourly Bill Rate:</span>
                    <span className="font-bold text-[#0F172A]">$85.00 / hr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">Federal Withholding (FIT):</span>
                    <span className="font-bold text-rose-700">- $18.70 / hr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">FICA (Social Security & Medicare):</span>
                    <span className="font-bold text-rose-700">- $6.50 / hr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">State Withholding (SIT - Est.):</span>
                    <span className="font-bold text-rose-700">- $4.20 / hr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF7ED] border border-amber-200 flex justify-between items-center font-bold text-amber-950">
                    <span className="font-sans">Net Disbursed Take-Home (Est.):</span>
                    <span className="text-base text-emerald-700">$55.60 / hr</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 font-sans">
                  <span>Cycle: Bi-Weekly Direct Deposit</span>
                  <span className="text-emerald-700 font-bold">100% On-Time Payroll</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. ANCHORED CHIPS IN-PAGE NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3">
        <div className="container-custom flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0 mr-2">Jump to:</span>
          {[
            { id: 'calculator', label: 'Gross-to-Net Explainer' },
            { id: 'onboarding-support', label: 'Post-Offer Onboarding' },
            { id: 'multi-state', label: 'Multi-State Tax Governance' },
          ].map((chip) => (
            <a
              key={chip.id}
              href={`#${chip.id}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shrink-0"
            >
              {chip.label}
            </a>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SIGNATURE COMPONENT: GROSS-TO-NET EXPLAINER (ILLUSTRATION)
          ───────────────────────────────────────────────────────────── */}
      <section id="calculator" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Interactive Model Breakdown</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Gross-to-Net Classification Explainer
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Explore how statutory tax withholdings, contractor classifications, and direct disbursements compare.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            {/* Classification Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex gap-2">
                {(['w2', 'c2c', '1099'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setContractType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      contractType === type
                        ? 'bg-[#C2410C] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type} Structure
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-600 font-mono">
                Sample Benchmark: $85 – $95/hr Baseline
              </span>
            </div>

            {/* Calculations Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase font-bold">Gross Rate</span>
                <div className="text-3xl font-numbers font-black text-[#0F172A]">${currentCalc.gross}.00 <span className="text-xs text-slate-600 font-normal">/ hr</span></div>
                <p className="text-xs text-slate-500 pt-1">{currentCalc.title}</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase font-bold">Tax Withholding Handling</span>
                <p className="text-xs text-[#0F172A] font-semibold leading-relaxed pt-1">{currentCalc.handling}</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[10px] text-emerald-800 uppercase font-bold">Estimated Net Take-Home</span>
                <div className="text-3xl font-numbers font-black text-emerald-700">${currentCalc.netEstimated}.00 <span className="text-xs text-slate-600 font-normal">/ hr</span></div>
                <p className="text-xs text-emerald-900 pt-1 font-medium">{currentCalc.benefits}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 italic">
              * Note: Sample figures are for illustrative purposes. Actual tax withholdings depend on marital filing status, state nexus, exemptions, and corporate deductions.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. POST-OFFER ONBOARDING SUPPORT (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="onboarding-support" className="py-16 bg-white border-y border-slate-200 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Seamless Integration</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Post-Offer Onboarding & Documentation Advisory
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Upon offer acceptance, our operations desk guides candidates through corporate onboarding to guarantee zero Day-1 delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'I-9 & Identity Verification', desc: 'Secure digital collection and verification of identity documents in compliance with USCIS regulations.' },
              { title: 'Tax Withholding Setup (W-4 / W-9)', desc: 'Assistance setting up state and federal tax withholdings or corporate vendor dossiers.' },
              { title: 'Direct Deposit & Timesheet Setup', desc: 'Integration with automated electronic timesheet approval workflows for punctual bi-weekly pay.' },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#FFFDF9] border border-amber-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{step.title}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MULTI-STATE TAX GOVERNANCE
          ───────────────────────────────────────────────────────────── */}
      <section id="multi-state" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">50-State Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Multi-State Tax Nexus & EOR Infrastructure
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Hiring remote engineers across different jurisdictions introduces complex state unemployment tax (SUTA), local withholdings, and statutory disability compliance. Codex Tech-IT's payroll partners manage state registrations, withholding filings, and annual W-2/1099 disbursements so you maintain flawless corporate compliance.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLOSING CTA BANNER (Cream Receipt)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom pb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FFF7ED] via-[#FFFBF5] to-white border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Questions About Contractor Payroll or Classification?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Book a consultation with our payroll operations specialists for personalized onboarding guidance.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Schedule Payroll Call <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
