import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Users,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  CreditCard,
  Sparkles,
  FileText,
  HelpCircle,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  Target,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { siteConfig } from '../config/site';

// Pastel palette assignments for 9 services (one unique colour tint per service)
const SERVICE_THEMES = [
  {
    bg: 'bg-[#EEF0FF]',
    border: 'border-[#D9DCFF]',
    text: 'text-navy-900',
    tagBg: 'bg-blue-600/10 text-blue-700',
    icon: Briefcase,
    colorName: 'Lavender',
    highlight: 'Direct Corporate Representation',
  },
  {
    bg: 'bg-[#E3F6EC]',
    border: 'border-[#C2EED7]',
    text: 'text-navy-900',
    tagBg: 'bg-emerald-600/10 text-emerald-700',
    icon: Users,
    colorName: 'Mint',
    highlight: 'Contract & Direct-Hire Staffing',
  },
  {
    bg: 'bg-[#E4F1FF]',
    border: 'border-[#CCE4FF]',
    text: 'text-navy-900',
    tagBg: 'bg-sky-600/10 text-sky-700',
    icon: Target,
    colorName: 'Sky',
    highlight: 'Embedded Talent Acquisition (RPO)',
  },
  {
    bg: 'bg-[#FFF3E8]',
    border: 'border-[#FFE2C7]',
    text: 'text-navy-900',
    tagBg: 'bg-orange-600/10 text-orange-700',
    icon: GraduationCap,
    colorName: 'Cream',
    highlight: '10 In-Demand Technology Tracks',
  },
  {
    bg: 'bg-[#FFEFB8]',
    border: 'border-[#FDE68A]',
    text: 'text-navy-900',
    tagBg: 'bg-amber-600/15 text-amber-800',
    icon: ShieldCheck,
    colorName: 'Butter',
    highlight: 'Exhaustive Identity & Tech Screening',
  },
  {
    bg: 'bg-[#FFE6E6]',
    border: 'border-[#FECDD3]',
    text: 'text-navy-900',
    tagBg: 'bg-rose-600/10 text-rose-700',
    icon: CreditCard,
    colorName: 'Blush',
    highlight: 'Multi-State W-2 & 1099 Compliance',
  },
  {
    bg: 'bg-[#EEF0FF]',
    border: 'border-[#D9DCFF]',
    text: 'text-navy-900',
    tagBg: 'bg-indigo-600/10 text-indigo-700',
    icon: Sparkles,
    colorName: 'Lavender',
    highlight: '3x Recruiter Inbound Velocity',
  },
  {
    bg: 'bg-[#E3F6EC]',
    border: 'border-[#C2EED7]',
    text: 'text-navy-900',
    tagBg: 'bg-emerald-600/10 text-emerald-700',
    icon: HelpCircle,
    colorName: 'Mint',
    highlight: 'Live Coding & STAR Behavioral Rounds',
  },
  {
    bg: 'bg-[#E4F1FF]',
    border: 'border-[#CCE4FF]',
    text: 'text-navy-900',
    tagBg: 'bg-sky-600/10 text-sky-700',
    icon: Compass,
    colorName: 'Sky',
    highlight: 'Curated Pitch Strategy & Negotiation',
  },
];

// Interactive Switcher Data for the Split Hero
const SWITCHER_ITEMS = [
  {
    id: 'placement',
    label: 'Job Placement',
    title: 'Candidate Placement & Career Representation',
    timeline: '18-Day Avg Turnaround',
    highlight: '100% Free for candidates with guaranteed offer support',
    summary:
      'We pair you with former enterprise engineering leaders who audit your repositories, recalibrate your resume, and introduce you directly to hiring managers.',
    slug: 'job-placement',
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'staffing',
    label: 'Corporate Staffing',
    title: 'Pre-Vetted Technical Staffing & Pod Scaling',
    timeline: '48-Hour Shortlist SLA',
    highlight: 'Tier-1 vendor status across Fortune 500 & FinTech',
    summary:
      'Deliver velocity to your product roadmap. We provide pre-screened Cloud Architects, Full Stack Engineers, and Data Specialists ready for day-one deployment.',
    slug: 'recruitment-staffing',
    icon: Users,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'training',
    label: 'IT Bootcamps',
    title: 'Hands-on Cloud, DevOps & AI Training',
    timeline: '8 to 12 Week Programs',
    highlight: 'Production simulation sandbox environments',
    summary:
      'Master AWS multi-account architectures, Kubernetes cluster management, Kafka stream pipelines, and real-world system design alongside senior architects.',
    slug: 'it-training',
    icon: GraduationCap,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'rebranding',
    label: 'Resume Rebrand',
    title: 'ATS Narrative Transformation & LinkedIn Optimization',
    timeline: '3 to 5 Day Delivery',
    highlight: 'Triples recruiter interview inbound inquiries',
    summary:
      'Transform generic resumes into high-impact architectural case studies engineered to sail through enterprise ATS filters and impress engineering directors.',
    slug: 'resume-linkedin-rebranding',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
  },
];

