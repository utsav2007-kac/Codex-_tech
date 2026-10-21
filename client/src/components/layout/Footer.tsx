import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Linkedin, Twitter, Github, Youtube } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { api } from '../../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/subscribe', { email });
      setSubscribed(true);
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Subscription failed. Please check your email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800 relative z-10">
      <div className="container-custom">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-navy-800">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link to="/" className="inline-block w-56">
              <img src="/assets/logo-white.svg" alt="Codex Tech-IT" className="h-11 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-normal">
              Codex Tech-IT connects skilled IT professionals with the companies that need them, faster, fairer, and with far less hiring chaos.
            </p>
            <div className="flex items-center gap-3 mt-2 text-slate-300">
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="Codex LinkedIn" className="p-2 rounded-lg bg-navy-800 hover:text-white hover:bg-orange-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={siteConfig.socials.twitter} target="_blank" rel="noreferrer" aria-label="Codex Twitter" className="p-2 rounded-lg bg-navy-800 hover:text-white hover:bg-orange-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="Codex GitHub" className="p-2 rounded-lg bg-navy-800 hover:text-white hover:bg-orange-500 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer" aria-label="Codex YouTube" className="p-2 rounded-lg bg-navy-800 hover:text-white hover:bg-orange-500 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-navy-800/60 p-6 sm:p-8 rounded-2xl border border-navy-700/60">
            <h4 className="text-white font-heading font-bold text-lg mb-1">
              Hiring insights, in your inbox. No spam.
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 font-normal">
              Bi-weekly engineering salary benchmarks, ATS algorithm updates, and high-demand tech skill shifts.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold bg-green-950/40 border border-green-800/50 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>You're subscribed! Keep an eye on your inbox for our latest market report.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-navy-900 border border-navy-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
          </div>
        </div>

        {/* Middle Section: Sitemapped Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 text-sm">
          {/* Column 1: Services */}
          <div>
            <h5 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Services</h5>
            <ul className="flex flex-col gap-2 text-slate-300 font-normal">
              {siteConfig.services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-orange-500 transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline">
                  View all 9 services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Careers & Talent */}
          <div>
            <h5 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Careers & Talent</h5>
            <ul className="flex flex-col gap-2 text-slate-300 font-normal">
              <li>
                <Link to="/careers" className="hover:text-orange-500 transition-colors flex items-center gap-1.5">
                  <span>Browse All Open Roles</span>
                  <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded">Hot</span>
                </Link>
              </li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Cloud & Infrastructure</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Full-Stack & Backend</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Data & AI Engineering</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Candidate Benefits & Visa</Link></li>
              <li><Link to="/refer-earn" className="hover:text-orange-500 transition-colors">Refer & Earn Program</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Company</h5>
            <ul className="flex flex-col gap-2 text-slate-300 font-normal">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Codex</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Careers at Codex</Link></li>
              <li><Link to="/refer-earn" className="hover:text-orange-500 transition-colors">Refer & Earn</Link></li>
              <li><Link to="/success-stories" className="hover:text-orange-500 transition-colors">Success Stories</Link></li>
              <li><Link to="/live-placements" className="hover:text-orange-500 transition-colors">Live Placements</Link></li>
              <li><Link to="/plans" className="hover:text-orange-500 transition-colors">Career Plans</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h5 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Resources</h5>
            <ul className="flex flex-col gap-2 text-slate-300 font-normal">
              <li><Link to="/resources/salary-guide" className="hover:text-orange-500 transition-colors">IT Salary Guide 2026</Link></li>
              <li><Link to="/resources/resume-templates" className="hover:text-orange-500 transition-colors">ATS Resume Templates</Link></li>
              <li><Link to="/resources/interview-question-bank" className="hover:text-orange-500 transition-colors">Interview Question Bank</Link></li>
              <li><Link to="/resources/webinars" className="hover:text-orange-500 transition-colors">Webinars & Workshops</Link></li>
              <li><Link to="/insights" className="hover:text-orange-500 transition-colors">Industry Insights</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal & Admin */}
          <div>
            <h5 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Legal & Compliance</h5>
            <ul className="flex flex-col gap-2 text-slate-300 font-normal">
              <li><Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-orange-500 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-orange-500 transition-colors">Refund Policy</Link></li>
              <li><Link to="/accessibility-statement" className="hover:text-orange-500 transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/admin/login" className="text-xs text-slate-300 hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4 font-medium">
          <p>© {new Date().getFullYear()} Codex Tech-IT LLC. All rights reserved. E-Verified Employer.</p>
          <div className="flex items-center gap-6">
            <span>USA: {siteConfig.contact.phoneUSA}</span>
            <span>India: {siteConfig.contact.phoneIndia}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
