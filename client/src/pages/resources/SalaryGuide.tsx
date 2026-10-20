import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, DollarSign, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { PageHero } from '../../components/layout/PageHero';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

const downloadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid work or personal email is required'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

export const SalaryGuide: React.FC = () => {
  const [downloadReady, setDownloadReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const onSubmit = async (data: DownloadFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post('/downloads', {
        resource_key: 'salary-guide-2026',
        name: data.name,
        email: data.email,
        honeypot: data.honeypot,
      });

      if (res.data?.success) {
        setDownloadReady(true);
        triggerFileDownload();
      } else {
        setSubmitError(res.data?.error?.message || 'Download request failed.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error?.message || 'Unable to register download.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileDownload = () => {
    // Generate text/pdf markdown content blob for immediate download
    const content = `CODEX TECH-IT — 2026 TECHNICAL SALARY & COMPENSATION BENCHMARK REPORT
Tagline: "We Deliver Jobs Faster"
========================================================================

1. EXECUTIVE SUMMARY
This compensation benchmark reflects placement data collected across direct-hire
and contract-to-hire technical engagements in North America and India.

2. SOFTWARE ENGINEERING COMPENSATION (USA)
- Junior Full-Stack (0-2 YOE): $85,000 - $115,000 Base
- Mid-Level Engineer (3-5 YOE): $120,000 - $155,000 Base
- Senior Software Engineer (6+ YOE): $160,000 - $210,000 Base
- Principal Architect: $215,000 - $275,000 Base

3. CLOUD & DEVOPS ENGINEERING (USA)
- AWS / Azure Cloud Engineer: $130,000 - $165,000 Base
- Site Reliability Engineer (SRE): $145,000 - $185,000 Base
- Cloud Security Architect: $175,000 - $230,000 Base

4. DATA ENGINEERING & ARTIFICIAL INTELLIGENCE (USA)
- Big Data / Spark Engineer: $135,000 - $175,000 Base
- Data Warehouse Architect (Snowflake/BigQuery): $150,000 - $195,000 Base
- Machine Learning / MLOps Engineer: $165,000 - $225,000 Base

5. SALARY NEGOTIATION BEST PRACTICES
- Avoid premature rate declaration before role requirements are established.
- Benchmark total package: Base Salary + Completion Bonus + Health Benefits.
- Always require written offer documentation with defined review cycles.

For tailored compensation evaluations, visit https://codextechit.com/contact
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Codex_Tech_IT_2026_Salary_Guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white">
      <SEO
        title="2026 Tech Salary & Compensation Benchmark Guide | Codex Tech-IT"
        description="Download our free 2026 Technical Salary Guide featuring verified base compensation, contract rates, and bonus benchmarks across Software, Cloud, and Data Engineering."
        canonical="/resources/salary-guide"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Tech Compensation Index Visual) ── */}
      <PageHero
        eyebrow="Compensation Intelligence"
        title={
          <>
            2026 Technical Salary & <span className="text-brand-gradient">Compensation Guide.</span>
          </>
        }
        tagline="Real-World Base Salaries, Contracting Rates & Equity Models"
        summary="Real-world placement intelligence detailing base salaries, hourly contracting rates, and bonus structures across high-demand tech stacks."
        breadcrumbs={[
          { label: 'Resources', path: '/resources' },
          { label: 'Salary Guide' },
        ]}
        primaryCta={{
          label: 'Download Free PDF',
          onClick: () => {
            const el = document.getElementById('download-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Explore All Resources',
          href: '/resources',
        }}
        facts={[
          { icon: DollarSign, label: 'Data Points', value: '2,400+ Offers' },
          { icon: TrendingUp, label: 'Highest Tech Lift', value: '+42% Uplift' },
          { icon: CheckCircle2, label: 'Access', value: '100% Free' },
        ]}
        visual="resource-salary-guide"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
            {/* Guide Highlights */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-h2 text-navy-900 mb-4">What's Inside the 2026 Guide</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Compiled from over 500 candidate placements and employer requisitions, this benchmark report provides candidate-side transparency to ensure you never leave money on the negotiation table.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1">Role Track Breakdowns</h3>
                    <p className="text-xs text-slate-500">Junior, Mid, Senior, and Architect compensation for 12 core engineering profiles.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1">Contract vs Full-Time Rates</h3>
                    <p className="text-xs text-slate-500">W2 vs C2C rate conversion calculators and hourly market ranges.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1">Visa Category Impact</h3>
                    <p className="text-xs text-slate-500">Compensation adjustments observed across OPT/CPT, H1B, and Green Card tracks.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1">Negotiation Scripts</h3>
                    <p className="text-xs text-slate-500">Exact phrasing to counter lowball offers without alienating hiring managers.</p>
                  </div>
                </div>
              </div>

              {/* Sample Table */}
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200">
                <h3 className="font-heading font-bold text-base text-navy-900 mb-4">Sample Benchmark Snapshot (USA)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase">
                        <th className="pb-2">Role Track</th>
                        <th className="pb-2">Mid (3-5 YOE)</th>
                        <th className="pb-2">Senior (6+ YOE)</th>
                        <th className="pb-2">Hourly (C2C)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                      <tr>
                        <td className="py-2.5 font-bold text-navy-900">Java Full-Stack</td>
                        <td className="py-2.5">$125k - $155k</td>
                        <td className="py-2.5">$165k - $195k</td>
                        <td className="py-2.5">$75 - $95/hr</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-navy-900">Cloud / DevOps (AWS)</td>
                        <td className="py-2.5">$135k - $165k</td>
                        <td className="py-2.5">$175k - $215k</td>
                        <td className="py-2.5">$85 - $115/hr</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-navy-900">Data Engineering</td>
                        <td className="py-2.5">$130k - $160k</td>
                        <td className="py-2.5">$170k - $210k</td>
                        <td className="py-2.5">$80 - $110/hr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Gated Download Form */}
            <div>
              <div id="download-form" className="p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm sticky top-24">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">Get Free Instant Access</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Enter your details to receive the comprehensive 2026 compensation report directly.
                </p>

                {downloadReady ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="font-heading font-bold text-sm text-emerald-900 mb-1">Download Initialized!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                      Your salary guide has been downloaded to your device.
                    </p>
                    <Button variant="outline" size="sm" onClick={triggerFileDownload} className="w-full justify-center">
                      Click to Re-Download
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

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">Your Full Name *</label>
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

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Preparing Report...
                        </span>
                      ) : (
                        'Download Free Salary Guide'
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
