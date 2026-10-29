import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Users,
  Search,
  ShieldCheck,
  GraduationCap,
  Calculator,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const PastelPillars: React.FC = () => {
  return (
    <section data-nav-theme="light" className="w-full">
      {/* ── 1. RECRUITMENT-FOCUSED DISPLAY HEADING ── */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="eyebrow flex items-center justify-center gap-1.5 text-[#C2410C] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>End-to-End Technical Talent Ecosystem</span>
        </div>
        <h2 className="text-h1 font-heading font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
          Workforce Solutions for <br className="hidden sm:inline" />
          <span className="text-[#C2410C]">Businesses</span> and <span className="text-[#2563EB]">Job Seekers</span>
        </h2>
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal max-w-2xl mx-auto">
          From hiring to getting hired, Codex Tech-IT is the dedicated technical workforce partner supporting enterprise hiring managers and ambitious software engineers with end-to-end recruitment services.
        </p>
      </div>

      {/* ── 2. ASYMMETRICAL CREATIVE CARD SHOWCASE (MATCHING REFERENCE IMAGE 4) ── */}
      <div className="space-y-6">
        {/* TOP ROW: 2 WIDE HERO CARDS (JOB PLACEMENT & RECRUITMENT STAFFING) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Job Placement (Cream Tint - 7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#FFF7ED] border border-[#FED7AA] p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            {/* Top Content */}
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#FDBA74] flex items-center justify-center text-[#C2410C] mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A] mb-3 leading-snug">
                Job Placement
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                Helping professionals land meaningful full-time roles with end-to-end services that turn jobs into long-term careers.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-[#334155] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <span>Resume re-engineering & technical positioning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <span>Direct submission to verified enterprise hiring desks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <span>Senior compensation negotiation representation</span>
                </li>
              </ul>
              <Link
                to="/services/job-placement"
                className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#C2410C] hover:text-[#9A3412] hover:underline"
              >
                <span>Explore Job Placement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Artistic Collage Graphic (Right Side) */}
            <div className="hidden sm:block absolute right-4 bottom-4 w-72 h-72 pointer-events-none select-none opacity-90 group-hover:scale-105 transition-transform duration-500">
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
                {/* Airplane Wing Silhouette */}
                <polygon points="40,160 180,80 140,180" fill="#2563EB" opacity="0.85" />
                <polygon points="180,80 220,130 140,180" fill="#1D4ED8" />
                {/* Cloud Trails */}
                <ellipse cx="60" cy="180" rx="35" ry="14" fill="#FFFFFF" opacity="0.9" />
                <ellipse cx="95" cy="175" rx="28" ry="12" fill="#FFFFFF" opacity="0.9" />
                {/* Professional Silhouette leaping */}
                <circle cx="150" cy="65" r="14" fill="#0F172A" />
                <path d="M140,82 L160,82 L168,125 L156,125 L152,100 L148,125 L136,125 Z" fill="#0F172A" />
                {/* Orange Tie / Accent */}
                <polygon points="149,82 153,82 154,105 151,108 148,105" fill="#F25C2A" />
                {/* Outstretched arms */}
                <path d="M140,90 L115,70 L120,64 L142,82" fill="#0F172A" />
                <path d="M160,90 L185,75 L182,68 L158,82" fill="#0F172A" />
              </svg>
            </div>
          </div>

          {/* Card 2: Recruitment & Staffing (Butter Tint - 5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#FFF4D6] border border-[#FDE68A] p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#FDE047] flex items-center justify-center text-[#D97706] mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A] mb-3 leading-snug">
                Recruitment & Staffing
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                Connecting businesses with skilled professionals who actually fit the technical stack, team culture, and delivery pace.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-[#334155] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Vetted bench cohorts ready for deployment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Contract, C2H, and permanent placement</span>
                </li>
              </ul>
              <Link
                to="/services/recruitment-staffing"
                className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#B45309] hover:text-[#78350F] hover:underline"
              >
                <span>Hire Talent Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Artistic Spotlight Beam Graphic */}
            <div className="hidden sm:block absolute right-2 bottom-0 w-60 h-60 pointer-events-none select-none opacity-85 group-hover:scale-105 transition-transform duration-500">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Yellow Beam */}
                <polygon points="10,20 190,190 80,190" fill="#FDE047" opacity="0.65" />
                {/* Spotlight Source */}
                <circle cx="10" cy="20" r="14" fill="#D97706" />
                {/* Candidate Standing in Spotlight */}
                <circle cx="140" cy="140" r="7" fill="#0F172A" />
                <path d="M135,149 L145,149 L148,185 L143,185 L140,165 L137,185 L132,185 Z" fill="#0F172A" />
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: 4 SPECIALIZED CARDS (TALENT ACQUISITION, BG VERIFICATION, IT TRAINING, PAYROLL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Card 3: Talent Acquisition (Sky Blue Tint) */}
          <div className="rounded-3xl bg-[#E8F2FF] border border-[#BFDBFE] p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#93C5FD] flex items-center justify-center text-[#2563EB] mb-5 shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-2 leading-snug">
                Talent Acquisition
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-6 font-normal">
                Strategic hiring support to build long-term, high-performing engineering squads.
              </p>
            </div>

            {/* Visual Collage: Mountain & Summit Scaler */}
            <div className="relative pt-4 border-t border-[#BFDBFE]/60 flex items-center justify-between">
              <Link
                to="/services/talent-acquisition"
                className="text-xs font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-16 h-16 pointer-events-none opacity-80">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <polygon points="10,70 45,20 75,70" fill="#3B82F6" opacity="0.4" />
                  <polygon points="35,70 55,35 75,70" fill="#1D4ED8" opacity="0.7" />
                  <circle cx="20" cy="55" r="12" fill="#F25C2A" />
                  <circle cx="45" cy="18" r="4" fill="#0F172A" />
                  <line x1="45" y1="18" x2="45" y2="34" stroke="#0F172A" strokeWidth="2.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Background Verification (Warm Peach/Butter Tint) */}
          <div className="rounded-3xl bg-[#FFF4D6] border border-[#FDE68A] p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#FCD34D] flex items-center justify-center text-[#D97706] mb-5 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-2 leading-snug">
                Background Verification
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-6 font-normal">
                Comprehensive checks to ensure trust, identity authentication, compliance, and reliability.
              </p>
            </div>

            {/* Visual Collage: Magnifying Glass & Ascending Steps */}
            <div className="relative pt-4 border-t border-[#FDE68A]/60 flex items-center justify-between">
              <Link
                to="/services/background-verification"
                className="text-xs font-bold text-[#B45309] hover:underline flex items-center gap-1"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-16 h-16 pointer-events-none opacity-80">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="28" cy="40" r="14" fill="#38BDF8" opacity="0.7" />
                  <rect x="15" y="55" width="20" height="20" fill="#0F172A" />
                  <circle cx="50" cy="35" r="15" fill="none" stroke="#0F172A" strokeWidth="4" />
                  <line x1="60" y1="46" x2="74" y2="60" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: IT Training (Lavender Tint) */}
          <div className="rounded-3xl bg-[#EFEEFF] border border-[#DDD6FE] p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#C4B5FD] flex items-center justify-center text-[#6D28D9] mb-5 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-2 leading-snug">
                IT Training & Bootcamps
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-6 font-normal">
                Training that prepares candidates for real-world enterprise cloud & distributed systems tech careers.
              </p>
            </div>

            {/* Visual Collage: Springboard & Upward Growth Bars */}
            <div className="relative pt-4 border-t border-[#DDD6FE]/60 flex items-center justify-between">
              <Link
                to="/services/it-training"
                className="text-xs font-bold text-[#6D28D9] hover:underline flex items-center gap-1"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-16 h-16 pointer-events-none opacity-80">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <rect x="10" y="55" width="10" height="20" fill="#F97316" />
                  <rect x="25" y="40" width="10" height="35" fill="#EA580C" />
                  <rect x="40" y="25" width="10" height="50" fill="#C2410C" />
                  <circle cx="65" cy="20" r="5" fill="#0F172A" />
                  <path d="M60,26 L70,26 L68,44 L60,44 Z" fill="#0F172A" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 6: Payroll & Compliance (Mint Tint) */}
          <div className="rounded-3xl bg-[#E4F6EC] border border-[#BBF7D0] p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#86EFAC] flex items-center justify-center text-[#15803D] mb-5 shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#0F172A] mb-2 leading-snug">
                Payroll & Taxes
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-6 font-normal">
                Seamless payroll processing with full state, federal, and international tax regulatory compliance.
              </p>
            </div>

            {/* Visual Collage: Hand with Origami Bird / Currency Wing */}
            <div className="relative pt-4 border-t border-[#BBF7D0]/60 flex items-center justify-between">
              <Link
                to="/services/payroll-taxes"
                className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-16 h-16 pointer-events-none opacity-80">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="45" r="22" fill="#EAB308" opacity="0.6" />
                  <polygon points="20,40 50,20 65,35 45,55" fill="#16A34A" opacity="0.8" />
                  <path d="M10,65 Q35,55 55,62" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
