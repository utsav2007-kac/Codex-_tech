import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Sliders,
  Send,
  Target,
  MapPin,
  Briefcase,
  Users,
  Compass,
  Check,
  Award,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteServices, oldSiteFaqs } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const CustomJobCampaignsPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Interactive Campaign Planner Configurator
  const [targetStack, setTargetStack] = useState<string>('Cloud & Distributed Systems');
  const [preferredRegion, setPreferredRegion] = useState<string>('Remote / Nationwide');
  const [searchUrgency, setSearchUrgency] = useState<string>('Active (Within 30-60 Days)');

  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="w-full bg-[#FAFDFC] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: MINT & BLUSH TINT WITH CONFIGURATOR AS HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-r from-[#E4F6EC] via-[#FAFDFC] to-[#FFE9E6] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Custom Job Campaigns</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>Targeted Talent Representation Campaign</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Customized Technical <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] via-[#E11D48] to-[#C2410C]">
                  Placement Campaigns.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Rather than blast mass resumes to cold job boards, we launch high-conviction, tailored campaigns directly to engineering hiring directors matching your exact skill domain.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Launch Campaign Planning <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Column: Signature Component - Campaign Configurator */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-heading font-bold text-sm text-[#0F172A]">Campaign Scope Planner</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                    INTERACTIVE BUILDER
                  </span>
                </div>

                {/* 3 Step Controls */}
                <div className="space-y-4">
                  {/* Step 1: Target Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1. Select Target Engineering Specialization</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['Cloud & Distributed Systems', 'Data Engineering & AI', 'Java / Spring Enterprise', 'DevOps & SRE'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setTargetStack(s)}
                          className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                            targetStack === s
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Preferred Corridor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>2. Geographic Preference</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {['Remote / Nationwide', 'Texas / DFW Hub', 'East Coast / NY'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setPreferredRegion(r)}
                          className={`p-2 rounded-xl border text-center font-medium transition-all ${
                            preferredRegion === r
                              ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Search Urgency */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      <span>3. Timeline & Availability</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['Active (Within 30-60 Days)', 'Immediate (1-2 Weeks)'].map((u) => (
                        <button
                          key={u}
                          onClick={() => setSearchUrgency(u)}
                          className={`p-2 rounded-xl border text-center font-medium transition-all ${
                            searchUrgency === u
                              ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Configured Summary Output */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-rose-50/60 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">Configured Campaign Parameters</span>
                    <span className="text-[10px] text-slate-500 font-mono">Ready to Submit</span>
                  </div>
                  <p className="text-slate-700">
                    Targeting <strong>{targetStack}</strong> requisitions across <strong>{preferredRegion}</strong> with <strong>{searchUrgency}</strong> onboarding availability.
                  </p>
                  <Button
                    onClick={onOpenConsultation}
                    className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2 rounded-xl mt-2 shadow-xs"
                  >
                    Confirm & Pre-Fill Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. STEP INDICATOR IN-PAGE NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Scope Configuration</span>
            </span>
            <span className="text-slate-300">→</span>
            <a href="#representation" className="flex items-center gap-1.5 hover:text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Talent Promotion</span>
            </a>
            <span className="text-slate-300">→</span>
            <a href="#timing-faq" className="flex items-center gap-1.5 hover:text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Placement Timing FAQ</span>
            </a>
          </div>
          <Button
            size="sm"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-1.5 px-3.5"
          >
            Launch Campaign
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STRATEGIC TALENT PROMOTION (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="representation" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Proactive Advocacy</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.resumePromotion.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.resumePromotion.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.resumePromotion.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Bypass resume aggregator black holes with verified hiring manager representation.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PLACEMENT TIMING & REALISTIC EXPECTATIONS FAQ (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="timing-faq" className="py-16 bg-white border-y border-slate-200 scroll-mt-28">
        <div className="container-custom space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Truth & Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Placement Timeline Expectations
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAFDFC] border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-heading font-bold text-base text-[#0F172A]">
              {oldSiteFaqs[2].question}
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {oldSiteFaqs[2].answer}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 italic">
              * Note: Codex Tech-IT does not make rigid timeline guarantees; our focus is on sustainable engineering placement quality and compensation maximization.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CLOSING CTA BANNER (Config Summary)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom py-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#E4F6EC] via-white to-[#FFE9E6] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Ready to Launch Your Custom Job Campaign?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Book a strategy consultation to map your technical strengths against active client requisitions.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Launch Campaign Call <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
