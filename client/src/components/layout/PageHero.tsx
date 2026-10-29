import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Star, Check } from 'lucide-react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Button } from '../ui/Button';
import { getHeroVisual } from '../hero-visuals/VisualRegistry';

export interface PageHeroFact {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface PageHeroCta {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface PageHeroProps {
  eyebrow?: string;
  badge?: string;
  title: string | React.ReactNode;
  titleGradientWords?: string[];
  tagline?: string;
  summary?: string;
  subtitle?: string;
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  facts?: PageHeroFact[];
  visual?: string | React.ReactNode;
  tone?: 'light' | 'navy';
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  badge,
  title,
  titleGradientWords,
  tagline,
  summary,
  subtitle,
  primaryCta,
  secondaryCta,
  breadcrumbs,
  facts,
  visual,
  tone = 'light',
  className = '',
}) => {
  const isNavy = tone === 'navy';
  const displayEyebrow = eyebrow || badge;
  const displaySummary = summary || subtitle || '';

  // Resolve visual component from registry if string key provided
  const visualContent = typeof visual === 'string' ? getHeroVisual(visual) : visual;

  // Clean tagline: remove any stray outer quotation marks
  const cleanTagline = tagline ? tagline.replace(/^["'“”]+|["'“”]+$/g, '').trim() : '';

  return (
    <section
      data-hero-section
      className={`relative pt-8 sm:pt-10 pb-14 sm:pb-20 overflow-hidden border-b ${
        isNavy
          ? 'bg-navy-900 border-navy-800 text-white'
          : 'bg-gradient-to-b from-slate-50/80 via-white to-white border-slate-100 text-[#0B1B2E]'
      } ${className}`}
    >
      {/* ── BACKGROUND BRAND MESH (Feathered edges, no hard lines) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
        style={{
          maskImage: 'radial-gradient(ellipse at center, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 60%, transparent 100%)',
        }}
      >
        {/* Soft Blue Radial Wash */}
        <div
          className={`absolute -top-[10%] right-[5%] w-[520px] h-[520px] rounded-full filter blur-[100px] pointer-events-none ${
            isNavy ? 'bg-blue-600/15' : 'bg-[#DCEBFA]/70'
          }`}
        />
        {/* Soft Orange Accent Wash */}
        <div
          className={`absolute bottom-[0%] left-[8%] w-[420px] h-[420px] rounded-full filter blur-[90px] pointer-events-none ${
            isNavy ? 'bg-orange-500/10' : 'bg-orange-500/8'
          }`}
        />
        {/* Subtle Watermark Monogram Accent at 4% opacity */}
        <div className="absolute right-[8%] top-[18%] opacity-[0.04] pointer-events-none select-none hidden lg:block">
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <path
              d="M 52 14 C 28 14 12 30 12 50 C 12 70 28 86 52 86"
              stroke={isNavy ? '#FFFFFF' : '#1F6AA5'}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path d="M 44 74 L 84 34" stroke={isNavy ? '#FFFFFF' : '#F15A34'} strokeWidth="11" strokeLinecap="round" />
            <path d="M 46 36 L 82 72" stroke={isNavy ? '#FFFFFF' : '#1F6AA5'} strokeWidth="11" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* 12-Column Responsive Grid: Text cols 1-7, Visual cols 8-12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* ── LEFT COLUMN (Text: Cols 1-7) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow / Badge */}
            {displayEyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3.5"
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isNavy
                      ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                      : 'bg-orange-50 text-orange-600 border border-orange-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  {displayEyebrow}
                </span>
              </motion.div>
            )}

            {/* H1 Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.12] mb-3.5 ${
                isNavy ? 'text-white' : 'text-[#0B1B2E]'
              }`}
            >
              {(() => {
                if (typeof title !== 'string' || !titleGradientWords || titleGradientWords.length === 0) {
                  return title;
                }
                for (const phrase of titleGradientWords) {
                  if (title.includes(phrase)) {
                    const parts = title.split(phrase);
                    return (
                      <>
                        {parts[0]}
                        <span className="text-brand-gradient">{phrase}</span>
                        {parts[1]}
                      </>
                    );
                  }
                }
                return title;
              })()}
            </motion.h1>

            {/* Tagline (Orange, Typographic without Quotes) */}
            {cleanTagline && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="text-base sm:text-lg lg:text-xl font-heading font-semibold text-[#F15A34] mb-4 leading-snug"
              >
                {cleanTagline}
              </motion.p>
            )}

            {/* Concise Summary / Subtitle */}
            {displaySummary && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl ${
                  isNavy ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {displaySummary}
              </motion.p>
            )}

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="flex flex-wrap items-center gap-3.5 mb-8"
              >
                {primaryCta && (
                  <Button
                    variant={primaryCta.variant || 'primary'}
                    size="lg"
                    onClick={primaryCta.onClick}
                    href={primaryCta.href}
                    className="shadow-lg shadow-orange-500/20"
                  >
                    {primaryCta.label}{' '}
                    {primaryCta.label.toLowerCase().includes('copied') ? (
                      <Check className="w-4 h-4 ml-1.5 text-emerald-300" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    )}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    variant={secondaryCta.variant || (isNavy ? 'ghost' : 'outline')}
                    size="lg"
                    onClick={secondaryCta.onClick}
                    href={secondaryCta.href}
                    className={isNavy ? 'text-white border border-slate-700 hover:bg-white/10' : ''}
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </motion.div>
            )}

            {/* Key Facts Row (3 items under CTAs with icons and labels) */}
            {facts && facts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={`pt-6 border-t flex flex-wrap items-center gap-5 sm:gap-7 ${
                  isNavy ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                {facts.map((fact, idx) => {
                  const FactIcon = fact.icon || CheckCircle2;
                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isNavy
                            ? 'bg-blue-900/50 text-orange-400 border border-blue-700/40'
                            : 'bg-orange-50 text-[#F15A34] border border-orange-200/60'
                        }`}
                      >
                        <FactIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div
                          className={`font-heading font-bold text-xs sm:text-sm leading-tight ${
                            isNavy ? 'text-white' : 'text-[#0B1B2E]'
                          }`}
                        >
                          {fact.value}
                        </div>
                        <div
                          className={`font-sans text-[11px] leading-tight ${
                            isNavy ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {fact.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* ── RIGHT COLUMN (Visual Companion: Cols 8-12) ── */}
          <div
            data-hero-right
            className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] max-h-[560px] w-full"
          >
            {visualContent ? (
              <motion.div
                data-hero-visual
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="page-hero-visual w-full max-w-[540px] flex items-center justify-center"
              >
                {visualContent}
              </motion.div>
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-300">
                {/* Visual placeholder until registry load */}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
