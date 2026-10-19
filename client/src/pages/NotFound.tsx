import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase, Wrench, PhoneCall, ArrowRight } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-16">
      <SEO
        title="404 — Page Not Found | Codex Tech-IT"
        description="The page you are looking for has been moved or took a different career path."
        canonical="/404"
      />

      <div className="container-custom max-w-xl text-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/10">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="text-6xl font-heading font-extrabold text-navy-900 mb-2">404</div>
        <h1 className="text-h2 text-navy-900 mb-4">
          This Page Took a <span className="text-brand-gradient">Different Career Path.</span>
        </h1>
        <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
          The URL you navigated to might have been reorganized, renamed, or temporarily relocated. Let's redirect you back to the right track:
        </p>

        {/* Helpful Shortcut Grid */}
        <div className="grid grid-cols-2 gap-3 text-left mb-8 max-w-md mx-auto">
          <Link
            to="/"
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-orange-500/40 transition-colors flex items-center gap-3 text-xs font-bold text-navy-900"
          >
            <Home className="w-4 h-4 text-orange-500" />
            <span>Home Page</span>
          </Link>
          <Link
            to="/services"
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-orange-500/40 transition-colors flex items-center gap-3 text-xs font-bold text-navy-900"
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>All Services</span>
          </Link>
          <Link
            to="/tools"
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-orange-500/40 transition-colors flex items-center gap-3 text-xs font-bold text-navy-900"
          >
            <Wrench className="w-4 h-4 text-purple-600" />
            <span>Career Tools</span>
          </Link>
          <Link
            to="/contact"
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-orange-500/40 transition-colors flex items-center gap-3 text-xs font-bold text-navy-900"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Contact Us</span>
          </Link>
        </div>

        <Link to="/">
          <Button variant="primary" size="md">
            Return to Codex Tech-IT
          </Button>
        </Link>
      </div>
    </div>
  );
};
