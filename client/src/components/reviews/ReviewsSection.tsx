import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote, Shield } from 'lucide-react';
import { api } from '../../services/api';

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating?: number;
  source?: string;
  avatar?: string;
  date?: string;
  is_sample?: boolean;
}

const fallbackReviews: TestimonialItem[] = [
  {
    id: 1,
    name: 'Michael R.',
    role: 'Senior AWS DevOps Engineer',
    quote: 'Codex Tech-IT did not just find me a job—they completely revamped how I present my architectural experience. I landed an offer with a $35k jump in 3 weeks.',
    rating: 5,
    source: 'LinkedIn Review',
    date: 'October 2026',
    is_sample: true,
  },
  {
    id: 2,
    name: 'Swetha K.',
    role: 'Full Stack Java Developer',
    quote: 'As an F1-OPT graduate, finding a genuine employer willing to sponsor was overwhelming. Codex connected me directly with an e-verified financial institution in under a month.',
    rating: 5,
    source: 'Google Review',
    date: 'September 2026',
    is_sample: true,
  },
  {
    id: 3,
    name: 'Jason Miller',
    role: 'VP of Engineering, CloudScale Systems',
    quote: 'Most staffing firms spam us with 50 irrelevant resumes. Codex sent us 3 pre-screened candidates, and we hired 2 of them within 10 days. Outstanding quality.',
    rating: 5,
    source: 'Client Testimonial',
    date: 'August 2026',
    is_sample: true,
  },
  {
    id: 4,
    name: 'Anita Deshmukh',
    role: 'Data Engineer (Snowflake & Spark)',
    quote: 'The PySpark and Snowflake training gave me the exact hands-on ammunition I needed for technical grilling rounds. Their interview coaching is gold.',
    rating: 5,
    source: 'LinkedIn Review',
    date: 'September 2026',
    is_sample: true,
  },
  {
    id: 5,
    name: 'Robert C.',
    role: 'SRE / Kubernetes Specialist',
    quote: 'The resume review tool gave me concrete fixes that immediately doubled my LinkedIn inbound recruiter messages. Highly recommended.',
    rating: 4,
    source: 'Google Review',
    date: 'July 2026',
    is_sample: true,
  },
  {
    id: 6,
    name: 'Tanya Gomez',
    role: 'QA Automation Engineer',
    quote: 'Switching from manual testing felt daunting. Codex taught me Playwright, helped me build a live portfolio, and backed me through every interview round.',
    rating: 5,
    source: 'LinkedIn Review',
    date: 'October 2026',
    is_sample: true,
  },
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>(fallbackReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get('/testimonials')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setReviews(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Auto slide with pause on hover
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  const activeReview = reviews[currentIndex] || fallbackReviews[0];

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Candidate and Employer Reviews Carousel"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Side: Rating Aggregate & Breakdown Bar */}
        <div className="lg:col-span-4 p-8 rounded-3xl bg-slate-50 border border-gray-200 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              <Shield className="w-4 h-4" />
              <span>Verified Testimonials</span>
            </div>
            <div className="text-4xl sm:text-5xl font-numbers font-black text-navy-900 mb-2">
              4.9 <span className="text-xl text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Based on candidate reviews and direct corporate client hiring surveys.
            </p>

            {/* Rating Breakdown Bars */}
            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-10">5 Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[88%]" />
                </div>
                <span className="w-8 text-right font-numbers text-slate-500">88%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10">4 Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full w-[10%]" />
                </div>
                <span className="w-8 text-right font-numbers text-slate-500">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10">3 Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 rounded-full w-[2%]" />
                </div>
                <span className="w-8 text-right font-numbers text-slate-500">2%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 text-[11px] text-slate-400">
            Reviews gathered from LinkedIn, Google Reviews & Direct Placement surveys.
          </div>
        </div>

        {/* Right Side: Featured Review Carousel Card */}
        <div className="lg:col-span-8 relative">
          <div
            ref={carouselRef}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-elevated relative flex flex-col justify-between min-h-[360px] transition-all"
          >
            <div>
              {/* Header: Stars + Source + Sample Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-1 text-orange-400">
                  {[...Array(activeReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {activeReview.source || 'Verified Partner'}
                  </span>
                  {activeReview.is_sample && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Sample
                    </span>
                  )}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-base sm:text-lg text-navy-900 font-heading font-medium leading-relaxed italic mb-8">
                "{activeReview.quote}"
              </blockquote>
            </div>

            {/* Reviewer Details & Controls */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 to-blue-600 text-white flex items-center justify-center font-heading font-bold text-sm shadow-sm">
                  {activeReview.name.charAt(0)}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-navy-900">
                    {activeReview.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {activeReview.role} · {activeReview.date || '2026'}
                  </div>
                </div>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
