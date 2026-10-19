import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { api } from '../services/api';

export const Insights: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    api.get('/posts')
      .then((res) => {
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw : (raw?.items || []);
        setPosts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const safePosts = Array.isArray(posts) ? posts : [];
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
    <div className="bg-white">
      <SEO
        title="Technical Career Insights & Hiring Strategies | Codex Tech-IT"
        description="Deep-dive articles on ATS resume fixes, technical interview frameworks, contract vs direct hire dynamics, and tech talent acquisition."
        canonical="/insights"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Insights' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Expert Analysis & Guides</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Engineering Careers & <span className="text-brand-gradient">Hiring Intelligence.</span>
            </h1>
            <p className="text-body-lg text-slate-800 font-medium leading-relaxed mb-8">
              Practical, field-tested guidance on resume positioning, technical interview tactics, compliance standards, and tech staffing economics.
            </p>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, topic, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-3 px-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
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
      <section className="section-padding bg-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <article
                  key={post.slug}
                  className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_minutes} min read
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-xl text-navy-900 mb-3 hover:text-orange-500 transition-colors">
                      <Link to={`/insights/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
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
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
