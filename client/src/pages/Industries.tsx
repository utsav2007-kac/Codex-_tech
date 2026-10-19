import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { TiltCard } from '../components/motion/TiltCard';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';

export const Industries: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  return (
    <div className="bg-white">
      <SEO
        title="Specialized IT Placement & Staffing by Industry Sector"
        description="Explore Codex Tech-IT tailored technical staffing across 7 vertical markets: Banking & Finance, Healthcare, Insurance, Retail, Telecom, Manufacturing, and Public Sector."
        canonical="/industries"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Industries' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Sector Expertise</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Industry-Focused <span className="text-brand-gradient">Technical Staffing.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Every vertical market has unique regulatory frameworks, security standards, and legacy architecture patterns. We deliver engineers calibrated for your specific sector demands.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.industries.map((ind, idx) => (
              <TiltCard
                key={ind.slug}
                className="p-8 rounded-3xl glass-card border border-gray-100 flex flex-col justify-between hover:border-orange-500/40 shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading font-bold text-xl text-navy-900 mb-3 hover:text-orange-500 transition-colors">
                    <Link to={`/industries/${ind.slug}`}>{ind.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    Specialized talent sourcing calibrated for {ind.title} compliance, low-latency architectures, and security mandates.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/industries/${ind.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-500 transition-colors"
                  >
                    <span>View sector insights</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Need Sector-Specific <span className="text-brand-gradient">Engineers?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Speak with an industry recruitment director who understands your exact technical and regulatory requirements.
          </p>
          <Button variant="primary" size="lg" href="/employers">
            Request Talent Shortlist <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};
