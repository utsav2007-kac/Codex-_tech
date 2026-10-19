import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { FileText, Linkedin, CheckSquare, BrainCircuit, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { TiltCard } from '../components/motion/TiltCard';
import { Button } from '../components/ui/Button';

export const Tools: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const tools = [
    {
      slug: 'resume-analyzer',
      title: 'ATS Resume Analyzer',
      tagline: 'Instant ATS Compatibility Score /100',
      desc: 'Upload your PDF/DOCX or paste text to evaluate contact parsing, section headings, action verbs, quantified metrics, and role keywords.',
      icon: FileText,
      badge: 'Most Popular',
    },
    {
      slug: 'linkedin-profile-analyzer',
      title: 'LinkedIn Profile Analyzer',
      tagline: 'Triple Recruiter Inbound Search Visibility',
      desc: 'Benchmark your headline formula, About narrative, keyword density, and skills order against top recruiter search criteria.',
      icon: Linkedin,
      badge: 'Recruiter Magnetic',
    },
    {
      slug: 'job-match-score',
      title: 'Job Match Score Calculator',
      tagline: 'Compare Your Resume vs. Target Job Description',
      desc: 'Identify missing technical skills, match percentage, and targeted phrasing improvements before you submit your application.',
      icon: CheckSquare,
      badge: 'Targeted Prep',
    },
    {
      slug: 'interview-readiness',
      title: 'Interview Readiness Diagnostic Quiz',
      tagline: 'Self-Assess System Design, Coding & Behavioral Prep',
      desc: 'A comprehensive multi-step technical evaluation that computes your readiness score, flags critical gaps, and builds a 14-day study plan.',
      icon: BrainCircuit,
      badge: 'Strategy Blueprint',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Free IT Career & ATS Diagnostic Tools"
        description="Free, deterministic diagnostic tools for technical job seekers: ATS Resume Analyzer, LinkedIn Profile Optimizer, Job Match Calculator, and Interview Readiness Quiz."
        canonical="/tools"
      />

      {/* Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Free Diagnostic Tools' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Free Candidate Utilities</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Autonomous Career <span className="text-brand-gradient">Diagnostic Tools.</span>
            </h1>
            <p className="text-body-lg text-slate-800 font-medium leading-relaxed">
              Transparent, deterministic evaluation tools designed to eliminate guesswork from your technical job hunt. Free to use with instant scoring and actionable remediation steps.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tools.map((t, idx) => (
              <TiltCard
                key={t.slug}
                className="p-8 rounded-3xl glass-card border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-orange-500/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <t.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-navy-50 text-navy-900 border border-navy-100">
                      {t.badge}
                    </span>
                  </div>

                  <h2 className="font-heading font-bold text-xl text-navy-900 mb-1 hover:text-orange-500 transition-colors">
                    <Link to={`/tools/${t.slug}`}>{t.title}</Link>
                  </h2>
                  <div className="text-xs font-semibold text-orange-600 mb-4">{t.tagline}</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-8">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/tools/${t.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <span>Launch Diagnostic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate-600 font-bold">No credit card needed</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Guarantee */}
      <section className="py-12 bg-gray-50 border-t border-gray-200/60 text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-navy-900 mb-2">How Scoring Works</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Our scoring algorithms are deterministic and explainable—calibrated directly against parsed resume tokens, standard ATS keyword databases, and real hiring rubrics. Tools provide guidance and optimization insights, not guarantees of employment.
          </p>
          <Button variant="outline" size="sm" onClick={onOpenConsultation}>
            Discuss Your Results with an Advisor
          </Button>
        </div>
      </section>
    </div>
  );
};
