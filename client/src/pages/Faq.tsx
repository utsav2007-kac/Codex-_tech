import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Loader2,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const Faq: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openIds, setOpenIds] = useState<number[]>([]);

  useEffect(() => {
    api
      .get('/faqs')
      .then((res) => {
        if (res.data?.data) {
          setFaqs(res.data.data);
          // open first 3 by default
          setOpenIds(res.data.data.slice(0, 3).map((f: any) => f.id));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { key: 'ALL', label: 'All Questions' },
    { key: 'JOB_SEEKERS', label: 'Job Seekers' },
    { key: 'EMPLOYERS', label: 'Employers' },
    { key: 'TRAINING', label: 'IT Training' },
    { key: 'FEES_PAYMENTS', label: 'Fees & Payments' },
    { key: 'VISAS_ELIGIBILITY', label: 'Visas & Work Status' },
    { key: 'DATA_PRIVACY', label: 'Data & Privacy' },
  ];

  const filtered = faqs.filter((f) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      f.question?.toLowerCase().includes(term) ||
      f.answer?.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Prepare FAQPage JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filtered.slice(0, 15).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden min-h-screen">
      <SEO
        title="Frequently Asked Questions (FAQ) | Codex Tech-IT"
        description="Comprehensive answers regarding Codex Tech-IT recruitment models, placement guarantees, training programs, visa eligibility, and payment frameworks."
        canonical="/faq"
        schema={faqSchema}
      />

      {/* ── 1. PROMINENT SEARCH HERO ── */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-gray-200/80 pt-24 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumbs & Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'FAQ' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-800 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-navy-900 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            HELP CENTER & KNOWLEDGE BASE
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-navy-900 leading-[1.15] mb-4">
            How Can We <span className="text-brand-gradient">Help You Today?</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto mb-8">
            Clear, transparent answers about our 18-day placement model, technical screening calibration, visa support, refund policies, and employer SLAs.
          </p>

          {/* SEARCH BAR EMBEDDED IN HERO */}
          <div className="relative max-w-2xl mx-auto shadow-lg rounded-2xl">
            <Search className="w-5 h-5 text-orange-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. refund, H-1B, resume, fees, timeline)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:border-orange-500 text-sm text-navy-900 placeholder-slate-400 focus:outline-none transition-colors bg-white shadow-xs"
            />
          </div>

          {/* Quick Query Tag Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-400 font-medium">Common searches:</span>
            {['18-Day SLA', 'Placement Fees', 'H-1B Visa Support', 'Refund Policy', 'IT Bootcamps'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 font-medium transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. SIGNATURE SECTION: CATEGORISED ACCORDION WITH STICKY PASTEL SIDEBAR ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Sticky Pastel Sidebar (Lavender #EEF0FF) (4 cols) */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 rounded-3xl bg-[#EEF0FF] border border-[#D9DCFF] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-4">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Question Categories</span>
                </div>

                <div className="space-y-1.5">
                  {categories.map((c) => {
                    const count =
                      c.key === 'ALL'
                        ? faqs.length
                        : faqs.filter((f) => f.category === c.key).length;
                    const isActive = selectedCategory === c.key;

                    return (
                      <button
                        key={c.key}
                        onClick={() => {
                          setSelectedCategory(c.key);
                          const el = document.getElementById('faq-results');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-navy-900 text-white shadow-sm'
                            : 'bg-white/80 text-navy-900 hover:bg-white hover:text-orange-600'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Support Panel in Sidebar */}
              <div className="p-6 rounded-3xl bg-navy-900 text-white shadow-xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase">
                  Direct Advisory Desk
                </div>
                <h3 className="font-heading font-bold text-base text-white">Have a specific question?</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Our talent directors in Plano, Texas, and Hyderabad are available 24/7 for confidential candidate or employer inquiries.
                </p>
                <div className="pt-2">
                  <Button variant="primary" size="sm" className="w-full justify-center" onClick={onOpenConsultation}>
                    Ask an Advisor Directly
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Accordion Results (8 cols) */}
            <div id="faq-results" className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100 text-xs font-semibold text-slate-500">
                <span>
                  Showing <strong className="text-navy-900">{filtered.length}</strong> questions in{' '}
                  <strong className="text-orange-600">
                    {categories.find((c) => c.key === selectedCategory)?.label}
                  </strong>
                </span>
                {(searchTerm || selectedCategory !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('ALL');
                    }}
                    className="text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
                  <p className="text-sm text-slate-500">Loading answers from knowledge base...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200">
                  <p className="text-sm text-slate-600 mb-4">No questions match your current search.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('ALL');
                    }}
                    className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
                  >
                    View All Questions
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((item) => {
                    const isOpen = openIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                          isOpen
                            ? 'bg-gradient-to-r from-orange-50/25 via-white to-white border-orange-500/50 ring-1 ring-orange-500/20 shadow-md'
                            : 'bg-white border-gray-200/90 hover:border-orange-500/30'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleAccordion(item.id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-page-${item.id}`}
                          id={`faq-header-page-${item.id}`}
                          className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group"
                        >
                          <div className="flex-1 min-w-0">
                            {item.category && (
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 transition-colors ${
                                  isOpen
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:bg-orange-50 group-hover:text-orange-600'
                                }`}
                              >
                                {item.category.replace('_', ' ')}
                              </span>
                            )}
                            <h2 className="font-heading font-bold text-base sm:text-lg text-navy-900 leading-snug group-hover:text-orange-600 transition-colors">
                              {item.question}
                            </h2>
                          </div>

                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 ${
                              isOpen
                                ? 'rotate-180 bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`faq-answer-page-${item.id}`}
                              role="region"
                              aria-labelledby={`faq-header-page-${item.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-gray-100/80 pt-4">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
