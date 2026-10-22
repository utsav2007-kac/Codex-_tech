import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, FileText, HelpCircle, Video, ArrowRight, Download, Sparkles } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHero } from '../components/layout/PageHero';

export const Resources: React.FC = () => {
  const resourceCards = [
    {
      title: '2026 Tech Salary & Compensation Guide',
      description: 'Comprehensive compensation benchmarks for Cloud, Data, AI/ML, and Full-Stack Engineering across USA and India markets.',
      link: '/resources/salary-guide',
      icon: DollarSign,
      tag: 'Gated PDF Download',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'ATS-Optimized Tech Resume Templates',
      description: 'Four pre-formatted, ATS-vetted resume templates in DOCX and PDF designed for high parser readability.',
      link: '/resources/resume-templates',
      icon: FileText,
      tag: 'Template Kit',
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Interview Question Bank (200+ Q&As)',
      description: 'Searchable technical and behavioral interview questions categorized by role track (Java, Python, Cloud, Data, DevOps) and difficulty level.',
      link: '/resources/interview-question-bank',
      icon: HelpCircle,
      tag: 'Interactive Bank',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Technical Webinars & Masterclasses',
      description: 'Upcoming live sessions and on-demand recordings featuring senior hiring leaders and technical architects.',
      link: '/resources/webinars',
      icon: Video,
      tag: 'Live & On-Demand',
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Career Resources, Salary Guides & Interview Banks | Codex Tech-IT"
        description="Access free IT career guides, ATS resume templates, 200+ technical interview questions, and expert webinars from Codex Tech-IT."
        canonical="/resources"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Resources Vault Visual) ── */}
      <PageHero
        eyebrow="Knowledge Center"
        title={
          <>
            Engineering Career & <span className="text-brand-gradient">Hiring Toolkit.</span>
          </>
        }
        tagline="Curated Playbooks, Comp Guides & Technical Prep Tools"
        summary="Equip yourself with validated compensation data, ATS-compliant resume frameworks, role-specific technical questions, and interactive webinars built by technical staffing veterans."
        breadcrumbs={[{ label: 'Resources' }]}
        primaryCta={{
          label: 'Explore Resources',
          onClick: () => {
            const el = document.getElementById('resources-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: '2026 Salary Guide',
          href: '/resources/salary-guide',
        }}
        facts={[
          { icon: Download, label: 'Guides Downloaded', value: '16,800+' },
          { icon: FileText, label: 'Templates & Banks', value: '100% Free' },
          { icon: Sparkles, label: 'Content Updates', value: 'Weekly Refreshes' },
        ]}
        visual="resources-hub"
      />

      {/* Resources Grid */}
      <section id="resources-grid" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {resourceCards.map((res, idx) => {
              const Icon = res.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all flex flex-col justify-between h-full"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${res.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                        {res.tag}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-2xl text-navy-900 mb-3 hover:text-orange-500 transition-colors min-h-[4rem] flex items-start">
                      <Link to={res.link}>{res.title}</Link>
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed mb-8 flex-1">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <Link
                      to={res.link}
                      className="inline-flex items-center gap-2 text-xs font-heading font-bold text-navy-900 hover:text-orange-500 transition-colors"
                    >
                      <span>Access Resource</span>
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
