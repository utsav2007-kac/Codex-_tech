import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import {
  Clock,
  Laptop,
  Layers,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { PageHero } from '../components/layout/PageHero';
import { CourseSnapshotVisual } from '../components/hero-visuals/courses/CourseSnapshotVisual';
import { api } from '../services/api';

export const CourseDetail: React.FC = () => {
  const { course: slug } = useParams<{ course: string }>();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState<number | null>(0);

  // Enrollment Form State
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [batchPref, setBatchPref] = useState('Weekday Evening Batch (Online Live)');
  const [enrollMsg, setEnrollMsg] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/courses/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          setCourse(res.data.data);
        }
      })
      .catch(() => {
        setCourse(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
        <p className="text-sm text-slate-500">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/services/it-training" replace />;
  }

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolling(true);
    setEnrollError('');
    try {
      await api.post('/enrollments', {
        course_id: course.id,
        name: enrollName,
        email: enrollEmail,
        phone: enrollPhone,
        batch_pref: batchPref,
        message: enrollMsg,
      });
      setEnrollSuccess(true);
    } catch (err: any) {
      setEnrollError(err.message || 'Enrollment submission failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
  const tools = Array.isArray(course.tools) ? course.tools : [];
  const outcomes = Array.isArray(course.outcomes) ? course.outcomes : [];
  const faqs = Array.isArray(course.faqs) ? course.faqs : [];

  return (
    <div className="bg-white">
      <SEO
        title={`${course.title} Bootcamp | Live Training & Capstone Labs`}
        description={course.summary}
        canonical={`/services/it-training/${course.slug}`}
        type="course"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Balanced 12-Column Grid with Course Snapshot Companion) ── */}
      <PageHero
        eyebrow="Industry-Led IT Training Track"
        title={course.title}
        tagline="Comprehensive Curriculum & Production Capstones"
        summary={course.summary}
        primaryCta={{
          label: 'Enroll in Next Cohort',
          onClick: () => {
            const formEl = document.getElementById('enroll-form');
            formEl?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Talk to Lead Instructor',
          onClick: onOpenConsultation,
        }}
        breadcrumbs={[
          { label: 'Services', path: '/services' },
          { label: 'IT Training', path: '/services/it-training' },
          { label: course.title },
        ]}
        facts={[
          { icon: Clock, label: 'Course Duration', value: course.duration },
          { icon: Laptop, label: 'Delivery Mode', value: course.mode },
          { icon: Layers, label: 'Audience Level', value: course.level },
        ]}
        visual={
          <CourseSnapshotVisual
            courseTitle={course.title}
            duration={course.duration}
            mode={course.mode}
            level={course.level}
            tools={tools}
          />
        }
      />

      {/* Main Content Layout */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Columns: Curriculum & Details */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              {/* Tools & Frameworks Mastered */}
              <div>
                <h2 className="text-h3 font-bold text-navy-900 mb-4">Tools & Technologies Mastered</h2>
                <div className="flex flex-wrap gap-2.5">
                  {tools.map((t: string, i: number) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-navy-900 text-xs font-semibold border border-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Curriculum Accordion */}
              <div>
                <h2 className="text-h2 text-navy-900 mb-3">
                  Comprehensive <span className="text-brand-gradient">Curriculum.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Hands-on modules structured around production architecture, clean code, and interview rubrics.
                </p>

                <div className="flex flex-col gap-3">
                  {curriculum.map((mod: any, idx: number) => (
                    <div key={idx} className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setOpenModule(openModule === idx ? null : idx)}
                        className="w-full p-5 text-left font-heading font-bold text-sm sm:text-base text-navy-900 flex items-center justify-between gap-4 bg-gray-50/50 hover:bg-gray-100/60 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xs font-numbers font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-md">
                            Module 0{idx + 1}
                          </span>
                          <span>{mod.title}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openModule === idx ? 'rotate-180 text-orange-500' : ''}`} />
                      </button>

                      {openModule === idx && (
                        <div className="p-5 bg-white border-t border-gray-100">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                            {Array.isArray(mod.topics) && mod.topics.map((topic: string, tIdx: number) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Capstone Projects Section */}
              <div className="p-8 rounded-3xl bg-navy-900 text-white shadow-xl">
                <div className="eyebrow text-orange-400">Production Portfolio</div>
                <h3 className="text-h3 font-bold text-white mb-3">Enterprise Capstones Built in This Course</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  You will design, code, and deploy 2 complete end-to-end applications from scratch. Projects include containerized Docker images, automated GitHub Actions CI/CD pipelines, and live cloud URLs to present directly to interviewers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-navy-800 border border-navy-700">
                    <h4 className="font-bold text-white mb-1">Capstone 1: Microservice Core</h4>
                    <p className="text-[11px] text-slate-400">High-throughput REST API with distributed data caching, JWT authorization, and unit tests.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-800 border border-navy-700">
                    <h4 className="font-bold text-white mb-1">Capstone 2: Event-Driven Pipeline</h4>
                    <p className="text-[11px] text-slate-400">Asynchronous message queue architecture with cloud deployment and live observability.</p>
                  </div>
                </div>
              </div>

              {/* Career Outcomes */}
              <div>
                <h3 className="text-h3 font-bold text-navy-900 mb-4">Target Career Outcomes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {outcomes.map((out: string, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-medium text-slate-700 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Enrollment Card */}
            <div className="lg:col-span-4">
              <div id="enroll-form" className="sticky top-28 p-6 sm:p-7 rounded-3xl bg-white border border-gray-200 shadow-xl">
                <h3 className="font-heading font-bold text-lg text-navy-900 mb-1">Enroll in this Track</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Reserve your seat for upcoming live batches. Flexible 0% interest monthly installments available.
                </p>

                {enrollSuccess ? (
                  <div className="p-5 rounded-2xl bg-green-50 text-green-800 text-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <h4 className="font-bold text-sm mb-1">Seat Reserved!</h4>
                    <p className="text-xs leading-relaxed text-green-700">
                      Our training coordinator has logged your application and will email batch timings and syllabus details.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-4 text-xs">
                    {enrollError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200">
                        {enrollError}
                      </div>
                    )}

                    <div>
                      <label className="block font-bold text-navy-900 mb-1 uppercase tracking-wider text-[10px]">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Swetha Kumar"
                        value={enrollName}
                        onChange={(e) => setEnrollName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-navy-900 mb-1 uppercase tracking-wider text-[10px]">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="swetha@example.com"
                        value={enrollEmail}
                        onChange={(e) => setEnrollEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-navy-900 mb-1 uppercase tracking-wider text-[10px]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={enrollPhone}
                        onChange={(e) => setEnrollPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-navy-900 mb-1 uppercase tracking-wider text-[10px]">Batch Preference *</label>
                      <select
                        value={batchPref}
                        onChange={(e) => setBatchPref(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="Weekday Evening Batch (Online Live)">Weekday Evening Batch (Online Live)</option>
                        <option value="Weekend Intensive Batch (Online Live)">Weekend Intensive Batch (Online Live)</option>
                        <option value="Self-Paced with 1-on-1 Mentorship">Self-Paced with 1-on-1 Mentorship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-navy-900 mb-1 uppercase tracking-wider text-[10px]">Questions or Background</label>
                      <textarea
                        rows={2}
                        placeholder="Mention your prior programming exposure..."
                        value={enrollMsg}
                        onChange={(e) => setEnrollMsg(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={enrolling}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm py-3 rounded-xl shadow-elevated transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Enrollment Application</span>}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      100% money-back guarantee within the first 7 days of training.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
