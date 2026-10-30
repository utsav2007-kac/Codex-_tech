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
  Copy,
  Check,
  Share2,
  ExternalLink,
  Info,
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

interface SettingsData {
  referral_reward_total?: string;
  referral_reward_on_enrolment?: string;
  referral_reward_on_placement?: string;
  referral_terms?: string;
  referral_tiers?: Array<{
    level: string;
    max_reward: string;
    amount: number;
    experience: string;
    timeline: string;
    description: string;
  }>;
}

const referFaqs = [
  {
    question: 'Who is eligible to participate in the Codex Tech-IT referral program?',
    answer:
      'Anyone is welcome to submit a referral! You do not need to be a current Codex candidate or client employee. Former colleagues, classmates, professional network connections, and hiring leaders are all eligible.',
  },
  {
    question: 'When and how do I receive my referral rewards?',
    answer:
      'Referral bonuses are disbursed in two verified phases: the enrolment bonus upon formal candidate program onboarding, and the placement completion bonus after the candidate successfully starts their enterprise role and completes the required verification window.',
  },
  {
    question: 'How does the unique referral code and share link work?',
    answer:
      'When you submit a referral or register as a partner, Codex generates a unique tracking code (e.g., CX-XXXXXX). You can share this link directly with colleagues. When they apply through your link, your referral code is automatically attached to their application.',
  },
  {
    question: 'Is there a limit on how many engineers I can refer?',
    answer:
      'There is zero cap on referral rewards. You may refer as many qualified software engineers, DevOps specialists, and data professionals as you know.',
  },
  {
    question: 'What happens if two people refer the same candidate?',
    answer:
      'Attribution is granted to the submission with the earlier database timestamp, provided the candidate confirms they were referred by that individual and was not already in an active interview loop.',
  },
  {
    question: 'What types of roles and technical backgrounds are eligible?',
    answer:
      'We place full stack developers (Java, React, Node), Python backend engineers, cloud & DevOps architects (AWS, GCP, Kubernetes), data engineers (Snowflake, Spark), and QA automation engineers.',
  },
  {
    question: 'How do I track the status of my referred candidates?',
    answer:
      'Our talent operations desk tracks referral codes in real-time. We send automated milestone email notifications when your candidate begins evaluation, attends client interviews, and receives an offer.',
  },
  {
    question: 'Are referral bonuses taxable?',
    answer:
      'Yes. For US residents, referral bonus payouts are reported as miscellaneous income according to IRS regulations (Form 1099-MISC if annual payouts exceed $600). General information, not legal or tax advice.',
  },
];

