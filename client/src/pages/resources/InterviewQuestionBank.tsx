import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, HelpCircle, Sparkles, Filter, Loader2, BookOpen } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { PageHero } from '../../components/layout/PageHero';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const InterviewQuestionBank: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [openIds, setOpenIds] = useState<number[]>([]);

  useEffect(() => {
    api.get('/interview-questions')
      .then((res) => {
        if (res.data?.data) {
          setQuestions(res.data.data);
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

  const tracks = ['ALL', ...Array.from(new Set(questions.map((q) => q.role_track)))];
  const levels = ['ALL', 'ENTRY', 'MID', 'SENIOR', 'LEAD'];

  const filtered = questions.filter((q) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      q.question.toLowerCase().includes(term) ||
      q.answer.toLowerCase().includes(term) ||
      q.role_track.toLowerCase().includes(term);
    const matchesTrack = selectedTrack === 'ALL' || q.role_track === selectedTrack;
    const matchesLevel = selectedLevel === 'ALL' || q.level.toUpperCase() === selectedLevel;
    return matchesSearch && matchesTrack && matchesLevel;
  });

  return (
    <div className="bg-white">
      <SEO
        title="Technical & Behavioral Interview Question Bank | Codex Tech-IT"
        description="Master 200+ vetted technical interview questions across Java, Python, AWS Cloud, DevOps, and Data Engineering with comprehensive answer outlines."
        canonical="/resources/interview-question-bank"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Question Deck Visual) ── */}
      <PageHero
        eyebrow="Technical Interview Preparation"
        title={
          <>
            Engineering <span className="text-brand-gradient">Interview Question Bank.</span>
          </>
        }
        tagline="Real Questions & Model Answers Across Top Tech Stacks"
        summary="Real questions asked during recent technical rounds at Fortune 500 enterprises, tech unicorns, and healthcare systems. Filter by track, level, or keyword."
        breadcrumbs={[
          { label: 'Resources', path: '/resources' },
          { label: 'Interview Question Bank' },
        ]}
        primaryCta={{
          label: 'Explore 500+ Questions',
          onClick: () => {
            const el = document.getElementById('questions-bank');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Schedule Live Mock Interview',
          onClick: onOpenConsultation,
        }}
        facts={[
          { icon: HelpCircle, label: 'Questions Curated', value: '500+ Q&As' },
          { icon: Sparkles, label: 'Role Tracks', value: '12 Disciplines' },
          { icon: BookOpen, label: 'Access', value: '100% Free' },
        ]}
        visual="resource-interview-question-bank"
      />

      {/* Filter Controls Toolbar */}
      <section id="questions-bank" className="py-8 bg-slate-50/70 border-b border-slate-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions by topic, keyword, or framework..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-xs"
              />
            </div>

            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-xs"
            >
              {tracks.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Role Tracks' : t}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-xs"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l === 'ALL' ? 'All Seniority Levels' : l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Loading interview repository from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No questions match your current search and filter settings.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedTrack('ALL'); setSelectedLevel('ALL'); }}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2 font-medium">
                Showing {filtered.length} interview questions
              </div>
              {filtered.map((item) => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {item.role_track}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase">
                            {item.level}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-base text-navy-900 leading-snug">
                          {item.question}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/40">
                        <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Need 1-on-1 <span className="text-brand-gradient">Mock Interview Coaching?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Practice technical coding rounds and STAR behavioral stories live with our veteran engineering mentors.
          </p>
          <Button variant="primary" size="lg" onClick={onOpenConsultation}>
            Schedule Mock Interview
          </Button>
        </div>
      </section>
    </div>
  );
};
