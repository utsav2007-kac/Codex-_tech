import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, Sparkles, PhoneCall, Calendar } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';

export const ThankYou: React.FC = () => {
  useEffect(() => {
    // E20 micro-animation: simple visual celebratory flare
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-16">
      <SEO
        title="Thank You | Codex Tech-IT"
        description="Your submission has been received by the Codex Tech-IT talent and recruitment directors."
        canonical="/thank-you"
      />

      <div className="container-custom max-w-2xl text-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="eyebrow text-emerald-600">Submission Confirmed</div>
        <h1 className="text-h1 text-navy-900 mb-4">
          You're One Step Closer to <span className="text-brand-gradient">Hiring or Landing Faster.</span>
        </h1>
        <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
          Thank you for trusting Codex Tech-IT. Your submission has been securely written to our placement database and dispatched to our senior talent partners.
        </p>

        {/* What Happens Next Card */}
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 text-left mb-8 shadow-sm">
          <h2 className="font-heading font-bold text-base text-navy-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            What Happens Next?
          </h2>
          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <p>
                <strong>Evaluation (Within 2 Business Hours):</strong> A dedicated technical recruiter reviews your requirements or profile against current market demand.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <p>
                <strong>Direct Outreach:</strong> We'll contact you via your preferred phone or email to confirm your consultation slot or candidate shortlist.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <p>
                <strong>Strategic Alignment:</strong> We finalize your resume positioning, mock interview roadmap, or talent requisition timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="md" className="gap-2">
              <Home className="w-4 h-4" /> Return to Home
            </Button>
          </Link>
          <Link to="/tools">
            <Button variant="outline" size="md" className="gap-2">
              Explore Career Tools <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