export const ReferEarn: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    referral_reward_total: '$1,500',
    referral_reward_on_enrolment: '$500',
    referral_reward_on_placement: '$1,000',
    referral_terms:
      'Terms & Eligibility: Referrals must complete registration and meet program milestones. Rewards are disbursed after successful corporate placement and verification of a minimum 60-day active tenure. Self-referrals are prohibited. T&C apply.',
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Calculator State
  const [calcCandidates, setCalcCandidates] = useState<number>(3);

  // Fetch settings from server
  useEffect(() => {
    api
      .get('/settings/public')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setSettings({
            referral_reward_total: d.referral_reward_total || '$1,500',
            referral_reward_on_enrolment: d.referral_reward_on_enrolment || '$500',
            referral_reward_on_placement: d.referral_reward_on_placement || '$1,000',
            referral_terms: d.referral_terms || settings.referral_terms,
            referral_tiers: d.referral_tiers,
          });
        }
      })
      .catch(() => {});
  }, []);

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
        const code = res.data.data?.referral_code || 'CX-REF789';
        setGeneratedCode(code);
        const origin = window.location.origin;
        setShareUrl(`${origin}/refer-earn?ref=${code}`);
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

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Safe numerical parse for calculator
  const parseAmount = (str?: string, fallback = 500) => {
    if (!str) return fallback;
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? fallback : num;
  };

  const enrolmentAmount = parseAmount(settings.referral_reward_on_enrolment, 500);
  const placementAmount = parseAmount(settings.referral_reward_on_placement, 1000);
  const totalPerCandidate = enrolmentAmount + placementAmount;
  const calculatedTotal = calcCandidates * totalPerCandidate;

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
    <div className="bg-white text-slate-800 overflow-x-hidden">
      <SEO
        title={`Refer & Earn ${settings.referral_reward_total || 'Up to $1,500'} | Codex Tech-IT Talent Rewards`}
        description={`Recommend qualified software engineers, cloud architects, and data engineers to Codex Tech-IT. Earn milestone placement rewards ${settings.referral_reward_total || 'up to $1,500'} per candidate.`}
        canonical="/refer-earn"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── 1. 100% LIGHT HERO: REWARD-FIRST HEADLINE & 2 CONNECTED STEPS ── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-[#FFF7ED] via-[#F8FAFC] to-white border-b border-orange-100">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Label Chip */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-orange-600" />
            <span>Codex Talent Referral Program</span>
            <span className="text-orange-400">•</span>
            <span className="text-orange-900 font-semibold">{settings.referral_reward_total} Total Reward</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-black tracking-tight leading-[1.15] text-slate-900">
                Empower a Peer.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                  Earn {settings.referral_reward_total || '$1,500'} Per Placement.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connect your technical peers with vetted enterprise teams across North America. When your referred candidate enrolls and achieves placement, you receive verified milestone rewards.
              </p>

              {/* 2 CONNECTED STEPS */}
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Two Simple Steps to Earn
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="font-heading font-bold text-sm text-slate-900">Register & Share</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      Submit candidate details or receive your personal tracking code (<code className="font-mono text-orange-600">CX-XXXXXX</code>).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold font-mono text-xs flex items-center justify-center">
                        2
                      </span>
                      <span className="font-heading font-bold text-sm text-slate-900">Earn Cash Rewards</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      Receive payout milestones: {settings.referral_reward_on_enrolment} on onboarding + {settings.referral_reward_on_placement} on placement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shadow-sm shadow-orange-500/20 group"
                >
                  <span>Submit Candidate Referral</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <a
                  href="#calculator"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-sm transition-all border border-slate-200 shadow-xs flex items-center justify-center"
                >
                  <Calculator className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Estimate Earnings</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Snapshot */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-200/80 shadow-sm space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Program Milestone Structure</div>
                      <div className="text-sm font-heading font-bold text-slate-900">Verified Payout Breakdown</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Milestone 1: Program Enrolment</div>
                      <div className="text-[11px] text-slate-500">Paid upon candidate profile calibration</div>
                    </div>
                    <div className="text-base font-numbers font-bold text-orange-600">
                      {settings.referral_reward_on_enrolment}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Milestone 2: Enterprise Offer Placement</div>
                      <div className="text-[11px] text-slate-500">Paid after 60-day client tenure verification</div>
                    </div>
                    <div className="text-base font-numbers font-bold text-emerald-600">
                      {settings.referral_reward_on_placement}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Total Reward Per Candidate:</span>
                  <span className="text-xl font-numbers font-black text-slate-900">
                    {settings.referral_reward_total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE EARNINGS CALCULATOR ── */}
      <section id="calculator" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Interactive Estimator
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              Calculate Your Potential Referral Rewards.
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select how many qualified engineers you plan to introduce to the Codex talent network.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Slider Input */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="candidates-range" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Referred Candidates
                    </label>
                    <span className="text-2xl font-numbers font-black text-orange-600">
                      {calcCandidates} {calcCandidates === 1 ? 'Candidate' : 'Candidates'}
                    </span>
                  </div>
                  <input
                    id="candidates-range"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={calcCandidates}
                    onChange={(e) => setCalcCandidates(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-2">
                    <span>1</span>
                    <span>3</span>
                    <span>5</span>
                    <span>7</span>
                    <span>10+</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500">Enrolment Subtotal</div>
                    <div className="text-lg font-numbers font-bold text-slate-900">
                      ${(calcCandidates * enrolmentAmount).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500">Placement Subtotal</div>
                    <div className="text-lg font-numbers font-bold text-slate-900">
                      ${(calcCandidates * placementAmount).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Output Card */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-white border border-orange-200 text-center space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-800">
                  Estimated Total Payout
                </div>
                <div className="text-4xl sm:text-5xl font-numbers font-black text-slate-900">
                  ${calculatedTotal.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on {calcCandidates} candidate{calcCandidates > 1 ? 's' : ''} completing program calibration and enterprise placement.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      const el = document.getElementById('referral-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>Start Referring Now</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. REFERRAL SUBMISSION FORM & UNIQUE CODE GENERATOR ── */}
      <section id="referral-form" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Official Submission Desk
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
                Submit a Candidate Referral.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                Fill in candidate details to instantly generate your unique tracking code and lock in attribution.
              </p>
            </div>

            {submitSuccess ? (
              /* Success Card with Unique Code and Shareable Link */
              <div className="p-8 sm:p-10 rounded-3xl bg-[#F0FDF4] border border-emerald-300 text-center space-y-6 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-black text-slate-900">
                    Referral Registered Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your candidate has been submitted to the talent desk. Your personal attribution code has been generated:
                  </p>
                </div>

                {/* Unique Code Display */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 max-w-md mx-auto space-y-2">
                  <div className="text-xs text-slate-500 font-medium">Your Unique Referral Code:</div>
                  <div className="text-3xl font-mono font-black text-emerald-800 tracking-wider">
                    {generatedCode || 'CX-SUCCESS'}
                  </div>
                </div>

                {/* Shareable Link Box with Copy Button */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 max-w-lg mx-auto flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Share Shortcuts */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Check out Codex Tech-IT's career acceleration program: ${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Share on WhatsApp</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Share on LinkedIn</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setGeneratedCode('');
                      setShareUrl('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Submit Another Referral
                  </button>
                </div>
              </div>
            ) : (
              /* ZOD-VALIDATED REFERRAL FORM */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-6"
              >
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Hidden Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  {...register('honeypot')}
                />

                {/* Section 1: Referrer Information */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-200">
                    1. Your Information (Referrer)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referrer_name')}
                      />
                      {errors.referrer_name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referrer_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referrer_email')}
                      />
                      {errors.referrer_email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referrer_email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referrer_phone')}
                      />
                      {errors.referrer_phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referrer_phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Candidate Information */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-200">
                    2. Candidate Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referee_name')}
                      />
                      {errors.referee_name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referee_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Email Address *</label>
                      <input
                        type="email"
                        placeholder="jane@domain.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referee_email')}
                      />
                      {errors.referee_email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referee_email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('referee_phone')}
                      />
                      {errors.referee_phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.referee_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Role or Tech Stack *</label>
                      <input
                        type="text"
                        placeholder="e.g. Java Microservices, AWS DevOps, Data Engineer"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        {...register('role_skill')}
                      />
                      {errors.role_skill && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.role_skill.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      {...register('consent')}
                    />
                    <span className="text-xs text-slate-600 leading-normal">
                      I confirm that I have informed this candidate and received their consent to share their professional details with Codex Tech-IT for recruitment and placement representation. *
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.consent.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>Generating Referral Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Referral & Generate Code</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. 8-QUESTION FAQ ACCORDION WITH SCHEMA ── */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              Referral Program Policies & Clarity.
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Clear rules governing milestone validation, payout disbursement, and tracking codes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {referFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-600 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-orange-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. DISCLOSED TERMS & CONDITIONS NOTICE ── */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#FFFDF8] border border-orange-200/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-900 uppercase tracking-wider">
              <Info className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Program Terms & Disclosures</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.referral_terms}
            </p>
            <p className="text-[11px] text-slate-600 italic">
              * General information, not financial or legal advice. Payouts subject to active tax reporting compliance.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. 100% LIGHT CLOSING CTA BAND ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-custom">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-sky-50/60 border border-orange-200/70 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Expand the Codex Talent Community</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                  Know an engineer looking for their next breakthrough role?
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                  Introduce them to our technical team today and unlock uncapped referral bonuses as they advance their career.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Submit Candidate Referral</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <a
                  href="tel:+18005550199"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-sm text-center transition-colors border border-slate-200 shadow-xs flex items-center justify-center"
                >
                  Contact Talent Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
