import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Video, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Webinars: React.FC = () => {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebinar, setSelectedWebinar] = useState<any | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    api.get('/webinars')
      .then((res) => {
        if (res.data?.data) {
          setWebinars(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onRegister = async (data: RegisterFormData) => {
    if (!selectedWebinar) return;
    setIsSubmitting(true);
    setRegError(null);

    try {
      const res = await api.post('/webinar-registrations', {
        webinar_id: selectedWebinar.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        honeypot: data.honeypot,
      });

      if (res.data?.success) {
        setRegSuccess(true);
        reset();
      } else {
        setRegError(res.data?.error?.message || 'Registration failed.');
      }
    } catch (err: any) {
      setRegError(err.response?.data?.error?.message || 'Error completing registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcoming = webinars.filter((w) => !w.is_past);
  const past = webinars.filter((w) => w.is_past);

  return (
    <div className="bg-white">
      <SEO
        title="Technical Career Webinars & Live Masterclasses | Codex Tech-IT"
        description="Join interactive technical webinars covering Cloud Migration, System Design, AI in DevOps, and US Technical Job Market dynamics."
        canonical="/resources/webinars"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Webinars' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Interactive Learning</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Technical Webinars & <span className="text-brand-gradient">Masterclasses.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Live sessions led by principal engineers, engineering managers, and executive tech recruiters. Register for upcoming streams or watch past session recordings.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Loading scheduled webinars...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming */}
              <div>
                <div className="eyebrow mb-2">Live Sessions</div>
                <h2 className="text-h2 text-navy-900 mb-8">Upcoming Webinars</h2>

                {upcoming.length === 0 ? (
                  <p className="text-sm text-slate-500">No live sessions scheduled right now. Check back next week!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcoming.map((w) => (
                      <div
                        key={w.id}
                        className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-orange-600 font-bold mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(w.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>

                          <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">{w.title}</h3>

                          <p className="text-xs text-slate-600 leading-relaxed mb-6">{w.description}</p>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>Host: <strong>{w.host}</strong></span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedWebinar(w);
                              setRegSuccess(false);
                            }}
                          >
                            Register for Free
                          </Button>
                          <span className="text-[11px] text-emerald-600 font-semibold">Live Interactive Q&A</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past */}
              <div>
                <div className="eyebrow mb-2">On-Demand Archives</div>
                <h2 className="text-h2 text-navy-900 mb-8">Past Recorded Masterclasses</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {past.map((w) => (
                    <div
                      key={w.id}
                      className="p-8 rounded-3xl bg-gray-50 border border-gray-200/80 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                          <Clock className="w-4 h-4" />
                          <span>Recorded Session</span>
                        </div>

                        <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">{w.title}</h3>

                        <p className="text-xs text-slate-600 leading-relaxed mb-6">{w.description}</p>

                        <div className="text-xs text-slate-500 mb-6">
                          <span>Delivered by: <strong>{w.host}</strong></span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <a
                          href={w.join_url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-navy-900 hover:text-orange-500"
                        >
                          <Video className="w-4 h-4 text-orange-500" />
                          <span>Watch Recording</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedWebinar(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-navy-900 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">Register for Webinar</h3>
            <p className="text-xs text-slate-500 mb-6 line-clamp-1">{selectedWebinar.title}</p>

            {regSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-heading font-bold text-sm text-emerald-900 mb-1">Registration Confirmed!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                  Calendar invites and the webinar access link have been dispatched to your email.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSelectedWebinar(null)}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                {regError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
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

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Reserving Seat...
                    </span>
                  ) : (
                    'Confirm Webinar Registration'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
