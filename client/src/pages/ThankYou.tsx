import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, Sparkles, PhoneCall, Calendar } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { PageHero } from '../components/layout/PageHero';

export const ThankYou: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Thank You | Codex Tech-IT"
        description="Your submission has been received by the Codex Tech-IT talent and recruitment directors."
        canonical="/thank-you"
      />

      <PageHero
        breadcrumbs={[{ label: 'Confirmation' }]}
        badge="Submission Confirmed"
        title="You're One Step Closer to Hiring or Landing Faster."
        titleGradientWords={['Hiring or Landing Faster.']}
        subtitle="Thank you for trusting Codex Tech-IT. Your submission has been securely written to our placement desk and assigned to our senior technical talent partners."
        primaryCta={{
          label: 'Return to Home',
          href: '/',
        }}
        secondaryCta={{
          label: 'Explore Open Roles',
          href: '/careers',
        }}
        facts={[
          { label: 'Outreach SLA', value: '< 2 Hours' },
          { label: 'Advisor Pairing', value: '1-on-1 Direct' },
          { label: 'Security', value: '256-bit SSL' },
        ]}
        visual="thank-you-celebration"
      />

      {/* What Happens Next Card Section */}
      <section className="section-padding bg-slate-50/50 border-t border-gray-100">
        <div className="container-custom max-w-4xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-200 text-left shadow-sm">
            <h2 className="font-heading font-bold text-xl text-navy-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              What Happens Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <h3 className="font-heading font-bold text-navy-900 text-base">Evaluation</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  A dedicated technical recruiter reviews your requirements or profile against current live enterprise requisitions within 2 business hours.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <h3 className="font-heading font-bold text-navy-900 text-base">Direct Outreach</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  We'll contact you via your preferred phone or email to confirm your consultation schedule or pre-calibrated candidate shortlists.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <h3 className="font-heading font-bold text-navy-900 text-base">Strategic Roadmap</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  We finalize your resume calibration, mock interview track, or staffing kickoff with strict adherence to our 18-day placement SLA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
