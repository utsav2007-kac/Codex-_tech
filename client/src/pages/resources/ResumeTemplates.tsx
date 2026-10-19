import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, FileText, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

const downloadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

export const ResumeTemplates: React.FC = () => {
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
        resource_key: 'resume-templates-kit',
        name: data.name,
        email: data.email,
        honeypot: data.honeypot,
      });

      if (res.data?.success) {
        setDownloadReady(true);
        triggerFileDownload();
      } else {
        setSubmitError(res.data?.error?.message || 'Download failed.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error?.message || 'Unable to register download.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileDownload = () => {
    const templateContent = `CODEX TECH-IT — ATS-OPTIMIZED TECHNICAL RESUME TEMPLATES
Tagline: "We Deliver Jobs Faster"
========================================================================

TEMPLATE 1: CHRONOLOGICAL SOFTWARE ENGINEER (ATS-COMPLIANT)
------------------------------------------------------------------------
[FIRST NAME] [LAST NAME]
[City, State ZIP] | [Phone Number] | [Professional Email]
[LinkedIn Profile URL] | [GitHub Profile URL]

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with 4+ years of hands-on experience
architecting distributed microservices using Java, Spring Boot, React, and AWS.
Demonstrated track record optimizing SQL query performance by 42% and automating
CI/CD release cadences across 18 enterprise production microservices.

TECHNICAL SKILLS
- Languages: Java 17, TypeScript, Python, SQL, HTML5/CSS3
- Frameworks & Libraries: Spring Boot, React.js, Node.js, Next.js, JUnit, Jest
- Cloud & DevOps: AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes, Jenkins, Terraform
- Databases: PostgreSQL, MySQL, Redis, MongoDB
- Tools & Methodologies: Git, Jira, Agile/Scrum, RESTful APIs, Microservices Architecture

PROFESSIONAL EXPERIENCE
Software Engineer | Acme Enterprise Systems | Dallas, TX
January 2023 - Present
- Architected and deployed 6 core RESTful microservices using Java Spring Boot and PostgreSQL, handling 2.4M daily transactional requests with 99.98% uptime.
- Spearheaded database query tuning and Redis caching, cutting average API response latency from 420ms to 95ms (77% reduction).
- Containerized legacy monolithic applications into Docker containers managed via AWS ECS, reducing environment onboarding provisioning time from 4 days to 25 minutes.

Junior Software Engineer | TechFront Innovations | Austin, TX
July 2021 - December 2022
- Developed responsive React frontend user interfaces backed by Redux Toolkit for candidate onboarding dashboards.
- Implemented automated unit and integration tests using JUnit and Mockito, raising test coverage from 58% to 84%.

EDUCATION
Bachelor of Science in Computer Science | University of Texas
Graduated: May 2021 | GPA: 3.8 / 4.0

========================================================================
TEMPLATE 2: CLOUD & DEVOPS ENGINEER (SKILLS-FIRST)
[Available in full download package]
========================================================================
`;
    const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Codex_Tech_IT_ATS_Resume_Templates.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white">
      <SEO
        title="Free ATS-Optimized Technical Resume Templates | Codex Tech-IT"
        description="Download four battle-tested, ATS-compliant technical resume templates designed to pass recruiter screening software and land interviews."
        canonical="/resources/resume-templates"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Resume Templates' },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">ATS Screening Optimization</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              ATS-Proof Technical <span className="text-brand-gradient">Resume Templates.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Recruiting algorithms discard up to 75% of resumes due to unparseable two-column tables, text boxes, and missing keywords. Download our clean, high-parsing technical frameworks.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
            {/* Template Features */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-h2 text-navy-900 mb-4">Engineered for Automated Parser Compliance</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Every template in this collection is verified against major Applicant Tracking Systems (Workday, Greenhouse, Taleo, Lever, iCIMS) to guarantee 100% field extraction without corrupted characters.
                </p>

                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2">1. Standard Single-Column Hierarchy</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Zero multi-column layout glitches. Ensures parsers read left-to-right, top-to-bottom in true chronological sequence.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2">2. Metric-Driven Bullet Formula</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pre-formatted bullet patterns adhering to the Google XYZ framework: "Accomplished [X], as measured by [Y], by doing [Z]."
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2">3. Clean Web-Safe Fonts & Margins</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Calibrated 0.75-inch margins with standard typography that renders identically on macOS, Windows, and Linux servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Form */}
            <div>
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm sticky top-24">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">Download Template Kit</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Get instant access to the ATS templates in plain-text and editable formats.
                </p>

                {downloadReady ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="font-heading font-bold text-sm text-emerald-900 mb-1">Kit Downloaded!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                      The template kit has been saved to your device.
                    </p>
                    <Button variant="outline" size="sm" onClick={triggerFileDownload} className="w-full justify-center">
                      Re-Download Kit
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
                          <Loader2 className="w-4 h-4 animate-spin" /> Packaging Files...
                        </span>
                      ) : (
                        'Download Free Templates'
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
