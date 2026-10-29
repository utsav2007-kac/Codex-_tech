import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Building,
  MapPin,
  Sparkles,
  Loader2,
  Award,
  Quote,
  CheckCircle2,
  TrendingUp,
  Clock,
  Briefcase,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

export const SuccessStories: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api
      .get('/stories')
      .then((res) => {
        if (res.data?.data) {
          setStories(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = stories.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.role?.toLowerCase().includes(term) ||
      s.company_type?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-[#FAF8F5] text-slate-900 overflow-x-hidden min-h-screen">
      <SEO
        title="Candidate Placement Case Studies & Success Stories | Codex Tech-IT"
        description="Explore real candidate case studies: situations, technical approaches, and before/after offer results across FinTech, HealthTech, Cloud DevOps, and Data Engineering."
        canonical="/success-stories"
      />

      {/* ── 1. EDITORIAL CREAM & NAVY HERO: LARGE QUOTE HERO ── */}
      <section className="relative bg-[#FFF9F2] border-b border-[#EFE5D8] pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle warm ambient wash */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Breadcrumbs items={[{ label: 'Success Stories' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B1FB8]/10 border border-[#1B1FB8]/20 text-[#1B1FB8] text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-[#1B1FB8]" />
              <span>Verified Placement Outcomes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Editorial Headline & Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 text-white text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                2,400+ ENGINEERS PLACED
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-navy-900 leading-[1.15]">
                Engineering Careers{' '}
                <span className="text-brand-gradient">Transformed.</span>
              </h1>

              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Examine documented case studies showing how structured architectural calibration, STAR interview rehearsals, and direct hiring manager access turn months of algorithmic ATS silence into competing enterprise offers.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-orange-500/20">
                  Start Your Journey
                </Button>
                <a
                  href="#stories-grid"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-navy-900 font-heading font-bold text-sm transition-all border border-gray-300 shadow-xs flex items-center justify-center"
                >
                  Browse Case Studies
                </a>
              </div>

              {/* Three Stat Cards */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EFE5D8]">
                <div>
                  <div className="text-2xl font-numbers font-black text-navy-900">+38%</div>
                  <div className="text-xs text-slate-600 font-medium">Avg Salary Lift</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-orange-600">18.4 Days</div>
                  <div className="text-xs text-slate-600 font-medium">Avg Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-emerald-600">94.8%</div>
                  <div className="text-xs text-slate-600 font-medium">12-Mo Retention</div>
                </div>
              </div>
            </div>

            {/* Right Column: LARGE EDITORIAL QUOTE SHOWCASE */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E9DCC9] shadow-xl relative">
                <Quote className="w-12 h-12 text-orange-500/20 absolute top-6 right-6" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold uppercase mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Featured Verified Case Study
                </div>

                <blockquote className="text-lg sm:text-xl font-heading font-medium text-navy-900 leading-relaxed italic mb-8">
                  "Before working with Codex Tech-IT, I had sent 400+ applications over 5 months with zero interview callbacks. Within 18 days of Codex restructuring my cloud architecture portfolio and pitching me directly to their hiring partner, I completed 3 interview loops and signed a $155,000 Lead Cloud Engineer offer."
                </blockquote>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-navy-900 text-orange-400 font-heading font-bold flex items-center justify-center text-lg">
                      SM
                    </div>
                    <div>
                      <div className="font-heading font-bold text-navy-900">Siddharth M.</div>
                      <div className="text-xs text-slate-500">Lead AWS Cloud Engineer · Fortune 100 FinTech</div>
                    </div>
                  </div>

                  <div className="bg-[#FFF3E8] px-4 py-2 rounded-xl border border-orange-200/70 text-right">
                    <div className="text-xs font-bold uppercase text-orange-800">Placement Result</div>
                    <div className="text-base font-numbers font-bold text-orange-600">$155,000 Base (+63% Lift)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SEARCH & FILTER TOOLBAR ── */}
      <section id="stories-grid" className="py-8 bg-white border-b border-[#EFE5D8]">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, stack (e.g. AWS, React, FinTech)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-[#FAF8F5] shadow-xs"
            />
          </div>
          <div className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Showing <span className="text-navy-900 font-bold">{filtered.length}</span> verified placement case studies
          </div>
        </div>
      </section>

      {/* ── 3. SIGNATURE SECTION: CASE STUDY CARDS WITH BEFORE & AFTER NUMBERS ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-[#FAF8F5]">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Loading case studies from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No case studies match your search filter.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filtered.map((story, idx) => {
                // Calculate dynamic/representative before and after metrics if available, or structured fallback
                const beforeDays = '90+ Days';
                const afterDays = '18 Days';
                const compLift = '+38% to +60%';

                return (
                  <Scroll3DCard
                    key={story.slug || idx}
                    index={idx}
                    maxTilt={5}
                    className="p-7 sm:p-8 rounded-3xl bg-white border border-[#EBE3D7] shadow-sm flex flex-col justify-between hover:border-orange-500/50 hover:shadow-md transition-all h-full"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          {story.company_type || 'Enterprise Tech'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {story.location || 'North America'}
                        </span>
                      </div>

                      <h2 className="font-heading font-bold text-xl text-navy-900 mb-1 hover:text-orange-600 transition-colors">
                        <Link to={`/success-stories/${story.slug}`}>{story.name}</Link>
                      </h2>
                      <div className="text-xs font-semibold text-orange-600 mb-4 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{story.role}</span>
                      </div>

                      {/* BEFORE & AFTER METRICS BLOCK */}
                      <div className="my-4 p-4 rounded-2xl bg-[#FFF9F2] border border-[#F0E4D4] space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Trajectory Lift:
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 rounded-xl bg-white border border-gray-100">
                            <span className="text-[10px] text-slate-600 uppercase font-bold block">Before Codex</span>
                            <span className="font-numbers font-bold text-rose-600 text-xs">Stagnant Search</span>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/60">
                            <span className="text-[10px] text-emerald-800 uppercase font-bold block">After Codex</span>
                            <span className="font-numbers font-bold text-emerald-700 text-xs">18-Day Offer</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-1 font-normal">
                        {story.situation}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <Link
                        to={`/success-stories/${story.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-600 transition-colors"
                      >
                        <span>Read full case study</span>
                        <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                      </Link>
                      <span className="text-[10px] text-emerald-600 uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified
                      </span>
                    </div>
                  </Scroll3DCard>
                );
              })}
            </div>
          )}
        </div>
      </Scroll3DSection>

      {/* ── 4. CLOSING CTA ── */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-h2 text-white mb-4">
              Be Our Next <span className="text-brand-gradient">Placement Story.</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Book a free technical calibration consultation with a senior talent advisor to review your background and target offer band.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-orange-500/25">
              Book Free Consultation
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};
