import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Briefcase, MapPin, Clock, ArrowLeft, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHero } from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

const applySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Phone number is required'),
  linkedin_url: z.string().url('Valid LinkedIn URL is required').optional().or(z.literal('')),
  cover_note: z.string().optional(),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type ApplyFormData = z.infer<typeof applySchema>;

export const CareerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/jobs/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          setJob(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be 5MB or less');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setFileError('Only PDF, DOC, or DOCX files are allowed');
      return;
    }

    setResumeFile(file);
  };

  const onSubmit = async (data: ApplyFormData) => {
    if (!resumeFile) {
      setFileError('Please attach your resume');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('job_id', String(job.id));
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    if (data.linkedin_url) formData.append('linkedin_url', data.linkedin_url);
    if (data.cover_note) formData.append('cover_note', data.cover_note);
    try {
      const refCode = sessionStorage.getItem('cx_referral_code');
      if (refCode) formData.append('referral_code', refCode);
    } catch {}
    if (data.honeypot) formData.append('honeypot', data.honeypot);
    formData.append('resume', resumeFile);

    try {
      const res = await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setSubmitSuccess(true);
        reset();
        setResumeFile(null);
      } else {
        setSubmitError(res.data?.error?.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error?.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="section-padding text-center container-custom">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Position Not Found</h1>
        <p className="text-slate-500 mb-6">The role you are looking for has been filled or removed.</p>
        <Link to="/careers" className="text-orange-500 font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> View All Open Positions
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${job.title} | Careers at Codex Tech-IT`}
        description={`Apply for ${job.title} in our ${job.department} team located in ${job.location}.`}
        canonical={`/careers/${job.slug}`}
      />

      {/* Header */}
      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Careers Life Visual) ── */}
      <PageHero
        eyebrow={job.department || 'Engineering Requisition'}
        title={job.title}
        tagline={`${job.location} · ${job.type}`}
        summary={job.description ? job.description.slice(0, 160) + '...' : 'Explore role requirements, team details, and submit your application directly to engineering directors.'}
        breadcrumbs={[
          { label: 'Careers', path: '/careers' },
          { label: job.title },
        ]}
        primaryCta={{
          label: 'Apply for Role',
          onClick: () => {
            const el = document.getElementById('apply-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Back to Open Positions',
          href: '/careers',
        }}
        facts={[
          { icon: MapPin, label: 'Location', value: job.location },
          { icon: Clock, label: 'Employment Type', value: job.type },
          { icon: CheckCircle2, label: 'Candidate Representation', value: '100% Free' },
        ]}
        visual="careers-life"
      />

      {/* Content Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
            {/* Description & Requirements */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-h3 text-navy-900 mb-4">About the Role</h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
                  {job.description}
                </div>
              </div>

              <div>
                <h2 className="text-h3 text-navy-900 mb-4">Role Requirements & Qualifications</h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
                  {job.requirements}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <div id="apply-form" className="p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm sticky top-24">
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">Apply for this Position</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Submit your resume and details directly to our hiring directors.
                </p>

                {submitSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-heading font-bold text-base text-emerald-900 mb-1">Application Submitted!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Thank you for applying to Codex Tech-IT. Our recruitment team will review your application and follow up via email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Honeypot */}
                    <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                    {submitError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Full Name *</label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address *</label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">LinkedIn Profile</label>
                      <input
                        type="url"
                        {...register('linkedin_url')}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.linkedin_url && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.linkedin_url.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Resume File (PDF/DOC/DOCX ≤ 5MB) *</label>
                      <label className="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 bg-white transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[11px] text-slate-600 font-medium">
                          {resumeFile ? resumeFile.name : 'Choose file or drag here'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.docx,application/pdf"
                          onChange={onFileChange}
                          className="hidden"
                        />
                      </label>
                      {fileError && <p className="text-[11px] text-red-500 mt-1">{fileError}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Brief Cover Note</label>
                      <textarea
                        {...register('cover_note')}
                        rows={3}
                        placeholder="Tell us why you are a great fit..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
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
