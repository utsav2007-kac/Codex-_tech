import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ArrowRight,
  Quote,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { api } from '../../services/api';

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
    quote:
      'Codex Tech-IT did not just find me a job—they completely revamped how I present my architectural experience. I landed an offer with a $35k jump in 3 weeks.',
    type: 'candidate',
    highlightMetric: '+$35k Salary Jump · 21 Days',
    is_sample: true,
  },
  {
    id: 2,
    name: 'Swetha K.',
    role: 'Full Stack Java Developer',
    placement: 'Placed at Apex Healthcare IT',
    quote:
      'As an F1-OPT graduate, finding a genuine employer willing to sponsor was overwhelming. Codex connected me directly with an e-verified financial institution in under a month.',
    type: 'candidate',
    highlightMetric: 'Direct Client · E-Verified',
    is_sample: true,
  },
  {
    id: 3,
    name: 'Jason Miller',
    role: 'VP of Engineering',
    placement: 'CloudScale Systems Hiring Partner',
    quote:
      'Most staffing firms spam us with 50 irrelevant resumes. Codex sent us 3 pre-screened candidates, and we hired 2 of them within 10 days. Outstanding quality.',
    type: 'employer',
    highlightMetric: '2 Hires in 10 Days · Partner',
    is_sample: true,
  },
  {
    id: 4,
    name: 'Anita Deshmukh',
    role: 'Lead Data Engineer',
    placement: 'Placed at Starlight Data Labs',
    quote:
      'The PySpark and Snowflake positioning gave me the exact hands-on ammunition I needed for technical grilling rounds. Their interview coaching is gold.',
    type: 'candidate',
    highlightMetric: 'Data Architecture · Placed',
    is_sample: true,
  },
  {
    id: 5,
    name: 'Robert C.',
    role: 'Kubernetes Platform SRE',
    placement: 'Placed at SecureCore CyberTech',
    quote:
      'The resume review tool gave me concrete fixes that immediately doubled my LinkedIn inbound recruiter messages. Direct hiring manager representation made the difference.',
    type: 'candidate',
    highlightMetric: 'Inbound Inquiries 2x · Placed',
    is_sample: true,
  },
  {
    id: 6,
    name: 'Tanya Gomez',
    role: 'QA Automation Engineer',
    placement: 'Placed at OmniLogistics Core',
    quote:
      'Switching from manual testing felt daunting. Codex taught me Playwright, helped me build a live portfolio, and backed me through every technical defense round.',
    type: 'candidate',
    highlightMetric: 'Skill Transition · Placed',
    is_sample: true,
  },
  {
    id: 7,
    name: 'David L.',
    role: 'Cloud Infrastructure Director',
    placement: 'Placed at FinTech Global',
    quote:
      'Their direct client representation helped me negotiate a compensation package 22% higher than my initial target. A true partner in senior tech placements.',
    type: 'candidate',
    highlightMetric: '+22% Offer Growth · Executive',
    is_sample: true,
  },
  {
    id: 8,
    name: 'Priya Patel',
    role: 'Enterprise Solutions Architect',
    placement: 'Placed at Nexus Capital Tech',
    quote:
      'The system design coaching transformed how I tackle whiteboard architectural challenges. Placed within 18 business days of starting.',
    type: 'candidate',
    highlightMetric: '18 Days to Offer · Sample',
    is_sample: true,
  },
  {
    id: 9,
    name: 'Elena Rostova',
    role: 'Director of Talent Acquisition',
    placement: 'FinTech Global Client Partner',
    quote:
      'We filled our mission-critical Kubernetes Lead position within two weeks. The candidates from Codex had already been vetted on real infrastructure scenarios.',
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

  const pillsContainerRef = useRef<HTMLDivElement>(null);

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

  // Safe active review
  const activeReview =
    filteredReviews[currentIndex % filteredReviews.length] || filteredReviews[0] || defaultReviews[0];

  // Auto-advance spotlight every 5.0s with reveal animation unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, filteredReviews.length]);

  const isPillFirstMount = useRef(true);

  // Keep active pill centered in horizontal scroll container only (without scrolling the page/window)
  useEffect(() => {
    if (isPillFirstMount.current) {
      isPillFirstMount.current = false;
      return;
    }
    const container = pillsContainerRef.current;
    if (container) {
      const activeBtn = container.querySelector(
        `[data-pill-idx="${currentIndex % filteredReviews.length}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        const targetLeft =
          activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }
  }, [currentIndex, filteredReviews.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const handleSelectReview = (idx: number) => {
    setCurrentIndex(idx);
  };

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

        {/* ── 2-COLUMN SHOWCASE (LEFT: 1-BY-1 REVIEWS WITH SMOOTH REVEAL EFFECT) ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: Featured Spotlight Card with Reveal Wipe Animation */}
          <div className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-[#FFFFFF] border-2 border-[#2563EB]/40 shadow-xl relative overflow-hidden group">
            {/* Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#E8F2FF] to-[#DBEAFE] rounded-full filter blur-3xl pointer-events-none opacity-80" />

            {/* Smooth 5.0s Auto-Advance Progress Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F1F5F9] overflow-hidden">
              <div
                key={`progress-${activeReview.id}-${isPaused}`}
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#F15A24] to-[#16A34A] transition-all"
                style={{
                  animation: isPaused ? 'none' : 'reviewTimer 5s linear forwards',
                  width: isPaused ? '100%' : undefined,
                }}
              />
            </div>

            <div>
              {/* Header: Badge, Counter & Live Indicator */}
              <div className="flex items-center justify-between gap-3 mb-5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#E8F2FF] text-[#1D4ED8] shadow-xs">
                    <Quote className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-[#E8F2FF] px-2.5 py-0.5 rounded-md">
                    {activeReview.type === 'employer' ? 'Hiring Partner Spotlight' : 'Placed Candidate Spotlight'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-[#E8F2FF] px-2.5 py-0.5 rounded-md">
                    Review {(currentIndex % filteredReviews.length) + 1} of {filteredReviews.length}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Auto-Reveal 1 by 1" />
                </div>
              </div>

              {/* "ALL REVIEWS 1 BY 1" TICKER: CLICKABLE PILLS FOR INSTANT REVEAL */}
              <div className="mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                    <Sparkle className="w-3 h-3 text-[#F15A24]" />
                    <span>All Reviews (Showing 1 by 1):</span>
                  </span>
                  <span className="text-[10px] text-[#2563EB] font-semibold">
                    Click to reveal any
                  </span>
                </div>

                <div
                  ref={pillsContainerRef}
                  className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth"
                >
                  {filteredReviews.map((r, idx) => {
                    const isSelected = idx === currentIndex % filteredReviews.length;
                    return (
                      <button
                        key={`pill-${r.id}`}
                        data-pill-idx={idx}
                        type="button"
                        onClick={() => handleSelectReview(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          isSelected
                            ? 'bg-[#1D4ED8] text-white shadow-md ring-2 ring-[#2563EB]/40 scale-105'
                            : 'bg-[#F1F5F9] text-slate-600 hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                        }`}
                        title={`${r.name} - ${r.role}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-amber-300 animate-ping' : 'bg-slate-400'
                          }`}
                        />
                        <span>{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── THE HERO REVEAL EFFECT CONTAINER ── */}
              {/* Uses CSS clip-path mask + vertical reveal line sweep for smooth reveal */}
              <div
                key={`reveal-container-${activeReview.id}`}
                className="review-reveal-stage relative"
              >
                {/* Visual Reveal Shimmer Beam that sweeps across as text appears */}
                <div className="reveal-shimmer-beam pointer-events-none" />

                {/* Main Quote with Mask Reveal */}
                <blockquote className="reveal-quote-text text-base sm:text-lg font-heading font-semibold text-[#0F172A] leading-relaxed mb-5 min-h-[96px]">
                  "{activeReview.quote}"
                </blockquote>

                {/* Highlight Metric Pill with Slide-Up Reveal */}
                {activeReview.highlightMetric && (
                  <div className="reveal-metric-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F6EC] border border-[#BBF7D0] text-[#15803D] text-xs font-bold mb-5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{activeReview.highlightMetric}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Author Footer with Staggered Reveal */}
            <div className="pt-5 border-t border-[#E2E8F0] flex items-center justify-between">
              <div
                key={`author-reveal-${activeReview.id}`}
                className="reveal-author-block flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-[#FFFFFF] font-heading font-bold text-base flex items-center justify-center shadow-sm">
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

              {/* Next/Prev Navigation Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous review"
                  title="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Next review"
                  title="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Outcomes Card Grid (Synchronized with 1-by-1 selection) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredReviews.slice(0, 6).map((item, idx) => {
              const isSelected = item.id === activeReview.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectReview(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#2563EB] shadow-lg ring-2 ring-[#2563EB]/30 scale-[1.015]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-[#F1F5F9] text-[#0F172A]'
                          }`}
                        >
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
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          isSelected
                            ? 'bg-[#E8F2FF] text-[#1D4ED8]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
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
                    <span className="text-[#2563EB] font-bold text-[10px] hover:underline flex items-center gap-1">
                      <span>View Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HIGH-END REVEAL EFFECT KEYFRAMES ── */}
      <style>{`
        @keyframes reviewTimer {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* 1. Quote Text Mask Wipe Reveal Effect */
        @keyframes quoteRevealWipe {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
            transform: translateY(12px) scale(0.98);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            filter: blur(1px);
          }
          100% {
            clip-path: inset(0 0% 0 0);
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* 2. Shimmer Reveal Beam Sweep */
        @keyframes shimmerBeamSweep {
          0% {
            left: 0%;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* 3. Metric Badge Pop Reveal */
        @keyframes badgePopReveal {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* 4. Author Dossier Slide Reveal */
        @keyframes authorSlideReveal {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal-quote-text {
          animation: quoteRevealWipe 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: clip-path, transform, opacity;
        }

        .reveal-shimmer-beam {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, transparent, #F15A24, #2563EB, transparent);
          box-shadow: 0 0 12px #F15A24;
          animation: shimmerBeamSweep 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .reveal-metric-badge {
          animation: badgePopReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .reveal-author-block {
          animation: authorSlideReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
        }
      `}</style>
    </section>
  );
};
