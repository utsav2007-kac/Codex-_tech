import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Check,
  Search,
  Phone,
  Mail,
  ArrowUpRight,
  BarChart3,
  Star,
  Terminal,
  RefreshCw,
  Cpu,
  Award,
  Globe,
  Building,
  CheckCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';

interface ServiceDetailData {
  slug: string;
  title: string;
  category: 'placement' | 'staffing' | 'upskilling' | 'compliance';
  categoryLabel: string;
  desc: string;
  metric: string;
  metricLabel: string;
  highlight: string;
  deliverables: string[];
  badge: string;
  badgeStyle: string;
  icon: React.ElementType;
  sla: string;
}

const ALL_SERVICES_DATA: ServiceDetailData[] = [
  {
    slug: 'job-placement',
    title: 'Candidate Career Representation & Job Placement',
    category: 'placement',
    categoryLabel: 'Candidate Career Growth',
    desc: 'Direct employer introductions, personalized resume calibration, and aggressive compensation defense to land full-time tech roles.',
    metric: '18 Days',
    metricLabel: 'Average Offer Turnaround',
    highlight: '100% Free representation for job seekers with zero placement cuts',
    deliverables: [
      'Direct hiring manager introductions at tier-1 firms',
      'System design & live coding technical mock defenses',
      'Executive salary & sign-on equity negotiation',
      'Full W-2 and C2H placement advocacy',
    ],
    badge: 'FLAGSHIP TRACK',
    badgeStyle: 'bg-orange-100 text-[#C2410C] border-orange-200',
    icon: Briefcase,
    sla: '18-Day SLA',
  },
  {
    slug: 'recruitment-staffing',
    title: 'Precision Recruitment & Technical Staffing',
    category: 'staffing',
    categoryLabel: 'Enterprise Staffing',
    desc: 'Contract, contract-to-hire, and permanent staffing pipelines providing pre-vetted engineers ready for immediate sprint integration.',
    metric: '48 Hours',
    metricLabel: 'Shortlist Delivery SLA',
    highlight: '94.8% 12-month mutual retention rate across engineering deployments',
    deliverables: [
      'Pre-vetted Cloud, DevOps, Data & Full-Stack engineers',
      'Rigorous GitHub production code and system audits',
      'Flexible W-2, C2C & 1099 engagement contracts',
      '30-Day risk-free talent replacement guarantee',
    ],
    badge: 'ENTERPRISE STAFFING',
    badgeStyle: 'bg-blue-100 text-[#1D4ED8] border-blue-200',
    icon: Users,
    sla: '48-Hour SLA',
  },
  {
    slug: 'talent-acquisition',
    title: 'Embedded Talent Acquisition (RPO Pods)',
    category: 'staffing',
    categoryLabel: 'Enterprise Staffing',
    desc: 'On-demand technical recruiters and sourcing pods embedded directly into your internal hiring workflow to accelerate critical roadmaps.',
    metric: '3 : 1',
    metricLabel: 'Interview-to-Offer Ratio',
    highlight: 'Scalable recruitment pods deployed in under 7 business days',
    deliverables: [
      'Embedded technical talent sourcers & recruiters',
      'Full-funnel applicant tracking system orchestration',
      'Employer branding & technical job spec refinement',
      'Weekly requisition pipeline & SLA dashboards',
    ],
    badge: 'RPO PODS',
    badgeStyle: 'bg-sky-100 text-[#0284C7] border-sky-200',
    icon: Target,
    sla: '7-Day Deployment',
  },
  {
    slug: 'it-training',
    title: 'Industry IT Training & Production Architecture Labs',
    category: 'upskilling',
    categoryLabel: 'Upskilling & Labs',
    desc: 'Hands-on live engineering bootcamps designed by Principal Architects across AWS Cloud, Java Microservices, PySpark, and Cybersecurity.',
    metric: '+42%',
    metricLabel: 'Average Salary Uplift',
    highlight: 'Live sandbox environments simulating enterprise multi-cloud architectures',
    deliverables: [
      '10 specialized tracks from Cloud SRE to Data Pipelines',
      '40+ hands-on production infrastructure labs per track',
      'Capstone portfolio deployed to live cloud instances',
      'Integrated placement coaching upon graduation',
    ],
    badge: 'HANDS-ON LABS',
    badgeStyle: 'bg-emerald-100 text-[#15803D] border-emerald-200',
    icon: GraduationCap,
    sla: '8-12 Week Cohorts',
  },
  {
    slug: 'background-verification',
    title: 'Technical & Comprehensive Background Screening',
    category: 'compliance',
    categoryLabel: 'Corporate Compliance',
    desc: 'Exhaustive verification covering criminal background, education, enterprise employment history, and technical code authenticity.',
    metric: '100%',
    metricLabel: 'FCRA & E-Verify Compliance',
    highlight: 'Dual-phase identity validation and technical repo verification',
    deliverables: [
      'Multi-state criminal & federal record screening',
      'Direct previous employer verification & tenure check',
      'Degree and technical certification validation',
      'GitHub originality & commit provenance analysis',
    ],
    badge: 'VERIFIED SECURITY',
    badgeStyle: 'bg-amber-100 text-[#B45309] border-amber-200',
    icon: ShieldCheck,
    sla: '72-Hour Turnaround',
  },
  {
    slug: 'payroll-taxes',
    title: 'Multi-State Payroll & Labor Tax Compliance',
    category: 'compliance',
    categoryLabel: 'Corporate Compliance',
    desc: 'Complete W-2, 1099, and C2C payroll handling, automated state tax filings, workers comp, and statutory benefits compliance.',
    metric: '50 States',
    metricLabel: 'US Jurisdiction Coverage',
    highlight: 'Flawless multi-state tax withholding and employer-of-record capability',
    deliverables: [
      'Automated bi-weekly direct deposit disbursement',
      'Federal, state, and local payroll tax withholding',
      'Comprehensive ACA, ERISA, and workers comp insurance',
      'Dedicated employee onboarding portal & 24/7 support',
    ],
    badge: 'PAYROLL EOR',
    badgeStyle: 'bg-purple-100 text-[#7E22CE] border-purple-200',
    icon: CreditCard,
    sla: 'Zero-Error SLA',
  },
  {
    slug: 'resume-linkedin-rebranding',
    title: 'Resume & LinkedIn Narrative Transformation',
    category: 'placement',
    categoryLabel: 'Candidate Career Growth',
    desc: 'Transform raw engineering resumes into high-impact, ATS-optimized architectural dossiers engineered to trigger recruiter outreach.',
    metric: '3.4x',
    metricLabel: 'Recruiter Inbound Lift',
    highlight: 'Calibrated to pass enterprise ATS algorithms and impress VPs of Engineering',
    deliverables: [
      'Algorithmic ATS keyword density optimization',
      'Executive LinkedIn headline, narrative & featured dossier',
      'Metrics-first bullet point architecture (STAR format)',
      'Delivered in editable Word, ATS-clean PDF & plain text',
    ],
    badge: 'PROFILE REBRAND',
    badgeStyle: 'bg-orange-100 text-[#C2410C] border-orange-200',
    icon: Sparkles,
    sla: '3-Day Turnaround',
  },
  {
    slug: 'interview-preparation',
    title: 'Technical Interview Defense & Behavioral Coaching',
    category: 'placement',
    categoryLabel: 'Candidate Career Growth',
    desc: 'Intensive 1-on-1 mock interviews covering low-level system design, algorithm grilling, architecture trade-offs, and behavioral rounds.',
    metric: '87.5%',
    metricLabel: 'First-Round Pass Rate',
    highlight: 'Conducted exclusively by practicing Lead Architects and Hiring Managers',
    deliverables: [
      'Real-world system design whiteboard simulations',
      'Live live-coding reviews under timed constraints',
      'Executive STAR behavioral and leadership alignment',
      'Detailed video recordings & line-by-line feedback',
    ],
    badge: 'MOCK SESSIONS',
    badgeStyle: 'bg-blue-100 text-[#1D4ED8] border-blue-200',
    icon: HelpCircle,
    sla: 'Custom Schedules',
  },
  {
    slug: 'custom-job-campaigns',
    title: 'Custom Job Outreach Campaigns & Direct Placement',
    category: 'placement',
    categoryLabel: 'Candidate Career Growth',
    desc: 'High-touch, confidential job search campaigns targeting unadvertised roles through executive networking and tailored direct pitches.',
    metric: '180+',
    metricLabel: 'Enterprise Hiring Desks',
    highlight: 'Bypasses automated applicant black holes through warm executive pitches',
    deliverables: [
      'Targeted employer mapping across North America',
      'Personalized pitch narratives tailored to each hiring lead',
      'Confidential candidate representation for employed leads',
      'Multi-offer coordination & bidding strategy',
    ],
    badge: 'EXCLUSIVE DESK',
    badgeStyle: 'bg-emerald-100 text-[#15803D] border-emerald-200',
    icon: Compass,
    sla: 'Active Matching',
  },
];

