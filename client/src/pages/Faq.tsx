import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { PageHero } from '../components/layout/PageHero';

export const Faq: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openIds, setOpenIds] = useState<number[]>([]);

  useEffect(() => {
    api.get('/faqs')
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
      f.question.toLowerCase().includes(term) ||
      f.answer.toLowerCase().includes(term);
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
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Frequently Asked Questions (FAQ) | Codex Tech-IT"
        description="Comprehensive answers regarding Codex Tech-IT's recruitment models, placement guarantees, training programs, visa eligibility, and payment plans."
        canonical="/faq"
        schema={faqSchema}
      />

      {/* Header */}
      <PageHero
        breadcrumbs={[{ label: 'FAQ' }]}
        badge="Help Center & Knowledge Base"
        title="Frequently Asked Questions."
        titleGradientWords={['Questions.']}
        subtitle="Everything you need to know about our recruitment timelines, payment frameworks, visa sponsorship support, and training curricula."
        primaryCta={{
          label: 'Ask an Advisor',
          onClick: onOpenConsultation,
        }}
        secondaryCta={{
          label: 'Search Questions',
          href: '#faq-search-bar',
        }}
        facts={[
          { label: 'Documented Answers', value: `${faqs.length > 0 ? faqs.length : '30'}+` },
          { label: 'Avg Advisory Reply', value: '< 15 Mins' },
          { label: 'Clarity Guarantee', value: '100% Direct' },
        ]}
        visual="faq-helper"
      />

      {/* Search Toolbar */}
      <section id="faq-search-bar" className="py-6 bg-slate-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search any keyword (e.g. refund, H1B, resume, timeline)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs & FAQ Accordion */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-100">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  selectedCategory === c.key
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-gray-50 text-slate-600 hover:bg-gray-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Retrieving answers from knowledge base...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No questions matched your search criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                      isOpen
                        ? 'bg-gradient-to-r from-orange-50/25 via-white to-white border-orange-500/50 ring-1 ring-orange-500/20 shadow-md'
                        : 'bg-white border-gray-200/90 hover:border-orange-500/30 hover:shadow'
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
                        <h3 className="font-heading font-bold text-base sm:text-lg text-navy-900 leading-snug group-hover:text-orange-600 transition-colors">
                          {item.question}
                        </h3>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 ${
                          isOpen
                            ? 'rotate-180 bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 transition-transform" />
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
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-1 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-gray-100/80 whitespace-pre-line">
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

          {/* Need More Assistance */}
          <div className="mt-16 p-8 rounded-3xl bg-gray-50 border border-gray-200 text-center max-w-xl mx-auto">
            <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">Still have unanswered questions?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Our career directors and staffing specialists are available for live strategy consultations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" size="md" onClick={onOpenConsultation}>
                Book Free Consultation
              </Button>
              <Link to="/contact">
                <Button variant="outline" size="md">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
