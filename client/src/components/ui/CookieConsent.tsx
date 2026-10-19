import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('codex_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('codex_cookie_consent', JSON.stringify({ necessary: true, analytics: true }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('codex_cookie_consent', JSON.stringify({ necessary: true, analytics: false }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Cookie Preferences" className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-slate-600 leading-relaxed">
          <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">We respect your privacy</h4>
          <p>
            We use functional cookies to guarantee platform stability and optional analytical cookies to optimize your job application experience.
          </p>
          <div className="mt-2">
            <Link to="/cookie-policy" className="text-blue-600 hover:underline">
              Read our full Cookie Policy
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2 text-xs font-semibold">
        <button
          onClick={handleAcceptNecessary}
          className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-gray-100 transition-colors"
        >
          Necessary Only
        </button>
        <button
          onClick={handleAcceptAll}
          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
};
