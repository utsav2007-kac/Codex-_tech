import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const InterviewReadiness: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  // Multi-step Quiz State
  const [track, setTrack] = useState('Full Stack Java / React');
  const [experienceYears, setExperienceYears] = useState('3-5 years');
  const [techConfidence, setTechConfidence] = useState(3);
  const [sysConfidence, setSysConfidence] = useState(3);
  const [behavConfidence, setBehavConfidence] = useState(4);
  const [liveCoding, setLiveCoding] = useState(true);
  const [mockInterviews, setMockInterviews] = useState(1);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Email report state
  const [emailName, setEmailName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await api.post('/tools/interview-readiness', {
        track,
        experience_years: experienceYears,
        technical_confidence: techConfidence,
        system_design_confidence: sysConfidence,
        behavioral_confidence: behavConfidence,
        live_coding_experience: liveCoding,
        mock_interviews_done: mockInterviews,
      });
      setResult(res.data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Evaluation failed. Please try again.');
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
        tool: 'READINESS',
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
        title="Technical Interview Readiness Diagnostic & 2-Week Study Plan"
        description="Self-assess your technical depth, system design readiness, and behavioral interview confidence. Get a customized 14-day study plan."
        canonical="/tools/interview-readiness"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Tools', path: '/tools' },
              { label: 'Interview Readiness Diagnostic' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Interactive Diagnostic</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              Interview Readiness <span className="text-brand-gradient">Assessment.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-4">
              Calculate your market interview probability across coding rounds, distributed system design, and STAR behavioral questions. Receive a customized 14-day roadmap.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Instant assessment · Explainable scoring · Personalized study plan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Quiz Form */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-xl mb-12">
            <form onSubmit={handleEvaluate} className="flex flex-col gap-6">
              {/* Target Track & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Target Technical Track *
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="Full Stack Java / React">Full Stack Java / React</option>
                    <option value="Python Backend & APIs">Python Backend & APIs</option>
                    <option value="Cloud DevOps / SRE">Cloud DevOps / SRE</option>
                    <option value="Data Engineering / PySpark">Data Engineering / PySpark</option>
                    <option value="QA Automation / Playwright">QA Automation / Playwright</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Years of Engineering Experience *
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="0-1 years (Entry / Graduate)">0-1 years (Entry / Graduate)</option>
                    <option value="1-3 years (Junior)">1-3 years (Junior)</option>
                    <option value="3-5 years (Mid-Level)">3-5 years (Mid-Level)</option>
                    <option value="5-8 years (Senior)">5-8 years (Senior)</option>
                    <option value="8+ years (Lead / Architect)">8+ years (Lead / Architect)</option>
                  </select>
                </div>
              </div>

              {/* Confidence Sliders / Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Algorithms & Coding (1-5)
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setTechConfidence(lvl)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          techConfidence === lvl
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    System Design (1-5)
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSysConfidence(lvl)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          sysConfidence === lvl
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Behavioral / STAR (1-5)
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setBehavConfidence(lvl)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          behavConfidence === lvl
                            ? 'bg-navy-900 text-white shadow-sm'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold text-navy-900">Have you practiced live coding on shared screens?</span>
                  <input
                    type="checkbox"
                    checked={liveCoding}
                    onChange={(e) => setLiveCoding(e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold text-navy-900">Mock interviews completed in last 60 days:</span>
                  <select
                    value={mockInterviews}
                    onChange={(e) => setMockInterviews(parseInt(e.target.value, 10))}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-navy-900 font-bold"
                  >
                    <option value={0}>0 (None)</option>
                    <option value={1}>1-2</option>
                    <option value={3}>3-5</option>
                    <option value={6}>6+</option>
                  </select>
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
                className="w-full sm:w-auto self-start bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm px-8 py-3.5 rounded-xl shadow-elevated transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Computing Readiness Score...</span>
                  </>
                ) : (
                  <span>Calculate Readiness Score & Roadmap</span>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="p-6 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-gray-200 gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Track: {track}</span>
                  <h3 className="text-h2 text-navy-900 mt-1">Readiness Evaluation</h3>
                  <p className="text-xs text-slate-500">Based on industry tier-1 interview criteria</p>
                </div>

                <div className="w-28 h-28 rounded-full border-8 border-gray-200 border-t-orange-500 border-r-blue-600 flex flex-col items-center justify-center shadow-md bg-white">
                  <span className="text-3xl font-numbers font-black text-navy-900">{result.score}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-gray-200">
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h4 className="font-heading font-bold text-sm text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Core Strengths
                  </h4>
                  <ul className="flex flex-col gap-2 text-xs text-slate-600">
                    {result.strengths.map((str: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h4 className="font-heading font-bold text-sm text-orange-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" /> Critical Gaps to Address
                  </h4>
                  <ul className="flex flex-col gap-2 text-xs text-slate-600">
                    {result.gaps.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 2-Week Study Roadmap */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="font-heading font-bold text-base text-navy-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Tailored 14-Day Preparation Roadmap
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {result.roadmap.map((phase: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <span className="text-xs font-numbers font-bold text-orange-500 block mb-1">{phase.day}</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{phase.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Report */}
              <div className="pt-6">
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-2">Email Me This Roadmap</h4>
                {emailSent ? (
                  <div className="p-4 rounded-xl bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Roadmap sent to {reportEmail}!</span>
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
                  <h4 className="font-heading font-bold text-sm text-navy-900">Want 1-on-1 Mock Sessions with Senior Architects?</h4>
                  <p className="text-xs text-slate-600">Eliminate interview surprises with live system design and coding feedback.</p>
                </div>
                <Button variant="primary" size="sm" href="/services/interview-preparation">
                  Book Mock Interview
                </Button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * Disclaimer: Readiness score represents a diagnostic self-assessment tool and does not guarantee job offers.
          </p>
        </div>
      </section>
    </div>
  );
};
