import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employerRequestSchema, EmployerRequestInput } from '@codex/shared';
import {
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const Employers: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployerRequestInput>({
    resolver: zodResolver(employerRequestSchema),
    defaultValues: {
      hiring_model: 'Contract to Hire',
      timeline: 'Immediate (1-2 weeks)',
      headcount: '1-3 Engineers',
      notes: '',
      honeypot: '',
    },
  });

  const onSubmit = async (values: EmployerRequestInput) => {
    setErrorMessage('');
    try {
      await api.post('/employer-requests', values);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check inputs.');
    }
  };

  return (
    <div className="bg-white">
      <SEO
        title="Technical Staffing for Employers | Hire Faster, Hire Right"
        description="Codex Tech-IT delivers pre-screened technical candidate shortlists within 48 to 72 hours. Contract, contract-to-hire, and direct-hire with a 90-day guarantee."
        canonical="/employers"
      />

      {/* Hero */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'For Employers' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Enterprise IT Staffing</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Hire Faster. <span className="text-brand-gradient">Hire Right.</span>
            </h1>
            <p className="text-body-lg text-slate-800 font-medium leading-relaxed mb-8">
              Skip the flood of unqualified resumes. Codex Tech-IT delivers calibrated candidate shortlists of pre-screened software engineers, data architects, and cloud specialists within 48 to 72 hours.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-navy-900">
                <Clock className="w-4 h-4 text-orange-500" /> 48-Hour Shortlist SLA
              </span>
              <span className="flex items-center gap-1.5 text-navy-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> 90-Day Placement Guarantee
              </span>
              <span className="flex items-center gap-1.5 text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> In-House Technical Screening
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout: Form + Employer Value */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Columns: Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200/80 shadow-md">
              <h2 className="font-heading font-bold text-2xl text-navy-900 mb-2">Request Technical Talent</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Tell us your headcount and stack requirements. An Account Director will respond within 4 business hours.
              </p>

              {isSuccess ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">Talent Request Received!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Thank you. We have assigned a Senior Technical Recruiter to your requisition. You will receive an outreach within 4 business hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
                    Submit Another Requisition
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs sm:text-sm">
                  <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Company Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. CloudScale Tech"
                        {...register('company')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-navy-900 focus:outline-none focus:ring-2 ${
                          errors.company ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                        }`}
                      />
                      {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Jason Miller"
                        {...register('contact_person')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-navy-900 focus:outline-none focus:ring-2 ${
                          errors.contact_person ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                        }`}
                      />
                      {errors.contact_person && <p className="text-xs text-red-500 mt-1">{errors.contact_person.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Work Email *</label>
                      <input
                        type="email"
                        placeholder="jmiller@cloudscale.com"
                        {...register('email')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-navy-900 focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+1 (469) 555-0188"
                        {...register('phone')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-navy-900 focus:outline-none focus:ring-2 ${
                          errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Roles Needed *</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Java Microservices Dev"
                        {...register('roles_needed')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                      {errors.roles_needed && <p className="text-xs text-red-500 mt-1">{errors.roles_needed.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Target Tech Stack *</label>
                      <input
                        type="text"
                        placeholder="e.g. Java, Spring Boot, Kafka, AWS"
                        {...register('tech_stack')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                      {errors.tech_stack && <p className="text-xs text-red-500 mt-1">{errors.tech_stack.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Headcount *</label>
                      <select {...register('headcount')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-navy-900">
                        <option value="1 Engineer">1 Engineer</option>
                        <option value="2-4 Engineers">2-4 Engineers</option>
                        <option value="5-10 Engineers">5-10 Engineers</option>
                        <option value="10+ Pod">10+ Dedicated Pod</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Hiring Model *</label>
                      <select {...register('hiring_model')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-navy-900">
                        <option value="Contract to Hire">Contract to Hire</option>
                        <option value="Contract (W2/C2C)">Contract (W2 / C2C)</option>
                        <option value="Direct Hire Permanent">Direct Hire Permanent</option>
                        <option value="Embedded RPO Pod">Embedded RPO Pod</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Hiring Timeline *</label>
                      <select {...register('timeline')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-navy-900">
                        <option value="Immediate (1-2 weeks)">Immediate (1-2 weeks)</option>
                        <option value="Within 30 Days">Within 30 Days</option>
                        <option value="Next Quarter">Next Quarter</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Additional Project Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Mention specific sprint deadlines, remote policies, or budget ranges..."
                      {...register('notes')}
                      className="w-full p-3 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm py-3.5 rounded-xl shadow-elevated transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Requisition...</span>
                      </>
                    ) : (
                      <span>Request Pre-Screened Candidates</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right 5 Columns: SLAs & Screening Standards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-navy-900 text-white shadow-xl">
                <div className="eyebrow text-orange-400">Our Service Standards</div>
                <h3 className="font-heading font-bold text-xl text-white mb-6">Staffing SLAs (SAMPLE)</h3>

                <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="pb-3 border-b border-navy-800 flex justify-between items-center">
                    <span>First Shortlist Delivery</span>
                    <span className="font-bold text-orange-400">48 - 72 Hours</span>
                  </div>
                  <div className="pb-3 border-b border-navy-800 flex justify-between items-center">
                    <span>Candidate Interview-to-Offer</span>
                    <span className="font-bold text-blue-400">88%</span>
                  </div>
                  <div className="pb-3 border-b border-navy-800 flex justify-between items-center">
                    <span>Direct-Hire Replacement Window</span>
                    <span className="font-bold text-green-400">90 Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Multi-State EOR Onboarding</span>
                    <span className="font-bold text-white">24 - 48 Hours</span>
                  </div>
                </div>
              </div>

              {/* Employer Testimonial (SAMPLE) */}
              <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-orange-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-4">
                    "Most staffing agencies spam our engineering managers with 40 irrelevant resumes. Codex sent us 3 pre-vetted candidates who had already passed architecture screening, and we hired 2 within 10 days. Exceptional speed and precision."
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="font-heading font-bold text-sm text-navy-900">Jason Miller</div>
                  <div className="text-xs text-slate-400">VP of Engineering, CloudScale Systems (SAMPLE)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
