import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Award,
  ExternalLink,
  Check,
  PlayCircle,
  Clock,
  Terminal,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteServices, oldSiteCareerPaths } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const ItTrainingPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component State: Week-by-week syllabus scrubber
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('java-full-stack');

  const syllabusWeeks = [
    {
      week: 1,
      title: 'Enterprise Architecture & Clean Code Foundations',
      tags: ['Design Patterns', 'Concurrency', 'OOP Principles'],
      topics: [
        'Domain-Driven Design (DDD) and bounded context modeling',
        'Clean architecture & SOLID principles in enterprise codebases',
        'Multi-threading, memory layout, and concurrency patterns',
      ],
      lab: 'Build a high-concurrency order-matching thread pool with zero memory leaks.',
    },
    {
      week: 2,
      title: 'Microservices, REST & Event-Driven Meshes',
      tags: ['Spring Boot / FastAPI', 'Kafka', 'API Gateways'],
      topics: [
        'Building resilient microservices with circuit breakers and retries',
        'Event streaming and distributed transaction outbox patterns with Apache Kafka',
        'Stateless authentication, JWT security filters, and rate limiting',
      ],
      lab: 'Implement an asynchronous distributed event pipeline with idempotent consumer queues.',
    },
    {
      week: 3,
      title: 'Cloud Infrastructure, Containers & CI/CD',
      tags: ['Docker', 'AWS ECS', 'Terraform', 'GitHub Actions'],
      topics: [
        'Containerization multi-stage builds and zero-vulnerability base images',
        'Infrastructure-as-Code with Terraform across multi-AZ AWS environments',
        'Automated CI/CD workflows, automated integration tests, and blue-green deploys',
      ],
      lab: 'Deploy a multi-service container cluster to AWS with automated PR test validation.',
    },
    {
      week: 4,
      title: 'Production System Design & Tier-1 Interview Defense',
      tags: ['System Design', 'Whiteboard Clinics', 'Mock Rounds'],
      topics: [
        'Designing for 100k+ QPS: Sharding, consistent hashing, and distributed caches',
        'Whiteboard architecture defense: trade-offs, CAP theorem, and back-of-envelope math',
        'Live 1-on-1 mock interview grills with senior engineering mentors',
      ],
      lab: 'Comprehensive live whiteboard defense against an ex-FAANG technical interviewer.',
    },
  ];

  const coursesList = [
    {
      slug: 'java-full-stack',
      title: 'Java Full Stack Engineering',
      duration: '12 Weeks',
      level: 'Intermediate to Advanced',
      desc: 'Master enterprise backend architectures with Spring Boot, Microservices, React frontend, and AWS cloud deployments.',
      tools: ['Java 21', 'Spring Boot', 'React', 'Kafka', 'AWS'],
    },
    {
      slug: 'python-development',
      title: 'Python Backend & Data Engineering',
      duration: '10 Weeks',
      level: 'Intermediate to Advanced',
      desc: 'FastAPI async microservices, distributed data processing, Snowflake pipelines, and cloud orchestration.',
      tools: ['Python 3.12', 'FastAPI', 'PySpark', 'Snowflake', 'Docker'],
    },
    {
      slug: 'data-engineering',
      title: 'Modern Data Engineering & Lakehouse',
      duration: '12 Weeks',
      level: 'Advanced',
      desc: 'ETL orchestration with Airflow, dbt dimensional modeling, distributed Spark analytics, and cloud lakehouse systems.',
      tools: ['Apache Spark', 'Airflow', 'dbt', 'BigQuery', 'Snowflake'],
    },
    {
      slug: 'aws-cloud-engineering',
      title: 'AWS Cloud & DevOps SRE Architecture',
      duration: '10 Weeks',
      level: 'Intermediate to Advanced',
      desc: 'Multi-region AWS architectures, Kubernetes cluster administration, Terraform automation, and observability telemetry.',
      tools: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus', 'Helm'],
    },
  ];

  const currentWeekData = syllabusWeeks.find((w) => w.week === activeWeek) || syllabusWeeks[0];

  return (
    <div className="w-full bg-[#FAF9FD] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: LAVENDER TINT (#EFEEFF) LEFT STICKY SYLLABUS LIST WITH CONTENT PANE
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#EFEEFF] via-[#F5F4FF] to-[#FAF9FD] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">IT Training & Upskilling</span>
          </div>

          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-900 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
              <span>Enterprise Engineering Upskilling & Mentorship</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Rigorous Technical Training That <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F25C2A]">
                Converts to Direct Offers.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              We bridge academic theory with live enterprise production code. Master distributed microservices, cloud deployments, and rigorous whiteboard coding defense led by active senior engineering architects.
            </p>
          </div>

          {/* Signature Component: Left Sticky Syllabus List with Content Pane */}
          <div id="syllabus-scrubber" className="p-6 sm:p-8 rounded-3xl bg-white border border-indigo-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Hands-On Curriculum</span>
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">Interactive 4-Phase Curriculum Scrubber</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Scrub weeks:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((wk) => (
                    <button
                      key={wk}
                      onClick={() => setActiveWeek(wk)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        activeWeek === wk
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      W{wk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Split: Left syllabus selector, Right week content pane */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Stepper List */}
              <div className="md:col-span-4 space-y-2">
                {syllabusWeeks.map((item) => (
                  <button
                    key={item.week}
                    onClick={() => setActiveWeek(item.week)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                      activeWeek === item.week
                        ? 'bg-[#EFEEFF] border-indigo-400 text-indigo-950 shadow-xs ring-2 ring-indigo-200/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                      Phase 0{item.week}
                    </div>
                    <div className="font-heading font-bold text-xs text-[#0F172A] mt-0.5 line-clamp-1">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Week Content Pane */}
              <div className="md:col-span-8 p-6 rounded-2xl bg-[#F8F7FF] border border-indigo-100 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    Week 0{currentWeekData.week} Milestone
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentWeekData.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white border border-indigo-100 text-[10px] font-mono font-medium text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="font-heading font-bold text-base text-[#0F172A]">{currentWeekData.title}</h4>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-950 block">Key Technical Competencies:</span>
                  <ul className="space-y-1.5">
                    {currentWeekData.topics.map((t, idx) => (
                      <li key={idx} className="text-xs text-[#475569] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-indigo-200/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2410C]">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Hands-On Production Lab Deliverable:</span>
                  </div>
                  <p className="text-xs text-slate-700 font-mono leading-relaxed">{currentWeekData.lab}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SKILL DEVELOPMENT PROGRAM (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Proven Framework</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.skillDevelopment.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.skillDevelopment.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.skillDevelopment.highlights.map((h, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Conducted in small cohort workshops with direct architectural feedback on your code and system diagrams.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CAREER TRACKS CATALOG (LINKS TO EXISTING COURSE PAGES)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-custom space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Dedicated Cohorts</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
                Explore In-Depth Technical Tracks
              </h2>
            </div>
            <Button
              onClick={onOpenConsultation}
              className="self-start sm:self-auto bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-2.5 px-5"
            >
              Inquire About Next Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursesList.map((course) => (
              <div
                key={course.slug}
                className="p-6 rounded-3xl bg-[#FAF9FD] border border-indigo-100/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                      {course.duration} • {course.level}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#0F172A]">{course.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{course.desc}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-mono border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-indigo-100 flex items-center justify-between">
                  <Link
                    to={`/services/it-training/${course.slug}`}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 group"
                  >
                    View Full Syllabus & Outcomes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={onOpenConsultation}
                    className="text-xs font-bold text-[#C2410C] hover:underline"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CLOSING CTA BANNER (Lavender Deck)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom py-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#EFEEFF] via-[#F4F3FF] to-white border border-indigo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Ready to Upgrade Your Engineering Depth?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Speak with a technical instructor to assess your current skills and determine the ideal learning track.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Book Free Assessment <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