export const Services: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [activeSwitcherId, setActiveSwitcherId] = useState('placement');

  const activeSwitcher = SWITCHER_ITEMS.find((s) => s.id === activeSwitcherId) || SWITCHER_ITEMS[0];
  const ActiveIcon = activeSwitcher.icon;

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Technical Staffing, Recruitment & IT Training Services | Codex Tech-IT"
        description="Explore Codex Tech-IT full spectrum of specialized IT placement, corporate recruitment, IT training bootcamps, and candidate rebranding services."
        canonical="/services"
      />

      {/* ── 1. SPLIT HERO WITH INTERACTIVE SERVICE SWITCHER ── */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-gray-200/80 pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        {/* Subtle ambient blur */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Services' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Our Services & Solutions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-navy-900 text-white text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ENTERPRISE & CANDIDATE SOLUTIONS
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-navy-900 leading-[1.15]">
                Services Engineered to{' '}
                <span className="text-brand-gradient">Deliver Results.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                From high-velocity corporate IT staffing and contract-to-hire solutions to candidate career advocacy, production bootcamps, and payroll compliance across North America and India.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-orange-500/20">
                  Book Free Consultation
                </Button>
                <Link
                  to="/success-stories"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-navy-900 font-heading font-bold text-sm transition-all border border-gray-300 shadow-xs flex items-center justify-center hover:border-orange-500/50"
                >
                  View Verified Results
                </Link>
              </div>

              {/* Facts Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xl sm:text-2xl font-numbers font-black text-orange-600">18 Days</div>
                  <div className="text-xs text-slate-500 font-medium">Avg Offer Turnaround</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-numbers font-black text-navy-900">180+</div>
                  <div className="text-xs text-slate-500 font-medium">Enterprise Partners</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-numbers font-black text-emerald-600">100% Free</div>
                  <div className="text-xs text-slate-500 font-medium">Candidate Advocacy</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Service Switcher Widget */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-6 sm:p-8 relative">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Interactive Service Preview
                </div>

                {/* Tab Switcher Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 bg-slate-100/90 rounded-2xl">
                  {SWITCHER_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSwitcherId(item.id)}
                      className={`px-3 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
                        activeSwitcherId === item.id
                          ? 'bg-white text-navy-900 shadow-sm'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Active Card Body */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500/15 to-blue-500/15 text-orange-600 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <ActiveIcon className="w-7 h-7 text-navy-900" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-heading font-bold text-navy-900 leading-snug">
                        {activeSwitcher.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeSwitcher.timeline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs font-semibold text-orange-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{activeSwitcher.highlight}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {activeSwitcher.summary}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/services/${activeSwitcher.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-heading font-bold text-navy-900 hover:text-orange-600 transition-colors"
                    >
                      <span>Explore full program details</span>
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </Link>
                    <button
                      onClick={onOpenConsultation}
                      className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PASTEL COLOUR-BLOCKED CARD GRID (One Colour Per Service) ── */}
      <Scroll3DSection preset="tilt" className="section-padding bg-slate-50/60 border-b border-gray-200/80">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="eyebrow justify-center">Specialized Practice Areas</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Comprehensive <span className="text-brand-gradient">Service Catalog.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Every service is delivered with dedicated engineering calibration, transparent communication, and rapid turnaround.
            </p>
          </SectionReveal>

          {/* 9 Pastel Colour-Blocked Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {siteConfig.services.map((service, idx) => {
              const theme = SERVICE_THEMES[idx] || SERVICE_THEMES[0];
              const Icon = theme.icon;

              return (
                <Scroll3DCard
                  key={service.slug}
                  index={idx}
                  className={`p-7 sm:p-8 rounded-3xl border ${theme.bg} ${theme.border} shadow-xs flex flex-col justify-between hover:shadow-lg transition-all h-full`}
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/90 border border-black/5 flex items-center justify-center shadow-xs shrink-0 text-navy-900">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold font-numbers uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.tagBg}`}>
                        Service 0{idx + 1}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-xl text-navy-900 mb-2.5 hover:text-orange-600 transition-colors min-h-[3.25rem] flex items-start">
                      <Link to={`/services/${service.slug}`}>{service.title}</Link>
                    </h2>

                    <div className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{theme.highlight}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal flex-1 mb-6">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex items-center justify-between mt-auto">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-600 transition-colors"
                    >
                      <span>Explore details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    </Link>
                    <button
                      onClick={onOpenConsultation}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      Book free call →
                    </button>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 3. SIGNATURE SECTION: ALTERNATING TWO-COLUMN SERVICE ROWS WITH DIFFERENT BACKGROUND COLOURS ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Signature Delivery Models</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              How We Solve Modern <span className="text-brand-gradient">Hiring Deadlocks.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore our four flagship delivery tracks designed for speed, architectural rigor, and mutual retention.
            </p>
          </SectionReveal>

          <div className="space-y-12">
            {/* Row 1: Job Placement on Lavender #EEF0FF */}
            <div className="rounded-3xl p-8 sm:p-12 bg-[#EEF0FF] border border-[#D9DCFF] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-bold uppercase tracking-wider">
                    Candidate Flagship Track
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">
                    Candidate Career Representation & Job Placement
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Unlike agencies that send your resume into automated submission black holes, we assign you a dedicated Technical Talent Advocate. We optimize your GitHub repositories, rehearse system design questions, and place you directly in front of engineering decision-makers.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      '18-Day average time from onboarding to offer',
                      'Direct hiring manager introductions',
                      'Aggressive compensation negotiation',
                      '100% free representation for candidates',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button variant="primary" size="md" onClick={onOpenConsultation}>
                      Get Placed Free
                    </Button>
                    <Link
                      to="/services/job-placement"
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-gray-300 flex items-center"
                    >
                      Read Full Placement Guide →
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-blue-200/60 shadow-md">
                  <div className="text-xs font-bold uppercase text-blue-600 mb-1">Placement Velocity</div>
                  <div className="text-3xl font-numbers font-black text-navy-900 mb-2">18.2 Days</div>
                  <p className="text-xs text-slate-600 mb-4">
                    Average duration from initial resume intake to signed enterprise offer letter.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Technical Screening:</span>
                      <span className="font-bold text-navy-900">24-48 Hours</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Direct Client Introductions:</span>
                      <span className="font-bold text-navy-900">Days 3 - 7</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Offer Negotiation:</span>
                      <span className="font-bold text-emerald-600">Days 14 - 18</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Corporate Recruitment & Staffing on Mint #E3F6EC */}
            <div className="rounded-3xl p-8 sm:p-12 bg-[#E3F6EC] border border-[#C2EED7] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-emerald-200/60 shadow-md order-2 lg:order-1">
                  <div className="text-xs font-bold uppercase text-emerald-600 mb-1">Staffing Caliber</div>
                  <div className="text-3xl font-numbers font-black text-navy-900 mb-2">94.8% Retention</div>
                  <p className="text-xs text-slate-600 mb-4">
                    12-month mutual retention rate across contract, C2H, and permanent engineering deployments.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Shortlist Delivery SLA:</span>
                      <span className="font-bold text-navy-900">48 Hours</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Interview-to-Offer Ratio:</span>
                      <span className="font-bold text-navy-900">3 : 1</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Zero-Risk Replacement:</span>
                      <span className="font-bold text-emerald-600">30-Day Guarantee</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    Enterprise Staffing
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">
                    Precision Recruitment, Contract-to-Hire & Pod Staffing
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Stop sifting through hundreds of irrelevant applicants. Our talent bench is pre-assessed on production code, architectural thinking, and communication skills before you ever see a resume.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Full W-2, C2C & 1099 compliance support',
                      'Pre-cleared E-Verify & background checks',
                      'Specialized in Cloud, Data, Web & AI pods',
                      'Dedicated account director for every team',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button variant="primary" size="md" onClick={onOpenConsultation}>
                      Request Talent Roster
                    </Button>
                    <Link
                      to="/employers"
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-gray-300 flex items-center"
                    >
                      Employer Solutions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Industry IT Training on Cream #FFF3E8 */}
            <div className="rounded-3xl p-8 sm:p-12 bg-[#FFF3E8] border border-[#FFE2C7] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 text-orange-700 text-xs font-bold uppercase tracking-wider">
                    Hands-On Upskilling
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">
                    Industry IT Training Bootcamps & Live Architecture Labs
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Bridge the gap between academic theory and enterprise production code. Our live bootcamps immerse candidates in real-world microservice design, cloud deployments, and automated testing pipelines.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      '10 technology tracks: Cloud, Java, DevOps, Data',
                      'Live sandbox environments & real codebases',
                      'Direct guidance from Principal Architects',
                      'Integrated placement support upon completion',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button variant="primary" size="md" onClick={onOpenConsultation}>
                      View Training Schedules
                    </Button>
                    <Link
                      to="/services/it-training"
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-gray-300 flex items-center"
                    >
                      Explore 10 Tracks →
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-orange-200/60 shadow-md">
                  <div className="text-xs font-bold uppercase text-orange-600 mb-1">Curriculum Impact</div>
                  <div className="text-3xl font-numbers font-black text-navy-900 mb-2">+42% Comp Lift</div>
                  <p className="text-xs text-slate-600 mb-4">
                    Average salary boost reported by bootcamp graduates post-placement.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Total Hands-On Labs:</span>
                      <span className="font-bold text-navy-900">40+ Labs / Track</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Capstone Project:</span>
                      <span className="font-bold text-navy-900">Production App</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Placement Rate:</span>
                      <span className="font-bold text-emerald-600">92.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Candidate Rebranding on Sky #E4F1FF */}
            <div className="rounded-3xl p-8 sm:p-12 bg-[#E4F1FF] border border-[#CCE4FF] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-sky-200/60 shadow-md order-2 lg:order-1">
                  <div className="text-xs font-bold uppercase text-sky-600 mb-1">Recruiter Attraction</div>
                  <div className="text-3xl font-numbers font-black text-navy-900 mb-2">3.4x Inbound</div>
                  <p className="text-xs text-slate-600 mb-4">
                    Increase in verified recruiter messages on LinkedIn within 14 days of profile rebrand.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">ATS Match Score Lift:</span>
                      <span className="font-bold text-navy-900">+48%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="font-medium">Delivery Speed:</span>
                      <span className="font-bold text-navy-900">72 Hours</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Format:</span>
                      <span className="font-bold text-sky-600">PDF + Word + LinkedIn</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-600/10 text-sky-700 text-xs font-bold uppercase tracking-wider">
                    Profile Optimization
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">
                    Resume Rebranding & LinkedIn Narrative Transformation
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Most tech resumes get rejected by automated screening parsers before a human ever reads them. We rewrite your professional story with metrics-driven accomplishments, high-weight technical keywords, and executive clarity.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Dual human recruiter + ATS algorithm audit',
                      'Custom LinkedIn summary & headline strategy',
                      'Targeted keywords for your precise tech stack',
                      'Interview talking points & STAR stories',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy-900">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button variant="primary" size="md" onClick={onOpenConsultation}>
                      Rebrand My Profile
                    </Button>
                    <Link
                      to="/tools/resume-analyzer"
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-gray-300 flex items-center"
                    >
                      Try Free Resume Analyzer →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CLOSING CTA SECTION ── */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-3xl mx-auto">
          <SectionReveal variant="tiltUp">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Direct Advisory Consultation
            </div>
            <h2 className="text-h2 text-white mb-4">
              Ready to Accelerate Your <span className="text-brand-gradient">Hiring or Career?</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto font-normal">
              Talk directly with a senior talent partner. We assess your unique timeline, technical requirements, and goals with zero pushy sales tactics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-orange-500/25">
                Book Free Consultation
              </Button>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm transition-colors border border-white/20 flex items-center justify-center"
              >
                Reach Our Offices
              </Link>
            </div>
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
