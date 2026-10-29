import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Users,
  GraduationCap,
  Building,
  ShieldCheck,
  TrendingUp,
  Clock,
  Compass,
  FileText,
  Star,
  Layers,
  ChevronRight,
  Code,
  Zap,
  Award,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { SectionReveal } from '../components/motion/SectionReveal';
import { Marquee } from '../components/motion/Marquee';
import { CodexMonogramStage } from '../components/hero/CodexMonogramStage';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { Dual3DScrollShowcase } from '../components/motion/Dual3DScrollShowcase';
import { Button } from '../components/ui/Button';
import { MagneticButton } from '../components/motion/MagneticButton';
import { siteConfig } from '../config/site';
import { api } from '../services/api';
import { useMotionSystem } from '../motion';

// New Signature Components for Home
import { PastelPillars } from '../components/home/PastelPillars';
import { ThreeColumnHighlight } from '../components/home/ThreeColumnHighlight';
import { Since2021Timeline } from '../components/home/Since2021Timeline';
import { DataVisualizations } from '../components/charts/DataVisualizations';
import { ReviewsWall } from '../components/reviews/ReviewsWall';
import { HomeFAQ } from '../components/home/HomeFAQ';
import { HomeBlogTeaser } from '../components/home/HomeBlogTeaser';

