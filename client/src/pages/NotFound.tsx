import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase, Wrench, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { PageHero } from '../components/layout/PageHero';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="404 — Page Not Found | Codex Tech-IT"
        description="The page you are looking for has been moved or took a different career path."
        canonical="/404"
      />

      <PageHero
        breadcrumbs={[{ label: '404' }]}
        badge="Page Not Found · 404"
        title="This Page Took a Different Career Path."
        titleGradientWords={['Different Career Path.']}
        subtitle="The URL you navigated to might have been reorganized, renamed, or temporarily relocated. Use the quick links below to jump directly back to our active engineering hubs."
        primaryCta={{
          label: 'Return to Home',
          href: '/',
        }}
        secondaryCta={{
          label: 'Explore Services',
          href: '/services',
        }}
        facts={[
          { label: 'Status Code', value: '404 Error' },
          { label: 'Redirect Hubs', value: '4 Shortcuts' },
          { label: 'Core Platform', value: 'Operational' },
        ]}
        visual="not-found-lost"
      />

      {/* Helpful Shortcut Grid */}
      <section className="section-padding bg-slate-50/50 border-t border-gray-100">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading font-bold text-lg text-navy-900 mb-6 text-center">
            Where would you like to go next?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-orange-500/40 hover:shadow-md transition-all flex items-center gap-4 text-sm font-bold text-navy-900"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div>Home Page</div>
                <div className="text-xs text-slate-500 font-normal">Return to the main landing page</div>
              </div>
            </Link>

            <Link
              to="/services"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500/40 hover:shadow-md transition-all flex items-center gap-4 text-sm font-bold text-navy-900"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div>All Services</div>
                <div className="text-xs text-slate-500 font-normal">Job placement, staffing & IT training</div>
              </div>
            </Link>

            <Link
              to="/careers"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-orange-500/40 hover:shadow-md transition-all flex items-center gap-4 text-sm font-bold text-navy-900"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div>Careers Portal</div>
                <div className="text-xs text-slate-500 font-normal">Open roles & talent programs</div>
              </div>
            </Link>

            <Link
              to="/contact"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500/40 hover:shadow-md transition-all flex items-center gap-4 text-sm font-bold text-navy-900"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div>Contact Us</div>
                <div className="text-xs text-slate-500 font-normal">Speak with a technical recruiter</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
