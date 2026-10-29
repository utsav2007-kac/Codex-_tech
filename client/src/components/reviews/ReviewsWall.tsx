import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowRight, Quote, CheckCircle2, Star, Sparkles, Building2, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { qualityGovernor } from '../../motion/qualityGovernor';

export interface ReviewItem {
  id: number;
  name: string;
  role: string;
  placement?: string;
  quote: string;
  type?: 'candidate' | 'employer';
  highlightMetric?: string;
  is_sample?: boolean;
}

export const defaultReviews: ReviewItem[] = [
  {
    id: 1,
    name: 'Michael R.',
    role: 'Senior AWS DevOps Engineer',
    placement: 'Placed at CloudScale Systems',
    quote: 'Codex Tech-IT did not just find me a job—they completely revamped how I present my architectural experience. I landed an offer with a $35k jump in 3 weeks.',
    type: 'candidate',
    highlightMetric: '+$35k Salary Jump · 21 Days',
    is_sample: true,
  },
  {
    id: 2,
    name: 'Swetha K.',
    role: 'Full Stack Java Developer',
    placement: 'Placed at Apex Healthcare IT',
    quote: 'As an F1-OPT graduate, finding a genuine employer willing to sponsor was overwhelming. Codex connected me directly with an e-verified financial institution in under a month.',
    type: 'candidate',
    highlightMetric: 'Direct Client · E-Verified',
    is_sample: true,
  },
  {
    id: 3,
    name: 'Jason Miller',
    role: 'VP of Engineering',
    placement: 'CloudScale Systems Hiring Partner',
    quote: 'Most staffing firms spam us with 50 irrelevant resumes. Codex sent us 3 pre-screened candidates, and we hired 2 of them within 10 days. Outstanding quality.',
    type: 'employer',
    highlightMetric: '2 Hires in 10 Days · Partner',
    is_sample: true,
  },
  {
    id: 4,
    name: 'Anita Deshmukh',
    role: 'Lead Data Engineer',
    placement: 'Placed at Starlight Data Labs',
    quote: 'The PySpark and Snowflake positioning gave me the exact hands-on ammunition I needed for technical grilling rounds. Their interview coaching is gold.',
    type: 'candidate',
    highlightMetric: 'Data Architecture · Placed',
    is_sample: true,
  },
  {
    id: 5,
    name: 'Robert C.',
    role: 'Kubernetes Platform SRE',
    placement: 'Placed at SecureCore CyberTech',
    quote: 'The resume review tool gave me concrete fixes that immediately doubled my LinkedIn inbound recruiter messages. Direct hiring manager representation made the difference.',
    type: 'candidate',
    highlightMetric: 'Inbound Inquiries 2x · Placed',
    is_sample: true,
  },
  {
    id: 6,
    name: 'Tanya Gomez',
    role: 'QA Automation Engineer',
    placement: 'Placed at OmniLogistics Core',
    quote: 'Switching from manual testing felt daunting. Codex taught me Playwright, helped me build a live portfolio, and backed me through every technical defense round.',
    type: 'candidate',
    highlightMetric: 'Skill Transition · Placed',
    is_sample: true,
  },
  {
    id: 7,
    name: 'David L.',
    role: 'Cloud Infrastructure Director',
    placement: 'Placed at FinTech Global',
    quote: 'Their direct client representation helped me negotiate a compensation package 22% higher than my initial target. A true partner in senior tech placements.',
    type: 'candidate',
    highlightMetric: '+22% Offer Growth · Executive',
    is_sample: true,
  },
  {
    id: 8,
    name: 'Priya Patel',
    role: 'Enterprise Solutions Architect',
    placement: 'Placed at Nexus Capital Tech',
    quote: 'The system design coaching transformed how I tackle whiteboard architectural challenges. Placed within 18 business days of starting.',
    type: 'candidate',
    highlightMetric: '18 Days to Offer · Sample',
    is_sample: true,
  },
  {
    id: 9,
    name: 'Elena Rostova',
    role: 'Director of Talent Acquisition',
    placement: 'FinTech Global Client Partner',
    quote: 'We filled our mission-critical Kubernetes Lead position within two weeks. The candidates from Codex had already been vetted on real infrastructure scenarios.',
    type: 'employer',
    highlightMetric: '14 Days Time-to-Fill · Partner',
    is_sample: true,
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const ReviewsWall: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [activeTab, setActiveTab] = useState<'all' | 'candidate' | 'employer'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch live reviews if API available
  useEffect(() => {
    api
      .get('/testimonials')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setReviews(res.data.data);
        }
      })
      .catch(() => {
        // Retain defaultReviews
      });
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  // Safe index within filtered reviews
  const activeReview = filteredReviews[currentIndex % filteredReviews.length] || filteredReviews[0] || defaultReviews[0];

  // Auto-advance spotlight every 6s unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, filteredReviews.length]);

  return (
    <section
      data-nav-theme="light"
      id="reviews-section"
      aria-label="Candidate and Client Reviews"
      className="section-padding bg-[#F8FAFC] border-y border-[#E2E8F0] relative overflow-hidden"
    >
      <div className="container-custom">
        {/* ── TOP HEADER (LIGHT THEME) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="eyebrow flex items-center gap-1.5 text-[#C2410C] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Candidate & Client Outcomes</span>
            </div>
            <h2 className="text-h2 font-heading font-bold text-[#0F172A] tracking-tight leading-tight">
              Real Experiences. <br className="hidden sm:inline" />
              <span className="text-[#C2410C]">Real Offers.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#475569] max-w-md font-normal leading-relaxed">
              Real testimonials from software engineers and enterprise hiring leads placed across North American technology corridors.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#0F172A] text-[#FFFFFF] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('candidate');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'candidate'
                    ? 'bg-[#0F172A] text-[#FFFFFF] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                Engineers
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('employer');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'employer'
                    ? 'bg-[#0F172A] text-[#FFFFFF] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                Hiring Leads
              </button>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN SHOWCASE (SPOTLIGHT + CARDS GRID) ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: Featured Spotlight Card (Light Paper & Sky Accents) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#CBD5E1] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8F2FF] rounded-full filter blur-3xl pointer-events-none" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#E8F2FF] text-[#1D4ED8]">
                    <Quote className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-[#E8F2FF] px-2.5 py-0.5 rounded-md">
                    {activeReview.type === 'employer' ? 'Hiring Partner Spotlight' : 'Placed Engineer Spotlight'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8]">Sample</span>
              </div>

              {/* Main Quote */}
              <blockquote className="text-lg sm:text-xl font-heading font-semibold text-[#0F172A] leading-relaxed mb-6">
                "{activeReview.quote}"
              </blockquote>

              {/* Highlight Metric Pill */}
              {activeReview.highlightMetric && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F6EC] border border-[#BBF7D0] text-[#15803D] text-xs font-bold mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeReview.highlightMetric}</span>
                </div>
              )}
            </div>

            {/* Author Footer & Carousel Controls */}
            <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-[#FFFFFF] font-heading font-bold text-base flex items-center justify-center shadow-xs">
                  {getInitials(activeReview.name)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#0F172A]">
                    {activeReview.name}
                  </h4>
                  <p className="text-xs text-[#475569] font-medium">
                    {activeReview.role}
                  </p>
                  <p className="text-[11px] text-[#C2410C] font-semibold mt-0.5">
                    {activeReview.placement}
                  </p>
                </div>
              </div>

              {/* Next/Prev Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length)}
                  className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredReviews.length)}
                  className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Outcomes Card Grid (Clickable to switch spotlight) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredReviews.slice(0, 6).map((item, idx) => {
              const isSelected = item.id === activeReview.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/20 scale-[1.01]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] text-[#0F172A] font-bold text-xs flex items-center justify-center">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <h5 className="font-heading font-bold text-xs text-[#0F172A] line-clamp-1">
                            {item.name}
                          </h5>
                          <span className="text-[10px] text-[#64748B] line-clamp-1">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">
                        {item.type === 'employer' ? 'Client' : 'Candidate'}
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-3 mb-3">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                    <span className="text-[#C2410C] font-semibold line-clamp-1">
                      {item.placement}
                    </span>
                    <span className="text-[#2563EB] font-bold text-[10px] hover:underline">
                      View Story →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM CONTINUOUS MARQUEE STRIP (LIGHT MONOCHROME) ── */}
        <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-semibold text-[#0F172A]">High-Growth Technical Tracks:</span>
            <span className="text-[#64748B]">Cloud Architecture, Distributed Systems, Data Engineering, SRE</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
              <span>{isPaused ? 'Resume Rotation' : 'Pause Rotation'}</span>
            </button>
            <span className="font-mono text-[10px] text-[#94A3B8]">E-Verified Placements</span>
          </div>
        </div>
      </div>
    </section>
  );
};
