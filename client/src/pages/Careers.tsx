import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Globe,
  Sparkles,
  Users,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  X,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHero } from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  skills: string[];
  visa: string;
  description: string;
  isHot?: boolean;
}

export const Careers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [activeJobForModal, setActiveJobForModal] = useState<JobListing | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLinkedIn, setApplicantLinkedIn] = useState('');
  const [applicantVisa, setApplicantVisa] = useState('US_CITIZEN_GC');
  const [applicantFile, setApplicantFile] = useState<File | null>(null);

  const jobs: JobListing[] = useMemo(
    () => [
      {
        id: 'job-1',
        title: 'Lead AWS Cloud Solutions Architect',
        department: 'Cloud & Infrastructure',
        location: 'Dallas, TX (Hybrid) / Remote',
        type: 'Full-time',
        salary: '$145,000 - $175,000 / yr',
        experience: '7+ years',
        skills: ['AWS', 'Terraform', 'Kubernetes', 'EKS', 'Microservices', 'Zero Trust'],
        visa: 'US Citizen / GC / H-1B Transfer',
        description:
          'Design enterprise multi-account AWS landing zones, lead Kubernetes migration pipelines, and architect fault-tolerant infrastructure for Fortune 500 financial systems.',
        isHot: true,
      },
      {
        id: 'job-2',
        title: 'Senior Full-Stack Engineer (React & Node.js)',
        department: 'Software Engineering',
        location: 'Plano, TX / Remote USA',
        type: 'Full-time',
        salary: '$130,000 - $160,000 / yr',
        experience: '5+ years',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind'],
        visa: 'All Work Authorizations Welcome',
        description:
          'Build high-throughput customer-facing financial dashboards with sub-second response times. Partner with product teams to architect real-time WebSocket communication pipelines.',
        isHot: true,
      },
      {
        id: 'job-3',
        title: 'DevOps & Platform Automation Specialist',
        department: 'Cloud & Infrastructure',
        location: 'Atlanta, GA / Remote',
        type: 'Contract-to-Hire',
        salary: '$70 - $90 / hr',
        experience: '4+ years',
        skills: ['Docker', 'Kubernetes', 'ArgoCD', 'GitHub Actions', 'Prometheus', 'Helm'],
        visa: 'STEM-OPT / H-1B / GC / US Citizen',
        description:
          'Maintain production CI/CD deployment pipelines, implement automated canary releases, and establish GitOps practices for high-velocity engineering organizations.',
      },
      {
        id: 'job-4',
        title: 'Senior Data Engineer (Snowflake & PySpark)',
        department: 'Data & AI',
        location: 'Chicago, IL (Hybrid) / Remote',
        type: 'Full-time',
        salary: '$135,000 - $165,000 / yr',
        experience: '5+ years',
        skills: ['Snowflake', 'PySpark', 'dbt', 'Airflow', 'AWS S3', 'Python'],
        visa: 'H-1B Sponsored / GC / Citizen',
        description:
          'Architect petabyte-scale ELT data lakes and warehouse pipelines. Transform streaming telemetric event data into performant dimensional models.',
        isHot: true,
      },
      {
        id: 'job-5',
        title: 'AI / Machine Learning Solutions Specialist',
        department: 'Data & AI',
        location: 'San Jose, CA / Remote USA',
        type: 'Full-time',
        salary: '$150,000 - $185,000 / yr',
        experience: '4+ years',
        skills: ['Python', 'LangChain', 'LlamaIndex', 'Vector DBs', 'PyTorch', 'FastAPI'],
        visa: 'Open to All Eligible Work Visas',
        description:
          'Develop production RAG (Retrieval-Augmented Generation) pipelines, fine-tune open-source LLMs, and deploy low-latency inference endpoints on cloud GPUs.',
      },
      {
        id: 'job-6',
        title: 'QA Lead Automation Engineer (Playwright & TypeScript)',
        department: 'Quality Engineering',
        location: 'Remote USA',
        type: 'Full-time',
        salary: '$115,000 - $140,000 / yr',
        experience: '5+ years',
        skills: ['Playwright', 'TypeScript', 'Cypress', 'API Testing', 'CI/CD Pipelines'],
        visa: 'All Work Authorizations Welcome',
        description:
          'Lead automated regression frameworks, design robust end-to-end test suites across distributed micro-frontends, and eliminate manual release bottlenecks.',
      },
      {
        id: 'job-7',
        title: 'Cybersecurity SOC Lead & Threat Analyst',
        department: 'Security & Compliance',
        location: 'Plano, TX (Onsite/Hybrid)',
        type: 'Full-time',
        salary: '$125,000 - $155,000 / yr',
        experience: '5+ years',
        skills: ['SIEM', 'CrowdStrike', 'Splunk', 'Incident Response', 'CISSP / CEH'],
        visa: 'US Citizen or Green Card Required',
        description:
          'Monitor threat intelligence feeds, lead root-cause investigations on security alerts, and harden enterprise multi-cloud perimeters against zero-day exploits.',
      },
      {
        id: 'job-8',
        title: 'Senior Technical Recruiter (IT Placement)',
        department: 'Talent Acquisition Operations',
        location: 'Plano, TX or Hyderabad Hub',
        type: 'Full-time (Base + Uncapped Bonus)',
        salary: '$75,000 - $110,000 + Comm.',
        experience: '3+ years',
        skills: ['Technical Sourcing', 'Candidate Care', 'ATS Management', 'Client Advisory'],
        visa: 'Local Authorization Required',
        description:
          'Connect top-tier software engineers and architects with hiring managers. Manage candidate lifecycle from initial sourcing through offer acceptance.',
      },
    ],
    []
  );

  const departments = ['ALL', 'Cloud & Infrastructure', 'Software Engineering', 'Data & AI', 'Quality Engineering', 'Security & Compliance', 'Talent Acquisition Operations'];
  const employmentTypes = ['ALL', 'Full-time', 'Contract-to-Hire'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || job.department === selectedDept;
    const matchesType = selectedType === 'ALL' || job.type === selectedType;
    return matchesSearch && matchesDept && matchesType;
  });

  const perks = [
    {
      title: 'Competitive Compensation & High Bonus Bands',
      desc: 'Top-tier base salaries benchmarked against the 75th percentile of US tech compensation, plus performance bonuses.',
      icon: DollarSign,
    },
    {
      title: 'Full Healthcare, Dental & Vision Coverage',
      desc: 'Comprehensive medical insurance policies with low deductibles for employees and dependent family members.',
      icon: Heart,
    },
    {
      title: 'Work Authorization & Visa Support',
      desc: 'Experienced in-house legal support for H-1B transfers, STEM-OPT extensions, and employment Green Card petitions.',
      icon: ShieldCheck,
    },
    {
      title: 'Continuous Upskilling & Tech Stipends',
      desc: '$2,500 annual learning stipend covering AWS/GCP cloud certifications, O’Reilly libraries, and system design masterclasses.',
      icon: Zap,
    },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Quick 1-Click Application',
      desc: 'Submit your resume and target role preferences. Our staff engineers review submissions within 24 hours.',
    },
    {
      num: '02',
      title: 'Engineer-Led Calibration',
      desc: 'A friendly 30-minute technical conversation assessing your core strengths, GitHub repositories, and system design experience.',
    },
    {
      num: '03',
      title: 'Direct Client Introduction',
      desc: 'Skip generic HR black holes. We present your calibrated profile directly to decision-making engineering directors.',
    },
    {
      num: '04',
      title: 'Offer Negotiation & Launch',
      desc: 'We advocate for maximum market compensation, assist with relocation/visa compliance, and provide onboarding support.',
    },
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      // Auto close after 3s
      setApplicationSubmitted(false);
      setActiveJobForModal(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setApplicantLinkedIn('');
      setApplicantFile(null);
    }, 2800);
  };

  return (
    <div className="bg-white">
      <SEO
        title="Careers & Open Tech Jobs | Codex Tech-IT - We Deliver Jobs Faster"
        description="Explore high-paying IT jobs in Cloud Architecture, Full-Stack Engineering, DevOps, Data & AI, and Cybersecurity. Fast 18-day average hiring turnaround with dedicated candidate advocacy."
        canonical="/careers"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Life at Codex Visual) ── */}
      <PageHero
        eyebrow="Active Open Requisitions · Verified Partners"
        title={
          <>
            Find Your Next Role <span className="text-brand-gradient">Faster.</span>
          </>
        }
        tagline="Direct Decision-Maker Access & 18-Day Average Placement"
        summary="Join leading enterprise engineering teams and high-growth technology companies. Every role listed here is backed by direct hiring manager access and dedicated candidate advocacy."
        breadcrumbs={[{ label: 'Careers' }]}
        primaryCta={{
          label: 'Explore Open Roles',
          onClick: () => {
            const el = document.getElementById('jobs-board');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Submit Resume Directly',
          onClick: () => setActiveJobForModal(jobs[0]),
        }}
        facts={[
          { icon: Briefcase, label: 'Active Requisitions', value: `${jobs.length} Openings` },
          { icon: Clock, label: 'Hiring Turnaround', value: '18 Days' },
          { icon: ShieldCheck, label: 'Candidate Representation', value: '100% Free' },
        ]}
        visual="careers-life"
      />

      {/* Search & Filter Bar */}
      <section id="jobs-board" className="py-8 bg-slate-50/80 border-b border-slate-200/60">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, skill (e.g. AWS, React, Python) or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent hover:border-gray-200 focus:border-orange-500 text-sm text-navy-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-3 px-4 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-navy-900 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Departments' : d}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-3 px-4 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-navy-900 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Contract Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Job Board Listing */}
      <Scroll3DSection preset="lift" className="section-padding bg-slate-50 border-b border-gray-200/60">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-navy-900">
                Open Engineering Requisitions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredJobs.length} active positions matching your criteria
              </p>
            </div>
            {(searchTerm || selectedDept !== 'ALL' || selectedType !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDept('ALL');
                  setSelectedType('ALL');
                }}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </SectionReveal>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 max-w-md mx-auto">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                No open positions match your current search.
              </p>
              <p className="text-xs text-slate-500 mb-6">
                New roles are added weekly. Submit an open profile calibration and our recruiters will match you as soon as a fitting opening opens.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDept('ALL');
                  setSelectedType('ALL');
                }}
              >
                View All Available Jobs
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredJobs.map((job, index) => (
                <Scroll3DCard
                  key={job.id}
                  index={index}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-bold">
                        {job.department}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {job.type}
                      </span>
                      {job.isHot && (
                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3 text-orange-600" /> Hot Opening
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-navy-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-navy-900">
                        <MapPin className="w-4 h-4 text-orange-500" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <DollarSign className="w-4 h-4 text-emerald-600" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" /> {job.experience}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-blue-600" /> {job.visa}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {job.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-slate-700 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:border-l lg:border-gray-100 lg:pl-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveJobForModal(job)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>1-Click Apply</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveJobForModal(job)}
                      className="hidden lg:block text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
                    >
                      View Full Specs
                    </button>
                  </div>
                </Scroll3DCard>
              ))}
            </div>
          )}
        </div>
      </Scroll3DSection>

      {/* 4-Step Placement Roadmap */}
      <Scroll3DSection preset="tilt" className="section-padding bg-white">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">The Codex Placement Advantage</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              How We Land You In <span className="text-brand-gradient">18 Days.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              A transparent, supportive engineering process engineered to get you directly before hiring directors.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {workflowSteps.map((step, idx) => (
              <Scroll3DCard
                key={idx}
                index={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-gray-200/80 relative flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-bold font-mono text-sm flex items-center justify-center mb-5 shadow-sm shrink-0">
                    {step.num}
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2 min-h-[2.85rem] flex items-start">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{step.desc}</p>
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Candidate Perks & Benefits */}
      <Scroll3DSection preset="lift" className="section-padding bg-slate-50 border-t border-gray-200/70">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Candidate Benefits</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Comprehensive Support For <span className="text-brand-gradient">Engineers.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              We advocate for competitive packages and continuous career advancement.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <Scroll3DCard
                  key={i}
                  index={i}
                  className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-5 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-2 min-h-[3rem] flex items-start">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{p.desc}</p>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </Scroll3DSection>

      {/* Interactive Application Modal */}
      {activeJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveJobForModal(null);
                setApplicationSubmitted(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {applicationSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-navy-900">
                  Application Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for applying to <span className="font-bold text-navy-900">{activeJobForModal.title}</span>. Our technical staffing advisors will review your profile and reach out within 24 business hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                    Fast-Track Application
                  </span>
                  <h3 className="text-xl font-heading font-bold text-navy-900 mt-2">
                    {activeJobForModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeJobForModal.department} · {activeJobForModal.location} · {activeJobForModal.salary}
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@domain.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1">LinkedIn or GitHub Profile</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={applicantLinkedIn}
                        onChange={(e) => setApplicantLinkedIn(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1">Visa / Work Authorization</label>
                      <select
                        value={applicantVisa}
                        onChange={(e) => setApplicantVisa(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                      >
                        <option value="US_CITIZEN_GC">US Citizen / Permanent Resident</option>
                        <option value="H1B">H-1B Visa (Transfer Eligible)</option>
                        <option value="OPT_STEM">F-1 STEM OPT</option>
                        <option value="L2_H4_EAD">H-4 / L-2 EAD</option>
                        <option value="OTHER">Other / Requires Sponsorship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">Upload Resume (PDF, DOCX) *</label>
                    <div className="border-2 border-dashed border-gray-200 hover:border-orange-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50">
                      <input
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setApplicantFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-file-input"
                      />
                      <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud className="w-8 h-8 text-orange-500 mb-2" />
                        <span className="text-xs font-bold text-navy-900">
                          {applicantFile ? applicantFile.name : 'Click to select resume file'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Maximum file size 10MB</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-md shadow-orange-500/25 cursor-pointer"
                    >
                      Submit Application to Codex Tech-IT
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                      🔒 Your contact information and resume are kept strictly confidential under our strict candidate privacy policy.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
