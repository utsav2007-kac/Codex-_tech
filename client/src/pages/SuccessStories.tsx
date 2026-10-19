import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Search, ArrowRight, Building, MapPin, Sparkles, Loader2, Award } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const SuccessStories: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/stories')
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
      s.name.toLowerCase().includes(term) ||
      s.role.toLowerCase().includes(term) ||
      s.company_type.toLowerCase().includes(term) ||
      s.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white">
      <SEO
        title="Candidate Placement Case Studies & Success Stories"
        description="Explore real candidate case studies: situations, technical approaches, and offer results across FinTech, HealthTech, Cloud DevOps, and Data Engineering."
        canonical="/success-stories"
      />

      {/* Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Success Stories' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Proven Placement Outcomes (SAMPLE)</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Engineering Career <span className="text-brand-gradient">Transformations.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-6">
              Examine detailed case studies illustrating how structured technical rebranding, intensive mock interviews, and direct employer advocacy turn application stagnation into signed offer letters.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by role, stack, or company type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
              />
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
              <p className="text-sm text-slate-500">Loading case studies from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No case studies match your search filter.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((story) => (
                <div
                  key={story.slug}
                  className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-orange-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-bold text-blue-600">{story.company_type}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {story.location}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-lg text-navy-900 mb-1 hover:text-orange-500 transition-colors">
                      <Link to={`/success-stories/${story.slug}`}>{story.name}</Link>
                    </h2>
                    <div className="text-xs font-semibold text-orange-600 mb-4">{story.role}</div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                      {story.situation}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/success-stories/${story.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-500 transition-colors"
                    >
                      <span>Read full case study</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    </Link>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Band */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Be Our Next <span className="text-brand-gradient">Placement Story.</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Book a free strategy session with our career director to evaluate your timeline and target offer.
          </p>
          <Button variant="primary" size="lg" onClick={onOpenConsultation}>
            Book Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};
