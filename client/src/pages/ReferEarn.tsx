import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Gift,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Award,
  ChevronDown,
  Calculator,
  HelpCircle,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

const referralFormSchema = z.object({
  referrer_name: z.string().min(2, 'Your full name is required'),
  referrer_email: z.string().email('Your valid email is required'),
  referrer_phone: z.string().min(7, 'Your phone number is required'),
  referee_name: z.string().min(2, "Candidate's full name is required"),
  referee_email: z.string().email("Candidate's valid email is required"),
  referee_phone: z.string().min(7, "Candidate's phone number is required"),
  role_skill: z.string().min(2, 'Candidate primary tech stack or target role is required'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm candidate consent to submit.' }),
  }),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});

type ReferralFormData = z.infer<typeof referralFormSchema>;

interface ReferralTier {
  level: string;
  max_reward: string;
  amount: number;
  experience: string;
  timeline: string;
  description: string;
}

const defaultTiers: ReferralTier[] = [
  {
    level: 'Associate & Entry Engineers',
    max_reward: '$500',
    amount: 500,
    experience: '0 - 2 Years Experience',
    timeline: 'Payable after 60-day placement verification',
    description: 'Awarded when your referred associate engineer, QA analyst, or junior developer successfully completes 60 days on assignment.',
  },
  {
    level: 'Mid-Level Technical Roles',
    max_reward: '$1,000',
    amount: 1000,
    experience: '3 - 6 Years Experience',
    timeline: 'Payable after 60-day placement verification',
    description: 'Awarded for full-time mid-level Full Stack Java/Node, DevOps, Data Engineers, and Cloud Specialists.',
  },
  {
    level: 'Senior, Lead & Enterprise Architects',
    max_reward: '$1,500',
    amount: 1500,
    experience: '7+ Years Experience',
    timeline: 'Payable after 60-day placement verification',
    description: 'Awarded for high-impact Lead Cloud Architects, Principal AI/ML Engineers, and Engineering Directors.',
  },
];

const referFaqs = [
  {
    question: 'Who is eligible to participate in the Codex Tech-IT referral program?',
    answer: 'Anyone can submit a referral! You do not need to be a current Codex candidate or client employee. Former colleagues, classmates, industry peers, and technical recruiters are all welcome.',
  },
  {
    question: 'When and how do I receive my referral bonus payout?',
    answer: 'Referral rewards are disbursed via direct bank transfer (ACH / Wire) within 14 business days after your referred candidate successfully completes their 60-day client onboarding guarantee period.',
  },
  {
    question: 'Is there a limit on how many engineers I can refer?',
    answer: 'No! There is zero cap on referral earnings. If you refer 5 qualified engineers who get placed in senior roles, you can earn up to $7,500.',
  },
  {
    question: 'What happens if two people refer the same candidate?',
    answer: 'Referral attribution is granted to the submission with the earlier database timestamp, provided the candidate confirms they were referred by that individual and was not already in an active interview loop.',
  },
  {
    question: 'How will I know the status of my referral?',
    answer: 'Our talent operations team logs every referral in the admin system and sends you an email update upon initial contact, interview scheduling, offer acceptance, and payout milestone verification.',
  },
];

