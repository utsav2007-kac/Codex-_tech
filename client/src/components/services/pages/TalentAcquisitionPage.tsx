import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Users,
  Compass,
  Cpu,
  ShieldCheck,
  Building2,
  Layers,
  Award,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSitePositioning } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

type SpokeId = 'recruiter' | 'sourcer' | 'techlead' | 'coordinator';

export const TalentAcquisitionPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Clickable Hub-and-Spoke Team Member
  const [activeSpoke, setActiveSpoke] = useState<SpokeId>('techlead');

  const spokesData: Record<
    SpokeId,
    {
      title: string;
      role: string;
      focus: string;
      deliverable: string;
      icon: string;
    }
  > = {
    techlead: {
      title: 'Technical Assessment Lead',
      role: 'Former Staff Engineer',
      focus: 'Architectural evaluation, live coding screening, and candidate rubric defense.',
      deliverable: '100% pre-vetted dossiers with code review notes submitted directly to your hiring manager.',
      icon: '01',
    },
    recruiter: {
      title: 'Dedicated Senior Tech Recruiter',
      role: 'Embedded Full-Lifecycle Recruiter',
      focus: 'Candidate engagement, compensation alignment, closing offer negotiations, and candidate advocacy.',
      deliverable: 'Acts seamlessly under your brand banner with transparent ATS integration.',
      icon: '02',
    },
    sourcer: {
      title: 'Precision Talent Sourcer',
      role: 'Passive Candidate Specialist',
      focus: 'Direct Boolean & AI sourcing across Tier-1 tech corridors, GitHub repositories, and patent holders.',
      deliverable: 'Custom candidate talent pipeline calibrated to high-difficulty niche roles.',
      icon: '03',
    },
    coordinator: {
      title: 'Interview Operations Coordinator',
      role: 'Logistics & Candidate Experience Lead',
      focus: 'Multi-stage panel scheduling, candidate preparation, NDA tracking, and post-interview debriefs.',
      deliverable: 'Flawless candidate journey resulting in zero dropped loops and high offer acceptance.',
      icon: '04',
    },
  };

  const currentSpoke = spokesData[activeSpoke];

  return (
    <div className="w-full bg-[#F8FAF9] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: MINT TINT (#E4F6EC) WITH CENTRED HUB DIAGRAM
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#E4F6EC] via-[#EDFAF3] to-[#F8FAF9] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 text-xs text-[#475569] font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Talent Acquisition (RPO)</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide shadow-xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
            <span>Embedded Recruitment Process Outsourcing (RPO)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
            An Embedded Technical Hiring Engine, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] via-[#0D9488] to-[#2563EB]">
              Integrated into Your Team.
            </span>
          </h1>

          {/* Positioning from old site */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs max-w-2xl mx-auto">
            <p className="text-xs text-[#0F172A] font-semibold italic">
              "{oldSitePositioning.statement}"
            </p>
            <p className="text-xs text-[#475569] mt-1">
              Scale engineering capacity without inflated 25% agency contingency fees or recruiter churn.
            </p>
          </div>

          <p className="text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
            When scaling 10 to 50+ engineers, one-off staffing agencies create unpredictable spend and inconsistent quality. Our embedded RPO team integrates directly into your Slack, Jira, and ATS, operating as an authentic extension of your internal talent brand.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenConsultation}
              className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
            >
              Configure Embedded Team <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <a
              href="#hub-diagram"
              className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs"
            >
              Explore Embedded Pod Structure
            </a>
          </div>

          {/* Centred Hub-and-Spoke Interactive SVG Component */}
          <div id="hub-diagram" className="mt-12 p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pod Architecture</span>
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">Click Spokes to Inspect Pod Roles</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold">
                EMBEDDED POD
              </span>
            </div>

            {/* Interactive SVG Diagram */}
            <div className="relative py-6 flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full max-w-md h-auto">
                {/* Connecting Spokes Lines */}
                <line x1="200" y1="200" x2="200" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="340" y2="200" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="200" y2="340" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="60" y2="200" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />

                {/* Central Hub */}
                <circle cx="200" cy="200" r="54" fill="#E4F6EC" stroke="#059669" strokeWidth="3" />
                <text x="200" y="196" textAnchor="middle" fill="#065F46" fontSize="13" fontWeight="bold">YOUR</text>
                <text x="200" y="214" textAnchor="middle" fill="#065F46" fontSize="13" fontWeight="bold">COMPANY</text>
              </svg>

              {/* 4 Clickable Spoke Nodes positioned absolutely */}
              <button
                onClick={() => setActiveSpoke('techlead')}
                className={`absolute top-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeSpoke === 'techlead'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                1. Tech Assessment Lead
              </button>

              <button
                onClick={() => setActiveSpoke('recruiter')}
                className={`absolute right-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeSpoke === 'recruiter'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                2. Senior Recruiter
              </button>

              <button
                onClick={() => setActiveSpoke('sourcer')}
                className={`absolute bottom-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeSpoke === 'sourcer'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                3. Precision Sourcer
              </button>

              <button
                onClick={() => setActiveSpoke('coordinator')}
                className={`absolute left-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeSpoke === 'coordinator'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                4. Ops Coordinator
              </button>
            </div>

            {/* Active Spoke Explainer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-[#F0FDF4] border border-emerald-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{currentSpoke.role}</span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">Node {currentSpoke.icon} / 04</span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#0F172A]">{currentSpoke.title}</h4>
              <p className="text-xs text-[#475569] leading-relaxed">{currentSpoke.focus}</p>
              <div className="pt-2 text-xs font-semibold text-emerald-900 border-t border-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Primary Output: {currentSpoke.deliverable}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. BODY WITH STICKY SIDE INDEX
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Side Index */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-3 py-1">
                RPO Index
              </div>
              {[
                { id: 'hub-diagram', label: 'Embedded Pod Model' },
                { id: 'cost-advantage', label: 'Cost vs Contingency' },
                { id: 'timeline', label: 'Integration Timeline' },
                { id: 'governance', label: 'Quality & Governance' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-[#475569] hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <Button
                  onClick={onOpenConsultation}
                  className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Book RPO Strategy Call
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-16">
            {/* 3. COST VS CONTINGENCY COMPARISON */}
            <section id="cost-advantage" className="space-y-6 scroll-mt-28">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Financial Optimization</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                  Predictable RPO Retainer vs 25% Contingency Spend
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                  As your hiring volume scales, contingency staffing agency markups become prohibitively expensive. Codex RPO offers fixed monthly pod fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Traditional Agency Contingency</div>
                  <div className="text-3xl font-numbers font-black text-rose-600">20% – 25%</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Per placement fee. For 15 hires averaging $150k base, you spend upwards of $560,000 with zero long-term talent assets created.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2">✕ Transactional incentive to pitch any candidate</li>
                    <li className="flex items-center gap-2">✕ No dedicated sourcing pipeline retained</li>
                    <li className="flex items-center gap-2">✕ Inconsistent candidate employer branding</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-emerald-300 space-y-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Codex Embedded RPO Model</div>
                  <div className="text-3xl font-numbers font-black text-emerald-700">Fixed Monthly Pod</div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Predictable monthly pod retainer regardless of how many engineers you hire. Save 40% to 65% annually on volume engineering scale.
                  </p>
                  <ul className="text-xs text-emerald-800 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-600" /> All candidate talent pipelines belong to you</li>
                    <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-600" /> Direct code defense & rubric screening included</li>
                    <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-600" /> Integrated directly into your ATS & hiring workflows</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. INTEGRATION TIMELINE */}
            <section id="timeline" className="space-y-6 scroll-mt-28">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Rapid Deployment</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                  Seamless 14-Day Team Integration
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { days: 'Days 1 – 4', title: 'Calibration & ATS Setup', desc: 'Sync with VP of Engineering, calibrate rubrics, join Slack, and configure ATS requisition pipelines.' },
                  { days: 'Days 5 – 9', title: 'Targeted Sourcing Launch', desc: 'Active multichannel outreach across Tier-1 engineering corridors and passive candidate networks.' },
                  { days: 'Days 10 – 14', title: 'First Calibrated Shortlists', desc: 'Delivery of pre-screened candidate dossiers with technical assessment notes ready for internal loops.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4">
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold font-mono shrink-0">
                      {item.days}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-sm text-[#0F172A]">{item.title}</h4>
                      <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. QUALITY & GOVERNANCE */}
            <section id="governance" className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4 scroll-mt-28">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Governance & SLAs</span>
              <h3 className="font-heading font-bold text-xl text-[#0F172A]">Weekly Telemetry & Hiring Governance</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                You receive weekly sprint reports detailing candidate conversion rates, pass-through metrics per interviewer, and competitive compensation intelligence across target hiring markets.
              </p>
            </section>

            {/* 6. CLOSING CTA BANNER (Mint Card) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#E4F6EC] via-[#EDFAF3] to-white border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
                  Scaling 10+ Engineering Hires This Quarter?
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
                  Schedule an architectural capacity session to model your hiring velocity and review embedded team sizing.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
              >
                Schedule Capacity Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
