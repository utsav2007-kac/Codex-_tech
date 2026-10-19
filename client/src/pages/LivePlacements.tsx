import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Building, DollarSign, Calendar, Search, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const LivePlacements: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('ALL');

  useEffect(() => {
    api.get('/live-placements')
      .then((res) => {
        if (res.data?.data) {
          setPlacements(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const companyTypes = ['ALL', ...Array.from(new Set(placements.map(p => p.company_type)))];

  const filtered = placements.filter((p) => {
    const matchesSearch =
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedCompanyType === 'ALL' || p.company_type === selectedCompanyType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white">
      <SEO
        title="Live Job Placements Feed | Codex Tech-IT"
        description="Browse recent candidate placements, compensation packages, and hiring companies across Cloud, Data, Full-Stack, and Cybersecurity."
        canonical="/live-placements"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Live Placements' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Real-Time Hiring Transparency (SAMPLE)</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Recent Offers & <span className="text-brand-gradient">Hiring Triumphs.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
              A dynamic record of recent engineering placements negotiated and secured through Codex Tech-IT's direct employer pipeline.
            </p>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by role, city, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
                />
              </div>

              <select
                value={selectedCompanyType}
                onChange={(e) => setSelectedCompanyType(e.target.value)}
                className="py-3 px-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
              >
                {companyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'ALL' ? 'All Industry Sectors' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Retrieving recent placement transactions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No placements matched your current filter criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCompanyType('ALL'); }}
                className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {item.company_type}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-lg text-navy-900 mb-2">
                      {item.role}
                    </h2>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                      <DollarSign className="w-3.5 h-3.5" />
                      {item.package_range}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Offer Verified (SAMPLE)
                    </span>
                    <span>Placed Recently</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Want to See Your Name on this <span className="text-brand-gradient">Placement Board?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Connect with our technical recruiters to benchmark your compensation and initiate your targeted placement campaign.
          </p>
          <Button variant="primary" size="lg" onClick={onOpenConsultation}>
            Start Your Placement Campaign
          </Button>
        </div>
      </section>
    </div>
  );
};
