import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Briefcase,
  Compass,
  FileText,
  UserCheck,
  Check,
  Calendar,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteCareerPaths, oldSiteServices, oldSiteJobPlacementSteps, oldSiteFaqs } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const JobPlacementPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component State: Interactive Journey Scrubbing
  const [activeStep, setActiveStep] = useState<number>(0);
  const journeyRef = useRef<HTMLDivElement>(null);

  // In-page progress rail state
  const [activeSection, setActiveSection] = useState<string>('journey');

  // Light Salary Range Panel (Labeled strictly as "Illustration")
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior'>('mid');
  const salaryRanges = {
    entry: { min: 85, max: 115, title: 'Associate Engineer (0-2 Yrs)' },
    mid: { min: 120, max: 155, title: 'Mid-Level Specialist (3-6 Yrs)' },
    senior: { min: 160, max: 210, title: 'Lead / Staff Architect (7+ Yrs)' },
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Selected Career Path Chip
  const [selectedPath, setSelectedPath] = useState<string>(oldSiteCareerPaths[0].title);

  // Section Observer for left progress rail
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['journey', 'career-paths', 'guidance', 'six-step-path', 'salary-illustration', 'faq'];
      const scrollPos = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const journeyMilestones = [
    {
      id: 'profile',
      label: '1. Diagnostic Review',
      detail: 'In-depth assessment of your GitHub artifacts, tech stack depth, and target enterprise roles.',
      icon: FileText,
      tint: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      id: 'match',
      label: '2. Tech Matching',
      detail: 'Calibrated pairing with verified enterprise hiring desks across North American tech hubs.',
      icon: Compass,
      tint: 'bg-sky-50 border-sky-200 text-sky-700',
    },
    {
      id: 'interview',
      label: '3. Coding Defense',
      detail: 'Rigorous mock grilling, distributed system design clinics, and behavioral leadership coaching.',
      icon: Briefcase,
      tint: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    {
      id: 'offer',
      label: '4. Offer & Day-1',
      detail: 'Strategic compensation benchmarking, onboarding document verification, and career compounding.',
      icon: Award,
      tint: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: SKY TINT (#E8F2FF) WITH FULL-WIDTH JOURNEY TRACK UNDER TITLE
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#E8F2FF] via-[#F0F6FF] to-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Job Placement</span>
          </div>

          {/* Hero Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#2563EB]/20 text-[#1D4ED8] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
              <span>Full-Cycle Technical Career Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Strategic Technical Placement for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                High-Growth Engineers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl font-normal">
              Codex Tech-IT operates as career success and growth architects. We align your engineering strengths with direct employer requisitions, guide technical defense, and represent you without transactional recruiting noise.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
              >
                Book a Free Call <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <a
                href="#career-paths"
                className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
              >
                Explore Facilitated Career Paths
              </a>
            </div>
          </div>

          {/* Full-Width Journey Track under the title (Signature Component) */}
          <div id="journey" className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Signature Candidate Journey</span>
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">Candidate Placement Trajectory</h3>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scroll or click milestones to inspect</span>
              </div>
            </div>

            {/* Step Selector Track */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
              {journeyMilestones.map((milestone, idx) => {
                const Icon = milestone.icon;
                const isCurrent = activeStep === idx;
                return (
                  <button
                    key={milestone.id}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#E8F2FF] border-[#2563EB] shadow-sm ring-2 ring-[#2563EB]/20'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${milestone.tint}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="font-heading font-bold text-sm text-[#0F172A]">{milestone.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Display Pane */}
            <div className="mt-6 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">Milestone Deep Dive</span>
                <h4 className="text-base font-bold text-[#0F172A]">{journeyMilestones[activeStep].label}</h4>
                <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">{journeyMilestones[activeStep].detail}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenConsultation}
                className="shrink-0 text-xs font-bold text-[#1D4ED8] border-slate-300 hover:bg-white"
              >
                Discuss Stage Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BODY WITH LEFT PROGRESS RAIL
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Progress Rail on the left (Sticky) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-2 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-3 py-1">
                In-Page Navigation
              </div>
              {[
                { id: 'journey', label: 'Candidate Journey' },
                { id: 'career-paths', label: 'Career Paths' },
                { id: 'guidance', label: 'Advisory Guidance' },
                { id: 'six-step-path', label: 'Six-Step Roadmap' },
                { id: 'salary-illustration', label: 'Salary Benchmark' },
                { id: 'faq', label: 'Placement FAQs' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSection === item.id
                      ? 'bg-[#E8F2FF] text-[#1D4ED8] font-extrabold translate-x-1'
                      : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <Button
                  onClick={onOpenConsultation}
                  className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                >
                  Book a Free Call
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Main Column (Sections 2 to 6) */}
          <div className="lg:col-span-9 space-y-16">
            {/* 2. CAREER PATHS FACILITATED (Role Chips) */}
            <section id="career-paths" className="space-y-6 scroll-mt-28">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Market Specializations</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                  Career Paths Facilitated
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                  Select a tech discipline below to inspect typical core responsibilities and enterprise placement alignments.
                </p>
              </div>

              {/* Role Chips */}
              <div className="flex flex-wrap gap-2">
                {oldSiteCareerPaths.map((path) => (
                  <button
                    key={path.slug}
                    onClick={() => setSelectedPath(path.title)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedPath === path.title
                        ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {path.title}
                  </button>
                ))}
              </div>

              {/* Selected Role Detail Box */}
              {(() => {
                const current = oldSiteCareerPaths.find((p) => p.title === selectedPath) || oldSiteCareerPaths[0];
                return (
                  <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-lg text-[#0F172A]">{current.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D4ED8] text-xs font-bold">
                        Vetted Requisition Track
                      </span>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">{current.description}</p>
                    <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#1D4ED8]">
                      <span>Source: Verified placement curriculum</span>
                      <button onClick={onOpenConsultation} className="hover:underline flex items-center gap-1 text-[#C2410C]">
                        Check your fit for this role <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* 3. PERSONALIZED CAREER GUIDANCE (Advisory Desk) */}
            <section id="guidance" className="p-8 rounded-3xl bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0] shadow-sm space-y-6 scroll-mt-28">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">One-on-One Advisory</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                  {oldSiteServices.careerGuidance.title}
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                  {oldSiteServices.careerGuidance.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {oldSiteServices.careerGuidance.highlights.map((h, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                      0{i + 1}
                    </div>
                    <p className="text-xs text-[#0F172A] font-medium leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. SIX-STEP ROADMAP (Structured Journey) */}
            <section id="six-step-path" className="space-y-6 scroll-mt-28">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Structured Execution</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                  Six-Step Path to Placement
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                  Our transparent roadmap ensures you navigate each stage with complete clarity and professional backing.
                </p>
              </div>

              <div className="space-y-3">
                {oldSiteJobPlacementSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#E8F2FF] text-[#1D4ED8] flex items-center justify-center font-heading font-extrabold text-sm shrink-0">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-sm text-[#0F172A]">{step.title}</h4>
                      <p className="text-xs text-[#475569] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. LIGHT SALARY RANGE PANEL (Strictly Labeled "Illustration") */}
            <section id="salary-illustration" className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6 scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Sample Benchmark • Illustration Only
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[#0F172A] mt-2">
                    Market Compensation Range Estimates
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['entry', 'mid', 'senior'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        experienceLevel === lvl
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#E8F2FF] to-white border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#1D4ED8]">{salaryRanges[experienceLevel].title}</div>
                  <div className="text-3xl font-numbers font-black text-[#0F172A]">
                    ${salaryRanges[experienceLevel].min}k – ${salaryRanges[experienceLevel].max}k{' '}
                    <span className="text-xs text-slate-500 font-normal">/ year</span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    Aggregated North American technology corridor base salary medians for full-time engineering requisitions.
                  </p>
                </div>
                <Button
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs py-2.5 px-5 shrink-0"
                >
                  Review My Market Potential
                </Button>
              </div>
              <p className="text-[11px] text-slate-600 italic">
                * Note: Figures displayed are illustrative industry reference bands. Actual compensation depends upon individual experience, employer budget, location, and technical interview outcomes.
              </p>
            </section>

            {/* 6. FAQS ACCORDION */}
            <section id="faq" className="space-y-4 scroll-mt-28">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Clarity & Truth</span>
                <h3 className="font-heading font-bold text-xl text-[#0F172A]">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-3">
                {oldSiteFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-heading font-bold text-sm text-[#0F172A] flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform ${openFaq === idx ? 'rotate-180 text-[#C2410C]' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 pt-0 text-xs text-[#475569] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 7. CLOSING CTA BANNER (Unique Sky Design) */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#E8F2FF] via-[#DBEAFE] to-[#EFF6FF] border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-xl font-heading font-extrabold text-[#0F172A]">
                  Ready to Accelerate Your Career Trajectory?
                </h4>
                <p className="text-xs text-[#475569] max-w-lg">
                  Speak directly with an experienced technical career advisor to map out active requisitions and interview coaching options.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-6 py-3 shrink-0 shadow-md"
              >
                Book a Free Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
