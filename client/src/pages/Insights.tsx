import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Search, Clock, Calendar, User, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { FALLBACK_INSIGHTS, type InsightPost } from '../data/insightsData';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { PageHero } from '../components/layout/PageHero';

export const Insights: React.FC = () => {
  const navigate = useNavigate();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [posts, setPosts] = useState<InsightPost[]>(FALLBACK_INSIGHTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    api.get('/posts')
      .then((res) => {
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw : (raw?.items || []);
        if (list.length > 0) {
          setPosts(list);
        }
      })
      .catch(() => {
        // Retain FALLBACK_INSIGHTS
      });
  }, []);

  const safePosts = Array.isArray(posts) && posts.length > 0 ? posts : FALLBACK_INSIGHTS;
  const categories = ['ALL', ...Array.from(new Set(safePosts.map((p) => p.category).filter(Boolean)))];

  const filtered = safePosts.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.title || '').toLowerCase().includes(term) ||
      (p.excerpt || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term);
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Technical Career Insights & Hiring Strategies | Codex Tech-IT"
        description="Deep-dive articles on ATS resume fixes, technical interview frameworks, contract vs direct hire dynamics, and tech talent acquisition."
        canonical="/insights"
      />

      <PageHero
        breadcrumbs={[{ label: 'Insights' }]}
        badge="Market Intelligence & Research"
        title="Engineering Careers & Hiring Intelligence."
        titleGradientWords={['Hiring Intelligence.']}
        subtitle="Practical, field-tested guidance on resume positioning, technical interview tactics, compliance standards, and tech staffing economics from the Codex engineering desk."
        primaryCta={{
          label: 'Request Strategy Session',
          onClick: onOpenConsultation,
        }}
        secondaryCta={{
          label: 'Explore Latest Articles',
          href: '#articles-section',
          onClick: () => {
            const el = document.getElementById('articles-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        facts={[
          { label: 'Intelligence Reports', value: `${safePosts.length}+` },
          { label: 'Quarterly Radar', value: 'Q4 2026' },
          { label: 'Weekly Cadence', value: 'Fresh Data' },
        ]}
        visual="insights-radar"
      />

      {/* Filter Bar Toolbar */}
      <section id="articles-section" className="py-6 bg-slate-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Topic Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Loading articles from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No articles match your current search.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filtered.map((post, idx) => (
                <Scroll3DCard
                  key={post.slug}
                  index={idx}
                  maxTilt={6}
                  onClick={() => navigate(`/insights/${post.slug}`)}
                  className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/40 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_minutes} min read
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-xl text-navy-900 mb-3 hover:text-orange-500 transition-colors min-h-[3.25rem] flex items-start">
                      <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="text-[11px] text-slate-600 font-medium">
                      <span>By {post.author_name}</span>
                    </div>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-500 transition-colors"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    </Link>
                  </div>
                </Scroll3DCard>
              ))}
            </div>
          )}
        </div>
      </Scroll3DSection>

      {/* Bottom CTA */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-h2 text-white mb-4">
              Looking for Tailored <span className="text-brand-gradient">Career Guidance?</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8">
              Schedule a 1-on-1 strategy call with our talent directors to discuss ATS positioning, compensation benchmarks, and direct employer representation.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation}>
              Book Free Strategy Consultation
            </Button>
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
