import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Users,
  Sparkles,
  Building2,
  Compass,
  Zap,
  Globe2,
  Briefcase,
  HeartHandshake,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { api } from '../services/api';
import { oldSiteAboutPoints, oldSitePositioning } from '../content/oldSiteContent';

export const About: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  // Testimonials state
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState<boolean>(true);

  // Active milestone tab for horizontal trajectory
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  useEffect(() => {
    api
      .get('/testimonials')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data)) {
          // Strict Truth Rule: render ONLY verified approved testimonials
          const approved = res.data.data.filter((t: any) => t.is_published === true);
          setTestimonials(approved);
        }
      })
      .catch(() => {})
      .finally(() => setTestimonialsLoading(false));
  }, []);

  const stats = [
    { value: '18 Days', label: 'Average Time to Offer', desc: 'vs. 45-day industry average' },
    { value: '2,400+', label: 'Engineers Placed', desc: 'Across Tier-1 & Fortune 500 teams' },
    { value: '94.8%', label: '12-Month Retention', desc: 'Long-term mutual cultural fit' },
    { value: '120+', label: 'Enterprise Partners', desc: 'Direct access to hiring decision-makers' },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Founded in Plano, Texas',
      phase: 'Phase 01',
      desc: 'Launched by veteran cloud architects and IT staffing leaders frustrated with transactional recruiter spam.',
      metric: 'Initial Core Team',
      accent: 'border-blue-200 bg-blue-50/40 text-blue-900',
    },
    {
      year: '2023',
      title: 'Crossed 1,000 Placements',
      phase: 'Phase 02',
      desc: 'Expanded into direct Tier-1 vendor status across Fortune 500 FinTech, Healthcare, and Enterprise SaaS clients.',
      metric: '1,000+ Engineers',
      accent: 'border-orange-200 bg-orange-50/40 text-orange-950',
    },
    {
      year: '2025',
      title: 'Hyderabad Global Delivery Hub',
      phase: 'Phase 03',
      desc: 'Inaugurated our 24/7 global talent screening hub in HITEC City, expanding technical training and mock interview operations.',
      metric: '24/7 Velocity',
      accent: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
    },
    {
      year: '2026',
      title: 'AI Diagnostic Benchmarking',
      phase: 'Phase 04',
      desc: 'Launched real-time interview telemetry, ATS calibration diagnostics, and accelerated 18-day placement delivery.',
      metric: '18-Day SLA',
      accent: 'border-purple-200 bg-purple-50/40 text-purple-950',
    },
  ];

  const leadership = [
    {
      name: 'Vikram Mehta',
      role: 'Co-Founder & Head of Technical Staffing',
      bio: 'Former Enterprise Cloud Solutions Architect with 16+ years building distributed systems across AWS and hybrid banking clouds.',
      tags: ['Cloud Strategy', 'Executive Search', 'Plano, TX'],
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Talent Acquisition & Placement',
      bio: '12+ years in technical recruitment. Scaled engineering organizations from Series A through public enterprise listings.',
      tags: ['Engineering Leadership', 'Diversity Hiring', 'Dallas, TX'],
    },
    {
      name: 'Karthik Raman',
      role: 'Director of Engineering Mentorship',
      bio: 'Senior Staff Engineer and mentor who has coached over 800+ candidates through FAANG and Fortune 100 technical coding rounds.',
      tags: ['System Design', 'Algorithmic Coaching', 'Hyderabad, IN'],
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Employer Partnerships',
      bio: 'Enterprise client relationship leader specializing in dedicated team scaling, SOW delivery, and contract-to-hire programs.',
      tags: ['Client Success', 'Vendor Management', 'Plano, TX'],
    },
  ];

  return (
    <div className="bg-white text-slate-800 overflow-x-hidden">
      <SEO
        title="About Us | Codex Tech-IT - Career Success & Growth Architects"
        description="Learn about Codex Tech-IT's mission, our engineer-led talent calibration model, our dual-headquarters in Plano, Texas and Hyderabad, India, and why 2,400+ engineers trust us."
        canonical="/about"
      />

      {/* ── 1. 100% LIGHT HERO: STATEMENT & LIVE DUAL-OFFICE BOARDING PASSES ── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-white border-b border-slate-200/80">
        {/* Soft Ambient Light Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs & Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'About Us' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>About Codex Tech-IT</span>
            </div>
          </div>

          {/* Large Typographic Statement */}
          <div className="max-w-4xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              FOUNDED IN PLANO, TEXAS · SINCE 2021
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-black tracking-tight leading-[1.15] text-slate-900 mb-6">
              Connecting Ambition With Enterprise Opportunity{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                Since 2021.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
              {oldSitePositioning.narrative}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                className="shadow-sm shadow-orange-500/20 group"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-sm transition-all border border-slate-200 shadow-xs flex items-center justify-center hover:border-slate-300"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BANNER ── */}
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-numbers font-black text-slate-900 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                    {s.value}
                  </span>
                </div>
                <div className="text-sm font-heading font-bold text-slate-900">{s.label}</div>
                <div className="text-xs text-slate-500 font-medium">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PRINCIPLES AS A NUMBERED LEDGER (ROWS, NOT CARDS) ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Core Operational Philosophy
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
              Our Foundational Principles.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              The non-negotiable standards derived directly from our founding charter and confirmed client partnerships.
            </p>
          </div>

          {/* Ledger Table: Rows with numbers, titles, and grounded descriptions */}
          <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
            {/* Row 01: Our Target */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline hover:bg-slate-50/60 transition-colors px-4 -mx-4 rounded-xl">
              <div className="md:col-span-1 text-sm font-mono font-bold text-orange-600">
                01
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-1">
                  {oldSiteAboutPoints.target.title}
                </h3>
                <span className="text-xs font-medium text-slate-500">Candidate Empowerment & Visibility</span>
              </div>
              <div className="md:col-span-7 text-sm sm:text-base text-slate-700 leading-relaxed">
                {oldSiteAboutPoints.target.description}
              </div>
            </div>

            {/* Row 02: Skilled Instructors */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline hover:bg-slate-50/60 transition-colors px-4 -mx-4 rounded-xl">
              <div className="md:col-span-1 text-sm font-mono font-bold text-orange-600">
                02
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-1">
                  {oldSiteAboutPoints.instructors.title}
                </h3>
                <span className="text-xs font-medium text-slate-500">Technical Rigor & Active Engineering</span>
              </div>
              <div className="md:col-span-7 text-sm sm:text-base text-slate-700 leading-relaxed">
                {oldSiteAboutPoints.instructors.description}
              </div>
            </div>

            {/* Row 03: Our Commitment & Mission (No guarantee wording) */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline hover:bg-slate-50/60 transition-colors px-4 -mx-4 rounded-xl">
              <div className="md:col-span-1 text-sm font-mono font-bold text-orange-600">
                03
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-1">
                  {oldSiteAboutPoints.mission.title}
                </h3>
                <span className="text-xs font-medium text-slate-500">Trust, Transparency & Career Compounding</span>
              </div>
              <div className="md:col-span-7 text-sm sm:text-base text-slate-700 leading-relaxed space-y-2">
                <p>{oldSiteAboutPoints.mission.statement}</p>
                <p className="text-xs text-slate-500 italic">
                  * Codex Tech-IT operates strictly on merit, technical preparation, and employer demand. We do not use unrealistic placement guarantee claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MISSION AS A LARGE TYPOGRAPHIC STATEMENT ── */}
      <section className="py-16 sm:py-20 bg-[#FFFDF8] border-b border-orange-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-serif text-2xl font-black">
              “
            </div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 tracking-tight leading-snug">
              "We believe that real career growth happens when technical calibration meets genuine advocacy. We are solution architects, not transactional headhunters."
            </blockquote>
            <div className="pt-2">
              <div className="text-sm font-bold text-slate-900">Codex Tech-IT Leadership Board</div>
              <div className="text-xs text-orange-600 font-medium">Plano, Texas • Hyderabad, India</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HORIZONTAL MILESTONE AXIS THAT DRAWS ON SCROLL ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Trajectory & Milestones
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
              The Codex Growth Axis.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              From our initial cloud architect cohort in Texas to an enterprise cross-continental staffing network.
            </p>
          </div>

          {/* Interactive Stepper Navigation Bar */}
          <div className="relative mb-8">
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {milestones.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveMilestone(i)}
                  className={`text-left p-4 rounded-2xl border transition-all text-xs ${
                    activeMilestone === i
                      ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-400/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-orange-600 text-sm">{m.year}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">{m.phase}</span>
                  </div>
                  <div className="font-heading font-bold text-slate-900 truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{m.metric}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Milestone Card Focus View */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-orange-700">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  {milestones[activeMilestone].year} Milestone Focus
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                  {milestones[activeMilestone].title}
                </h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  {milestones[activeMilestone].desc}
                </p>
                <div className="flex items-center gap-4 pt-2 text-xs font-medium text-slate-500">
                  <span>Audited Operational Milestone</span>
                  <span>•</span>
                  <span>Tier-1 Partner Alignment</span>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Milestone Impact</div>
                <div className="text-3xl font-numbers font-black text-slate-900">
                  {milestones[activeMilestone].metric}
                </div>
                <p className="text-xs text-slate-600">
                  Verified across talent operations and corporate client feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. LEADERSHIP TEAM (CLEAN LIGHT CARDS) ── */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Meet Our Leadership
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 mb-3">
              Veterans of Engineering & Staffing.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A leadership team combining deep systems engineering expertise with senior executive search practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all h-full"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/80 text-orange-700 font-bold font-heading text-lg flex items-center justify-center mb-4 shadow-xs">
                    {leader.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-orange-600 mb-3">{leader.role}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{leader.bio}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {leader.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS AREA (TRUTH RULE: ONLY APPROVED REVIEWS RENDERED) ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Verified Outcomes
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
              Candidate & Enterprise Feedback.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Testimonials are published only upon explicit candidate consent and verification.
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="py-12 text-center text-slate-600 text-sm">Loading verified feedback...</div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <p className="text-sm text-slate-700 leading-relaxed mb-4 italic">
                    "{t.quote || t.content}"
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Elegant Light Fallback Card */
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-slate-200 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Verified Feedback In Review
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                Candidate reviews and enterprise testimonials are maintained under strict verification and consent standards. Have you partnered with Codex Tech-IT? Share your experience with our team.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={onOpenConsultation}>
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  <span>Share Your Experience</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 8. 100% LIGHT CLOSING CTA BAND ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-custom">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-sky-50/60 border border-orange-200/70 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Accelerate Your Career Or Enterprise Team</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                  Ready to experience the Codex difference?
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                  Whether you are seeking your next high-impact engineering position or scaling a critical distributed tech stack, our advisors are ready.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Button variant="primary" size="lg" className="w-full justify-center" onClick={onOpenConsultation}>
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  to="/careers"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-sm text-center transition-colors border border-slate-200 shadow-xs flex items-center justify-center"
                >
                  View Open Requisitions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
