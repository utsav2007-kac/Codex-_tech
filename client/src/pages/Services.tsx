import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Zap, Users, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHero } from '../components/layout/PageHero';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
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

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Solutions Architecture Visual) ── */}
      <PageHero
        eyebrow="Enterprise & Candidate Solutions"
        title={
          <>
            Services Built to <span className="text-brand-gradient">Deliver Results.</span>
          </>
        }
        tagline="High-Velocity Placements, Production Bootcamps & Compliant Staffing"
        summary="From targeted career representation and live engineering training to high-velocity corporate IT staffing and payroll compliance."
        breadcrumbs={[{ label: 'Services' }]}
        primaryCta={{
          label: 'Book Free Consultation',
          onClick: onOpenConsultation,
        }}
        secondaryCta={{
          label: 'View Verified Results',
          href: '/success-stories',
        }}
        facts={[
          { icon: Zap, label: 'Average Timeline', value: '18 Days' },
          { icon: Users, label: 'Employer Partners', value: '180+' },
          { icon: ShieldCheck, label: 'Candidate Guarantee', value: '100% Free' },
        ]}
        visual="services-overview"
      />

      {/* Grid of 9 Services */}
      <Scroll3DSection preset="tilt" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {siteConfig.services.map((service, idx) => (
              <Scroll3DCard
                key={service.slug}
                index={idx}
                className="p-8 rounded-3xl glass-card border border-gray-100 flex flex-col justify-between hover:border-orange-500/40 shadow-sm"
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-numbers font-bold text-orange-500">0{idx + 1}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Codex Solution</span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-navy-900 mb-3 hover:text-orange-500 transition-colors min-h-[3.25rem] flex items-start">
                    <Link to={`/services/${service.slug}`}>{service.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6 flex-1">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
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
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Bottom CTA */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
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
              <Button variant="outline" size="lg" href="/careers" className="text-white border-white/20 hover:bg-white/10">
                Browse Careers
              </Button>
            </div>
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
