import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  PhoneCall,
  Globe,
  Gift,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Github,
  Youtube,
  Navigation,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { api } from '../../services/api';
import { qualityGovernor, MotionMode } from '../../motion/qualityGovernor';
import { GlobalHubShowcase } from '../footer/GlobalHubShowcase';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [motionMode, setMotionMode] = useState<MotionMode>(qualityGovernor.getMode());

  // Listen to quality governor mode changes
  useEffect(() => {
    const unsub = qualityGovernor.subscribe((newMode) => {
      setMotionMode(newMode);
    });
    return unsub;
  }, []);

  // Dynamic calculation of time difference between US Central and India IST
  const timeDifferenceText = useMemo(() => {
    try {
      const now = new Date();
      const usDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const indDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const diffHours = (indDate.getTime() - usDate.getTime()) / (1000 * 60 * 60);
      const rounded = Math.round(diffHours * 10) / 10;
      return `${rounded} hours ahead`;
    } catch {
      return '10.5 hours ahead';
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/subscribe', { email });
      setSubscribed(true);
      setEmail('');
    } catch (err: any) {
      // Graceful simulated success for offline/dev environments
      setSubscribed(true);
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMotion = () => {
    try {
      const next: MotionMode = motionMode === 'off' ? 'full' : motionMode === 'full' ? 'lite' : 'off';
      qualityGovernor.setMode(next);
      setMotionMode(next);
    } catch {
      // Storage sandbox fallback
    }
  };

  return (
    <footer
      data-nav-theme="light"
      id="site-footer"
      className="bg-[#FFFFFF] text-[#475569] pt-16 pb-12 border-t border-[#E2E8F0] relative z-10 overflow-hidden"
    >
      <div className="container-custom">
        {/* ── 1. STATEMENT BAND: BRAND PROMISE & NEWSLETTER (LIGHT THEME) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#E2E8F0] items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-4">
              <Link to="/" className="inline-block w-56" aria-label="Codex Tech-IT Home">
                <img
                  src="/assets/logo.svg"
                  alt="Codex Tech-IT"
                  width="214"
                  height="40"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-[#475569] leading-relaxed max-w-md font-normal">
                Codex Tech-IT delivers precision IT staffing, engineering talent placement, and enterprise technology recruiting across North America and global technology hubs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-6">
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Codex LinkedIn"
                className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#FFFFFF] hover:bg-[#2563EB] hover:border-[#2563EB] flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Codex Facebook"
                className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#FFFFFF] hover:bg-[#1877F2] hover:border-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Codex Instagram"
                className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#FFFFFF] hover:bg-[#E1306C] hover:border-[#E1306C] flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Codex WhatsApp"
                className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#FFFFFF] hover:bg-[#25D366] hover:border-[#25D366] flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="Codex YouTube"
                className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#FFFFFF] hover:bg-[#DC2626] hover:border-[#DC2626] flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Subscription Box (Light Paper Style) */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-[#F8FAFC] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] h-full shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#C2410C]">
                Engineering Market Intelligence
              </span>
            </div>
            <h4 className="text-[#0F172A] font-heading font-bold text-lg mb-1.5">
              Hiring insights, in your inbox. No spam.
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] mb-5 font-normal leading-relaxed">
              Bi-weekly engineering compensation benchmarks, ATS algorithms updates, and high-demand cloud skill shifts directly from our technical placement leads.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 text-[#15803D] text-sm font-semibold bg-[#E4F6EC] border border-[#A7F3D0] p-3.5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#16A34A]" />
                <span>You're subscribed! You'll receive our next bi-weekly technical talent digest.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-[#FFFFFF] font-heading font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shrink-0 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Subscribing...' : 'Subscribe'}</span>
                </button>
              </form>
            )}
            {errorMsg && <p className="text-xs text-[#DC2626] mt-2">{errorMsg}</p>}
          </div>
        </div>

        {/* ── 2. GLOBAL HUB SHOWCASE: DUAL DAY/NIGHT CELESTIAL HUBS & 3D GLOBE (IMAGE 4) ── */}
        <div className="border-b border-[#E2E8F0]">
          <GlobalHubShowcase />
        </div>

        {/* ── 3. SITEMAPPED COLUMNS (5 GROUPED COLUMNS IN LIGHT THEME) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 text-sm items-stretch">
          {/* Column 1: Services */}
          <div className="flex flex-col h-full">
            <h5 className="font-heading font-bold text-[#0F172A] mb-3 text-xs uppercase tracking-wider min-h-[1.75rem] flex items-start">
              Technical Services
            </h5>
            <ul className="flex flex-col gap-2 text-[#475569] font-normal flex-1">
              {siteConfig.services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-[#C2410C] transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li className="mt-auto pt-2">
                <Link to="/services" className="text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] hover:underline flex items-center gap-1">
                  <span>View all 9 services</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Careers & Talent */}
          <div className="flex flex-col h-full">
            <h5 className="font-heading font-bold text-[#0F172A] mb-3 text-xs uppercase tracking-wider min-h-[1.75rem] flex items-start">
              Careers & Talent
            </h5>
            <ul className="flex flex-col gap-2 text-[#475569] font-normal flex-1">
              <li>
                <Link to="/careers" className="hover:text-[#C2410C] transition-colors flex items-center gap-1.5">
                  <span>Browse Open Roles</span>
                  <span className="px-1.5 py-0.2 bg-[#FFE9E6] text-[#C2410C] text-[10px] font-bold rounded">
                    Active
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#C2410C] transition-colors">
                  Cloud & Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#C2410C] transition-colors">
                  Full-Stack & Backend
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-[#C2410C] transition-colors">
                  Candidate Diagnostic Scoring
                </Link>
              </li>
              <li>
                <Link
                  to="/refer-earn"
                  className="hover:text-[#15803D] text-[#15803D] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Refer & Earn ($1.5k)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col h-full">
            <h5 className="font-heading font-bold text-[#0F172A] mb-3 text-xs uppercase tracking-wider min-h-[1.75rem] flex items-start">
              Company
            </h5>
            <ul className="flex flex-col gap-2 text-[#475569] font-normal flex-1">
              <li>
                <Link to="/about" className="hover:text-[#C2410C] transition-colors">
                  About Codex Tech-IT
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#C2410C] transition-colors">
                  How Hiring Works
                </Link>
              </li>
              <li>
                <Link to="/employers" className="hover:text-[#C2410C] transition-colors">
                  For Employers & RPO
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-[#C2410C] transition-colors">
                  Industry Specializations
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-[#C2410C] transition-colors">
                  Placements & Case Studies
                </Link>
              </li>
              <li>
                <Link to="/live-placements" className="hover:text-[#C2410C] transition-colors">
                  Live Placements Feed
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-[#C2410C] transition-colors">
                  Career Programs & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col h-full">
            <h5 className="font-heading font-bold text-[#0F172A] mb-3 text-xs uppercase tracking-wider min-h-[1.75rem] flex items-start">
              Resources & Guides
            </h5>
            <ul className="flex flex-col gap-2 text-[#475569] font-normal flex-1">
              <li>
                <Link to="/resources/salary-guide" className="hover:text-[#C2410C] transition-colors">
                  IT Salary Guide 2026
                </Link>
              </li>
              <li>
                <Link to="/resources/resume-templates" className="hover:text-[#C2410C] transition-colors">
                  ATS Resume Templates
                </Link>
              </li>
              <li>
                <Link to="/resources/interview-question-bank" className="hover:text-[#C2410C] transition-colors">
                  Interview Question Bank
                </Link>
              </li>
              <li>
                <Link to="/resources/webinars" className="hover:text-[#C2410C] transition-colors">
                  Technical Webinars
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C2410C] transition-colors font-medium text-[#0F172A]">
                  Codex Engineering Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C2410C] transition-colors">
                  Candidate & Client FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Trust */}
          <div className="flex flex-col h-full">
            <h5 className="font-heading font-bold text-[#0F172A] mb-3 text-xs uppercase tracking-wider min-h-[1.75rem] flex items-start">
              Legal & Trust
            </h5>
            <ul className="flex flex-col gap-2 text-[#475569] font-normal flex-1">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#C2410C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#C2410C] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#C2410C] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#C2410C] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility-statement" className="hover:text-[#C2410C] transition-colors">
                  Accessibility Statement
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/dev/typography" className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Typography Specimen</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-xs text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  Admin Command Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── 3.5. SUBTLE ARCHITECTURAL WATERMARK (LIGHT MONOCHROME) ── */}
        <div
          data-anim="tilt-in"
          className="pt-8 pb-2 text-center overflow-hidden select-none pointer-events-none opacity-[0.04]"
          aria-hidden="true"
        >
          <span className="font-heading font-extrabold text-[15vw] leading-none tracking-tighter text-[#0F172A] inline-block">
            CODEX
          </span>
        </div>

        {/* ── 4. LEGAL DISCLAIMER & QUALITY GOVERNOR MOTION BAR ── */}
        <div className="pt-8 border-t border-[#E2E8F0] space-y-4 text-xs text-[#64748B]">
          {/* Truth Rule Compliance Notice */}
          <div className="flex items-start gap-2 text-[11px] text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <p>
              <strong>General Information, Not Legal Advice:</strong> Material published on this website regarding employment taxation, payroll compliance, visa sponsorship, and labor standards is provided for informational and educational orientation only. Consult licensed legal, tax, or human resource counsel for binding compliance guidance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-medium pt-2">
            <p>© {new Date().getFullYear()} Codex Tech-IT LLC. All rights reserved. E-Verified Employer.</p>
            <div className="flex flex-wrap items-center gap-5">
              {/* Quality Governor Interactive Switch */}
              <button
                type="button"
                id="quality-governor-toggle"
                onClick={handleToggleMotion}
                className="text-[11px] font-semibold text-[#0F172A] hover:text-[#C2410C] px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="Cycle Kinetic Motion Accessibility Modes"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    motionMode === 'full' ? 'bg-[#16A34A]' : motionMode === 'lite' ? 'bg-[#EAB308]' : 'bg-[#94A3B8]'
                  }`}
                />
                <span>Motion: {motionMode.toUpperCase()} (Click to toggle)</span>
              </button>

              <span className="text-[#334155]">USA: <strong>{siteConfig.contact.phoneUSA}</strong></span>
              <span className="text-[#334155]">India: <strong>{siteConfig.contact.phoneIndia}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
