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

      <Scroll3DSection id="contact-form-section" preset="lift" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
            {/* Contact Information & Office Locations (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <SectionReveal variant="tiltLeft">
                  <div className="eyebrow">Direct Advisory Desk</div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-tight mb-2">
                    Global Offices
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    Connect directly with our senior talent partners in North America and Asia-Pacific.
                  </p>
                </SectionReveal>

                <div className="space-y-4">
                  {/* USA Office */}
                  <Scroll3DCard index={0} className="p-6 rounded-3xl bg-slate-50/70 border border-gray-200/90 shadow-sm">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[10.5px] font-bold text-orange-700 uppercase tracking-wider mb-2.5 border border-orange-200/60">
                      United States Headquarters
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-3">Dallas Executive Office</h3>
                    <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{siteConfig.offices[0].address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${siteConfig.contact.phoneUSA}`} className="hover:text-orange-600 font-semibold transition-colors">
                          {siteConfig.contact.phoneUSA}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-orange-600 transition-colors">
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>
                  </Scroll3DCard>

                  {/* India Office */}
                  <Scroll3DCard index={1} className="p-6 rounded-3xl bg-slate-50/70 border border-gray-200/90 shadow-sm">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10.5px] font-bold text-blue-700 uppercase tracking-wider mb-2.5 border border-blue-200/60">
                      India Delivery Operations
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-3">Hyderabad Technology Center</h3>
                    <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{siteConfig.offices[1].address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${siteConfig.contact.phoneIndia}`} className="hover:text-orange-600 font-semibold transition-colors">
                          {siteConfig.contact.phoneIndia}
                        </a>
                      </div>
                    </div>
                  </Scroll3DCard>

                  {/* Business Hours & SLA */}
                  <Scroll3DCard index={2} className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Operating Hours & Advisory Response</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {siteConfig.contact.hours} · Guaranteed &lt; 15 min business response for enterprise inquiries.
                    </p>
                  </Scroll3DCard>
                </div>
              </div>

              {/* Direct Strategy Booking Card (Compact, Natural Height) */}
              <Scroll3DCard index={3} className="p-6 sm:p-7 rounded-3xl bg-navy-900 text-white border border-navy-800 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Fast-Track Call</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-white mb-2">Prefer a direct conversation?</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Schedule a 1-on-1 career consultation directly with our talent directors. 100% confidential.
                </p>
                <Button variant="primary" size="sm" className="w-full justify-center shadow-lg shadow-orange-500/25" onClick={onOpenConsultation}>
                  Reserve Free Strategy Call
                </Button>
              </Scroll3DCard>
            </div>

            {/* Interactive Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <Scroll3DCard index={1} maxTilt={2} className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 border border-gray-200/90 shadow-sm">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-200/70">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
                      Send Us an Inquiry
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Submit your query and our recruiting directors will respond within 4 business hours.
                    </p>
                  </div>
                  <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    4-Hour SLA
                  </span>
                </div>

                {submitSuccess ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-lg text-emerald-900 mb-1">Message Received!</h3>
                    <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed mb-6">
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
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 mb-1.5">Your Full Name *</label>
                        <input
                          type="text"
                          {...register('name')}
                          placeholder="Jane Smith"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all shadow-sm"
                        />
                        {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all shadow-sm"
                        />
                        {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 mb-1.5">Phone Number *</label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all shadow-sm"
                        />
                        {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 mb-1.5">Subject *</label>
                        <input
                          type="text"
                          {...register('subject')}
                          placeholder="e.g. Hiring Consultation / Career Placement"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all shadow-sm"
                        />
                        {errors.subject && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1.5">Message Details *</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Please describe your background, technical requirements, or target timeline..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all shadow-sm resize-y"
                      />
                      {errors.message && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all text-sm font-bold"
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
