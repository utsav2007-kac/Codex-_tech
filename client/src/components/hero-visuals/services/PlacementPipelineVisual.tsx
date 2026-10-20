import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Award, Sparkles, Building2, UserCheck } from 'lucide-react';

export const PlacementPipelineVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // 0-indexed: 2 = Interviews

  // Looping 7s stepper progress animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 1));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Profile Fit', subtext: '98% calibrated' },
    { label: 'Targeted Outreach', subtext: 'Direct to VP Eng' },
    { label: 'Technical Interviews', subtext: 'Fast-track rounds' },
    { label: 'Offer Negotiation', subtext: 'Top market base' },
    { label: 'Onboarding Check-in', subtext: '90-day retention' },
  ];

  return (
    <div className="relative w-full max-w-[500px] select-none p-2 sm:p-4">
      {/* ── MAIN GLASS CONTAINER ── */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 rounded-[24px] bg-white/85 backdrop-blur-[16px] border border-white/90 shadow-[0_24px_60px_rgba(31,106,165,0.14)] p-5 sm:p-6"
      >
        {/* ── TOP: CANDIDATE PROFILE HEADER & MATCH RING ── */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Initials Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-blue-600 flex items-center justify-center text-white font-heading font-extrabold text-base shadow-md shadow-orange-500/20">
                JD
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 leading-tight">
                  Senior Java Developer
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Verified Candidate Profile · Tier-1 Pool
              </p>
            </div>
          </div>

          {/* SVG Match-Score Ring */}
          <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-500"
                strokeDasharray="98, 100"
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-heading font-extrabold text-navy-900">
              98%
            </span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {['Java 17', 'Spring Boot', 'AWS Microservices', 'Kafka'].map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/50"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* ── 5-STAGE PIPELINE STEPPER ── */}
        <div className="space-y-3.5 relative">
          {/* Background Vertical Connector Track */}
          <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-slate-100 -z-0" />

          {/* Animated Filling Progress Line */}
          <motion.div
            className="absolute left-[13px] top-3 w-[2px] bg-gradient-to-b from-orange-500 to-blue-600 origin-top -z-0"
            initial={{ height: 0 }}
            animate={{
              height: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {steps.map((st, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div key={idx} className="relative z-10 flex items-center gap-3">
                {/* Node Indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-600/30'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-heading font-bold block ${
                        isCurrent
                          ? 'text-blue-700'
                          : isCompleted
                          ? 'text-navy-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-sans block">
                      {st.subtext}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── FLOATING CHIP 1: INTERVIEW SCHEDULED (Top-Right) ── */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute -top-3 -right-2 sm:-right-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-[14px] border border-white/80 shadow-[0_12px_35px_rgba(31,106,165,0.18)]"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
          <Calendar className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-heading font-bold text-navy-900">
            Interview Scheduled
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Tue · 2:30 PM (Technical Round)
          </div>
        </div>
      </motion.div>

      {/* ── FLOATING CHIP 2: OFFER LETTER READY (Bottom-Right) ── */}
      <motion.div
        animate={{ y: [0, 7, 0], x: [0, -3, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="absolute -bottom-3 -right-1 sm:-right-3 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/95 backdrop-blur-[14px] border border-white/80 shadow-[0_12px_35px_rgba(16,185,129,0.18)]"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
          <Award className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-heading font-bold text-emerald-700 flex items-center gap-1">
            <span>Offer Letter Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            $142,000 Base · FinTech Enterprise
          </div>
        </div>
      </motion.div>
    </div>
  );
};
