import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
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
        title="Contact Codex Tech-IT | Offices in New York, NY, Ahmedabad & Goa"
        description="Get in touch with Codex Tech-IT technical recruiters and talent directors. Reach our New York headquarters, Ahmedabad delivery operations, or Goa branch."
        canonical="/contact"
      />

      {/* ── 1. SIGNATURE LIGHT HERO WITH TWO REAL OFFICES SIDE BY SIDE ── */}
      <section
        data-nav-theme="light"
        className="relative bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/70 to-white text-slate-900 pt-28 pb-16 sm:pb-24 border-b border-slate-200/80 overflow-hidden"
      >
        {/* Ambient radial glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-r from-orange-200/25 to-blue-200/25 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[260px] bg-amber-100/35 blur-[110px] pointer-events-none rounded-full" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Contact' }]} className="text-slate-600" />
            <span className="hidden sm:inline text-slate-400">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold shadow-xs">
              <Mail className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Contact & Advisory Desk</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                GLOBAL REACH · 24/7 SUPPORT
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 leading-[1.15]">
                Let's Discuss Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#2563EB]">
                  Goals.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Whether you need to scale an engineering pod under aggressive delivery deadlines or accelerate your personal job search, our technical recruiters in New York and India are ready to assist.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-xl shadow-orange-500/20 px-6 py-3 font-bold rounded-xl"
                >
                  Book 1-on-1 Consultation
                </Button>
                <a
                  href={`tel:${siteConfig.contact.phoneUSA}`}
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Call {siteConfig.contact.phoneUSA}</span>
                </a>
              </div>
            </div>

            {/* Right: The Two Offices Highlight Cards Side by Side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* US Headquarters Card (New York) */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:border-orange-300 transition-all space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C2410C] border border-orange-200/70">
                    US Headquarters
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-slate-900 mb-1">
                    New York, NY (USA)
                  </h2>
                  <p className="text-[11px] text-slate-500 font-mono">Broadway Executive Office</p>
                </div>
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{siteConfig.offices[0].address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <a href={`tel:${siteConfig.contact.phoneUSA}`} className="hover:text-orange-600 font-mono font-medium transition-colors text-slate-800">
                      {siteConfig.contact.phoneUSA}
                    </a>
                  </div>
                </div>
              </div>

              {/* India Delivery Center Card (Ahmedabad) */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:border-blue-300 transition-all space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                    Global Delivery Hub
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-slate-900 mb-1">
                    Ahmedabad, Gujarat (India)
                  </h2>
                  <p className="text-[11px] text-slate-500 font-mono">Shivalik Shilp Technology Center</p>
                </div>
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{siteConfig.offices[1].address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <a href={`tel:${siteConfig.contact.phoneIndia}`} className="hover:text-orange-600 font-mono font-medium transition-colors text-slate-800">
                      {siteConfig.contact.phoneIndia}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. GLOBAL OFFICES DIRECTORY & CONTACT INQUIRY FORM ── */}
      <section id="contact-form-section" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
            {/* Contact Information & Office Locations (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Direct Advisory Desk</div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight mb-2">
                  Global Offices
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Connect directly with our senior talent partners in North America and Asia-Pacific.
                </p>

                <div className="space-y-4">
                  {/* USA Office: New York */}
                  <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs hover:border-orange-300 hover:bg-white hover:shadow-md transition-all">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[10.5px] font-bold text-orange-700 uppercase tracking-wider mb-2.5 border border-orange-200/60">
                      🇺🇸 United States Corporate Headquarters
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mb-2">New York Executive Office</h3>
                    <div className="space-y-2 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
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
                  </div>

                  {/* India Office: Ahmedabad */}
                  <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:bg-white hover:shadow-md transition-all">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10.5px] font-bold text-blue-700 uppercase tracking-wider mb-2.5 border border-blue-200/60">
                      🇮🇳 India Delivery & Sourcing Center
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Ahmedabad Technology Center</h3>
                    <div className="space-y-2 text-xs text-slate-700 font-medium">
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
                  </div>

                  {/* India Office: Goa Branch */}
                  <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider mb-2.5 border border-emerald-200/60">
                      🇮🇳 Branch Operations Desk
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Goa Branch Office</h3>
                    <div className="space-y-2 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{siteConfig.offices[2].address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${siteConfig.contact.phoneUSA}`} className="hover:text-orange-600 font-semibold transition-colors">
                          {siteConfig.contact.phoneUSA}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours & SLA */}
                  <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100/90 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Operating Hours & Advisory Response</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {siteConfig.contact.hours} · Guaranteed &lt; 15 min business response for enterprise inquiries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Strategy Booking Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 text-slate-900 border border-orange-200/90 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-[#C2410C]" />
                  <span className="text-[11px] font-bold text-[#C2410C] uppercase tracking-wider">Fast-Track Call</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-900 mb-2">Prefer a direct conversation?</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  Schedule a 1-on-1 career consultation directly with our talent directors. 100% confidential.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-lg shadow-orange-500/20 py-3 font-bold rounded-xl"
                  onClick={onOpenConsultation}
                >
                  Reserve Free Strategy Call
                </Button>
              </div>
            </div>

            {/* Interactive Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-200/70">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
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
                      className="w-full justify-center bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all text-sm font-bold py-3.5 rounded-xl"
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

                    <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-gray-200/80">
                      By providing a telephone number and submitting this form you are consenting to be contacted by SMS text message. Message frequency may vary. Message & data rates may apply. You can reply STOP to opt-out of further messaging or HELP for more information. Refer to our{' '}
                      <Link to="/privacy-policy" className="text-[#C2410C] hover:underline font-semibold">
                        Privacy Policy
                      </Link>.
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
