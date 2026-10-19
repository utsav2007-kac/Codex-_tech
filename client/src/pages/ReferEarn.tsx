import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gift, DollarSign, Users, CheckCircle2, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

const referralSchema = z.object({
  referrer_name: z.string().min(2, 'Your name is required'),
  referrer_email: z.string().email('Your valid email is required'),
  referrer_phone: z.string().min(7, 'Your phone number is required'),
  referee_name: z.string().min(2, 'Candidate name is required'),
  referee_email: z.string().email('Candidate valid email is required'),
  referee_phone: z.string().min(7, 'Candidate phone number is required'),
  role_skill: z.string().min(2, 'Candidate role or primary tech skill is required'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type ReferralFormData = z.infer<typeof referralSchema>;

export const ReferEarn: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
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

  const tiers = [
    {
      level: 'Associate & Entry Engineers',
      reward: '$500',
      description: 'Awarded when your referred 0-2 year engineer or analyst completes their first 60 days on assignment.',
    },
    {
      level: 'Mid-Senior Engineers',
      reward: '$1,000',
      description: 'Awarded for mid-to-senior technical roles (Software Engineers, Cloud Architects, Data Engineers).',
    },
    {
      level: 'Lead & Principal Specialists',
      reward: '$1,500',
      description: 'Awarded for Principal Architects, Engineering Managers, and high-demand niche domain leads.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Submit Candidate Details',
      desc: 'Introduce a qualified software engineer, data specialist, or cloud architect using our secure referral form below.',
    },
    {
      num: '02',
      title: 'We Screen & Place Them',
      desc: 'Our recruiters align their resume, coach their technical interviews, and match them directly with hiring managers.',
    },
    {
      num: '03',
      title: 'Receive Your Referral Payout',
      desc: 'Once your referral completes their placement onboarding guarantee window, we wire your reward directly.',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Refer & Earn Career Rewards | Codex Tech-IT"
        description="Recommend top engineering and IT talent to Codex Tech-IT and earn up to $1,500 in referral bonuses when they are placed."
        canonical="/refer-earn"
      />

      {/* Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Refer & Earn' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Talent Referral Program</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Connect Great Talent. <span className="text-brand-gradient">Earn Generous Rewards.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Know an engineer, cloud specialist, or data architect looking for their next career milestone? Recommend them to Codex Tech-IT and receive cash bonuses up to $1,500 upon their successful placement.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="section-padding bg-gray-50 border-b border-gray-200/60">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow">How It Works</div>
            <h2 className="text-h2 text-navy-900">Three Straightforward Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm relative">
                <div className="text-4xl font-heading font-extrabold text-orange-500/20 mb-4">{s.num}</div>
                <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="section-padding bg-white border-b border-gray-200/60">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow">Reward Structure (SAMPLE)</div>
            <h2 className="text-h2 text-navy-900">Transparent Placement Payouts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{tier.level}</h3>
                  <div className="text-3xl font-heading font-extrabold text-orange-500 mb-4">{tier.reward}</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{tier.description}</p>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Direct ACH or wire payout upon qualification</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="p-8 md:p-12 rounded-3xl bg-white border border-gray-200 shadow-xl">
            <div className="text-center mb-8">
              <div className="eyebrow">Submit a Candidate</div>
              <h2 className="text-h2 text-navy-900 mb-2">Refer a Colleague Today</h2>
              <p className="text-xs text-slate-500">
                All referral submissions are logged in our database and matched against our active client requisitions.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-emerald-900 mb-2">Referral Registered!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed mb-6">
                  Thank you for referring your colleague. We will review their background and reach out respectfully. If placed, you will receive confirmation and reward distribution instructions.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitSuccess(false)}>
                  Submit Another Referral
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Referrer Details */}
                <div>
                  <h3 className="font-heading font-bold text-sm text-navy-900 mb-3 border-b border-gray-100 pb-2">
                    1. Your Information (Referrer)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Name *</label>
                      <input
                        type="text"
                        {...register('referrer_name')}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referrer_name && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referrer_name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Email *</label>
                      <input
                        type="email"
                        {...register('referrer_email')}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referrer_email && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referrer_email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Phone *</label>
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

                {/* Candidate Details */}
                <div>
                  <h3 className="font-heading font-bold text-sm text-navy-900 mb-3 border-b border-gray-100 pb-2">
                    2. Candidate Information (Referee)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Candidate Name *</label>
                      <input
                        type="text"
                        {...register('referee_name')}
                        placeholder="Candidate Name"
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
                        placeholder="colleague@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.referee_email && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.referee_email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Primary Role / Tech Stack *</label>
                      <input
                        type="text"
                        {...register('role_skill')}
                        placeholder="e.g. AWS DevOps / Java Full Stack"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.role_skill && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.role_skill.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting Referral...
                    </span>
                  ) : (
                    'Submit Referral for Review'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
