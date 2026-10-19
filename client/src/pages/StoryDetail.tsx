import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, CheckCircle2, Award, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [story, setStory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/stories/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          setStory(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="section-padding text-center container-custom">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Case Study Not Found</h1>
        <p className="text-slate-500 mb-6">The requested candidate case study could not be located in our records.</p>
        <Link to="/success-stories" className="text-orange-500 font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Case Studies
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${story.name} — ${story.role} Case Study | Codex Tech-IT`}
        description={`Read how ${story.name} transitioned into a ${story.role} role at a ${story.company_type} in ${story.location} using Codex Tech-IT's career campaign.`}
        canonical={`/success-stories/${story.slug}`}
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Success Stories', href: '/success-stories' },
              { label: story.name },
            ]}
          />

          <div className="max-w-4xl mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-4">
              <Award className="w-3.5 h-3.5" />
              Verified Placement Case Study (SAMPLE)
            </div>

            <h1 className="text-h1 text-navy-900 mb-4">
              How {story.name} Secured a <span className="text-brand-gradient">{story.role}</span> Role.
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                {story.company_type}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {story.location}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Offer Signed & Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl">
            {/* Main Narrative */}
            <div className="lg:col-span-2 space-y-10">
              {/* Situation */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200/80">
                <div className="eyebrow">Phase 1: Initial Assessment</div>
                <h2 className="text-h3 text-navy-900 mb-4">The Baseline Challenge</h2>
                <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line space-y-4">
                  {story.situation}
                </div>
              </div>

              {/* Approach */}
              <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100">
                <div className="eyebrow text-blue-600">Phase 2: Strategy & Execution</div>
                <h2 className="text-h3 text-navy-900 mb-4">Technical Rebranding & Prep</h2>
                <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line space-y-4">
                  {story.approach}
                </div>
              </div>

              {/* Results */}
              <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                <div className="eyebrow text-emerald-600">Phase 3: The Result</div>
                <h2 className="text-h3 text-navy-900 mb-4">Offer Letter & Compensation</h2>
                <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line space-y-4">
                  {story.results}
                </div>
              </div>
            </div>

            {/* Sidebar Details & CTA */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-navy-900 text-white shadow-xl">
                <h3 className="font-heading font-bold text-lg mb-2">Ready to replicate this result?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Our talent directors evaluate your technical resume, visa timeline, and target companies during a 30-minute private strategy session.
                </p>
                <Button variant="primary" size="md" className="w-full justify-center" onClick={onOpenConsultation}>
                  Book Free Consultation
                </Button>
              </div>

              <div className="p-6 rounded-3xl border border-gray-200 bg-white">
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-4">Placement Quick Facts</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-400">Target Role</span>
                    <span className="font-bold text-navy-900">{story.role}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-400">Sector</span>
                    <span className="font-bold text-navy-900">{story.company_type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-400">Location</span>
                    <span className="font-bold text-navy-900">{story.location}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Placement Status</span>
                    <span className="font-bold text-emerald-600">Active Employment</span>
                  </div>
                </div>
              </div>

              <Link
                to="/success-stories"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors p-2"
              >
                <ArrowLeft className="w-4 h-4" /> All Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
