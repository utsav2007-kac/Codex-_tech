import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  DollarSign,
  FileText,
  HelpCircle,
  Video,
  ArrowRight,
  Download,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

const RESOURCE_CATEGORIES = ['ALL', 'Compensation', 'Resume Kits', 'Interview Prep', 'Webinars'];

const RESOURCE_CARDS = [
  {
    title: '2026 Tech Salary & Compensation Benchmark Report',
    category: 'Compensation',
    description:
      'Comprehensive compensation benchmarks for Cloud Architects, Data Engineers, Full-Stack Developers, and AI Specialists across US tech hubs and India.',
    link: '/resources/salary-guide',
    icon: DollarSign,
    tag: 'Gated PDF Report · 48 Pages',
    color: 'bg-teal-500/10 text-teal-700 border-teal-200',
    downloads: '12,400+ Downloads',
    actionText: 'Download Salary Report',
  },
  {
    title: 'ATS-Optimized Tech Resume Template Suite',
    category: 'Resume Kits',
    description:
      'Four pre-formatted, parser-tested resume templates in DOCX and PDF designed specifically for high-readability in enterprise applicant tracking systems.',
    link: '/resources/resume-templates',
    icon: FileText,
    tag: 'Template Kit · DOCX & PDF',
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    downloads: '8,900+ Downloads',
    actionText: 'Get Template Suite',
  },
  {
    title: 'Technical Interview Question Bank (200+ Scenarios)',
    category: 'Interview Prep',
    description:
      'Searchable architectural scenarios and STAR behavioral questions categorized by engineering track (AWS, React, Python, Kafka, Spark) and seniority.',
    link: '/resources/interview-question-bank',
    icon: HelpCircle,
    tag: 'Interactive Bank · 200+ Q&As',
    color: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    downloads: '14,200+ Views',
    actionText: 'Explore Question Bank',
  },
  {
    title: 'System Design Masterclasses & On-Demand Webinars',
    category: 'Webinars',
    description:
      'Deep-dive architecture webinars and video recordings featuring principal engineers breaking down real-world high-concurrency microservices.',
    link: '/resources/webinars',
    icon: Video,
    tag: 'Video Series · 12 Hours',
    color: 'bg-teal-500/10 text-teal-700 border-teal-200',
    downloads: '5,600+ Attendees',
    actionText: 'Watch Masterclasses',
  },
];

export const Resources: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = RESOURCE_CARDS.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#F4FAF8] text-slate-900 overflow-x-hidden min-h-screen">
      <SEO
        title="Career Resources, Salary Guides & Interview Banks | Codex Tech-IT"
        description="Access free IT career guides, ATS resume templates, 200+ technical interview questions, and expert webinars from Codex Tech-IT."
        canonical="/resources"
      />

      {/* ── 1. SOFT TEAL & WHITE LIBRARY HERO ── */}
      <section className="relative bg-gradient-to-br from-[#E6F4F1] via-[#F0FAF7] to-white border-b border-teal-200/60 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Soft teal ambient glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Resources' }]} />
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 border border-teal-600/20 text-teal-800 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Knowledge Center</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900 text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                FREE IT CAREER PLAYBOOKS & TOOLKITS
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-navy-900 leading-[1.15]">
                Engineering Career &{' '}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Hiring Library.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl">
                Equip yourself with validated market compensation data, ATS-vetted resume frameworks, 200+ role-specific interview questions, and hands-on masterclasses authored by senior technical leaders.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-teal-600/20">
                  Book Career Advisory
                </Button>
                <Link
                  to="/resources/salary-guide"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-navy-900 font-heading font-bold text-sm transition-all border border-teal-200 shadow-xs flex items-center justify-center"
                >
                  2026 Salary Guide
                </Link>
              </div>

              {/* Facts Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-teal-200/80 max-w-lg">
                <div>
                  <div className="text-2xl font-numbers font-black text-teal-800">16,800+</div>
                  <div className="text-xs text-slate-600 font-medium">Guides Downloaded</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-navy-900">100% Free</div>
                  <div className="text-xs text-slate-600 font-medium">Open Knowledge</div>
                </div>
                <div>
                  <div className="text-2xl font-numbers font-black text-emerald-600">Weekly</div>
                  <div className="text-xs text-slate-600 font-medium">Content Refreshes</div>
                </div>
              </div>
            </div>

            {/* Right Column: Library Hero Book/Toolkit Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-teal-200/80 shadow-xl p-7 sm:p-8 relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    Featured Toolkit
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Updated for 2026
                  </span>
                </div>

                <div className="my-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-navy-900 leading-snug">
                    2026 US & India Tech Salary Guide
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Accurate compensation benchmarks across 12 tech tracks, detailing base salaries, equity expectations, and hiring velocity.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E6F4F1] border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                  <span>Instant PDF Access · Zero Spam</span>
                  <Link
                    to="/resources/salary-guide"
                    className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SEARCH & CATEGORY FILTER BAR ── */}
      <section className="py-8 bg-white border-b border-teal-200/60 sticky top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs font-heading font-semibold">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:border-teal-600 bg-slate-50"
            />
          </div>
        </div>
      </section>

      {/* ── 3. SIGNATURE SECTION: DOWNLOADABLE RESOURCE CARDS ── */}
      <Scroll3DSection preset="lift" className="section-padding bg-[#F4FAF8]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {filtered.map((res, idx) => {
              const Icon = res.icon;
              return (
                <Scroll3DCard
                  key={idx}
                  index={idx}
                  maxTilt={4}
                  className="p-8 rounded-3xl bg-white border border-teal-200/70 shadow-sm hover:border-teal-500/60 hover:shadow-md transition-all flex flex-col justify-between h-full"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${res.color} border flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 bg-slate-100 rounded-full border border-gray-200">
                        {res.tag}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-xl text-navy-900 mb-2.5 hover:text-teal-700 transition-colors">
                      <Link to={res.link}>{res.title}</Link>
                    </h2>

                    <div className="text-xs font-semibold text-teal-700 mb-4 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      <span>{res.downloads}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal flex-1 mb-6">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <Link
                      to={res.link}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-teal-700 hover:text-teal-800 transition-colors"
                    >
                      <span>{res.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                    </Link>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Free Access
                    </span>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </Scroll3DSection>

      {/* ── 4. CLOSING CTA ── */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-h2 text-white mb-4">
              Need Personal <span className="text-brand-gradient">Career Guidance?</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed font-normal">
              Our career directors and technical recruiters offer 1-on-1 strategic assessments to review your resume, target tech stack, and compensation expectations.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-orange-500/25">
              Book Free Strategy Session
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};