export const ReferEarn: React.FC = () => {
  const [tiers, setTiers] = useState<ReferralTier[]>(defaultTiers);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Calculator State
  const [calcReferralCount, setCalcReferralCount] = useState<number>(3);
  const [calcSelectedTierIndex, setCalcSelectedTierIndex] = useState<number>(1);
  const [animatedTotal, setAnimatedTotal] = useState<number>(3000);

  // Load tiers from Admin Settings / Database if configured
  useEffect(() => {
    api
      .get('/settings/public')
      .then((res) => {
        if (res.data?.data?.referral_tiers && Array.isArray(res.data.data.referral_tiers)) {
          setTiers(res.data.data.referral_tiers);
        }
      })
      .catch(() => {});
  }, []);

  // Update animated calculator count
  useEffect(() => {
    const selectedAmount = tiers[calcSelectedTierIndex]?.amount || 1000;
    const target = calcReferralCount * selectedAmount;
    let current = animatedTotal;
    const step = Math.ceil(Math.abs(target - current) / 8) || 1;

    const timer = setInterval(() => {
      if (current < target) {
        current = Math.min(target, current + step * 25);
        setAnimatedTotal(current);
      } else if (current > target) {
        current = Math.max(target, current - step * 25);
        setAnimatedTotal(current);
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [calcReferralCount, calcSelectedTierIndex, tiers]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      consent: true,
      honeypot: '',
    },
  });

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post('/referrals', data);
      if (res.data?.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setSubmitError(res.data?.error?.message || 'Failed to submit referral.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error?.message || 'Error submitting referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: referFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-white">
      <SEO
        title="Refer & Earn Up to $1,500 | Codex Tech-IT Talent Rewards"
        description="Recommend talented software engineers, cloud architects, and data professionals to Codex Tech-IT. Earn uncapped referral payouts up to $1,500 per placement."
        canonical="/refer-earn"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── 1. SIGNATURE HERO: VIBRANT GRADIENT (Orange to Deep Navy with Green Earn Accent) ── */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-br from-[#0B1228] via-[#0F172A] to-[#1E293B] text-white overflow-hidden border-b border-navy-800">
        {/* Ambient Lighting Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/15 rounded-full filter blur-[90px] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Coloured Page Label Chip */}
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Refer & Earn Program
            </span>
            <span className="text-xs text-slate-400">· Uncapped Cash Rewards</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action CTAs */}
            <div className="lg:col-span-7">
              <h1 className="text-display text-white mb-6 leading-tight">
                Empower a Peer. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-emerald-400 to-sky-400">
                  Earn Up to $1,500.
                </span>
              </h1>

              <p className="text-body-lg text-slate-300 mb-8 max-w-xl font-normal leading-relaxed">
                Connect your technical colleagues with vetted hiring managers at Fortune 500 enterprises and fast-growing tech teams. When they land an offer, you earn a guaranteed placement reward.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shadow-elevated bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <span>Refer Someone Now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
                >
                  How It Works
                </Button>
              </div>

              {/* Trust Metrics Pill Bar */}
              <div className="grid grid-cols-3 gap-3 max-w-lg pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl font-numbers font-black text-emerald-400">$1,500</div>
                  <div className="text-[11px] text-slate-400 font-medium">Max Reward / Placement</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-orange-400">0 Limit</div>
                  <div className="text-[11px] text-slate-400 font-medium">Uncapped Referrals</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-sky-400">14 Days</div>
                  <div className="text-[11px] text-slate-400 font-medium">Direct Wire Disbursement</div>
                </div>
              </div>
            </div>

            {/* Right Column: Original Referral Artwork SVG in Codex Brand Colors */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-2xl">
                <svg
                  viewBox="0 0 400 320"
                  className="w-full h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Codex Tech-IT Referral Flow Illustration"
                >
                  {/* Decorative background nodes */}
                  <circle cx="200" cy="160" r="120" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6 6" />
                  <circle cx="200" cy="160" r="70" stroke="rgba(242,92,42,0.2)" strokeWidth="2" />

                  {/* Flow Paths */}
                  <path d="M 90 160 C 130 110, 170 110, 200 130" stroke="#F25C2A" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 200 130 C 240 150, 280 180, 310 160" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />

                  {/* Referrer Node (Left) */}
                  <g transform="translate(60, 130)">
                    <rect width="60" height="60" rx="16" fill="#0F172A" stroke="#2563EB" strokeWidth="2" />
                    <circle cx="30" cy="24" r="10" fill="#38BDF8" />
                    <path d="M 16 48 C 16 38, 44 38, 44 48" fill="#38BDF8" />
                    <text x="30" y="74" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      YOU
                    </text>
                  </g>

                  {/* Center Hub: Codex Tech-IT Matching Pod */}
                  <g transform="translate(165, 95)">
                    <rect width="70" height="70" rx="20" fill="url(#heroGrad)" stroke="#F25C2A" strokeWidth="2.5" />
                    <path d="M 185 125 L 215 125" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="200" cy="130" r="14" fill="#FFFFFF" fillOpacity="0.2" />
                    <text x="35" y="42" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      CODEX
                    </text>
                    <text x="35" y="86" fill="#F25C2A" fontSize="9" fontWeight="bold" textAnchor="middle">
                      DIRECT PLACEMENT
                    </text>
                  </g>

                  {/* Referee Candidate Node (Right) */}
                  <g transform="translate(280, 130)">
                    <rect width="60" height="60" rx="16" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
                    <circle cx="30" cy="24" r="10" fill="#10B981" />
                    <path d="M 16 48 C 16 38, 44 38, 44 48" fill="#10B981" />
                    <text x="30" y="74" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                      CANDIDATE
                    </text>
                  </g>

                  {/* Reward Badge Popup */}
                  <g transform="translate(140, 215)">
                    <rect width="120" height="42" rx="12" fill="#10B981" />
                    <text x="60" y="26" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                      +$1,500 REWARD
                    </text>
                  </g>

                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F25C2A" />
                      <stop offset="1" stopColor="#0F172A" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Automated Status Tracking
                  </span>
                  <span className="text-emerald-400 font-bold">100% Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS: 3 STEPS WITH TIMELINES ── */}
      <section id="how-it-works" className="section-padding bg-slate-50 border-b border-gray-200/80">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Simple Execution</div>
            <h2 className="text-h2 text-navy-900 mb-3">How the Program Works</h2>
            <p className="text-slate-600 text-sm">
              From initial introduction to payout disbursement, every stage is structured and tracked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                step: '01',
                title: 'You Refer',
                timeline: 'Day 1: Instant Registration',
                desc: 'Submit your colleague’s name, contact details, and core technical skill set via our secure referral portal.',
                icon: Users,
                accent: 'border-orange-500/30 text-orange-600 bg-orange-50',
              },
              {
                step: '02',
                title: 'They Get Placed',
                timeline: 'Days 10 - 28: Curated Client Vetting',
                desc: 'Our recruiting pod reviews their profile, refines their positioning, and pitches them directly to active client requisitions.',
                icon: Zap,
                accent: 'border-blue-500/30 text-blue-600 bg-blue-50',
              },
              {
                step: '03',
                title: 'You Get Paid',
                timeline: 'Day 60+: Direct Wire Payout',
                desc: 'Upon completing their first 60 days on assignment, we wire your cash reward directly to your bank account.',
                icon: Award,
                accent: 'border-emerald-500/30 text-emerald-600 bg-emerald-50',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-numbers font-black text-slate-300">{s.step}</span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.accent}`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">{s.title}</h3>
                  <div className="text-xs font-semibold text-orange-600 mb-4 bg-orange-50/60 inline-block px-2.5 py-1 rounded-md">
                    {s.timeline}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. REWARD TIERS (STEPPED LADDER / ASCENDING BARS DESIGN) ── */}
      <section id="reward-tiers" className="section-padding bg-white border-b border-gray-200/80">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Ascending Tier Ladder</div>
            <h2 className="text-h2 text-navy-900 mb-3">Transparent Reward Structure</h2>
            <p className="text-slate-600 text-sm">
              Reward amounts are dynamically synchronized with active recruitment margins. All rewards are labelled as{' '}
              <span className="font-bold text-navy-900">"up to"</span> subject to assignment terms.
            </p>
          </div>

          {/* Stepped Ascending Ladder Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            {tiers.map((tier, idx) => {
              // Stepped visual heights: 1st card normal, 2nd card taller, 3rd card highest
              const minHeightClass = idx === 0 ? 'min-h-[380px]' : idx === 1 ? 'min-h-[420px]' : 'min-h-[460px]';
              const isTopTier = idx === 2;

              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all border ${minHeightClass} ${
                    isTopTier
                      ? 'bg-gradient-to-b from-navy-900 to-[#122842] text-white border-orange-500 shadow-xl ring-2 ring-orange-500/20'
                      : 'bg-slate-50 border-gray-200/80 hover:border-orange-300 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Tier Level & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${
                          isTopTier
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-slate-600 border border-gray-200'
                        }`}
                      >
                        Step 0{idx + 1}
                      </span>
                      <span className={`text-xs font-semibold ${isTopTier ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tier.experience}
                      </span>
                    </div>

                    <h3
                      className={`font-heading font-bold text-lg mb-3 ${
                        isTopTier ? 'text-white' : 'text-navy-900'
                      }`}
                    >
                      {tier.level}
                    </h3>

                    {/* Up to Reward Heading */}
                    <div className="mb-4">
                      <span className={`text-xs font-semibold block ${isTopTier ? 'text-orange-400' : 'text-slate-500'}`}>
                        Earn up to
                      </span>
                      <div
                        className={`text-4xl font-numbers font-black ${
                          isTopTier ? 'text-emerald-400' : 'text-navy-900'
                        }`}
                      >
                        {tier.max_reward}
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-6 ${
                        isTopTier ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {tier.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/40 text-[11px]">
                    <div className={isTopTier ? 'text-slate-400' : 'text-slate-500'}>{tier.timeline}</div>
                    <a
                      href="#program-terms"
                      className={`underline font-bold mt-1 inline-block ${
                        isTopTier ? 'text-orange-400' : 'text-orange-600'
                      }`}
                    >
                      View eligibility terms →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE EARNINGS CALCULATOR (WITH ANIMATED COUNT-UP) ── */}
      <section className="section-padding bg-slate-50 border-b border-gray-200/80">
        <div className="container-custom max-w-4xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-navy-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                  <Calculator className="w-4 h-4" />
                  <span>Referral Calculator</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
                  Simulate Your Referral Potential
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-8">
                  Adjust the number of candidate introductions to see your estimated cumulative cash earnings.
                </p>

                {/* Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Number of Placed Referrals:</span>
                    <span className="text-orange-400 font-bold text-sm font-numbers">{calcReferralCount} engineers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={calcReferralCount}
                    onChange={(e) => setCalcReferralCount(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1</span>
                    <span>3</span>
                    <span>5</span>
                    <span>8</span>
                    <span>10+</span>
                  </div>
                </div>

                {/* Role Tier Selector */}
                <div className="mb-6">
                  <div className="text-xs font-semibold text-slate-300 mb-2">Primary Role Specialization:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {tiers.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCalcSelectedTierIndex(idx)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold text-center transition-all ${
                          calcSelectedTierIndex === idx
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-navy-800 text-slate-400 hover:text-white hover:bg-navy-700'
                        }`}
                      >
                        {t.max_reward} / role
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Animated Display Output */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
                  Estimated Total Reward
                </span>
                <div className="text-4xl sm:text-5xl font-numbers font-black text-emerald-400 mb-2">
                  ${animatedTotal.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-300 mb-4">
                  Calculated based on {calcReferralCount} placed {tiers[calcSelectedTierIndex]?.level.toLowerCase()}.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Start Earning Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. REFERRAL SUBMISSION FORM ── */}
      <section id="referral-form" className="section-padding bg-white border-b border-gray-200/80">
        <div className="container-custom max-w-3xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-200 shadow-xl">
            <div className="text-center mb-10">
              <div className="eyebrow justify-center">Secure Registration</div>
              <h2 className="text-h2 text-navy-900 mb-2">Submit Candidate Referral</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                All submissions are encrypted, stored in our database, and matched against active enterprise requisitions.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-emerald-950 mb-2">
                  Referral Successfully Registered!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed mb-6 max-w-md mx-auto">
                  Thank you! Our technical recruiters have received your referral. We will review their background and reach out respectfully. You will receive email tracking notifications as their placement progresses.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSubmitSuccess(false)}
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-100"
                >
                  Submit Another Colleague
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Honeypot field for anti-spam */}
                <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Referrer Information */}
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Your Details (Referrer)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        {...register('referrer_name')}
                        placeholder="Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referrer_name && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referrer_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        {...register('referrer_email')}
                        placeholder="alex@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referrer_email && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referrer_email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Phone Number *</label>
                      <input
                        type="tel"
                        {...register('referrer_phone')}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referrer_phone && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referrer_phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Candidate Information */}
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Colleague Details (Candidate)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Candidate Full Name *</label>
                      <input
                        type="text"
                        {...register('referee_name')}
                        placeholder="Jordan Lee"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referee_name && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referee_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Candidate Email *</label>
                      <input
                        type="email"
                        {...register('referee_email')}
                        placeholder="jordan@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referee_email && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referee_email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Candidate Phone *</label>
                      <input
                        type="tel"
                        {...register('referee_phone')}
                        placeholder="+1 (555) 111-2222"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referee_phone && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referee_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">
                        Primary Role / Core Tech Stack *
                      </label>
                      <input
                        type="text"
                        {...register('role_skill')}
                        placeholder="e.g. Senior AWS Solutions Architect / Java Spring"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.role_skill && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.role_skill.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('consent')}
                      className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span>
                      I confirm that I have informed this colleague of this referral and have their consent to share their contact information with Codex Tech-IT for hiring opportunities.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.consent.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-elevated"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting Referral to Admin...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Submit Referral for Review
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACCORDION BLOCK ── */}
      <section className="section-padding bg-slate-50 border-b border-gray-200/80">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center">Frequently Asked Questions</div>
            <h2 className="text-h2 text-navy-900 mb-2">Referral Program FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding qualification milestones, reward disbursements, and candidate tracking.
            </p>
          </div>

          <div className="space-y-3">
            {referFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-heading font-semibold text-sm text-navy-900 flex items-center justify-between gap-4 hover:text-orange-600 transition-colors cursor-pointer"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TERMS & ELIGIBILITY SECTION (WITH CLEAR OWNER PLACEHOLDER LABELS) ── */}
      <section id="program-terms" className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="p-8 rounded-3xl bg-slate-50 border border-gray-200 text-xs text-slate-600 space-y-4">
            <div className="flex items-center gap-2 text-sm font-heading font-bold text-navy-900">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Program Eligibility & Terms of Distribution</span>
            </div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Notice: The following terms outline standard program parameters. [Placeholder text for site owner / legal counsel to review and confirm].
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Eligible Introductions:</strong> To qualify for a referral reward, the referred candidate must not have been actively in conversation or interviewed by Codex Tech-IT within the preceding 90 days.
              </li>
              <li>
                <strong>Placement Milestone:</strong> Rewards are considered earned and payable once the placed engineer satisfies their first 60 continuous calendar days of client assignment.
              </li>
              <li>
                <strong>Payment Method & Taxation:</strong> All rewards are issued in USD via direct ACH or domestic bank wire. In accordance with US federal tax requirements, referrers receiving over $600 in a calendar year may be issued a standard Form 1099-MISC.
              </li>
              <li>
                <strong>Client & Corporate Rules:</strong> Hiring managers and HR personnel participating in direct procurement decisions with Codex Tech-IT are ineligible to receive referral rewards for candidates placed at their own employer organization.
              </li>
              <li>
                <strong>Policy Discretion:</strong> Codex Tech-IT reserves the right to verify candidate consent and amend bonus tier brackets at its discretion.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