export const Services: React.FC = () => {
  const outletCtx = useOutletContext<{ onOpenConsultation?: () => void }>() || {};
  const onOpenConsultation = outletCtx.onOpenConsultation || (() => {});

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Filtered services
  const filteredServices = useMemo(() => {
    return ALL_SERVICES_DATA.filter((service) => {
      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="bg-white overflow-x-hidden min-h-screen text-[#0F172A]">
      <SEO
        title="Technical Services & Staffing Solutions | Codex Tech-IT"
        description="Explore Codex Tech-IT's 9 specialized practices across tech recruitment, contract staffing, hands-on IT bootcamps, candidate advocacy, and payroll compliance."
        canonical="/services"
      />

      {/* ── 1. SIGNATURE LIGHT SKY-TO-CREAM HERO: "THE SERVICE SPECTRUM" ── */}
      <section
        data-nav-theme="light"
        className="relative pt-[calc(var(--nav-h)+var(--nav-top)+20px)] pb-20 lg:pt-[calc(var(--nav-h)+var(--nav-top)+32px)] lg:pb-28 overflow-hidden bg-gradient-to-b from-[#E8F2FF] via-[#FFF7ED]/80 to-[#FFFFFF] text-[#0F172A] border-b border-[#E2E8F0]"
      >
        {/* Soft Ambient Radial Lights (matching Home Hero) */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-blue-500/10 rounded-full filter blur-[110px] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs & Eyebrow */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Services' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Full Service Catalog · 9 Specialized Practice Areas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading & Core Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12] mb-6">
                Engineered IT Solutions for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                  High-Velocity Growth.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#475569] font-normal leading-relaxed mb-8 max-w-2xl">
                Whether you need to scale an enterprise engineering pod under aggressive delivery SLAs or accelerate your personal tech career with 1-on-1 advocacy, Codex Tech-IT delivers calibrated precision across North America and India.
              </p>

              {/* Actions & Highlights */}
              <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-elevated font-bold text-sm px-7 py-3.5"
                >
                  Book Free Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  to="/careers"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-heading font-bold text-sm transition-all border border-[#CBD5E1] shadow-xs hover:border-[#C2410C] flex items-center justify-center gap-1.5"
                >
                  <span>Explore Open Bench Roles</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C2410C]" />
                </Link>
              </div>

              {/* Trust Indicators Strip */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-[#C2410C]" /> 18-Day Avg Turnaround
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" /> 100% E-Verified & FCRA
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-[#16A34A]" /> 94.8% 12-Month Retention
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Service Deck Radar (Completely Unique Visual Card) */}
            <div className="lg:col-span-5">
              <div className="p-7 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                      SERVICE CAPABILITY MATRIX
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-100">
                    2026 EDITION
                  </span>
                </div>

                {/* Radar Grid of 4 Key Capabilities */}
                <div className="space-y-3.5 mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Candidate Placement</div>
                        <div className="text-[11px] text-[#64748B]">100% Free · Direct Hiring Desks</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-numbers text-[#C2410C] bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
                      18-Day Offer
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center font-bold text-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Enterprise IT Staffing</div>
                        <div className="text-[11px] text-[#64748B]">Contract, C2H & Direct Hire</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-numbers text-[#1D4ED8] bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                      48-Hr SLA
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center font-bold text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">Production Cloud Labs</div>
                        <div className="text-[11px] text-[#64748B]">AWS, Java, Data & DevOps</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-numbers text-[#15803D] bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      +42% Comp
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7E22CE] flex items-center justify-center font-bold text-xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">50-State EOR & Payroll</div>
                        <div className="text-[11px] text-[#64748B]">Tax Withholding & Compliance</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-numbers text-[#7E22CE] bg-purple-50 px-2 py-1 rounded-md border border-purple-200">
                      Zero-Error
                    </span>
                  </div>
                </div>

                {/* Live Corridor Micro-Pill */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                    NYC ⇄ AMD Global Corridor
                  </span>
                  <Link
                    to="/contact"
                    className="font-bold text-[#C2410C] hover:underline flex items-center gap-1"
                  >
                    <span>Reach Hubs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTERABLE SERVICE DECK: SEARCH & CATEGORY SELECTOR ── */}
      <section
        data-nav-theme="light"
        className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]"
      >
        <div className="container-custom">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200 mb-3">
                <Target className="w-3.5 h-3.5 text-[#C2410C]" />
                Interactive Service Navigator
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0F172A] tracking-tight">
                Explore All <span className="text-[#C2410C]">9 Practice Areas.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-xl">
                Filter by practice category or search directly to explore deliverables, SLAs, and technical frameworks.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="w-full lg:w-72 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services, skills, SLAs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E2E8F0]">
            {[
              { id: 'all', label: 'All 9 Solutions', count: ALL_SERVICES_DATA.length },
              { id: 'placement', label: 'Candidate Career Placement', count: 4 },
              { id: 'staffing', label: 'Enterprise IT Staffing & RPO', count: 2 },
              { id: 'upskilling', label: 'Technical Upskilling & Labs', count: 1 },
              { id: 'compliance', label: 'Verification & Payroll EOR', count: 2 },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* The 9 Service Cards Grid */}
          {filteredServices.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#E2E8F0] p-8">
              <Search className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0F172A] mb-1">No matching practice areas found</h3>
              <p className="text-xs text-[#64748B] mb-4">Try clearing your search query or selecting "All 9 Solutions".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {filteredServices.map((service, idx) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.slug}
                    className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-orange-400/80 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Ribbon */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#C2410C] border border-orange-100 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${service.badgeStyle}`}
                          >
                            {service.badge}
                          </span>
                        </div>
                      </div>

                      {/* Title & Category */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        {service.categoryLabel}
                      </div>
                      <h3 className="text-xl font-heading font-extrabold text-[#0F172A] mb-3 group-hover:text-[#C2410C] transition-colors leading-snug">
                        <Link to={`/services/${service.slug}`}>{service.title}</Link>
                      </h3>

                      {/* Highlight Banner */}
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] mb-4 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                        <span className="leading-snug">{service.highlight}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                        {service.desc}
                      </p>

                      {/* Deliverables Checklist */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-[#F1F5F9]">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                          Key Deliverables:
                        </div>
                        {service.deliverables.slice(0, 3).map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer KPI & Navigation */}
                    <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-base font-numbers font-black text-[#0F172A]">
                          {service.metric}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-medium leading-tight">
                          {service.metricLabel}
                        </div>
                      </div>

                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#C2410C] text-white text-xs font-heading font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. DUAL-TRACK COMPARATIVE ARCHITECTURE: CANDIDATE VS ENTERPRISE ── */}
      <section
        data-nav-theme="light"
        className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]"
      >
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#C2410C]" />
              Dual-Sided Value Creation
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0F172A] tracking-tight">
              One Unified Ecosystem. <span className="text-[#C2410C]">Two Delivery Tracks.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              How our service portfolio simultaneously accelerates candidate compensation and eliminates corporate hiring bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Track A: Candidate Acceleration */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FFF7ED]/50 border border-orange-200 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-orange-200">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-orange-100 text-[#C2410C]">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">TRACK A</div>
                      <h3 className="text-lg font-heading font-extrabold text-[#0F172A]">Candidate Career Advocacy</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    100% Free
                  </span>
                </div>

                <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                  Designed for ambitious software engineers, data architects, cloud specialists, and F-1 OPT / STEM professionals seeking high-comp placements with verified sponsorship.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { step: '01', title: 'Algorithmic Profile Rebranding', desc: 'Overhaul resume & LinkedIn for high recruiter visibility' },
                    { step: '02', title: '1-on-1 System Design & Code Grilling', desc: 'Simulate technical grilling rounds with Lead Architects' },
                    { step: '03', title: 'Direct Hiring Desk Introductions', desc: 'Skip automated resume portals via warm manager pitches' },
                    { step: '04', title: 'Aggressive Offer Negotiation', desc: 'Secure maximum base comp, sign-on bonuses, and equity' },
                  ].map((s, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-2xl bg-white border border-orange-200/80 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#C2410C] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{s.title}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-orange-200 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold px-5 py-2.5"
                >
                  Apply For Placement Desk
                </Button>
                <Link
                  to="/services/job-placement"
                  className="text-xs font-bold text-[#0F172A] hover:text-[#C2410C] flex items-center gap-1 transition-colors"
                >
                  <span>Explore Placement Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Track B: Enterprise Technical Staffing */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#E8F2FF]/50 border border-blue-200 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-100 text-[#1D4ED8]">
                      <Building className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">TRACK B</div>
                      <h3 className="text-lg font-heading font-extrabold text-[#0F172A]">Enterprise Staffing & Scaling</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1D4ED8] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-mono">
                    48-Hr Shortlist
                  </span>
                </div>

                <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                  Engineered for VPs of Engineering, CTOs, and Talent Directors who need pre-assessed engineering talent without wading through unqualified applicants.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { step: '01', title: 'Target Stack & Requisition Scoping', desc: 'Calibrate senior competencies and delivery milestones' },
                    { step: '02', title: 'Pre-Vetted Candidate Shortlisting', desc: 'Deliver top 3 candidates audited on live production code' },
                    { step: '03', title: 'Streamlined Panel Scheduling', desc: 'Direct technical interviews without multi-week lag' },
                    { step: '04', title: 'Day-One Deployment & Compliance', desc: 'Full W-2/C2C compliance, E-Verify, and payroll support' },
                  ].map((s, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-2xl bg-white border border-blue-200/80 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#1D4ED8] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{s.title}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenConsultation}
                  className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold px-5 py-2.5"
                >
                  Request Candidate Roster
                </Button>
                <Link
                  to="/services/recruitment-staffing"
                  className="text-xs font-bold text-[#0F172A] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
                >
                  <span>Explore Staffing Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ENTERPRISE ENGAGEMENT FRAMEWORKS (LIGHT THEME MATCHING HOME) ── */}
      <section
        data-nav-theme="light"
        className="py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0] relative overflow-hidden"
      >
        {/* Ambient background glow matching Home light sections */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-500/5 via-blue-500/5 to-orange-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200 mb-3">
              <Cpu className="w-3.5 h-3.5 text-[#C2410C]" />
              Engagement Flexibility
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0F172A] tracking-tight">
              4 Scalable <span className="text-[#C2410C]">Engagement Models.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2 font-normal">
              From burst-capacity engineering contractors to full-time executive appointments and embedded sourcing pods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                id: 'c2h',
                title: 'Contract-to-Hire',
                badge: 'FLEXIBLE TRIAL',
                badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
                desc: 'Evaluate technical and cultural fit during a 3 to 6-month contract deployment before full-time W-2 transition.',
                metric: '3-6 Mo',
                metricLabel: 'Standard Evaluation Period',
                sla: 'Zero conversion fees after contract completion',
              },
              {
                id: 'direct',
                title: 'Direct-Hire Search',
                badge: 'PERMANENT ROLES',
                badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-200',
                desc: 'Specialized executive and senior search for Principal Architects, Engineering Managers, and Staff Software Engineers.',
                metric: '18-24 Days',
                metricLabel: 'Requisition Close Window',
                sla: 'Backed by our 90-day retention guarantee',
              },
              {
                id: 'pods',
                title: 'Dedicated Agile Pods',
                badge: 'POD SCALING',
                badgeColor: 'text-blue-800 bg-blue-100 border-blue-200',
                desc: 'Complete cross-functional teams (Lead Architect, 3 Engineers, QA Automation) integrated directly into your sprint backlog.',
                metric: '7 Days',
                metricLabel: 'Pod Deployment Turnaround',
                sla: 'Turnkey onboarding with pre-aligned workflows',
              },
              {
                id: 'rpo',
                title: 'Embedded RPO Desk',
                badge: 'SCALE SOURCING',
                badgeColor: 'text-purple-800 bg-purple-100 border-purple-200',
                desc: 'Dedicated technical recruiters scaling up or down with your quarterly headcount targets and engineering expansion.',
                metric: '3x Faster',
                metricLabel: 'Requisition Velocity Lift',
                sla: 'White-label recruiting under your brand',
              },
            ].map((model) => (
              <div
                key={model.id}
                className="p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-orange-400/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span
                    className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4 ${model.badgeColor}`}
                  >
                    {model.badge}
                  </span>
                  <h3 className="text-lg font-heading font-extrabold text-[#0F172A] mb-2.5 group-hover:text-[#C2410C] transition-colors">
                    {model.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal mb-5">
                    {model.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <div className="text-xl font-numbers font-black text-[#0F172A] mb-0.5">
                    {model.metric}
                  </div>
                  <div className="text-[10px] text-[#64748B] mb-3">{model.metricLabel}</div>
                  <div className="text-[11px] text-[#C2410C] font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#16A34A]" />
                    <span>{model.sla}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. THE 4-STAGE SERVICE EXECUTION LIFECYCLE ── */}
      <section
        data-nav-theme="light"
        className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]"
      >
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200 mb-3">
              <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
              Execution Lifecycle
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0F172A] tracking-tight">
              Calibrated Service <span className="text-[#C2410C]">Delivery Roadmap.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              Every practice area follows a transparent, metric-driven workflow engineered for high conversion and zero wasted turns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                phase: 'Hours 0 - 24',
                title: 'Technical Discovery & Intake',
                desc: 'Comprehensive audit of target tech stack, repository requirements, or candidate career ambitions with a Lead Technical Partner.',
                deliverable: 'Scope Specification & SLA Calibration',
              },
              {
                step: '02',
                phase: 'Hours 24 - 72',
                title: 'Code Vetting & Shortlisting',
                desc: 'Candidate portfolios and client requisitions are matched against live code challenges, ATS keywords, and architectural benchmarks.',
                deliverable: 'Top-Caliber Candidate Shortlist',
              },
              {
                step: '03',
                phase: 'Days 3 - 10',
                title: 'Interview Panels & Defense',
                desc: 'Simulated rounds, live coding preparation, and direct coordination with hiring managers for rapid two-way evaluation.',
                deliverable: 'Direct Executive Panel Feedback',
              },
              {
                step: '04',
                phase: 'Days 10 - 18',
                title: 'Offer Negotiation & Onboarding',
                desc: 'Comprehensive market compensation defense, background screening, W-2 compliance, and day-one deployment check-ins.',
                deliverable: 'Executed Offer & Seamless Start',
              },
            ].map((stage, idx) => (
              <div
                key={stage.step}
                className="p-7 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs hover:border-[#C2410C] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-orange-100 text-[#C2410C] font-mono font-black text-sm flex items-center justify-center">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                      {stage.phase}
                    </span>
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-[#0F172A] mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed font-normal mb-5">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#C2410C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>{stage.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS ABOUT OUR SERVICES ── */}
      <section
        data-nav-theme="light"
        className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]"
      >
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#C2410C]" />
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0F172A] tracking-tight">
              Frequently Asked <span className="text-[#C2410C]">Questions.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2">
              Everything you need to know about our fee structures, SLAs, and candidate advocacy guarantees.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Are job placement and career advocacy services completely free for candidates?',
                a: 'Yes, 100% free. We never charge candidates, job seekers, or boot camp participants any upfront placement fees, salary percentages, or hidden placement costs. Our corporate hiring partners compensate us directly for sourcing and vetting senior talent.',
              },
              {
                q: 'What is your typical candidate shortlist turnaround for enterprise requisitions?',
                a: 'Our standard enterprise shortlist SLA is 48 business hours. Because we maintain active bench cohorts of pre-screened Cloud, DevOps, Java, and Data engineers, we can present pre-vetted dossiers with verified code samples faster than traditional staffing agencies.',
              },
              {
                q: 'How does your 18-day average offer turnaround work?',
                a: 'From the moment an engineer joins our placement roster, we execute an immediate profile recalibration (Day 1-3), conduct live system design mock interviews (Day 3-5), and introduce them directly to hiring managers on our verified partner network (Days 5-12). Multi-offer negotiations and signed contracts typically occur by Day 18.',
              },
              {
                q: 'Do you support multi-state payroll, workers compensation, and visa sponsorship?',
                a: 'Yes. We operate as an authorized E-Verified employer across all 50 US states. We manage complete W-2, 1099, and C2C payroll disbursements, statutory tax withholdings, ACA benefits, and provide guidance on STEM-OPT and H-1B transfer requirements.',
              },
              {
                q: 'What if a placed contractor or direct hire is not the right fit?',
                a: 'We provide a 30-day zero-risk talent replacement guarantee on contractor deployments and a 90-day retention guarantee on direct-hire executive searches. If a candidate leaves or fails to meet technical milestones, we provide an immediate replacement at zero additional fee.',
              },
            ].map((faq, fIdx) => {
              const isOpen = openFaqIdx === fIdx;

              return (
                <div
                  key={fIdx}
                  className="rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-heading font-extrabold text-sm sm:text-base text-[#0F172A]">
                      {faq.q}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[#0F172A]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-4 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. CLOSING CONSULTATION DESK (LIGHT THEME MATCHING HOME) ── */}
      <section
        data-nav-theme="light"
        className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#FFF7ED]/50 to-[#E8F2FF]/60 border-t border-[#E2E8F0]"
      >
        <div className="container-custom max-w-5xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#CBD5E1] shadow-xl relative overflow-hidden">
            {/* Background ambient radial glow matching Home hero */}
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-orange-500/10 via-blue-500/10 to-transparent blur-[80px] pointer-events-none rounded-full" />

            <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#C2410C] text-xs font-bold uppercase mb-4 border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" /> Direct Technical Advisory
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-[#0F172A] mb-3">
                Let's Discuss Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                  Timeline & Requisitions.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                Speak directly with our technical staffing directors in New York and India. 100% confidential, zero high-pressure sales tactics.
              </p>
            </div>

            {/* Dual Decision Cards (Light Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 max-w-2xl mx-auto mb-8">
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-[#C2410C] mb-1">For Job Seekers</div>
                  <div className="text-base font-bold text-[#0F172A] mb-1.5">Accelerate Your Job Placement</div>
                  <p className="text-xs text-[#475569] leading-relaxed mb-5">
                    Get an instant resume review, coding defense practice, and direct employer introductions.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenConsultation}
                  className="w-full justify-center bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs py-3 shadow-md rounded-xl"
                >
                  Join Placement Roster →
                </Button>
              </div>

              <div className="p-6 rounded-2xl bg-[#E8F2FF] border border-blue-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-[#1D4ED8] mb-1">For Hiring Managers</div>
                  <div className="text-base font-bold text-[#0F172A] mb-1.5">Scale Your Engineering Pod</div>
                  <p className="text-xs text-[#475569] leading-relaxed mb-5">
                    Receive pre-screened candidate dossiers with verified code within 48 business hours.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenConsultation}
                  className="w-full justify-center bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs py-3 shadow-md rounded-xl"
                >
                  Request Talent Roster →
                </Button>
              </div>
            </div>

            {/* Quick Contact Links */}
            <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-6 text-xs text-[#475569] relative z-10 font-medium">
              <a
                href={`tel:${siteConfig.contact.phoneUSA}`}
                className="hover:text-[#C2410C] transition-colors flex items-center gap-2 font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>{siteConfig.contact.phoneUSA}</span>
              </a>
              <span className="hidden sm:inline text-slate-300">•</span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-[#C2410C] transition-colors flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <span className="hidden sm:inline text-slate-300">•</span>
              <Link to="/contact" className="hover:text-[#C2410C] transition-colors font-bold text-[#0F172A]">
                View All Global Offices →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