export const Home: React.FC = () => {
  const outletCtx = useOutletContext<{ onOpenConsultation?: () => void }>() || {};
  const onOpenConsultation = outletCtx.onOpenConsultation || (() => {});

  const homeRef = useRef<HTMLDivElement>(null);
  useMotionSystem(homeRef);

  const [livePlacements, setLivePlacements] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live feed data from MySQL API
    api
      .get('/live-placements')
      .then((res) => {
        if (res.data?.data) setLivePlacements(res.data.data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div ref={homeRef} className="relative overflow-hidden bg-white">
      {/* Scroll threshold sentinel (24px) for navbar top state */}
      <div id="nav-scroll-sentinel" aria-hidden="true" className="absolute top-0 left-0 w-full h-[24px] pointer-events-none" />

      <SEO
        title="We Deliver Jobs Faster | IT Recruitment, Staffing & Training"
        description="Codex Tech-IT connects skilled IT professionals with companies ready to hire, through sharp profile positioning, interview coaching and direct employer access."
        canonical="/"
      />

      {/* ── 1. SIGNATURE LIGHT SKY-TO-CREAM HERO WITH 3D MONOGRAM STAGE ── */}
      <section
        data-nav-theme="light"
        className="hero-section relative pt-[calc(var(--nav-h)+var(--nav-top)+20px)] pb-20 lg:pt-[calc(var(--nav-h)+var(--nav-top)+32px)] lg:pb-32 overflow-hidden bg-gradient-to-b from-[#E8F2FF] via-[#FFF7ED]/80 to-[#FFFFFF] text-[#0F172A] border-b border-[#E2E8F0]"
      >
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-blue-500/10 rounded-full filter blur-[110px] pointer-events-none" />

        <div className="container-custom relative z-10" data-anim="stage-recede">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left relative z-10">
              <div className="w-full">
                {/* Pill Eyebrow */}
                <div className="eyebrow mb-4" data-testid="hero-label">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 hero-entrance-eyebrow shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
                    IT Recruitment · Staffing · Direct Placement
                  </span>
                </div>

                <h1
                  className="text-display text-[#0F172A] mb-6 hero-anim-headline overflow-visible leading-tight"
                  data-testid="hero-h1"
                >
                  <span className="block sm:inline hero-anim-line-1 pb-1">We Deliver</span>{' '}
                  <span className="block sm:inline hero-anim-line-2 pb-1">
                    Jobs{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                      Faster.
                    </span>
                  </span>
                </h1>

                <p
                  className="text-body-lg text-[#475569] font-normal mb-8 max-w-xl leading-relaxed hero-anim-para"
                  data-testid="hero-para"
                >
                  <span className="inline-block hero-entrance-para">
                    Codex Tech-IT connects skilled IT professionals with companies ready to hire, through sharp profile positioning, live technical coaching, and direct employer advocacy.
                  </span>
                </p>

                {/* CTAs */}
                <div
                  className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto hero-anim-cta"
                  data-testid="hero-buttons"
                >
                  <div className="hero-entrance-cta flex flex-wrap items-center gap-4">
                    <MagneticButton strength={0.2}>
                      <Button
                        variant="primary"
                        size="lg"
                        href="/careers"
                        className="btn-primary-orange bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-elevated"
                      >
                        Find My Next Job <ArrowRight className="w-5 h-5 ml-1" />
                      </Button>
                    </MagneticButton>
                    <MagneticButton strength={0.2}>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onOpenConsultation}
                        className="bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-slate-50 backdrop-blur-md shadow-xs font-semibold"
                      >
                        Hire Top Talent
                      </Button>
                    </MagneticButton>
                  </div>
                </div>

                {/* Floating trust indicators */}
                <div className="flex flex-wrap items-center gap-3 hero-anim-chips hero-entrance-chips">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                    <Zap className="w-3.5 h-3.5 text-orange-600" /> Fast 10-21 day interviews
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Pre-screened talent
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" /> Career-first advocacy
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Codex Monogram Stage with floating quadrant cards */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
              <CodexMonogramStage />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DUAL-DIRECTION 3D SCROLLING SHOWCASE (WORKING BOTH SIDES) ── */}
      <section data-nav-theme="light" data-anim="split-lines" className="relative overflow-hidden bg-slate-50/70 border-b border-gray-200/80">
        <Dual3DScrollShowcase />
      </section>

      {/* ── 3. SO, WHAT IS CODEX TECH-IT? (4 PASTEL CARDS MATCHING REFERENCE 1) ── */}
      <section data-nav-theme="light" data-anim="tilt-in" className="section-padding bg-white border-b border-gray-200/70">
        <div className="container-custom">
          <PastelPillars />
        </div>
      </section>

      {/* ── 4. WHY JOB SEEKERS & EMPLOYERS CHOOSE CODEX (THREE-COLUMN HIGHLIGHT MATCHING REFERENCE 1) ── */}
      <section data-nav-theme="light" data-anim="flip-rows" className="section-padding bg-slate-50/60 border-b border-gray-200/70">
        <div className="container-custom">
          <ThreeColumnHighlight />
        </div>
      </section>

      {/* ── 5. SERVICES GRID (9 SPECIALIZED SOLUTIONS) ── */}
      <section data-nav-theme="light" className="section-padding bg-white border-b border-gray-200/70">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Specialized Practices</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Comprehensive <span className="text-brand-gradient">IT Solutions.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Explore our specialized recruitment, IT training, and corporate talent infrastructure offerings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch" data-anim="flip-rows">
            {siteConfig.services.map((service, idx) => (
              <div
                key={service.slug}
                className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-numbers font-bold text-slate-400">0{idx + 1}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-navy-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
                    {service.desc}
                  </p>
                </div>

                <Link
                  to={`/services/${service.slug}`}
                  className="pt-4 border-t border-gray-100 inline-flex items-center justify-between text-xs font-heading font-bold text-navy-900 group-hover:text-orange-600 transition-colors"
                >
                  <span>Explore service details</span>
                  <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. SINCE 2021 YEARS TIMELINE (MATCHING CODEX TRAJECTORY) ── */}
      <section data-nav-theme="light" data-anim="draw" className="section-padding bg-slate-50/70 border-b border-gray-200/70">
        <div className="container-custom">
          <Since2021Timeline />
        </div>
      </section>

      {/* ── 7. DATA VISUALISATIONS (CHARTS, VELOCITY GAUGE, & BENCHMARKS) ── */}
      <section data-nav-theme="light" data-anim="tilt-in" className="section-padding bg-white border-b border-gray-200/70">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow justify-center">Analytics & Insights</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Performance <span className="text-brand-gradient">By the Numbers.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Live placement benchmarks, compensation medians, and interview scheduling velocity across our engineering cohorts.
            </p>
          </div>

          <DataVisualizations />
        </div>
      </section>

      {/* ── 8. REVIEWS WALL (CINEMATIC 3-COLUMN DRIFTING ON BRAND ORANGE) ── */}
      <ReviewsWall />

      {/* ── 9. FEATURED TECHNICAL OPENINGS ── */}
      <section data-nav-theme="light" id="featured-openings" className="section-padding bg-[#FFFFFF] border-b border-[#E2E8F0] relative overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="eyebrow flex items-center gap-1.5 text-[#C2410C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Bench Requisitions</span>
              </div>
              <h2 className="text-h2 text-[#0F172A] mb-2 font-heading font-bold">
                Featured Technical Openings
              </h2>
              <p className="text-[#475569] text-sm max-w-xl leading-relaxed">
                Direct hiring manager requisitions across enterprise cloud, distributed backend, and real-time data pipelines.
              </p>
            </div>
            <Link
              to="/careers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] hover:text-[#9A3412] hover:underline shrink-0"
            >
              <span>View All Open Positions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
            data-anim="rise-stagger"
          >
            {[
              {
                title: 'Lead Cloud Solutions Architect',
                dept: 'Cloud & Infrastructure',
                salary: '$145k - $175k / yr',
                location: 'Dallas, TX / Remote',
                tag: 'Priority Requisition',
                tagColor: 'bg-[#E8F2FF] text-[#1D4ED8] border-[#BFDBFE]',
                timeline: '10-18 Days to Offer',
                skills: ['AWS', 'Terraform', 'Kubernetes'],
              },
              {
                title: 'Senior Full-Stack Engineer',
                dept: 'React & Node.js Platform',
                salary: '$130k - $160k / yr',
                location: 'Plano, TX / Hybrid',
                tag: 'Fast-Track Fill',
                tagColor: 'bg-[#FFE9E6] text-[#C2410C] border-[#FED7AA]',
                timeline: '12-21 Days to Offer',
                skills: ['TypeScript', 'React', 'Node.js'],
              },
              {
                title: 'Data Engineer (Snowflake & Spark)',
                dept: 'Distributed Analytics',
                salary: '$135k - $165k / yr',
                location: 'Chicago, IL / Remote',
                tag: 'Direct Client',
                tagColor: 'bg-[#E4F6EC] text-[#15803D] border-[#BBF7D0]',
                timeline: '14-24 Days to Offer',
                skills: ['PySpark', 'Snowflake', 'dbt'],
              },
              {
                title: 'Platform SRE & Automation',
                dept: 'Site Reliability Engineering',
                salary: '$140k - $170k / yr',
                location: 'Atlanta, GA / Remote',
                tag: 'Visa Friendly',
                tagColor: 'bg-[#EFEEFF] text-[#4F46E5] border-[#DDD6FE]',
                timeline: '8-15 Days to Offer',
                skills: ['Docker', 'Golang', 'CI/CD Pipelines'],
              },
            ].map((role, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#2563EB]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${role.tagColor}`}
                    >
                      {role.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] font-medium">Sample</span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1.5 leading-snug group-hover:text-[#1D4ED8] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium mb-3">
                    {role.dept} · {role.location}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-3 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#F1F5F9]">
                    <span className="text-sm font-heading font-bold text-[#15803D] tabular-nums">
                      {role.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {role.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <Clock className="w-3 h-3 text-[#C2410C]" />
                    <span>{role.timeline}</span>
                  </div>
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. RECENT VERIFIED PLACEMENTS FEED ── */}
      {livePlacements.length > 0 && (
        <section data-nav-theme="light" className="section-padding bg-slate-50/70 border-b border-gray-200/70">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="eyebrow">Verified Placements</div>
                <h2 className="text-h2 text-navy-900">Recent Candidate Outcomes</h2>
              </div>
              <Link
                to="/live-placements"
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                View all verified placements →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch" data-anim="depth-in">
              {livePlacements.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-2">
                      <span className="font-bold text-blue-700">{p.company_type}</span>
                      <span>{p.location}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1 leading-snug">{p.role}</h3>
                    <p className="text-xs text-slate-600 font-normal mb-4">{p.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-numbers font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {p.package_range}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Offer Accepted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 11. FAQ ACCORDION (Interactive Tabs, Search, Fallback) ── */}
      <HomeFAQ />

      {/* ── 12. LATEST ENGINEERING & RECRUITING BLOG PUBLICATIONS ── */}
      <HomeBlogTeaser />

      {/* ── 13. CLOSING CALL TO ACTION ── */}
      <section data-nav-theme="light" data-anim="tilt-in" className="py-20 bg-gradient-to-r from-[#FFF7ED] via-[#FFF4D6]/50 to-[#E8F2FF] text-[#0F172A] border-t border-[#E2E8F0] relative overflow-hidden">
        <div className="container-custom max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] mb-4 border border-orange-200/90 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Ready for the Next Chapter?</span>
          </div>
          <h2 className="text-display text-[#0F172A] mb-4">
            Accelerate Your Technical <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
              Hiring or Career Today.
            </span>
          </h2>
          <p className="text-[#475569] text-sm max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Whether you are an engineer looking for a high-compensation breakthrough or a hiring manager needing a vetted shortlist within 48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenConsultation}
              className="btn-primary-orange bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-elevated"
            >
              Book Free Career Call
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/careers"
              className="bg-white text-[#0F172A] border border-slate-300 hover:bg-slate-50 font-semibold shadow-xs"
            >
              Browse Open Roles
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
