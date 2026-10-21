import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Code,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/ui/SEO';
import { SectionReveal } from '../components/motion/SectionReveal';
import { TextReveal } from '../components/motion/TextReveal';
import { TiltCard } from '../components/motion/TiltCard';
import { Marquee } from '../components/motion/Marquee';
import { GradientMesh } from '../components/motion/GradientMesh';
import { CodexMonogramStage } from '../components/hero/CodexMonogramStage';
import { ScrollExperienceScene } from '../components/3d/ScrollExperienceScene';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/motion/Reveal';
import { MagneticButton } from '../components/motion/MagneticButton';
import { ScrollDepthSection } from '../components/motion/ScrollDepthSection';
import { siteConfig } from '../config/site';
import { api } from '../services/api';

const defaultHomeFaqs = [
  {
    id: 1,
    category: 'Placement Timeline',
    question: 'How quickly can Codex Tech-IT help me secure interviews?',
    answer: 'Most actively prepared candidates receive their first curated interview invitation within 10 to 21 business days after completing our profile positioning review.',
  },
  {
    id: 2,
    category: 'Candidate Eligibility',
    question: 'Do you only place senior engineers, or can juniors and career switchers apply?',
    answer: 'We support candidates across all experience levels, from fresh computer science graduates and career switchers to senior enterprise architects.',
  },
  {
    id: 3,
    category: 'Hiring Approach',
    question: 'What makes Codex Tech-IT different from mass-applying on job boards?',
    answer: 'We do not blast your resume blindly. We tailor your positioning, conduct technical mock interviews, and present your profile directly to vetted hiring managers with active openings.',
  },
  {
    id: 4,
    category: 'Confidentiality',
    question: 'Is my current employment kept confidential during the process?',
    answer: 'Absolutely. We never share your resume or contact details without your explicit prior authorization.',
  },
];

