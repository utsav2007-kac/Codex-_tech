import React, { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { Sparkles, Type, CheckCircle2, Copy } from 'lucide-react';

export const DevTypography: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const typographyScales = [
    {
      level: 'Display 1',
      className: 'text-display-1',
      clamp: 'clamp(2.75rem, 1.6rem + 5vw, 5.5rem)',
      sample: 'Executive Tech Staffing at Scale',
      font: 'Sora 800',
      lineHeight: '1.12',
      tracking: '-0.035em',
    },
    {
      level: 'Display 2',
      className: 'text-display-2',
      clamp: 'clamp(2.25rem, 1.4rem + 4vw, 4.25rem)',
      sample: 'Real Experiences. Real Offers.',
      font: 'Sora 800',
      lineHeight: '1.15',
      tracking: '-0.03em',
    },
    {
      level: 'Heading 1',
      className: 'text-h1',
      clamp: 'clamp(2rem, 1.4rem + 3vw, 3.5rem)',
      sample: 'Workforce Solutions for High-Growth Tech Teams',
      font: 'Sora 700',
      lineHeight: '1.18',
      tracking: '-0.025em',
    },
    {
      level: 'Heading 2',
      className: 'text-h2',
      clamp: 'clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem)',
      sample: 'Featured Technical Requisitions & Bench Cohorts',
      font: 'Sora 700',
      lineHeight: '1.22',
      tracking: '-0.02em',
    },
    {
      level: 'Heading 3',
      className: 'text-h3',
      clamp: 'clamp(1.35rem, 1.1rem + 1.2vw, 1.875rem)',
      sample: 'Precision Vetting for Enterprise Cloud Infrastructure',
      font: 'Sora 600',
      lineHeight: '1.28',
      tracking: '-0.015em',
    },
    {
      level: 'Heading 4',
      className: 'text-h4',
      clamp: 'clamp(1.15rem, 1.05rem + 0.6vw, 1.5rem)',
      sample: 'Direct Client Representation & Offer Negotiation',
      font: 'Sora 600',
      lineHeight: '1.35',
      tracking: '-0.01em',
    },
    {
      level: 'Heading 5',
      className: 'text-h5',
      clamp: 'clamp(1rem, 0.95rem + 0.3vw, 1.25rem)',
      sample: 'Technical Sourcing & Multi-Cloud Architecture Review',
      font: 'Sora 600',
      lineHeight: '1.4',
      tracking: '-0.005em',
    },
    {
      level: 'Heading 6',
      className: 'text-h6',
      clamp: 'clamp(0.875rem, 0.85rem + 0.2vw, 1rem)',
      sample: 'E-VERIFIED EMPLOYER COMPLIANCE & GOVERNANCE',
      font: 'Sora 600',
      lineHeight: '1.45',
      tracking: '0.05em (Caps)',
    },
    {
      level: 'Body Large',
      className: 'text-body-lg',
      clamp: 'clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)',
      sample: 'Codex Tech-IT bridges skilled IT professionals with companies ready to hire, faster, fairer, and with far less hiring chaos.',
      font: 'Inter 400',
      lineHeight: '1.7',
      tracking: '0em',
    },
    {
      level: 'Body Base',
      className: 'text-body-base',
      clamp: '1rem (16px)',
      sample: 'Bi-weekly engineering salary benchmarks, ATS algorithms updates, and high-demand cloud skill shifts directly from our technical placement leads.',
      font: 'Inter 400',
      lineHeight: '1.625',
      tracking: '0em',
    },
    {
      level: 'Body Small',
      className: 'text-body-sm',
      clamp: '0.875rem (14px)',
      sample: 'Material published on this website regarding employment taxation, payroll compliance, and labor standards is provided for educational orientation only.',
      font: 'Inter 400',
      lineHeight: '1.5',
      tracking: '0em',
    },
    {
      level: 'Caption & Eyebrow',
      className: 'text-caption',
      clamp: '0.75rem (12px)',
      sample: 'DIRECT BENCH REQUISITION • TIER-1 PARTNER DESK',
      font: 'Inter 600',
      lineHeight: '1.4',
      tracking: '0.08em (Uppercase)',
    },
  ];

  return (
    <div className="section-padding bg-[#FFFFFF] min-h-screen text-[#475569]">
      <SEO title="Typography System & Specimen | Codex Tech-IT Design System" />
      <div className="container-custom max-w-6xl space-y-14">
        {/* Header */}
        <div className="pb-8 border-b border-[#E2E8F0]">
          <div className="eyebrow flex items-center gap-1.5 text-[#C2410C] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Tokens · Typography System</span>
          </div>
          <h1 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight mb-3">
            Typography System & Specimen
          </h1>
          <p className="text-body-lg text-[#475569] max-w-3xl">
            Strictly dual-typeface architecture: <strong>Sora</strong> for architectural display headings and tabular numerals, and <strong>Inter</strong> for high-legibility interface text and body copy.
          </p>
        </div>

        {/* Font Family Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-[#E8F2FF] px-2.5 py-1 rounded-md">
                Display & Headings
              </span>
              <span className="text-xs text-[#64748B]">Weights: 400, 600, 700, 800</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-2">
              Sora
            </h2>
            <p className="text-sm text-[#475569] mb-4">
              Geometric proportions with distinct humanistic angles, designed for high-impact display branding, section headings, and precision lining numerals.
            </p>
            <div className="font-heading text-lg font-bold text-[#0F172A] p-4 bg-[#FFFFFF] rounded-xl border border-[#CBD5E1]">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 ($185k / yr)
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFE9E6] px-2.5 py-1 rounded-md">
                UI & Body Copy
              </span>
              <span className="text-xs text-[#64748B]">Weights: 400, 500, 600</span>
            </div>
            <h2 className="text-3xl font-sans font-bold text-[#0F172A] mb-2">
              Inter
            </h2>
            <p className="text-sm text-[#475569] mb-4">
              Crafted specifically for computer screens with tall x-height, contextual alternates, and crisp legibility down to 10px sub-captions.
            </p>
            <div className="font-sans text-lg text-[#0F172A] p-4 bg-[#FFFFFF] rounded-xl border border-[#CBD5E1]">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 (info@codextechit.com)
            </div>
          </div>
        </div>

        {/* Tabular Numerals Comparison */}
        <div className="p-8 rounded-3xl bg-[#FFF4D6] border border-[#FDE68A]">
          <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-2">
            Tabular Numerals & Metric Columns (font-variant-numeric: tabular-nums)
          </h3>
          <p className="text-xs text-[#475569] mb-6">
            In recruitment compensation and placement statistics, numbers must align monospaced without jittering during count-ups or tabular comparisons.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#FEF08A]">
              <span className="text-xs font-mono text-[#D97706] font-bold block mb-2">
                STANDARD PROPORTIONAL (Numbers wobble)
              </span>
              <div className="space-y-1 font-heading text-lg text-[#0F172A]">
                <div>$111,111 / yr · 11 Days</div>
                <div>$888,888 / yr · 88 Days</div>
                <div>$185,000 / yr · 18 Days</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#FEF08A]">
              <span className="text-xs font-mono text-[#15803D] font-bold block mb-2">
                TABULAR NUMERALS (Aligned perfectly)
              </span>
              <div className="space-y-1 font-numbers text-lg text-[#0F172A]">
                <div>$111,111 / yr · 11 Days</div>
                <div>$888,888 / yr · 88 Days</div>
                <div>$185,000 / yr · 18 Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Fluid Scale Matrix */}
        <div className="space-y-6">
          <h3 className="font-heading font-bold text-2xl text-[#0F172A]">
            Fluid Hierarchy Matrix (Responsive clamp scales)
          </h3>

          <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {typographyScales.map((item) => (
              <div key={item.level} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-sm text-[#0F172A]">
                      {item.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`.${item.className}`)}
                      className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-1"
                      title="Copy CSS class"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-[#64748B]">
                    {item.clamp}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">
                    {item.font} · LH {item.lineHeight}
                  </div>
                </div>

                <div className="lg:col-span-9">
                  <p className={`${item.className} text-[#0F172A]`}>
                    {item.sample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {copiedToken && (
          <div className="fixed bottom-6 right-6 px-4 py-2 bg-[#0F172A] text-white rounded-xl shadow-lg text-xs font-mono flex items-center gap-2 z-50 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Copied {copiedToken}</span>
          </div>
        )}
      </div>
    </div>
  );
};
