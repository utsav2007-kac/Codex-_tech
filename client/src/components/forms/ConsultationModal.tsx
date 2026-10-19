import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationSchema, ConsultationInput } from '@codex/shared';
import { X, CheckCircle2, Loader2, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { siteConfig } from '../../config/site';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
  defaultService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = '',
  defaultService = 'job-placement',
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      country_code: '+1',
      visa_status: 'NA',
      service_interest: defaultService,
      plan: defaultPlan,
      source: 'website_modal',
      consent: true,
      honeypot: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (values: ConsultationInput) => {
    setErrorMessage('');
    try {
      await api.post('/leads', values);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check the fields and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 relative">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Free 30-Min Strategy Call
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
            Accelerate Your Technical Career
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Speak directly with a senior talent advisor. Get a personalized profile roadmap and employer placement timeline.
          </p>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-xl transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-heading font-bold text-xl text-navy-900 mb-2">
                Consultation Request Confirmed!
              </h4>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Thank you for reaching out. We have logged your request and sent a confirmation email. Our talent director will connect with you within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-heading font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
              {/* Honeypot field (hidden from legitimate users) */}
              <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

              {errorMessage && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  {...register('name')}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    {...register('email')}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-900 focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register('country_code')}
                      className="w-24 px-2 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="+1">USA (+1)</option>
                      <option value="+91">IN (+91)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+1-CA">CA (+1)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="555-0199"
                      {...register('phone')}
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm text-navy-900 focus:outline-none focus:ring-2 ${
                        errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Current Role & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Current / Target Role *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    {...register('current_role')}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-900 focus:outline-none focus:ring-2 ${
                      errors.current_role ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200'
                    }`}
                  />
                  {errors.current_role && <p className="text-xs text-red-500 mt-1">{errors.current_role.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Experience Level *
                  </label>
                  <select
                    {...register('experience_level')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="Fresh Graduate / Entry">Fresh Graduate / Entry (0-1 yrs)</option>
                    <option value="1-3 years">Junior Developer (1-3 yrs)</option>
                    <option value="3-5 years">Mid-Level Engineer (3-5 yrs)</option>
                    <option value="5-8 years">Senior Specialist (5-8 yrs)</option>
                    <option value="8+ years">Lead / Principal Architect (8+ yrs)</option>
                    <option value="Career Switcher">Career Switcher</option>
                  </select>
                </div>
              </div>

              {/* Visa / Work Authorization & Service Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Visa / Work Status *
                  </label>
                  <select
                    {...register('visa_status')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="US_CITIZEN_GC">US Citizen / Green Card</option>
                    <option value="F1">F-1 OPT / STEM OPT</option>
                    <option value="H1B_H4">H-1B / H-4 EAD</option>
                    <option value="OTHER">Other Authorization</option>
                    <option value="NA">Not Applicable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Service of Interest *
                  </label>
                  <select
                    {...register('service_interest')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    {siteConfig.services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                    <option value="general-career-consultation">General Career Strategy</option>
                  </select>
                </div>
              </div>

              {/* Preferred Time & Note */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Preferred Consultation Timing
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekday afternoons or ASAP"
                  {...register('preferred_datetime')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Questions or Career Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what role or compensation tier you are aiming for..."
                  {...register('message')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 mt-1">
                <input
                  type="checkbox"
                  id="modal-consent"
                  {...register('consent')}
                  className="mt-1 w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="modal-consent" className="text-xs text-slate-500 leading-normal">
                  I agree to the <a href="/privacy-policy" target="_blank" className="text-blue-600 underline">Privacy Policy</a> and consent to receive communication from Codex Tech-IT regarding career consultations.
                </label>
              </div>
              {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-base py-3.5 rounded-xl shadow-elevated transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Booking Consultation...</span>
                  </>
                ) : (
                  <span>Confirm Free Consultation</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
