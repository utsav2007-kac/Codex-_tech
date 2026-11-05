import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Interactive3DPricingCard } from '../components/pricing/Interactive3DPricingCard';
import { PricingScrollBackground } from '../components/pricing/PricingScrollBackground';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const outlet = useOutletContext<{ onOpenConsultation?: () => void } | null>();
  const shouldReduceMotion = useReducedMotion();

  const handleOpenConsultation = () => {
    if (outlet?.onOpenConsultation) {
      outlet.onOpenConsultation();
    } else {
      navigate('/contact');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white min-h-screen text-[#0F172A] relative overflow-hidden"
    >
      <SEO
        title="Career Services Plans & Pricing | Codex Tech-IT"
        description="Plans built around your offer letter. Choose from Basic, Elite, or Premium career acceleration support for software engineers and IT professionals."
        canonical="/price"
      />

      {/* ── 1. SIGNATURE LIGHT SKY-TO-CREAM HERO (MATCHING HOMEPAGE THEME) ── */}
      <section
        data-nav-theme="light"
        className="hero-section relative pt-[calc(var(--nav-h)+var(--nav-top)+20px)] pb-16 lg:pt-[calc(var(--nav-h)+var(--nav-top)+32px)] lg:pb-24 overflow-hidden bg-gradient-to-b from-[#E8F2FF] via-[#FFF7ED]/80 to-[#FFFFFF] text-[#0F172A] border-b border-[#E2E8F0]"
      >
        {/* 3D Parallax & Ambient Background Effects */}
        <PricingScrollBackground />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Animated Pill Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.92 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 shadow-xs mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C2410C] animate-pulse" />
              <span>CAREER SERVICES PLANS</span>
            </motion.div>

            {/* Animated Headline */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-[#0F172A] tracking-tight leading-[1.15] mb-5"
            >
              Plans built around your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                offer letter.
              </span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal max-w-2xl"
            >
              From the first screening call to offer review, choose the level of support you need. We focus on W2, contract and full-time offers.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── 2. THREE PRICING CARDS (WITH 3D HOVER & SCROLL ENTRANCE) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* ── CARD 1: BASIC ── */}
            <Interactive3DPricingCard delay={0.08} isFeatured={false}>
              {/* Header Box */}
              <div className="bg-[#1E293B] text-white p-7 text-center rounded-t-3xl">
                <h3 className="text-2xl font-heading font-bold tracking-tight">Basic</h3>
                <p className="text-xs text-slate-300 mt-1 font-semibold uppercase tracking-wider">6 months</p>
              </div>

              {/* Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Upfront */}
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      UPFRONT
                    </span>
                    <div className="text-4xl lg:text-5xl font-heading font-black text-[#0F172A] mt-1">
                      $1,500
                    </div>
                  </div>

                  {/* Plus */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      PLUS
                    </span>
                    <div className="text-base font-bold text-[#0F172A] mt-0.5">
                      10% of annual salary package
                    </div>
                  </div>

                  {/* Paid */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      PAID
                    </span>
                    <p className="text-sm text-[#475569] mt-0.5 leading-snug font-medium">
                      In 4 installments, starting when you receive your offer letter
                    </p>
                  </div>

                  <hr className="my-7 border-[#E2E8F0]" />

                  {/* Highlights */}
                  <ul className="space-y-3.5 text-sm text-[#334155] font-medium">
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Recorded technical training</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Quality job applications</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Offer review</span>
                    </li>
                  </ul>
                </div>

                {/* More Details Button (INSIDE CARD AT BOTTOM) */}
                <div className="pt-8 mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to="/price-details?plan=basic"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] hover:text-[#C2410C] transition-all cursor-pointer border border-[#CBD5E1] shadow-xs group"
                    >
                      <span>More Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Interactive3DPricingCard>

            {/* ── CARD 2: ELITE (FEATURED / MOST POPULAR) ── */}
            <Interactive3DPricingCard delay={0.2} isFeatured={true}>
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#C2410C] to-[#EA580C] text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3.5 rounded-bl-xl shadow-xs z-20">
                MOST POPULAR
              </div>

              {/* Header Box */}
              <div className="bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white p-7 text-center rounded-t-3xl">
                <h3 className="text-2xl font-heading font-bold tracking-tight">Elite</h3>
                <p className="text-xs text-orange-100 mt-1 font-semibold uppercase tracking-wider">9 months</p>
              </div>

              {/* Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Upfront */}
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      UPFRONT
                    </span>
                    <div className="text-4xl lg:text-5xl font-heading font-black text-[#0F172A] mt-1">
                      $2,500
                    </div>
                  </div>

                  {/* Plus */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      PLUS
                    </span>
                    <div className="text-base font-bold text-[#0F172A] mt-0.5">
                      12% of annual salary package
                    </div>
                  </div>

                  {/* Paid */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      PAID
                    </span>
                    <p className="text-sm text-[#475569] mt-0.5 leading-snug font-medium">
                      In 4 to 5 installments, starting when you receive your offer letter
                    </p>
                  </div>

                  <hr className="my-7 border-[#E2E8F0]" />

                  {/* Highlights */}
                  <ul className="space-y-3.5 text-sm text-[#334155] font-medium">
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Live or recorded training</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Mock interviews and interview support</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>3-month job warranty</span>
                    </li>
                  </ul>

                  {/* Refund Badge */}
                  <div className="mt-7">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="border border-[#C2410C] bg-orange-50 text-[#C2410C] font-bold text-xs tracking-wider uppercase py-1.5 px-4 rounded-xl text-center shadow-xs cursor-default"
                    >
                      REFUND ELIGIBLE
                    </motion.div>
                  </div>
                </div>

                {/* More Details Button (INSIDE CARD AT BOTTOM) */}
                <div className="pt-8 mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to="/price-details?plan=elite"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-white bg-[#C2410C] hover:bg-[#9A3412] transition-all cursor-pointer shadow-md hover:shadow-orange-500/30 group"
                    >
                      <span>More Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Interactive3DPricingCard>

            {/* ── CARD 3: PREMIUM ── */}
            <Interactive3DPricingCard delay={0.32} isFeatured={false}>
              {/* Header Box */}
              <div className="bg-[#0F172A] text-white p-7 text-center rounded-t-3xl">
                <h3 className="text-2xl font-heading font-bold tracking-tight">Premium</h3>
                <p className="text-xs text-slate-300 mt-1 font-semibold uppercase tracking-wider">12 months</p>
              </div>

              {/* Body */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Upfront */}
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      UPFRONT
                    </span>
                    <div className="text-4xl lg:text-5xl font-heading font-black text-[#0F172A] mt-1">
                      $3,000
                    </div>
                  </div>

                  {/* On Offer Letter */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      ON OFFER LETTER
                    </span>
                    <div className="text-base font-bold text-[#0F172A] mt-0.5">
                      $3,000
                    </div>
                  </div>

                  {/* Then */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      THEN
                    </span>
                    <div className="text-base font-bold text-[#0F172A] mt-0.5">
                      $4,000 in 2 installments
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748B] block">
                      TOTAL
                    </span>
                    <div className="text-base font-bold text-[#0F172A] mt-0.5">
                      $10,000
                    </div>
                  </div>

                  <hr className="my-7 border-[#E2E8F0]" />

                  {/* Highlights */}
                  <ul className="space-y-3.5 text-sm text-[#334155] font-medium">
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Personal recruiter</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Assessment support</span>
                    </li>
                    <li className="flex items-start gap-2.5 group/item transition-transform duration-150 hover:translate-x-1">
                      <Check className="w-4 h-4 text-[#0F172A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>6-month job warranty</span>
                    </li>
                  </ul>

                  {/* Refund Badge */}
                  <div className="mt-7">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="border border-[#0F172A] bg-slate-50 text-[#0F172A] font-bold text-xs tracking-wider uppercase py-1.5 px-4 rounded-xl text-center shadow-xs cursor-default"
                    >
                      REFUND ELIGIBLE
                    </motion.div>
                  </div>
                </div>

                {/* More Details Button (INSIDE CARD AT BOTTOM) */}
                <div className="pt-8 mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to="/price-details?plan=premium"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-white bg-[#0F172A] hover:bg-[#1E293B] transition-all cursor-pointer shadow-md group"
                    >
                      <span>More Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Interactive3DPricingCard>

          </div>

          {/* ── 3. "EVERY PLAN INCLUDES" CONTAINER (WITH 3D DEPTH ENTRANCE) ── */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 35, scale: 0.97, rotateX: 6 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
            className="bg-[#FFF7ED] border border-[#FED7AA] rounded-3xl p-8 sm:p-10 mt-12 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h4 className="text-xl font-heading font-extrabold text-[#0F172A] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C2410C]" />
              <span>Every plan includes</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 text-sm text-[#334155]">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">Screening Call + Career Guidance</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">We Care Support</span>
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">Resume Crafting</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">BGC + Onboarding Help</span>
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">Resume Understanding Session</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 cursor-default"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span className="font-semibold">Offer Review</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </motion.div>
  );
};
