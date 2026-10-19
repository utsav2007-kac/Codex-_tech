import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { TiltCard } from '../components/motion/TiltCard';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';

export const Services: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  return (
    <div className="bg-white">
      <SEO
        title="Technical Staffing, Recruitment & IT Training Services"
        description="Explore Codex Tech-IT full spectrum of specialized IT placement, corporate recruitment, IT training bootcamps, and candidate rebranding services."
        canonical="/services"
      />

      {/* Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Services' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Enterprise & Candidate Solutions</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Services Built to <span className="text-brand-gradient">Deliver Results.</span>
            </h1>
            <p className="text-body-lg text-slate-800 font-medium leading-relaxed">
              From targeted career representation and live engineering training to high-velocity corporate IT staffing and payroll compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of 9 Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.services.map((service, idx) => (
              <TiltCard
                key={service.slug}
                className="p-8 rounded-3xl glass-card border border-gray-100 flex flex-col justify-between hover:border-orange-500/40 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-numbers font-bold text-orange-500">0{idx + 1}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Codex Solution</span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-navy-900 mb-3 hover:text-orange-500 transition-colors">
                    <Link to={`/services/${service.slug}`}>{service.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-navy-900 hover:text-orange-500 transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  </Link>
                  <button
                    onClick={onOpenConsultation}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    Get started →
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Need a Custom <span className="text-brand-gradient">Hiring or Career Plan?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Whether you are hiring 10 developers or looking for your next career jump, our senior team is ready to assist.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={onOpenConsultation}>
              Book Free Career Consultation
            </Button>
            <Button variant="outline" size="lg" href="/employers" className="text-white border-white/20 hover:bg-white/10">
              For Employers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
