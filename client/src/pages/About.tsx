import React from 'react';
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
  Clock,
  Compass,
  Zap,
  Globe2,
  Briefcase,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { PageHero } from '../components/layout/PageHero';

export const About: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const stats = [
    { value: '18 Days', label: 'Average Time to Offer', desc: 'vs. 45-day industry average' },
    { value: '2,400+', label: 'Engineers Placed', desc: 'Across Tier-1 & Fortune 500 teams' },
    { value: '94.8%', label: '12-Month Retention', desc: 'Long-term mutual cultural fit' },
    { value: '120+', label: 'Enterprise Partners', desc: 'Direct access to hiring decision-makers' },
  ];

  const pillars = [
    {
      icon: CpuIcon,
      title: 'Engineer-Led Calibration',
      description:
        'Our technical recruiters are paired directly with staff engineers. We assess real-world system design, production code quality, and architectural thinking—never just keyword matching.',
    },
    {
      icon: HeartHandshake,
      title: 'Radical Transparency',
      description:
        'No hidden fee deductions, no unrealistic promises, and zero bait-and-switch. Candidates receive transparent bill rates, genuine visa support, and unvarnished client feedback.',
    },
    {
      icon: Zap,
      title: 'Speed Without Chaos',
      description:
        'Our proprietary talent bench is pre-screened and pre-vetted. When an enterprise opens a requisition, we deliver high-fit, interview-ready shortlists within 48 hours.',
    },
    {
      icon: TrendingUp,
      title: 'Candidate-First Advocacy',
      description:
        'We view placements as multi-year career compounding events. We negotiate aggressive compensation packages, guide counteroffers, and mentor engineers post-placement.',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Founded in Plano, Texas',
      desc: 'Launched by veteran cloud architects and IT staffing leaders frustrated with transactional recruiter spam.',
    },
    {
      year: '2023',
      title: 'Crossed 1,000 Placements',
      desc: 'Expanded into direct Tier-1 vendor status across Fortune 500 FinTech, Healthcare, and Enterprise SaaS clients.',
    },
    {
      year: '2025',
      title: 'Hyderabad Global Delivery Hub',
      desc: 'Inaugurated our 24/7 global talent screening hub in HITEC City, expanding technical training and mock interview operations.',
    },
    {
      year: '2026',
      title: 'AI Diagnostic Benchmarking',
      desc: 'Launched real-time interview telemetry, ATS calibration diagnostics, and accelerated 18-day placement delivery.',
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
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="About Us | Codex Tech-IT - We Deliver Jobs Faster"
        description="Learn about Codex Tech-IT's mission, our engineer-led talent calibration model, our global delivery footprint in Dallas and Hyderabad, and why 2,400+ engineers trust us."
        canonical="/about"
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbs={[{ label: 'About Us' }]}
        badge="Our Mission & Operating Philosophy"
        title="Engineering Careers with Purpose & Velocity."
        titleGradientWords={['Purpose & Velocity.']}
        subtitle="Codex Tech-IT was founded to eliminate the disconnect in modern IT hiring: transactional recruiters who don’t understand architecture, and extraordinary engineers invisible to automated screening algorithms."
        primaryCta={{
          label: 'Book Advisory Consultation',
          onClick: onOpenConsultation,
        }}
        secondaryCta={{
          label: 'Explore Placements',
          href: '/live-placements',
        }}
        facts={[
          { label: 'Time to Offer', value: '18 Days' },
          { label: 'Placed Engineers', value: '2,400+' },
          { label: '12-Mo Retention', value: '94.8%' },
        ]}
        visual="about-journey"
      />

      {/* Metrics Banner Section */}
      <section className="py-12 bg-slate-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <SectionReveal key={i} variant="tiltUp" delay={i * 0.08} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-numbers font-black text-navy-900 tracking-tight">
                  <span className="text-brand-gradient">{s.value}</span>
                </div>
                <div className="text-sm font-heading font-bold text-navy-900">{s.label}</div>
                <div className="text-xs text-slate-500 font-medium">{s.desc}</div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Story & Why We Exist */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <SectionReveal variant="tiltLeft" className="lg:col-span-6 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <div className="eyebrow">The Origin Story</div>
              <h2 className="text-h2 text-navy-900 leading-tight">
                Bridging the Gap Between <span className="text-brand-gradient">Talent & Real Demand.</span>
              </h2>
              <p>
                In 2021, an enterprise team of cloud architects and talent executives in Texas noticed a severe paradox: companies were suffering from prolonged engineering shortages, yet thousands of qualified software engineers, DevOps specialists, and data engineers were struggling to break through algorithmic resume filters.
              </p>
              <p>
                Traditional staffing agencies relied on brute-force keyword matching without evaluating code or architecture. Codex Tech-IT was engineered from day one to break this cycle through a **dual-engine model**: rigorous technical calibration paired with direct, advocate-led placement into pre-vetted corporate teams.
              </p>
              <p>
                Today, operating across dual headquarters in Plano, Texas, and Hyderabad, India, we have facilitated over 2,400 successful placements, averaging an offer turnaround of just 18 days.
              </p>
            </SectionReveal>

            <SectionReveal variant="tiltRight" className="lg:col-span-6 bg-navy-900 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Our Guiding Mission</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "To create meaningful, life-changing employment by connecting qualified engineers with the right companies—faster, fairer, and with total transparency."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Our Operating Vision</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    To remain the premier technical staffing and career acceleration ecosystem across North America and India, known for relentless candidate advocacy and elite technical quality.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="primary" size="md" onClick={onOpenConsultation}>
                    Partner with Codex Tech-IT <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </Scroll3DSection>

      {/* 4 Foundational Operating Pillars */}
      <Scroll3DSection preset="tilt" className="section-padding bg-slate-50 border-y border-gray-200/70">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">How We Operate</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Our 4 Foundational <span className="text-brand-gradient">Pillars.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              The non-negotiable standards that govern every candidate recommendation and enterprise relationship.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Scroll3DCard
                  key={idx}
                  index={idx}
                  className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </Scroll3DSection>

      {/* Journey Timeline */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Milestones & Growth</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              The Codex <span className="text-brand-gradient">Trajectory.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              From our initial cohort of engineers to a recognized cross-continental staffing powerhouse.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <Scroll3DCard
                key={idx}
                index={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-gray-200/80 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-numbers font-black text-orange-600 mb-3 block">
                    {m.year}
                  </span>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Leadership & Advisory Team */}
      <Scroll3DSection preset="lift" className="section-padding bg-slate-50 border-t border-gray-200/70">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Meet the Leadership</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Veterans of <span className="text-brand-gradient">Engineering & Staffing.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              A leadership team combining deep systems engineering expertise with senior executive search leadership.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, i) => (
              <Scroll3DCard
                key={i}
                index={i}
                className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-navy-900 text-orange-400 font-bold font-heading text-xl flex items-center justify-center mb-4 shadow-sm">
                    {leader.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-0.5">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-orange-600 mb-3">{leader.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{leader.bio}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {leader.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Global Footprint */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-white">
        <div className="container-custom">
          <div className="p-8 sm:p-12 rounded-3xl bg-navy-900 text-white relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <SectionReveal variant="tiltLeft" className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold">
                  <Globe2 className="w-3.5 h-3.5" /> Global Infrastructure
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  Headquartered in Texas. Operating Globally.
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Our dual-hub model provides clients and candidates continuous, 24/7 staffing velocity. Client account management and technical interviews are anchored in Plano, Texas, supported by our global recruitment and training center in Hyderabad.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-bold text-sm text-white mb-1">🇺🇸 Plano, Texas (USA)</div>
                    <div className="text-xs text-slate-300">
                      North America Client Services, Executive Search, E-Verify Operations
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-bold text-sm text-white mb-1">🇮🇳 Hyderabad (India)</div>
                    <div className="text-xs text-slate-300">
                      HITEC City Technical Evaluation Hub, 24/7 Sourcing & IT Training
                    </div>
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal variant="tiltRight" className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-3xl font-numbers font-bold text-orange-400 mb-1">100%</div>
                <div className="text-sm font-bold text-white mb-2">Dedicated Placement Advocacy</div>
                <p className="text-xs text-slate-300 mb-6">
                  Ready to accelerate your engineering career or scale your technical team?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button variant="primary" size="md" className="flex-1 justify-center" onClick={onOpenConsultation}>
                    Talk to an Advisor
                  </Button>
                  <Link
                    to="/careers"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center transition-colors border border-white/20 flex items-center justify-center"
                  >
                    Explore Open Jobs
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </Scroll3DSection>
    </div>
  );
};

function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}
