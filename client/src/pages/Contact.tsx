import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { PageHero } from '../components/layout/PageHero';
import { siteConfig } from '../config/site';
import { api } from '../services/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post('/contact', data);
      if (res.data?.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setSubmitError(res.data?.error?.message || 'Failed to submit message.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error?.message || 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Contact Codex Tech-IT | Offices in Dallas, TX & Hyderabad"
        description="Get in touch with Codex Tech-IT technical recruiters and talent directors. Reach our Dallas, TX headquarters or Hyderabad delivery operations."
        canonical="/contact"
      />

      <PageHero
        breadcrumbs={[{ label: 'Contact' }]}
        badge="Get in Touch"
        title="Let's Discuss Your Hiring or Career Goals."
        titleGradientWords={['Hiring or Career Goals.']}
        subtitle="Whether you need to scale an engineering pod under aggressive delivery deadlines or accelerate your personal job search, our technical recruiters are ready to assist."
        primaryCta={{
          label: 'Send Direct Message',
          href: '#contact-form-section',
        }}
        secondaryCta={{
          label: 'Book Consultation',
          onClick: onOpenConsultation,
        }}
        facts={[
          { label: 'Advisory Reply', value: '< 15 Mins' },
          { label: 'Headquarters', value: 'Dallas & Hyd' },
          { label: 'Support SLA', value: '24/7 Global' },
        ]}
        visual="contact-card"
      />

      <Scroll3DSection id="contact-form-section" preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
            {/* Contact Information & Office Locations */}
            <div className="space-y-8">
              <div>
                <SectionReveal variant="tiltLeft">
                  <h2 className="text-h3 text-navy-900 mb-6">Global Offices</h2>
                </SectionReveal>

                <div className="space-y-6">
                  {/* USA Office */}
                  <Scroll3DCard index={0} className="p-6 rounded-3xl bg-gray-50 border border-gray-200">
                    <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                      United States Headquarters
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-3">Dallas Executive Office</h3>
                    <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <span>{siteConfig.offices[0].address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${siteConfig.contact.phoneUSA}`} className="hover:text-orange-500 font-semibold">
                          {siteConfig.contact.phoneUSA}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-orange-500">
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>
                  </Scroll3DCard>

                  {/* India Office */}
                  <Scroll3DCard index={1} className="p-6 rounded-3xl bg-gray-50 border border-gray-200">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                      India Delivery Operations
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-3">Hyderabad Technology Center</h3>
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{siteConfig.offices[1].address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${siteConfig.contact.phoneIndia}`} className="hover:text-orange-500 font-semibold">
                          {siteConfig.contact.phoneIndia}
                        </a>
                      </div>
                    </div>
                  </Scroll3DCard>

                  {/* Business Hours */}
                  <Scroll3DCard index={2} className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Operating Hours</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {siteConfig.contact.hours}
                    </p>
                  </Scroll3DCard>
                </div>
              </div>

              {/* Direct Strategy Booking Card */}
              <Scroll3DCard index={3} className="p-6 rounded-3xl bg-navy-900 text-white">
                <h4 className="font-heading font-bold text-base mb-2">Prefer a direct conversation?</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Schedule a 1-on-1 career consultation directly with our talent directors.
                </p>
                <Button variant="primary" size="sm" className="w-full justify-center" onClick={onOpenConsultation}>
                  Reserve Free Strategy Call
                </Button>
              </Scroll3DCard>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-2">
              <Scroll3DCard index={1} maxTilt={3} className="p-8 md:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-h3 text-navy-900 mb-2">Send Us an Inquiry</h2>
                  <p className="text-xs text-slate-500">
                    Submit your query and our team will get back to you within 4 business hours.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-lg text-emerald-900 mb-1">Message Received!</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed mb-6">
                      Thank you for contacting Codex Tech-IT. A representative has received your request and will follow up shortly.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                    {submitError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          {...register('name')}
                          placeholder="Jane Smith"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                        />
                        {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address *</label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="jane@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                        />
                        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <label className="block text-xs font-semibold text-navy-900 mb-1">Subject *</label>
                        <input
                          type="text"
                          {...register('subject')}
                          placeholder="e.g. Job Placement Inquiry / Hiring Consultation"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                        />
                        {errors.subject && <p className="text-[11px] text-red-500 mt-1">{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Message Details *</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Please describe your background, requirements, or target timeline..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                      />
                      {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Transmitting Message...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" /> Send Inquiry Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </Scroll3DCard>
            </div>
          </div>
        </div>
      </Scroll3DSection>
    </div>
  );
};
