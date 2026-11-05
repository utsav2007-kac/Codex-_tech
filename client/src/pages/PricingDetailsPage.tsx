import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, Check, X, ShieldCheck, Sparkles, CheckCircle2
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { PRICING_PLANS, COMPARISON_TABLE_ROWS, PricingPlan } from '../data/pricingData';
import { PricingScrollBackground } from '../components/pricing/PricingScrollBackground';

export const PricingDetailsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const outlet = useOutletContext<{ onOpenConsultation?: () => void } | null>();
  const shouldReduceMotion = useReducedMotion();

  // Extract selected plan from query param (defaults to 'elite')
  const planParam = (searchParams.get('plan') || 'elite').toLowerCase();
  const initialPlan = (planParam in PRICING_PLANS ? planParam : 'elite') as 'basic' | 'elite' | 'premium';

  const [activePlanKey, setActivePlanKey] = useState<'basic' | 'elite' | 'premium'>(initialPlan);

  useEffect(() => {
    if (planParam in PRICING_PLANS) {
      setActivePlanKey(planParam as 'basic' | 'elite' | 'premium');
    }
  }, [planParam]);

  const handleSelectPlan = (key: 'basic' | 'elite' | 'premium') => {
    setActivePlanKey(key);
    setSearchParams({ plan: key });
  };

  const handleOpenConsultation = () => {
    if (outlet?.onOpenConsultation) {
      outlet.onOpenConsultation();
    } else {
      navigate('/contact');
    }
  };

  const currentPlan: PricingPlan = PRICING_PLANS[activePlanKey];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white min-h-screen text-[#0F172A] relative overflow-hidden"
    >
      <SEO
        title={`${currentPlan.name} Plan Details | Career Services Pricing | Codex Tech-IT`}
        description={`Complete specification, pricing breakdown, refund policy, and features for the ${currentPlan.name} (${currentPlan.duration}) Career Acceleration Plan.`}
        canonical="/price-details"
      />

      {/* ── 1. SIGNATURE LIGHT SKY-TO-CREAM HERO (MATCHING HOMEPAGE THEME) ── */}
      <section
        data-nav-theme="light"
        className="hero-section relative pt-[calc(var(--nav-h)+var(--nav-top)+20px)] pb-12 lg:pt-[calc(var(--nav-h)+var(--nav-top)+32px)] lg:pb-16 overflow-hidden bg-gradient-to-b from-[#E8F2FF] via-[#FFF7ED]/80 to-[#FFFFFF] text-[#0F172A] border-b border-[#E2E8F0]"
      >
        {/* 3D Parallax & Ambient Background Effects */}
        <PricingScrollBackground />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Animated Back to Pricing Button */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -15 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 w-fit"
          >
            <motion.div
              whileHover={{ x: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                to="/price"
                className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#C2410C] hover:text-[#9A3412] transition-colors group cursor-pointer bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200/80 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Pricing</span>
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2E8F0] pb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F172A] text-white shadow-xs">
                  {currentPlan.duration} Program
                </span>
                {currentPlan.refundEligible && (
                  <motion.span
                    initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 flex items-center gap-1 shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Refund Eligible
                  </motion.span>
                )}
              </div>

              <motion.h1
                key={`h1-${activePlanKey}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#0F172A] tracking-tight"
              >
                {currentPlan.name} Plan Details
              </motion.h1>
              <motion.p
                key={`tagline-${activePlanKey}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-[#475569] text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed"
              >
                {currentPlan.tagline}
              </motion.p>
            </div>

            {/* Plan Switcher Pills with Animated Layout Indicator */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm self-start md:self-auto shrink-0 relative">
              {(['basic', 'elite', 'premium'] as const).map((key) => {
                const plan = PRICING_PLANS[key];
                const isActive = activePlanKey === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleSelectPlan(key)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative z-10 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-colors cursor-pointer ${
                      isActive ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePlanTab"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-[#C2410C] rounded-xl shadow-md -z-10"
                      />
                    )}
                    {plan.name} ({plan.duration})
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PLAN SPECIFICATION & PRICING BREAKDOWN ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Left 2 Cols: Details, Philosophy & Categorized Features */}
          <div className="lg:col-span-2 space-y-10">

            <AnimatePresence mode="wait">
              <motion.div
                key={activePlanKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >
                {/* Overview Box */}
                <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-xl font-heading font-black text-[#0F172A] tracking-tight">
                    Program Overview & Philosophy
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    {currentPlan.overview}
                  </p>
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-start gap-3 text-sm">
                    <span className="font-bold text-[#0F172A] shrink-0">Target Candidate:</span>
                    <span className="text-[#475569]">{currentPlan.idealFor}</span>
                  </div>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-heading font-black text-[#0F172A] tracking-tight">
                    Full Services & Deliverables Included
                  </h2>

                  <div className="space-y-6">
                    {currentPlan.featuresCategorized.map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        className="border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300"
                      >
                        <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-[#C2410C] border-b border-[#E2E8F0] pb-3">
                          {cat.category}
                        </h3>

                        <div className="divide-y divide-gray-100">
                          {cat.items.map((item, itemIdx) => (
                            <motion.div
                              key={itemIdx}
                              whileHover={shouldReduceMotion ? {} : { x: 5 }}
                              transition={{ duration: 0.15 }}
                              className="py-3 flex items-start justify-between gap-4 rounded-xl px-2 -mx-2 hover:bg-orange-50/40 transition-colors cursor-default"
                            >
                              <div className="flex items-start gap-3">
                                {item.included ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                                ) : (
                                  <X className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <div className={`text-sm font-bold ${item.included ? 'text-[#0F172A]' : 'text-slate-400 line-through'}`}>
                                    {item.name}
                                  </div>
                                  {item.detail && (
                                    <p className="text-xs text-[#64748B] mt-0.5">{item.detail}</p>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                                item.included ? 'bg-orange-50 text-[#C2410C]' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {item.included ? 'Included' : 'Not Included'}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Refund & Warranty Details */}
                <div className="p-8 rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#C2410C]" />
                    <h3 className="text-lg font-heading font-black text-[#0F172A] tracking-tight">
                      Job Warranty & Refund Policy
                    </h3>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {currentPlan.refundPolicyDetails}
                  </p>
                  {currentPlan.jobWarrantyMonths ? (
                    <div className="p-4 rounded-2xl bg-white border border-[#FED7AA] text-xs text-[#334155] font-medium leading-relaxed">
                      <strong className="text-[#0F172A]">{currentPlan.jobWarrantyMonths}-Month Job Warranty Protection:</strong> If your placement ends within {currentPlan.jobWarrantyMonths} months through no fault of your own (e.g. corporate downsizing or restructuring), Codex Tech-IT will immediately reactivate your pipeline and application outreach at zero extra upfront fee.
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Col: Sticky Pricing Summary & Call to Action (With 3D Elevation) */}
          <div className="space-y-6 sticky top-24">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              className="p-8 rounded-3xl border-2 border-[#C2410C] bg-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300 space-y-6"
            >
              <div className="border-b border-[#E2E8F0] pb-5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                  SELECTED PLAN
                </span>
                <motion.div
                  key={`sum-name-${activePlanKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-heading font-black text-[#0F172A] mt-1"
                >
                  {currentPlan.name} Plan
                </motion.div>
                <div className="text-xs text-[#C2410C] font-bold uppercase tracking-wider mt-1">
                  Duration: {currentPlan.duration}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-baseline border-b border-[#E2E8F0] pb-3">
                  <span className="text-[#64748B] font-medium">Upfront Enrollment:</span>
                  <motion.span
                    key={`sum-upfront-${activePlanKey}`}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-heading font-black text-[#0F172A]"
                  >
                    {currentPlan.pricing.upfront}
                  </motion.span>
                </div>

                <div className="border-b border-[#E2E8F0] pb-3 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#64748B] font-medium">{currentPlan.pricing.plusOrOffer.label}:</span>
                    <span className="font-bold text-[#0F172A] text-right">
                      {currentPlan.pricing.plusOrOffer.value}
                    </span>
                  </div>
                </div>

                <div className="border-b border-[#E2E8F0] pb-3 space-y-1">
                  <div className="text-[#64748B] font-medium text-xs uppercase tracking-wider">
                    {currentPlan.pricing.paidOrThen.label}
                  </div>
                  <div className="text-[#334155] font-medium text-xs leading-relaxed">
                    {currentPlan.pricing.paidOrThen.value}
                  </div>
                </div>

                {currentPlan.pricing.total && (
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[#0F172A] font-bold">Total Fixed Cost:</span>
                    <span className="text-2xl font-heading font-black text-[#C2410C]">
                      {currentPlan.pricing.total.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons with Micro-Interactions */}
              <div className="space-y-3 pt-2">
                <motion.div
                  whileHover={{ scale: 1.025, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOpenConsultation}
                    className="w-full cursor-pointer justify-center shadow-elevated bg-[#C2410C] hover:bg-[#9A3412] text-white py-3.5 font-heading font-bold"
                  >
                    Schedule Plan Consultation
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    to="/price"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] hover:text-[#C2410C] transition-all cursor-pointer border border-[#CBD5E1]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Pricing</span>
                  </Link>
                </motion.div>
              </div>

              {/* Assurance Chips */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2 text-[11px] text-[#475569]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Full transparent written service agreement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Zero hidden percentage cuts beyond stated terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Dedicated US IT career coaching team</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 3. FULL COMPARISON TABLE ("WHAT EACH PLAN INCLUDES" - SECOND IMAGE CONTENT) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E2E8F0]">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Complete Side-by-Side Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0F172A] tracking-tight">
            What each plan includes
          </h2>
          <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
            Every service in the three plans, side by side. Plan length, job warranty and refund eligibility are listed in the same table.
          </p>
        </div>

        {/* Table Container with 3D Depth Elevation */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white">
          <table className="w-full text-left text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-4 px-6 text-[#64748B] font-bold uppercase text-[11px] tracking-wider w-2/5">
                  Plan Feature / Service
                </th>
                <th className={`py-4 px-4 text-center w-1/5 font-heading font-bold text-base transition-colors duration-200 ${
                  activePlanKey === 'basic' ? 'bg-[#1E293B] text-white' : 'bg-slate-100 text-[#0F172A]'
                }`}>
                  Basic
                </th>
                <th className={`py-4 px-4 text-center w-1/5 font-heading font-bold text-base transition-colors duration-200 ${
                  activePlanKey === 'elite' ? 'bg-[#C2410C] text-white' : 'bg-orange-50 text-[#C2410C]'
                }`}>
                  Elite
                </th>
                <th className={`py-4 px-4 text-center w-1/5 font-heading font-bold text-base transition-colors duration-200 ${
                  activePlanKey === 'premium' ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-[#0F172A]'
                }`}>
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-[#334155]">
              {COMPARISON_TABLE_ROWS.map((row, idx) => {
                return (
                  <tr
                    key={idx}
                    className="hover:bg-orange-50/40 transition-colors duration-150 group/row"
                  >
                    {/* Feature Label */}
                    <td className="py-3.5 px-6 font-semibold text-[#0F172A] group-hover/row:text-[#C2410C] transition-colors">
                      {row.feature}
                    </td>

                    {/* Basic */}
                    <td className={`py-3.5 px-4 text-center transition-colors duration-200 ${activePlanKey === 'basic' ? 'bg-slate-50/80 font-bold' : ''}`}>
                      {row.type === 'check' ? (
                        row.basic ? (
                          <Check className="w-4 h-4 mx-auto text-[#0F172A] stroke-[2.5]" />
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )
                      ) : row.type === 'text-or-dash' ? (
                        row.basic ? (
                          <span className="text-[#0F172A]">{row.basic}</span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )
                      ) : (
                        <span className="text-[#0F172A]">{row.basic}</span>
                      )}
                    </td>

                    {/* Elite */}
                    <td className={`py-3.5 px-4 text-center transition-colors duration-200 ${activePlanKey === 'elite' ? 'bg-orange-50/60 font-bold' : ''}`}>
                      {row.type === 'check' ? (
                        row.elite ? (
                          <Check className="w-4 h-4 mx-auto text-[#C2410C] stroke-[2.5]" />
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )
                      ) : row.type === 'text-or-dash' ? (
                        <span className="font-bold text-[#C2410C]">{row.elite}</span>
                      ) : (
                        <span className="font-bold text-[#C2410C]">{row.elite}</span>
                      )}
                    </td>

                    {/* Premium */}
                    <td className={`py-3.5 px-4 text-center transition-colors duration-200 ${activePlanKey === 'premium' ? 'bg-slate-50/80 font-bold' : ''}`}>
                      {row.type === 'check' ? (
                        row.premium ? (
                          <Check className="w-4 h-4 mx-auto text-[#0F172A] stroke-[2.5]" />
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )
                      ) : row.type === 'text-or-dash' ? (
                        <span className="font-semibold text-[#0F172A]">{row.premium}</span>
                      ) : (
                        <span className="font-semibold text-[#0F172A]">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Back Button & Consultation CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-8 rounded-3xl bg-[#FFF7ED] border border-[#FED7AA] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div>
            <h3 className="text-lg font-heading font-extrabold text-[#0F172A]">
              Still deciding between plans?
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              Return to the pricing overview or schedule a zero-pressure strategy session with our placement team.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/price"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-[#0F172A] bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-[#E2E8F0] shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Pricing</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenConsultation}
                className="w-full sm:w-auto cursor-pointer bg-[#C2410C] hover:bg-[#9A3412] text-white"
              >
                Book Free Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
