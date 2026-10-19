import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Linkedin, Sparkles, CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const LinkedInAnalyzer: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Email report state
  const [emailName, setEmailName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await api.post('/tools/linkedin-analyzer', {
        headline,
        about,
        skills,
        target_role: targetRole,
      });
      setResult(res.data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please verify your fields.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportEmail || !result) return;
    setEmailing(true);
    try {
      await api.post('/tools/email-report', {
        tool: 'LINKEDIN',
        name: emailName || 'Candidate',
        email: reportEmail,
        score: result.score,
        report_json: result,
      });
      setEmailSent(true);
    } catch (err) {
      // ignore
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div className="bg-white">
      <SEO
        title="LinkedIn Profile Analyzer | Recruiter Visibility Optimization"
        description="Benchmark your LinkedIn headline, About narrative, and skills coverage against senior technical recruiter search patterns."
        canonical="/tools/linkedin-profile-analyzer"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Tools', path: '/tools' },
              { label: 'LinkedIn Profile Analyzer' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Recruiter Inbound Optimizer</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              LinkedIn Profile <span className="text-brand-gradient">Analyzer.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-4">
              Most technical profiles fail to rank in LinkedIn Recruiter searches because their headlines and About summaries lack structural value triggers. Analyze your profile below.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Instant evaluation · No login required · 100% confidential</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Form */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-xl mb-12">
            <form onSubmit={handleAnalyze} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Target Engineering Specialization *
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Software Architect">Software Architect</option>
                  <option value="QA Automation Engineer">QA Automation Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Current LinkedIn Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer at TechCorp | React, TypeScript, Node.js | Building Scalable Cloud Apps"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Character Count: {headline.length} / 220</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  LinkedIn 'About' Section Narrative *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste your current About text here..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Top Skills Listed on Profile (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, TypeScript, Node.js, AWS, Docker, GraphQL, PostgreSQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={analyzing}
                className="w-full sm:w-auto self-start bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm px-8 py-3.5 rounded-xl shadow-elevated transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing LinkedIn Profile...</span>
                  </>
                ) : (
                  <span>Audit LinkedIn Profile Free</span>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="p-6 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-gray-200 gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Target Role: {targetRole}</span>
                  <h3 className="text-h2 text-navy-900 mt-1">LinkedIn Diagnostic Score</h3>
                  <p className="text-xs text-slate-500">Recruiter search indexing strength</p>
                </div>

                <div className="w-28 h-28 rounded-full border-8 border-gray-200 border-t-orange-500 border-r-blue-600 flex flex-col items-center justify-center shadow-md bg-white">
                  <span className="text-3xl font-numbers font-black text-navy-900">{result.score}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Sub Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-b border-gray-200 text-xs">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Headline Impact</span>
                  <span className="text-base font-numbers font-bold text-navy-900">{result.headlineScore} / 30 pts</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">About Narrative & CTA</span>
                  <span className="text-base font-numbers font-bold text-navy-900">{result.aboutScore} / 40 pts</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Skills Search Density</span>
                  <span className="text-base font-numbers font-bold text-navy-900">{result.skillsScore} / 30 pts</span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="font-heading font-bold text-base text-navy-900 mb-3">Recruiter Optimization Recommendations</h4>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-700">
                  {result.suggestions.map((sug: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100">
                      <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Report */}
              <div className="pt-6">
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-2">Email Me This Audit</h4>
                {emailSent ? (
                  <div className="p-4 rounded-xl bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Report sent to {reportEmail}!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendReport} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <button
                      type="submit"
                      disabled={emailing}
                      className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {emailing ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                )}
              </div>

              {/* Service Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-orange-50 border border-orange-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900">Want an Executive LinkedIn Rewrite?</h4>
                  <p className="text-xs text-slate-600">Let our career strategists overhaul your profile for top recruiter rankings.</p>
                </div>
                <Button variant="primary" size="sm" href="/services/resume-linkedin-rebranding">
                  Explore Rebranding
                </Button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * Disclaimer: This tool provides automated guidance based on publicly recognized technical search patterns. It does not represent an endorsement from or affiliation with LinkedIn Corporation.
          </p>
        </div>
      </section>
    </div>
  );
};