export const Home: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  // Interactive states
  const [whyChooseTab, setWhyChooseTab] = useState<'candidates' | 'employers'>('candidates');
  const [livePlacements, setLivePlacements] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>(defaultHomeFaqs);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Readiness widget state
  const [readinessStep, setReadinessStep] = useState(78);

  useEffect(() => {
    // Fetch live feed data from MySQL API
    api.get('/live-placements').then((res) => {
      if (res.data?.data) setLivePlacements(res.data.data.slice(0, 8));
    }).catch(() => { });

    api.get('/testimonials').then((res) => {
      if (res.data?.data) setTestimonials(res.data.data.slice(0, 6));
    }).catch(() => { });

    api.get('/posts?limit=3').then((res) => {
      if (res.data?.data?.items) setPosts(res.data.data.items);
    }).catch(() => { });

    api.get('/faqs?category=Job%20Seekers').then((res) => {
      if (res.data?.data && res.data.data.length > 0) setFaqs(res.data.data.slice(0, 5));
    }).catch(() => { });
  }, []);

  return (
    <div className="relative overflow-hidden bg-white">
      <SEO
        title="We Deliver Jobs Faster | IT Recruitment, Staffing & Training"
        description="Codex Tech-IT connects skilled IT professionals with companies ready to hire, through sharp profile positioning, interview coaching and direct employer access."
        canonical="/"
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-16 pb-20 lg:pt-28 lg:pb-36 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
        <GradientMesh />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Copy & CTAs with Dedicated Stacking Context & Soft Scrim Backing */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left relative z-10">
              {/* Subtle white-to-transparent soft scrim so text area is always calm and light */}
              <div
                className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-to-r from-white via-white/95 to-transparent rounded-3xl pointer-events-none -z-10"
                aria-hidden="true"
              />

              <Reveal variant="3d-unfold">
                <div className="eyebrow">IT Recruitment · Staffing · Training</div>

                <h1 className="text-display text-navy-900 mb-6">
                  We Deliver Jobs <span className="text-brand-gradient">Faster.</span>
                </h1>

                <p className="text-body-lg text-slate-800 font-medium mb-8 max-w-xl leading-relaxed">
                  Codex Tech-IT connects skilled IT professionals with companies ready to hire, through sharp profile positioning, interview coaching, and direct employer access.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                  <MagneticButton strength={0.2}>
                    <Button variant="primary" size="lg" href="/careers">
                      Find My Next Job <ArrowRight className="w-5 h-5 ml-1" />
                    </Button>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onOpenConsultation}
                      className="bg-white text-[#0F172A] border-[1.5px] border-[#0F172A] hover:bg-slate-50 hover:border-slate-800 shadow-sm"
                    >
                      Hire Top Talent
                    </Button>
                  </MagneticButton>
                </div>

                {/* Floating trust indicators */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-semibold text-orange-800 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-orange-600" /> Fast interviews
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-800 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Pre-screened talent
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 shadow-sm">
                    <Compass className="w-3.5 h-3.5 text-slate-600" /> Career-first support
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Codex Monogram Stage */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
              <CodexMonogramStage />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST MARQUEE ── */}
      <Scroll3DSection preset="lift" className="py-8 bg-gray-50 border-y border-gray-200/70 overflow-hidden">
        <div className="container-custom mb-3 text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-600">
            Trusted by teams hiring across tech, finance, healthcare, and high-growth sectors
          </p>
        </div>
        <Marquee speed={28} className="py-2">
          {['FinTech Global', 'CloudScale Inc', 'Apex Health', 'OmniLogistics', 'Starlight Data', 'Quantum Retail', 'SecureCore Tech', 'Nexus Capital', 'Synapse AI'].map((partner, i) => (
            <div
              key={i}
              className="px-6 py-2.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-sm font-heading font-bold text-slate-600 tracking-wide flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>{partner}</span>
            </div>
          ))}
        </Marquee>
      </Scroll3DSection>

      {/* ── 3. AUDIENCE PILLARS ── */}
      <Scroll3DSection preset="tilt" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Tailored Pathways</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              Wherever you are, there’s a <span className="text-brand-gradient">next step.</span>
            </h2>
            <p className="text-slate-600 mx-auto">
              Whether you are landing your first technical role, pivoting stacks, or scaling an engineering department.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Fresh Graduates',
                sub: 'Transition from academic theory to enterprise coding.',
                perks: ['Hands-on capstones', 'F1-OPT & STEM sponsorship guidance', 'First-round interview fast-track'],
                cta: 'Launch Your Career',
              },
              {
                icon: TrendingUp,
                title: 'Experienced Pros',
                sub: 'Unlock senior compensation and strategic roles.',
                perks: ['Resume ATS transformation', 'System design interview mastery', 'Direct corporate hiring manager access'],
                cta: 'Level Up Compensation',
              },
              {
                icon: Compass,
                title: 'Career Switchers',
                sub: 'Pivot into Cloud, Java, or QA in 90 days.',
                perks: ['Zero-to-production training', 'Practical portfolio construction', 'Confidence-building mock interviews'],
                cta: 'Start Career Pivot',
              },
              {
                icon: Building,
                title: 'Employers & Recruiters',
                sub: 'Pre-vetted engineering talent delivered in 48h.',
                perks: ['Contract & Direct-hire options', 'Pre-screened technical benchmarks', '90-day placement guarantee'],
                cta: 'Request Talent Shortlist',
                link: '/contact',
              },
            ].map((card, i) => (
              <Scroll3DCard key={i} index={i} className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between border border-gray-100 hover:border-orange-500/40">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5 shadow-sm">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-h3 font-bold text-navy-900 mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-700 font-medium mb-5 leading-relaxed">{card.sub}</p>

                  <ul className="flex flex-col gap-2.5 mb-8 text-xs text-slate-700 font-medium">
                    {card.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {card.link ? (
                  <Link to={card.link} className="inline-flex items-center justify-between text-xs font-heading font-bold text-navy-900 hover:text-orange-500 pt-3 border-t border-gray-100 transition-colors">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  </Link>
                ) : (
                  <button onClick={onOpenConsultation} className="inline-flex items-center justify-between text-xs font-heading font-bold text-navy-900 hover:text-orange-500 pt-3 border-t border-gray-100 transition-colors cursor-pointer text-left">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  </button>
                )}
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 4. WHAT IS CODEX TECH-IT (STORY & 4 PILLARS) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-gray-50 border-t border-gray-200/60 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <SectionReveal variant="tiltLeft" className="lg:col-span-5">
              <div className="eyebrow">Our Philosophy</div>
              <h2 className="text-h2 text-navy-900 mb-5">
                Technical Staffing with <span className="text-brand-gradient">Integrity & Speed.</span>
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Most agencies blast resumes into black-hole applicant portals. At Codex Tech-IT, we operate with a surgical standard: thorough technical preparation, tailored employer pitch decks, and verified corporate pipelines.
              </p>
              <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-orange-500 text-xs sm:text-sm text-navy-900 font-medium">
                "We don't believe in vanity metrics. We measure success by real offer letters signed and engineering teams successfully built."
              </div>
            </SectionReveal>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: 'Careers, Not Just Jobs', desc: 'We align placement with your 5-year trajectory, focusing on stack relevance and compensation growth.' },
                { title: 'Deadlines Mean Deadlines', desc: 'We respect your urgency. 48-hour shortlists for employers and 21-day average placements for candidates.' },
                { title: 'Partnerships, Not Transactions', desc: 'Transparent communication before, during, and long after the onboarding signature.' },
                { title: 'Always Improving', desc: 'Continuous feedback loops with engineering leaders so our mock interviews match real technical rounds.' },
              ].map((pillar, idx) => (
                <Scroll3DCard key={idx} index={idx} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-numbers font-extrabold text-orange-500/30 mb-2">0{idx + 1}</div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{pillar.title}</h3>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{pillar.desc}</p>
                  </div>
                </Scroll3DCard>
              ))}
            </div>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 5. SERVICES GRID (9 CARDS) ── */}
      <Scroll3DSection preset="tilt" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Comprehensive Solutions</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              End-to-End <span className="text-brand-gradient">IT Services.</span>
            </h2>
            <p className="text-slate-700 font-medium">
              Explore our specialized recruitment, IT training, and corporate talent infrastructure offerings.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.services.map((service, idx) => (
              <Scroll3DCard key={service.slug} index={idx} className="p-7 rounded-2xl glass-card border border-gray-100 flex flex-col justify-between group hover:border-orange-500/40">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-numbers font-bold text-slate-500">0{idx + 1}</span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-h3 font-bold text-navy-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 group-hover:text-orange-500 transition-colors"
                >
                  <span>Explore service details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 6. INTERACTIVE 3D SCROLLING ANIMATION JOURNEY ── */}
      <ScrollExperienceScene onOpenConsultation={onOpenConsultation} />

      {/* ── 7. WHY CHOOSE US (INTERACTIVE TOGGLE) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow justify-center">Proven Advantages</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              Why Partner with <span className="text-brand-gradient">Codex Tech-IT?</span>
            </h2>
            <p className="text-slate-600 mb-6">
              Switch perspectives to see the concrete value we deliver to job seekers and hiring managers.
            </p>

            {/* Toggle switch */}
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                onClick={() => setWhyChooseTab('candidates')}
                className={`px-5 py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm transition-all cursor-pointer ${whyChooseTab === 'candidates' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-navy-900'
                  }`}
              >
                For Job Seekers
              </button>
              <button
                onClick={() => setWhyChooseTab('employers')}
                className={`px-5 py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm transition-all cursor-pointer ${whyChooseTab === 'employers' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-navy-900'
                  }`}
              >
                For Employers
              </button>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseTab === 'candidates' ? (
              <>
                <Scroll3DCard index={0} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">Faster Interview Scheduling</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Direct representation bypasses generic HR queues, landing first-round discussions in 10-21 days.</p>
                </Scroll3DCard>
                <Scroll3DCard index={1} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">Verified E-Verified Employers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Work exclusively with vetted companies offering legitimate contracts and stable visa sponsorship.</p>
                </Scroll3DCard>
                <Scroll3DCard index={2} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center mb-4">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">Interview Confidence</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Full mock interview debriefs so you walk into system design and coding assessments fully prepared.</p>
                </Scroll3DCard>
              </>
            ) : (
              <>
                <Scroll3DCard index={0} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">48-Hour Shortlists</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Receive 2-4 pre-vetted candidates who have already passed coding assessments within 2 business days.</p>
                </Scroll3DCard>
                <Scroll3DCard index={1} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">Technical Pre-Screening</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Every engineer is vetted by senior developers to guarantee real-world architecture and communication competency.</p>
                </Scroll3DCard>
                <Scroll3DCard index={2} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">Flexible Hiring Models</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Contract, contract-to-hire, and full direct placement with multi-state payroll and tax compliance handled.</p>
                </Scroll3DCard>
              </>
            )}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 8. COMPARISON TABLE ── */}
      <Scroll3DSection preset="cinematic" className="section-padding bg-gray-50 border-t border-gray-200/60 relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">The Codex Difference</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Codex Tech-IT vs. <span className="text-brand-gradient">Going It Alone.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              See the concrete operational difference in strategy, network access, and timeline results.
            </p>
          </SectionReveal>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-navy-900 text-white">
                    <th className="p-4 font-heading font-bold">Key Criteria</th>
                    <th className="p-4 font-heading font-bold text-orange-400 bg-navy-800">With Codex Tech-IT</th>
                    <th className="p-4 font-heading font-bold text-slate-400">Going It Alone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Profile Positioning', 'Targeted ATS keyword mapping & architectural highlights', 'Generic template with unverified keyword density'],
                    ['Job Applications', 'Curated direct employer submissions with talent manager advocacy', 'Hundreds of blind submissions into black-hole ATS portals'],
                    ['Interview Coaching', 'Live 1-on-1 mock interviews, system design & STAR prep', 'Self-study videos without feedback on actual answer structure'],
                    ['Employer Access', 'Direct connections with 180+ pre-vetted corporate hiring partners', 'Competing with 500+ applicants on public LinkedIn posts'],
                    ['Feedback Loop', 'Clear rejection context and immediate interview adjustments', 'Radio silence or automated rejection emails with zero explanation'],
                    ['Offer Negotiation', 'Data-driven salary benchmarking & contract rate optimization', 'Accepting first baseline offer due to uncertainty and stress'],
                    ['Onboarding Support', 'Compliance, documentation, and 90-day retention support', 'Navigating complex corporate contracts and I-9 forms unguided'],
                    ['Time to Results', 'Average 10 - 21 business days to first interviews', '3 - 6 months of inconsistent search fatigue'],
                  ].map(([criteria, codex, alone], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="p-4 font-semibold text-navy-900">{criteria}</td>
                      <td className="p-4 font-medium text-navy-900 bg-orange-50/30 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{codex}</span>
                      </td>
                      <td className="p-4 text-slate-500">{alone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 9. READINESS WIDGET ── */}
      <Scroll3DSection preset="tilt" className="section-padding bg-white relative">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="eyebrow text-orange-400">Interactive Assessment</div>
                <h2 className="text-h2 text-white mb-4">
                  How ready are you for the <span className="text-brand-gradient">next role?</span>
                </h2>
                <p className="text-slate-300 text-sm mb-6">
                  Adjust your current preparation level to simulate your market placement score and view your prioritized roadmap.
                </p>

                {/* Sub-meters */}
                <div className="flex flex-col gap-4 text-xs font-medium">
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>ATS Resume Keyword Coverage</span>
                      <span className="font-bold text-orange-400">82%</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Technical Mock Interview Readiness</span>
                      <span className="font-bold text-blue-400">75%</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[75%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Behavioral STAR Communication</span>
                      <span className="font-bold text-green-400">85%</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <Button variant="primary" size="md" href="/careers">
                    Explore Open Positions <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Readiness Score Dial */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-44 h-44 rounded-full border-8 border-navy-800 border-t-orange-500 border-r-blue-600 flex flex-col items-center justify-center relative shadow-glow">
                  <span className="text-4xl font-numbers font-black text-white">{readinessStep}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Readiness Score</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-4 text-center">
                  Based on 2,400+ placed technical candidates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 10. ACTIVE CAREER OPENINGS PREVIEW ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-gray-50 border-t border-gray-200/60 relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="eyebrow">Active Bench Requisitions</div>
              <h2 className="text-h2 text-navy-900 mb-2">
                Featured Technical <span className="text-brand-gradient">Openings.</span>
              </h2>
              <p className="text-slate-600 text-sm max-w-xl">
                Direct hiring manager requisitions across enterprise cloud, distributed engineering, and AI pipelines.
              </p>
            </div>
            <Link to="/careers" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 shrink-0">
              <span>View All 20+ Open Positions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Lead Cloud Solutions Architect',
                dept: 'Cloud & Infrastructure',
                salary: '$145k - $175k',
                location: 'Dallas, TX / Remote',
                tag: 'Hot Role',
              },
              {
                title: 'Senior Full-Stack Engineer',
                dept: 'React & Node.js',
                salary: '$130k - $160k',
                location: 'Plano, TX / Remote',
                tag: 'Fast Fill',
              },
              {
                title: 'Data Engineer (Snowflake & Spark)',
                dept: 'Data Engineering',
                salary: '$135k - $165k',
                location: 'Chicago, IL / Hybrid',
                tag: 'Direct Client',
              },
              {
                title: 'DevOps & Platform Automation',
                dept: 'Kubernetes & CI/CD',
                salary: '$70 - $90 / hr C2H',
                location: 'Atlanta, GA / Remote',
                tag: 'Visa Friendly',
              },
            ].map((role, idx) => (
              <Scroll3DCard
                key={idx}
                index={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                      {role.tag}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{role.salary}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-1 leading-snug">
                    {role.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">{role.dept} · {role.location}</p>
                </div>
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-between text-xs font-bold text-orange-600 hover:text-orange-700 pt-3 border-t border-gray-100"
                >
                  <span>Apply with 1-Click</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 11. LIVE PLACEMENTS FEED (FROM MYSQL DB) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="eyebrow">Real Placements</div>
              <h2 className="text-h2 text-navy-900">
                Recent Career <span className="text-brand-gradient">Placements.</span>
              </h2>
            </div>
            <Link to="/live-placements" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
              View all verified placements →
            </Link>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {livePlacements.map((p, idx) => (
              <Scroll3DCard key={idx} index={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-2">
                    <span className="font-bold text-blue-700">{p.company_type}</span>
                    <span>{p.location}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-navy-900 mb-1">{p.role}</h3>
                  <p className="text-xs text-slate-700 font-medium mb-4">{p.summary}</p>
                </div>
                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-xs font-numbers font-bold text-green-800 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                    {p.package_range}
                  </span>
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Offer Accepted</span>
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 12. STATS & GROWTH ── */}
      <Scroll3DSection preset="scaleIn" className="py-16 bg-navy-900 text-white relative border-y border-navy-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <SectionReveal variant="tiltUp" delay={0.05}>
              <div className="text-4xl sm:text-5xl font-numbers font-black text-orange-500 mb-2">2,400+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Engineers Placed</div>
            </SectionReveal>
            <SectionReveal variant="tiltUp" delay={0.12}>
              <div className="text-4xl sm:text-5xl font-numbers font-black text-blue-400 mb-2">21 Days</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Avg. Days to Offer</div>
            </SectionReveal>
            <SectionReveal variant="tiltUp" delay={0.19}>
              <div className="text-4xl sm:text-5xl font-numbers font-black text-orange-500 mb-2">180+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Hiring Partners</div>
            </SectionReveal>
            <SectionReveal variant="tiltUp" delay={0.26}>
              <div className="text-4xl sm:text-5xl font-numbers font-black text-green-400 mb-2">88%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Interview-to-Offer Rate</div>
            </SectionReveal>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 13. PLANS (3 TIERS) ── */}
      <Scroll3DSection preset="tilt" className="section-padding bg-gray-50 relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Tailored Programs</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Simple, Transparent <span className="text-brand-gradient">Career Plans.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Standard recruitment placement is always 100% employer-funded. Choose an accelerator plan for bespoke 1-on-1 coaching.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'US Career Ready',
                tag: 'Foundation',
                sub: 'For engineers needing an ATS positioning overhaul and structured mock interviews.',
                features: ['Comprehensive ATS resume overhaul', 'LinkedIn keyword optimization', '3 Technical mock interview sessions', 'Direct representation to partner employers', 'Standard email support'],
                popular: false,
              },
              {
                title: 'Career Accelerator',
                tag: 'Most Popular',
                sub: 'Intensive interview mastery, targeted job campaigns, and personalized outreach.',
                features: ['Everything in Career Ready', '6 Live coding & system design mock rounds', 'Dedicated talent advisor & custom job campaigns', 'Salary negotiation coaching', 'STEM-OPT & H-1B transfer guidance', 'Priority hiring manager introductions'],
                popular: true,
              },
              {
                title: 'Career Partner',
                tag: 'Executive',
                sub: 'Full-spectrum career transition, full training bootcamp access, and ongoing coaching.',
                features: ['Everything in Career Accelerator', 'Full access to 1 live IT training track', 'Unlimited technical and behavioral mock sessions', 'Dedicated senior director sponsorship', '90-day post-placement onboarding coaching', 'Guaranteed interview schedule SLA'],
                popular: false,
              },
            ].map((plan, i) => (
              <Scroll3DCard
                key={i}
                index={i}
                className={`p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${plan.popular
                    ? 'bg-white border-2 border-orange-500 shadow-elevated relative scale-105 z-10'
                    : 'bg-white border border-gray-200/80 shadow-sm'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-600">{plan.tag}</span>
                    {plan.popular && (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">{plan.title}</h3>
                  <p className="text-xs text-slate-700 font-medium mb-6 leading-relaxed">{plan.sub}</p>

                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className="text-2xl font-heading font-bold text-navy-900">Contact Us</span>
                    <span className="text-xs text-slate-600 font-medium ml-2">/ flexible monthly options</span>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 text-xs text-slate-700 font-medium">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="md"
                  onClick={onOpenConsultation}
                  className="w-full"
                >
                  Select {plan.title}
                </Button>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 14. TESTIMONIALS (FROM MYSQL DB) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Success Stories</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Candidate & Employer <span className="text-brand-gradient">Perspectives.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Real outcomes from developers and hiring leaders who partnered with Codex Tech-IT.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Scroll3DCard key={idx} index={idx} className="p-6 rounded-2xl glass-card border border-gray-100 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex gap-1 text-orange-400 mb-4">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-heading font-bold text-sm text-navy-900">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 15. TECHNICAL PRACTICE TRACKS ── */}
      <Scroll3DSection preset="fade3d" className="py-12 bg-gray-50 border-y border-gray-200/70">
        <div className="container-custom text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-600 mb-6">
            Core Technical Practice Areas & Placement Tracks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { title: 'Cloud Architecture & AWS', link: '/careers' },
              { title: 'Full-Stack & Distributed Systems', link: '/careers' },
              { title: 'DevOps & Kubernetes Platforms', link: '/careers' },
              { title: 'Data Engineering & Snowflake', link: '/careers' },
              { title: 'AI & Generative LLMs', link: '/careers' },
              { title: 'QA Automation & Reliability', link: '/careers' },
              { title: 'Cybersecurity SOC & Threat Defense', link: '/careers' },
            ].map((track, i) => (
              <Link
                key={i}
                to={track.link}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-heading font-semibold text-navy-900 hover:border-orange-500 hover:text-orange-500 transition-colors shadow-sm"
              >
                {track.title}
              </Link>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 16. TECHNOLOGIES STRIP ── */}
      <Scroll3DSection preset="fade3d" className="py-12 bg-white">
        <div className="container-custom text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-6">
            Roles We Fill Across In-Demand Tech Stacks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              'Java / Spring Boot', 'Python / FastAPI', 'React & TypeScript', 'AWS / Azure Cloud',
              'DevOps & Kubernetes', 'Snowflake & Spark', 'QA Playwright / Selenium', 'Cybersecurity SOC',
              'Salesforce Apex / LWC', 'SAP S/4HANA', 'Kafka & Microservices', 'Next.js & Node'
            ].map((tech, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-lg bg-navy-50 text-navy-900 text-xs font-medium border border-navy-100"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/technologies" className="text-xs font-bold text-orange-600 hover:underline">
              Explore full tech stack dictionary & roles →
            </Link>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 17. COMPLIANCE STRIP ── */}
      <Scroll3DSection preset="fade3d" className="py-8 bg-navy-900 text-slate-400 text-xs border-t border-navy-800">
        <div className="container-custom flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          <span className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> E-Verified US Employer
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Multi-State W2 & 1099 Compliant
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-green-400" /> 90-Day Placement Guarantee
          </span>
        </div>
      </Scroll3DSection>

      {/* ── 18. LATEST INSIGHTS (3 BLOG POSTS FROM DB) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-white relative">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="eyebrow">Career Intelligence</div>
              <h2 className="text-h2 text-navy-900">
                Latest Hiring <span className="text-brand-gradient">Insights.</span>
              </h2>
            </div>
            <Link to="/insights" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
              Read all articles →
            </Link>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <Scroll3DCard
                key={post.slug}
                index={idx}
                className="group p-6 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-orange-500/40 transition-colors"
              >
                <Link to={`/insights/${post.slug}`} className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 mb-2 inline-block">
                      {post.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-navy-900 group-hover:text-orange-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>{post.read_minutes} min read</span>
                    <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 19. TOP FAQS (PREMIUM INTERACTIVE ACCORDION) ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-slate-50/70 border-t border-gray-200/60 relative">
        <div className="container-custom max-w-4xl mx-auto">
          <SectionReveal variant="tiltUp" className="text-center mb-12">
            <div className="eyebrow justify-center">Answers & Clarity</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Frequently Asked <span className="text-brand-gradient">Questions.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Have questions? Find quick answers below or speak directly to our talent directors.
            </p>
          </SectionReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.id || i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                    isOpen
                      ? 'bg-gradient-to-r from-orange-50/30 via-white to-white border-orange-500/50 ring-1 ring-orange-500/20 shadow-md'
                      : 'bg-white border-gray-200/90 hover:border-orange-500/30 hover:shadow'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-home-${i}`}
                    id={`faq-question-home-${i}`}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {faq.category && (
                        <span
                          className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:bg-orange-50 group-hover:text-orange-600'
                          }`}
                        >
                          {faq.category}
                        </span>
                      )}
                      <h3 className="font-heading font-bold text-base sm:text-lg text-navy-900 leading-snug group-hover:text-orange-600 transition-colors">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-home-${i}`}
                        role="region"
                        aria-labelledby={`faq-question-home-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-gray-100/80">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              <span>Browse complete FAQ knowledge base (24+ Q&As across 6 categories)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 20. CTA BAND ── */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-navy-900 text-white relative overflow-hidden">
        <GradientMesh />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <SectionReveal variant="tiltUp">
            <div className="eyebrow text-orange-400 justify-center">Take the Next Step</div>
            <h2 className="text-h2 text-white mb-6">
              Got a job-hunt stress or a hiring problem? <span className="text-brand-gradient">We love those.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free 30-minute consultation with a senior technical recruiter today. No pressure, no obligations—just actionable guidance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="primary" size="lg" onClick={onOpenConsultation}>
                Book Free Career Call <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="white" size="lg" href="/about">
                Learn About Codex
              </Button>
            </div>
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
