import React, { useState, useEffect, useId } from 'react';
import { ChevronDown, Search, X, Sparkles, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

export interface FAQItem {
  id: number;
  category: 'Candidates' | 'Employers' | 'Process';
  question: string;
  answer: string;
}

export const SEEDED_FAQS: FAQItem[] = [
  // ── CANDIDATES ──
  {
    id: 1,
    category: 'Candidates',
    question: 'How quickly can Codex Tech-IT help me secure technical interviews?',
    answer: 'Most actively prepared engineers receive their first curated interview invitation within 10 to 21 business days after completing our profile positioning review and technical alignment walkthrough.',
  },
  {
    id: 2,
    category: 'Candidates',
    question: 'Do you only place senior engineers, or can juniors and career switchers apply?',
    answer: 'We support technical professionals across all experience levels—from recent computer science graduates and bootcamp alumni to senior enterprise architects and engineering directors.',
  },
  {
    id: 3,
    category: 'Candidates',
    question: 'What makes Codex Tech-IT different from mass-applying on public job boards?',
    answer: 'We never blast your resume blindly to job portals. Every application is tailored to your technical depth, backed by live mock coaching, and presented directly to hiring managers with approved open headcount.',
  },
  {
    id: 4,
    category: 'Candidates',
    question: 'Is my current employment kept confidential throughout the recruitment process?',
    answer: 'Absolutely. We uphold strict confidentiality protocols. We never share your resume, employer details, or contact information with any hiring team without your explicit prior authorization.',
  },

  // ── EMPLOYERS ──
  {
    id: 5,
    category: 'Employers',
    question: 'What hiring models do you provide for enterprise and startup teams?',
    answer: 'We offer flexible staffing solutions including contract staffing (W2/C2C), contract-to-hire (C2H), direct hire contingency placement, and dedicated embedded talent acquisition pods (RPO).',
  },
  {
    id: 6,
    category: 'Employers',
    question: 'How do you screen engineering talent before submitting candidate shortlists?',
    answer: 'Every candidate passes identity verification, a 45-minute live technical coding evaluation, hands-on architecture review, and communications assessments before your team reviews their profile.',
  },
  {
    id: 7,
    category: 'Employers',
    question: 'What is your typical turnaround time to deliver qualified candidate shortlists?',
    answer: 'We deliver a curated shortlist of 2 to 4 thoroughly pre-screened technical profiles within 48 to 72 hours of receiving your requisition requirements.',
  },
  {
    id: 8,
    category: 'Employers',
    question: 'Do you provide a replacement guarantee on direct hire placements?',
    answer: 'Yes, we provide standard 90-day replacement guarantees on direct hire placements to ensure mutual satisfaction and role stability.',
  },

  // ── PROCESS ──
  {
    id: 9,
    category: 'Process',
    question: 'Do job seekers pay any upfront fees for placement assistance?',
    answer: 'Standard recruitment placement services are 100% employer-funded. We never charge candidates for job matching, representation, or interview coordination with our client network.',
  },
  {
    id: 10,
    category: 'Process',
    question: 'Do you work with candidates requiring visa sponsorship (F-1 OPT, STEM, H-1B)?',
    answer: 'Yes, we work closely with verified E-Verified employers who regularly sponsor STEM OPT extensions, H-1B transfers, and employment-based immigration filings.',
  },
  {
    id: 11,
    category: 'Process',
    question: 'How is candidate resume data and personal privacy protected?',
    answer: 'All candidate data is stored using AES-256 encryption at rest and TLS 1.3 in transit. We strictly observe privacy guidelines and never monetize or sell personal contact information.',
  },
  {
    id: 12,
    category: 'Process',
    question: 'What steps are involved from initial consultation to final offer acceptance?',
    answer: 'The process involves: 1) Initial profile and career goals intake, 2) ATS keyword and resume positioning, 3) Technical mock interviews, 4) Direct employer submission, 5) Coached interview rounds, and 6) Offer negotiation and onboarding support.',
  },
];

export const HomeFAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(SEEDED_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Candidates' | 'Employers' | 'Process'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<number | null>(1); // First item open by default

  const searchInputId = useId();

  useEffect(() => {
    // Attempt live API fetch; fall back cleanly to SEEDED_FAQS if offline or empty
    let isMounted = true;
    api
      .get('/faqs')
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length >= 4) {
          // Map DB categories to Candidates, Employers, Process
          const mapped: FAQItem[] = res.data.data.map((f: any, idx: number) => {
            let cat: 'Candidates' | 'Employers' | 'Process' = 'Process';
            const rawCat = (f.category || '').toLowerCase();
            if (rawCat.includes('seeker') || rawCat.includes('candidate')) cat = 'Candidates';
            else if (rawCat.includes('employer')) cat = 'Employers';
            return {
              id: f.id || idx + 1,
              category: cat,
              question: f.question,
              answer: f.answer,
            };
          });
          setFaqs(mapped);
        }
      })
      .catch(() => {
        // Safe fallback already seeded
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: 'All', label: 'All Questions' },
    { key: 'Candidates', label: 'Candidates' },
    { key: 'Employers', label: 'Employers' },
    { key: 'Process', label: 'Process' },
  ] as const;

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  // Ensure first visible item is open when changing category or search if current open item is filtered out
  useEffect(() => {
    if (filteredFaqs.length > 0) {
      if (!openId || !filteredFaqs.some((f) => f.id === openId)) {
        setOpenId(filteredFaqs[0].id);
      }
    } else {
      setOpenId(null);
    }
  }, [selectedCategory, searchTerm, filteredFaqs.length]);

  // JSON-LD Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section
      data-nav-theme="light"
      id="faq-section"
      className="section-padding bg-white border-b border-[#E2E8F0] relative overflow-hidden"
    >
      {/* FAQPage JSON-LD Injected cleanly */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container-custom max-w-4xl">

      {/* ── UNIFORM SECTION HEADER (All Centred) ── */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="eyebrow justify-center mb-2.5">
          <HelpCircle className="w-3.5 h-3.5 text-orange-600 inline mr-1.5" />
          Got Questions?
        </div>
        <h2 className="text-h2 text-[#0F172A] mb-3">
          Frequently Asked <span className="text-brand-gradient">Questions</span>
        </h2>
        <p className="text-sm text-[#475569] leading-relaxed max-w-xl mx-auto">
          Straightforward answers on our placement turnaround, candidate advocacy, and enterprise hiring workflows.
        </p>
      </div>

      {/* ── CONTROLS: Category Tabs & Search Box ── */}
      <div className="max-w-3xl mx-auto mb-8 space-y-4">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                role="tab"
                id={`faq-tab-${cat.key}`}
                aria-selected={isActive}
                aria-controls="faq-list"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C2410C] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <label htmlFor={searchInputId} className="sr-only">
            Search questions
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id={searchInputId}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── ACCESSIBLE ACCORDION LIST ── */}
      <div
        id="faq-list"
        role="region"
        aria-live="polite"
        className="max-w-3xl mx-auto space-y-3"
      >
        {filteredFaqs.length === 0 ? (
          <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
            <p className="text-sm font-medium mb-2">No questions matched "{searchTerm}"</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
            >
              Reset filters to view all questions
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const buttonId = `faq-btn-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left font-heading font-semibold text-sm sm:text-base text-[#0F172A] flex items-center justify-between gap-4 hover:text-orange-600 transition-colors cursor-pointer select-none"
                >
                  <span className="flex-1">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </section>
  );
};
