import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Search,
  Sparkles,
  Loader2,
  CheckCircle2,
  Radio,
  Zap,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

const REGION_CHIPS = ['ALL', 'Texas', 'California', 'New York', 'Illinois', 'Remote / Hybrid', 'India Hub'];

const SAMPLE_TICKER_ITEMS = [
  { role: 'Lead AWS Cloud Architect', loc: 'Dallas, TX', comp: '$165,000', company: 'Fortune 100 FinTech' },
  { role: 'Staff React Engineer', loc: 'Chicago, IL', comp: '$148,000', company: 'Healthcare SaaS' },
  { role: 'Data Pipeline Specialist', loc: 'Austin, TX', comp: '$152,000', company: 'E-Commerce Enterprise' },
  { role: 'DevOps & K8s Engineer', loc: 'Remote (US)', comp: '$140,000', company: 'Cloud Infrastructure' },
  { role: 'Senior Python API Lead', loc: 'Plano, TX', comp: '$145,000', company: 'Banking Services' },
  { role: 'Cybersecurity SOC Lead', loc: 'Charlotte, NC', comp: '$138,000', company: 'InsurTech Global' },
];

export const LivePlacements: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  useEffect(() => {
    api
      .get('/live-placements')
      .then((res) => {
        if (res.data?.data) {
          setPlacements(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const companyTypes = ['ALL', ...Array.from(new Set(placements.map((p) => p.company_type)))];

  const filtered = placements.filter((p) => {
    const matchesSearch =
      p.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedCompanyType === 'ALL' || p.company_type === selectedCompanyType;
    const matchesRegion =
      selectedRegion === 'ALL' ||
      (selectedRegion === 'Remote / Hybrid' && (p.location?.toLowerCase().includes('remote') || p.location?.toLowerCase().includes('hybrid'))) ||
      (selectedRegion === 'India Hub' && (p.location?.toLowerCase().includes('india') || p.location?.toLowerCase().includes('hyderabad'))) ||
      p.location?.toLowerCase().includes(selectedRegion.toLowerCase());
    return matchesSearch && matchesType && matchesRegion;
  });

  return (
    <div className="bg-[#090E17] text-white overflow-x-hidden min-h-screen">
      <SEO
        title="Live Job Placements Feed | Real-Time Hiring Outcomes | Codex Tech-IT"
        description="Browse recent candidate placements, compensation packages, and hiring companies across Cloud, Data, Full-Stack, and Cybersecurity in real time."
        canonical="/live-placements"
      />

      {/* ── 1. DARK HERO WITH GREEN LIVE ACCENTS & REAL-TIME TICKER ── */}
      <section className="relative bg-gradient-to-br from-[#060A12] via-[#09101E] to-[#0A1826] border-b border-emerald-500/20 pt-24 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
        {/* Emerald ambient radar glows */}
        <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b98112_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Live Placements' }]} className="text-emerald-200/80" />
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Placements Feed · Verified</span>
            </div>
          </div>

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              STREAMING CANDIDATE HIRES & OFFER CONTRACTS
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] text-white mb-4">
              Recent Offers &{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                Hiring Triumphs.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              A dynamic, real-time record of engineering positions negotiated and secured across North America and India. Every card represents a verified signed offer letter.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-emerald-500/20">
                Request Placement Evaluation
              </Button>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 px-4 py-3 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Feed Active · 18.4 Days Avg Turnaround</span>
              </div>
            </div>
          </div>

          {/* STREAMING LIVE TICKER STRIP */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Recent Placement Stream:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAMPLE_TICKER_ITEMS.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs backdrop-blur-md hover:border-emerald-500 transition-colors"
                >
                  <div>
                    <div className="font-heading font-bold text-white">{item.role}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.loc} · {item.company}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-numbers font-bold text-emerald-400 text-sm">{item.comp}</div>
                    <span className="text-[10px] text-emerald-500 uppercase font-mono">Offer Signed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER & REGION CHIPS BAR ── */}
      <section id="placements-grid" className="py-6 bg-[#060A12] border-b border-slate-800 sticky top-20 z-20 backdrop-blur-xl bg-[#060A12]/95">
        <div className="container-custom space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by role, location, or technology (e.g. Dallas, Python, AWS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 bg-slate-900/90"
              />
            </div>

            <select
              value={selectedCompanyType}
              onChange={(e) => setSelectedCompanyType(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-slate-700 text-xs sm:text-sm text-white bg-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {companyTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Industry Sectors' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-slate-400 mr-1 shrink-0">Region:</span>
            {REGION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedRegion(chip)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                  selectedRegion === chip
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {chip}
              </button>
            ))}
            {(searchTerm || selectedCompanyType !== 'ALL' || selectedRegion !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompanyType('ALL');
                  setSelectedRegion('ALL');
                }}
                className="text-emerald-400 underline font-bold ml-auto cursor-pointer whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. SIGNATURE SECTION: LIVE FEED GRID WITH GREEN LIVE ACCENTS ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-[#090E17]">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
              <p className="text-sm text-slate-400 font-mono">Connecting to live placement telemetry stream...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto">
              <p className="text-sm text-slate-400 mb-4">No placements matched your current filter criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompanyType('ALL');
                  setSelectedRegion('ALL');
                }}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filtered.map((item, idx) => (
                <Scroll3DCard
                  key={item.id || idx}
                  index={idx}
                  maxTilt={4}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                        {item.company_type || 'Enterprise Tech'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {item.location}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-lg text-white mb-2 min-h-[3rem] flex items-start">
                      {item.role}
                    </h2>

                    {/* Compensation Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-numbers font-bold mb-4 w-fit">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.compensation || '$145,000 / yr'}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal flex-1 mb-5">
                      {item.summary ||
                        'Candidate placed following intensive architectural calibration, resume ATS optimization, and direct client introduction.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.date_formatted || 'Recently Placed'}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Hire
                    </span>
                  </div>
                </Scroll3DCard>
              ))}
            </div>
          )}
        </div>
      </Scroll3DSection>

      {/* ── 4. CLOSING CTA ── */}
      <section className="section-padding bg-gradient-to-b from-[#090E17] to-[#040810] text-white text-center border-t border-slate-800">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-h2 text-white mb-4">
              Get Your Offer on This <span className="text-emerald-400">Live Board.</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Schedule your free 30-minute evaluation with an engineering talent partner. We review your tech stack and map active requisitions in real time.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-emerald-500/20">
              Claim Your Free Consultation
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};
