import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Lock,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  UserCheck,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteServices } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

interface VerificationCheck {
  id: string;
  category: string;
  name: string;
  status: 'cleared' | 'verifying';
  turnaround: string;
  source: string;
}

export const BackgroundVerificationPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Animated verification checks (Illustration Only)
  const [checks, setChecks] = useState<VerificationCheck[]>([
    { id: 'c1', category: 'Identity & SSN', name: 'SSN Trace & Address History', status: 'cleared', turnaround: 'Instant', source: 'Direct Credit Bureau Bureau' },
    { id: 'c2', category: 'Criminal History', name: 'Federal & County Criminal Search', status: 'cleared', turnaround: '24 Hours', source: 'National Crime Database' },
    { id: 'c3', category: 'Employment History', name: 'Past 7 Years Enterprise Verification', status: 'verifying', turnaround: '48 Hours', source: 'The Work Number / Employer HR' },
    { id: 'c4', category: 'Education & Degrees', name: 'University Degree Authentication', status: 'cleared', turnaround: '24 Hours', source: 'National Student Clearinghouse' },
    { id: 'c5', category: 'Regulatory / Visa', name: 'E-Verify & I-9 Right to Work Audit', status: 'cleared', turnaround: 'Instant', source: 'USCIS DHS Portal' },
  ]);

  // Simulate verification clearance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecks((prev) =>
        prev.map((c) => (c.id === 'c3' ? { ...c, status: 'cleared' } : c))
      );
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-[#FFFBFB] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: BLUSH TINT (#FFE9E6) WITH REPORT MOCK-UP AS HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#FFE9E6] via-[#FFF3F1] to-[#FFFBFB] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Background Verification</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>Enterprise FCRA & USCIS Compliance Standards</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Enterprise-Grade Background <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#F25C2A]">
                  Verification & Onboarding.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                De-risk corporate onboarding with comprehensive criminal, employment, and education screenings. We guide both enterprise employers and candidates through frictionless documentation.
              </p>

              {/* Legal Notice Callout */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-200/80 shadow-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-[#475569] leading-relaxed">
                  <strong className="text-[#0F172A]">Compliance Notice:</strong> General information only; not formal legal advice. All background screenings conform strictly to FCRA federal standards and USCIS E-Verify protocols.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Initiate Verification Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Hero: Report Mockup (Signature Component - Labeled "Illustration") */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-rose-600" />
                    <span className="font-heading font-bold text-sm text-[#0F172A]">Candidate Clearance Dossier</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-200">
                    Sample Report • Illustration
                  </span>
                </div>

                {/* Animated Verification Items */}
                <div className="space-y-2.5">
                  {checks.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#0F172A]">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.source} • {item.turnaround}</div>
                      </div>
                      {item.status === 'cleared' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                          <Check className="w-3 h-3" /> Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" /> In Progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Audit Trail: Immutable SHA-256</span>
                  <span className="text-emerald-700 font-bold">FCRA Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPERT DOCUMENTATION SUPPORT (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Candidate & Employer Advisory</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.documentationSupport.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.documentationSupport.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.documentationSupport.highlights.map((h, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Eliminates last-minute offer rescissions and administrative bottlenecks through structured pre-clearance checks.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPLIANCE & LEGAL DISCLAIMER
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-custom space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Standards & Security</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Multi-Jurisdictional Verification Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'FCRA Compliant Screening', desc: 'Full candidate disclosure, adverse action notices, and dispute resolution workflows adhered to strictly.' },
              { title: 'E-Verify & I-9 Audit Readiness', desc: 'Direct electronic confirmation of employment eligibility with USCIS and Social Security Administration.' },
              { title: '7-Year Criminal & County Court Records', desc: 'Comprehensive county, state, and federal criminal docket reviews without outdated arrest record overreach.' },
              { title: 'Encrypted PII Data Protection', desc: 'All documents encrypted in transit (TLS 1.3) and at rest (AES-256) with strict RBAC access logs.' },
            ].map((std, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#FFFBFB] border border-rose-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-heading font-bold text-sm text-[#0F172A]">{std.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{std.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Statutory Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <strong>Important Legal Disclaimer:</strong> The background verification advisory provided by Codex Tech-IT is for general informational and administrative facilitation purposes only and does not constitute formal legal counsel. Employers remain responsible for complying with all applicable federal, state, and local employment laws.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CLOSING CTA BANNER (Blush Dossier)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom py-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FFE9E6] via-[#FFF3F1] to-white border border-rose-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Need Turnkey Onboarding & Background Verification?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Speak with our compliance specialists to structure your candidate screening pipeline.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Start Compliance Review <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
