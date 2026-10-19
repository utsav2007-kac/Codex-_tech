import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CheckSquare, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const JobMatchScore: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Email report state
  const [emailName, setEmailName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalyzing(true);
    setResult(null);

    try {
      if (resumeText.trim().length < 50) {
        throw new Error('Please enter at least 50 characters of resume content.');
      }
      if (jobDescription.trim().length < 50) {
        throw new Error('Please enter at least 50 characters of the job description.');
      }

      const res = await api.post('/tools/job-match', {
        resume_text: resumeText,
        job_description: jobDescription,
      });
      setResult(res.data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Match calculation failed. Please check inputs.');
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
        tool: 'MATCH',
        name: emailName || 'Candidate',
        email: reportEmail,
        score: result.matchPercentage,
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
        title="Job Match Score Calculator | Resume vs Job Description"
        description="Compare your technical resume against any target job description. See matched skills, missing keywords, and match percentage before applying."
        canonical="/tools/job-match-score"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Tools', path: '/tools' },
              { label: 'Job Match Score Calculator' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Skills Comparison Engine</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              Job Match <span className="text-brand-gradient">Score Calculator.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-4">
              Discover how closely your technical profile aligns with a specific job posting. Uncover missing keyword requirements before human recruiters or ATS parsers reject your submission.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Instant comparison · No account required · 100% confidential</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Inputs Form */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-xl mb-12">
            <form onSubmit={handleMatch} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Your Resume Content *
                  </label>
                  <textarea
                    rows={10}
                    required
                    placeholder="Paste your resume experience and skills here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Target Job Description *
                  </label>
                  <textarea
                    rows={10}
                    required
                    placeholder="Paste the target job description, requirements, and responsibilities here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 leading-relaxed"
                  />
                </div>
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
                    <span>Comparing Skills & Keywords...</span>
                  </>
                ) : (
                  <span>Calculate Job Match %</span>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="p-6 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-gray-200 gap-6">
                <div>
                  <h3 className="text-h2 text-navy-900">Job Description Alignment</h3>
                  <p className="text-xs text-slate-500">
                    {result.matchedCount} of {result.totalSkillsInJob} required technologies found in your resume
                  </p>
                </div>

                <div className="w-28 h-28 rounded-full border-8 border-gray-200 border-t-orange-500 border-r-blue-600 flex flex-col items-center justify-center shadow-md bg-white">
                  <span className="text-3xl font-numbers font-black text-navy-900">{result.matchPercentage}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Match</span>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-gray-200">
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h4 className="font-heading font-bold text-sm text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Matched Technologies ({result.matchedCount})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((s: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-green-50 text-green-800 text-xs font-semibold border border-green-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h4 className="font-heading font-bold text-sm text-red-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" /> Missing / Unmentioned Skills ({result.missingCount})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length > 0 ? (
                      result.missingSkills.map((s: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-red-50 text-red-800 text-xs font-semibold border border-red-200">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None! You covered all extracted keywords.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="font-heading font-bold text-base text-navy-900 mb-3">Targeted Application Tips</h4>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-700">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100">
                      <ArrowRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Report */}
              <div className="pt-6">
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-2">Email Me This Match Report</h4>
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

              {/* Related Service */}
              <div className="mt-8 p-6 rounded-2xl bg-orange-50 border border-orange-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900">Want Custom Job Application Campaigns?</h4>
                  <p className="text-xs text-slate-600">Let our team hand-pitch your profile directly to hiring directors.</p>
                </div>
                <Button variant="primary" size="sm" href="/services/custom-job-campaigns">
                  Explore Custom Campaigns
                </Button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * Disclaimer: Match score is computed based on extracted technology tokens and does not guarantee interview shortlisting.
          </p>
        </div>
      </section>
    </div>
  );
};
