import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const ResumeAnalyzer: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('paste');
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');

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
      if (inputMode === 'upload') {
        if (!selectedFile) {
          throw new Error('Please select a PDF, DOC, or DOCX resume file.');
        }
        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('target_role', targetRole);

        const res = await api.post('/tools/resume-analyzer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResult(res.data.data);
      } else {
        if (!resumeText || resumeText.trim().length < 50) {
          throw new Error('Please paste at least 50 characters of resume content.');
        }
        const res = await api.post('/tools/resume-analyzer', {
          resume_text: resumeText,
          target_role: targetRole,
        });
        setResult(res.data.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please verify your document.');
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
        tool: 'RESUME',
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
        title="ATS Resume Analyzer & Keyword Scoring Tool"
        description="Test your technical resume against real ATS parsing algorithms. Evaluate keyword density, formatting bugs, action verbs, and quantifiable metrics."
        canonical="/tools/resume-analyzer"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Tools', path: '/tools' },
              { label: 'ATS Resume Analyzer' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Deterministic Parsing Engine</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              ATS Resume <span className="text-brand-gradient">Analyzer.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-4">
              Evaluate your resume structure, keyword coverage against target engineering roles, action verbs, and quantified achievements in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>100% Private · No data sold · Instant explainable score</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Tool Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-xl mb-12">
            {/* Mode Selector */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <button
                onClick={() => setInputMode('paste')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-colors cursor-pointer ${
                  inputMode === 'paste' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                Paste Resume Text
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-colors cursor-pointer ${
                  inputMode === 'upload' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                Upload File (PDF / DOCX)
              </button>
            </div>

            <form onSubmit={handleAnalyze} className="flex flex-col gap-5">
              {/* Target Role Selector */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Target Engineering Role *
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="DevOps / Cloud Engineer">DevOps / Cloud Engineer</option>
                  <option value="Data Scientist / AI">Data Scientist / AI</option>
                  <option value="QA Automation">QA Automation</option>
                </select>
              </div>

              {/* Paste or Upload Area */}
              {inputMode === 'paste' ? (
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Paste Resume Content *
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Paste full text of your resume here (Summary, Experience, Skills, Education)..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-navy-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 leading-relaxed"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Upload Resume File (PDF, DOC, DOCX up to 5MB) *
                  </label>
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-orange-500 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-2">Maximum file size: 5MB</p>
                  </div>
                </div>
              )}

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
                    <span>Parsing & Scoring Resume...</span>
                  </>
                ) : (
                  <span>Calculate ATS Score Free</span>
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          {result && (
            <div className="p-6 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-gray-200 gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Target Role: {targetRole}</span>
                  <h3 className="text-h2 text-navy-900 mt-1">Diagnostic Evaluation</h3>
                  <p className="text-xs text-slate-500">Total Word Count: {result.wordCount} words</p>
                </div>

                {/* Animated Score Dial */}
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 rounded-full border-8 border-gray-200 border-t-orange-500 border-r-blue-600 flex flex-col items-center justify-center shadow-md bg-white">
                    <span className="text-3xl font-numbers font-black text-navy-900">{result.score}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8 border-b border-gray-200 text-xs">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Contact Details</span>
                  <span className="text-base font-numbers font-bold text-navy-900">
                    {result.breakdown.contactInfo.score} / {result.breakdown.contactInfo.max} pts
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Section Structure</span>
                  <span className="text-base font-numbers font-bold text-navy-900">
                    {result.breakdown.sectionStructure.score} / {result.breakdown.sectionStructure.max} pts
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Action Verbs Found</span>
                  <span className="text-base font-numbers font-bold text-navy-900">
                    {result.breakdown.actionVerbs.score} / {result.breakdown.actionVerbs.max} pts ({result.breakdown.actionVerbs.count} verbs)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-slate-400 font-bold block mb-1">Quantified Metrics</span>
                  <span className="text-base font-numbers font-bold text-navy-900">
                    {result.breakdown.quantifiedMetrics.score} / {result.breakdown.quantifiedMetrics.max} pts ({result.breakdown.quantifiedMetrics.count} metrics)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm sm:col-span-2">
                  <span className="text-slate-400 font-bold block mb-1">Role Keyword Coverage</span>
                  <span className="text-base font-numbers font-bold text-navy-900">
                    {result.breakdown.roleKeywords.score} / {result.breakdown.roleKeywords.max} pts
                  </span>
                  <div className="mt-2 text-[11px] text-slate-500">
                    <span>Matched: {result.breakdown.roleKeywords.matched?.join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Prioritized Fixes */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="font-heading font-bold text-base text-navy-900 mb-3">Prioritized Fixes to Boost Score</h4>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-700">
                  {result.fixes.map((fix: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100">
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Report Form */}
              <div className="pt-6">
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-2">Email Me This Report</h4>
                {emailSent ? (
                  <div className="p-4 rounded-xl bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Report sent to {reportEmail}! Check your inbox.</span>
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

              {/* Related Service Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-orange-50 border border-orange-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-navy-900">Want Our Certified Writers to Rebrand Your Resume?</h4>
                  <p className="text-xs text-slate-600">Triple your inbound recruiter response rate with full ATS reconstruction.</p>
                </div>
                <Button variant="primary" size="sm" href="/services/resume-linkedin-rebranding">
                  Explore Rebranding Service
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * Disclaimer: This automated diagnostic tool provides directional guidance and ATS formatting checks. It does not constitute a legal or contractual guarantee of interview invitations or employment offers.
          </p>
        </div>
      </section>
    </div>
  );
};
