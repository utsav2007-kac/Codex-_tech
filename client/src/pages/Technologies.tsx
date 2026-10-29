import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Code2,
  Server,
  Cloud,
  Database,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

interface TechStackCategory {
  category: string;
  icon: any;
  techs: string[];
  roles: string[];
}

const TECH_CATALOG: TechStackCategory[] = [
  {
    category: 'Backend & Microservices',
    icon: Server,
    techs: ['Java 21', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'Go', 'Kafka', 'RabbitMQ', 'RESTful APIs', 'gRPC'],
    roles: ['Backend Software Engineer', 'Java Microservices Architect', 'Python API Developer', 'Distributed Systems Engineer'],
  },
  {
    category: 'Frontend & Web Platforms',
    icon: Code2,
    techs: ['React 18', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Redux Toolkit', 'GraphQL', 'HTML5 / Modern CSS'],
    roles: ['Frontend React Developer', 'UI/UX Systems Engineer', 'Full Stack JavaScript Engineer', 'Design Systems Specialist'],
  },
  {
    category: 'Cloud & Infrastructure (DevOps)',
    icon: Cloud,
    techs: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'Helm', 'ArgoCD', 'CI/CD Pipelines'],
    roles: ['Cloud Solutions Architect', 'DevOps Automation Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer'],
  },
  {
    category: 'Data Engineering & Analytics',
    icon: Database,
    techs: ['Apache Spark', 'Snowflake', 'Apache Airflow', 'dbt', 'Databricks', 'PostgreSQL', 'MongoDB', 'Redis', 'Python / PySpark'],
    roles: ['Data Pipeline Engineer', 'Snowflake Warehouse Architect', 'Big Data Spark Specialist', 'BI Analytics Developer'],
  },
  {
    category: 'Cybersecurity & Governance',
    icon: Shield,
    techs: ['Splunk', 'SIEM Operations', 'Wireshark', 'Burp Suite', 'Zero Trust', 'SOC 2', 'NIST Framework', 'Kali Linux'],
    roles: ['Security Operations Center (SOC) Analyst', 'Application Security Engineer', 'Cloud Penetration Tester', 'GRC Officer'],
  },
  {
    category: 'Enterprise Applications (CRM / ERP)',
    icon: Smartphone,
    techs: ['Salesforce Apex', 'Lightning Web Components', 'Salesforce Admin', 'SAP S/4HANA', 'ABAP', 'SAP Fiori', 'SAP FICO / MM'],
    roles: ['Lead Salesforce Developer', 'Salesforce Solutions Consultant', 'SAP S/4HANA Functional Lead', 'ABAP Extension Developer'],
  },
];

// Interactive Tabbed Stack Explorer Data (Cloud, Data, Web, AI)
const STACK_EXPLORER_TABS = [
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    badge: 'High Demand',
    icon: Cloud,
    tagline: 'Multi-Account AWS & Azure Landing Zones',
    description:
      'We place certified Cloud Architects and DevOps Engineers capable of architecting resilient multi-region infrastructure, automating zero-downtime Kubernetes deployments, and maintaining strict SOC 2 compliance.',
    coreTechnologies: ['AWS (EKS, Lambda, SQS)', 'Kubernetes & Docker', 'Terraform & OpenTofu', 'ArgoCD & GitHub Actions', 'Prometheus & Grafana'],
    averageSalary: '$140,000 - $185,000',
    turnaround: '16 Days Avg Offer',
    typicalRoles: ['Senior Cloud Architect', 'DevOps Platform Engineer', 'Site Reliability Engineer (SRE)', 'Kubernetes Specialist'],
    interviewTopics: ['Zero-trust network architecture', 'Kubernetes pod auto-scaling & ingress', 'Terraform state locking & modularization'],
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    badge: 'Enterprise Growth',
    icon: Database,
    tagline: 'Petabyte-Scale Spark & Modern Warehouses',
    description:
      'From real-time streaming with Apache Kafka to scalable cloud data warehousing in Snowflake and Databricks. Our candidates engineer reliable ELT/ETL pipelines handling millions of transactional events per second.',
    coreTechnologies: ['Apache Spark & PySpark', 'Snowflake & BigQuery', 'Apache Airflow & dbt', 'Kafka & AWS Kinesis', 'PostgreSQL & Redshift'],
    averageSalary: '$135,000 - $175,000',
    turnaround: '18 Days Avg Offer',
    typicalRoles: ['Lead Data Engineer', 'Snowflake Architect', 'PySpark Streaming Developer', 'Analytics Engineering Lead'],
    interviewTopics: ['Data warehouse dimensional modeling (Star/Snowflake)', 'Spark broadcast joins & partition tuning', 'dbt test coverage & CI testing'],
  },
  {
    id: 'web',
    name: 'Modern Web & Full-Stack',
    badge: 'Volume Placement',
    icon: Code2,
    tagline: 'High-Performance React, Node & Java Systems',
    description:
      'Engineers who bridge elegant UI design systems with enterprise distributed backends. Specialists in serverless APIs, micro-frontends, high-concurrency Spring Boot services, and TypeScript full-stack applications.',
    coreTechnologies: ['React 18 & TypeScript', 'Next.js & Server Components', 'Java 21 & Spring Boot', 'Node.js & NestJS', 'GraphQL & RESTful APIs'],
    averageSalary: '$130,000 - $165,000',
    turnaround: '14 Days Avg Offer',
    typicalRoles: ['Full-Stack Software Engineer', 'Staff Frontend React Architect', 'Java Microservices Engineer', 'TypeScript Lead'],
    interviewTopics: ['Web vitals & state management (Redux/Zustand)', 'Distributed transaction patterns (Saga)', 'Event-driven message routing'],
  },
  {
    id: 'ai',
    name: 'AI & Systems Engineering',
    badge: 'Emerging Frontier',
    icon: Cpu,
    tagline: 'Generative AI Pipelines & High-Throughput Go Systems',
    description:
      'Software engineers and AI practitioners building retrieval-augmented generation (RAG) engines, embedding search pipelines, fine-tuned LLM agents, and ultra-low latency backend services in Go and Rust.',
    coreTechnologies: ['Python & PyTorch', 'LangChain & LlamaIndex', 'Vector DBs (Pinecone, Qdrant)', 'Go (Golang) Microservices', 'gRPC & Protocol Buffers'],
    averageSalary: '$150,000 - $195,000',
    turnaround: '17 Days Avg Offer',
    typicalRoles: ['Generative AI Engineer', 'AI/ML Pipeline Architect', 'Go Backend Systems Engineer', 'LLM Integration Specialist'],
    interviewTopics: ['Vector embedding retrieval & chunking strategies', 'Concurrent routine handling in Go', 'Model quantization & low-latency inference'],
  },
];

export const Technologies: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTabId, setActiveTabId] = useState<string>('cloud');

  const filtered = selectedCategory === 'all'
    ? TECH_CATALOG
    : TECH_CATALOG.filter((c) => c.category === selectedCategory);

  const activeTab = STACK_EXPLORER_TABS.find((t) => t.id === activeTabId) || STACK_EXPLORER_TABS[0];
  const ActiveTabIcon = activeTab.icon;

  return (
    <div className="bg-[#0B132B] text-slate-100 overflow-x-hidden min-h-screen">
      <SEO
        title="Technologies & Stacks We Place | Full Stack, Cloud, Data, AI | Codex Tech-IT"
        description="Explore the technical stacks, languages, and frameworks Codex Tech-IT specializes in—and the precise engineering roles we fill across North America and India."
        canonical="/technologies"
      />

      {/* ── 1. DARK SLATE HERO WITH ANIMATED TECH GRID & NEON BLUE ACCENTS ── */}
      <section className="relative bg-gradient-to-br from-[#060D24] via-[#0B1536] to-[#0A1A3F] border-b border-cyan-500/20 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Neon blue and cyan atmospheric glows */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf812_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Breadcrumbs and Coloured Page Label Chip */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Breadcrumbs items={[{ label: 'Technologies' }]} className="text-cyan-200/80" />
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tech Stack Matrix</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ENTERPRISE TECH STACKS · 45+ FRAMEWORKS
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] text-white">
                Technologies & Stacks We{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Vette & Place.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                We do not staff generalists. Our candidate evaluation engines and placement pipelines are organized by technical stack depth, evaluating real-world system architecture, algorithmic proficiency, and production code quality.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('stack-explorer');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shadow-lg shadow-cyan-500/20"
                >
                  Explore Stack Explorer
                </Button>
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm transition-all border border-cyan-400/30 backdrop-blur-md hover:border-cyan-400/60 flex items-center justify-center cursor-pointer"
                >
                  Discuss Custom Requisition
                </button>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-cyan-400">6</div>
                  <div className="text-xs text-slate-400 font-medium">Core Disciplines</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-sky-400">45+</div>
                  <div className="text-xs text-slate-400 font-medium">Supported Frameworks</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-numbers font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Practical Calibration</div>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Tech Grid Illustration */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 shadow-[0_0_40px_rgba(37,99,235,0.25)] flex flex-col justify-between backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">stack_telemetry.sh</span>
                </div>

                {/* Animated Tech Node Matrix */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  {[
                    { name: 'Kubernetes', level: 'v1.29', color: 'border-blue-500 text-blue-300' },
                    { name: 'AWS Cloud', level: 'Architect', color: 'border-orange-500 text-orange-300' },
                    { name: 'React 18', level: 'TypeScript', color: 'border-cyan-400 text-cyan-300' },
                    { name: 'Python', level: 'FastAPI', color: 'border-emerald-400 text-emerald-300' },
                    { name: 'Apache Spark', level: 'Streaming', color: 'border-amber-400 text-amber-300' },
                    { name: 'Kafka', level: 'Pub/Sub', color: 'border-purple-400 text-purple-300' },
                    { name: 'Terraform', level: 'IaC Cloud', color: 'border-indigo-400 text-indigo-300' },
                    { name: 'Docker', level: 'Containers', color: 'border-sky-400 text-sky-300' },
                    { name: 'Go (Golang)', level: 'gRPC Micro', color: 'border-teal-400 text-teal-300' },
                  ].map((node, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl bg-slate-800/60 border ${node.color} flex flex-col justify-between hover:bg-slate-800 transition-all shadow-xs`}
                    >
                      <div className="text-xs font-mono font-bold text-white">{node.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{node.level}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Bench Verified
                  </span>
                  <span>48h SLA Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SIGNATURE SECTION: TABBED STACK EXPLORER (Cloud, Data, Web, AI) ── */}
      <section id="stack-explorer" className="py-16 sm:py-24 bg-[#0A1128] border-b border-cyan-500/20">
        <div className="container-custom">
          <SectionReveal variant="tiltUp" className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Signature Deep-Dive
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Tabbed Stack <span className="text-cyan-400">Explorer.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Select an architectural discipline to inspect technical depth, compensation medians, and evaluation criteria.
            </p>
          </SectionReveal>

          {/* Tab Selection Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {STACK_EXPLORER_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Explorer Panel */}
          <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Detail Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40">
                    <ActiveTabIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                      {activeTab.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400">{activeTab.tagline}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeTab.description}
                </p>

                {/* Core Technologies Badges */}
                <div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 block mb-3">
                    Core Technologies & Frameworks:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeTab.coreTechnologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-cyan-200 text-xs font-mono border border-cyan-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benchmark Interview Questions */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-xs font-bold font-mono text-cyan-400 block mb-2">
                    Sample Technical Calibration Scenarios:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeTab.interviewTopics.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold font-mono">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Summary Column (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Market Comp Range</div>
                  <div className="text-3xl font-numbers font-black text-cyan-300">{activeTab.averageSalary}</div>
                  <div className="text-xs text-slate-400 mt-1">Based on US tech hubs & Tier-1 corporate roles</div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-2">Common Roles We Place</div>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {activeTab.typicalRoles.map((role, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="md" className="flex-1 justify-center" onClick={onOpenConsultation}>
                    Hire for this Stack
                  </Button>
                  <Link
                    to="/careers"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center border border-slate-700 transition-colors flex items-center justify-center"
                  >
                    View Open Roles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FULL TECH CATALOG GRID WITH NEON ACCENTS ── */}
      <section className="section-padding bg-[#070D1F] border-b border-cyan-500/20">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                All 6 Practice Areas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Filter by technical category to inspect specific tools and framework requirements
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-heading font-semibold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All (6)
              </button>
              {TECH_CATALOG.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.category
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.category.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {filtered.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <Scroll3DCard
                  key={cat.category}
                  index={idx}
                  maxTilt={4}
                  className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center">
                        <CatIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-white">{cat.category}</h3>
                        <span className="text-xs font-mono text-cyan-400">Validated Production Track</span>
                      </div>
                    </div>

                    {/* Tech Pills */}
                    <div className="mb-6 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                        Core Frameworks:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cat.techs.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Roles We Fill */}
                    <div className="pt-4 border-t border-slate-800 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3 font-mono">
                        Placed Titles:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
                        {cat.roles.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={onOpenConsultation}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Submit profile for this track →
                    </button>
                    <button
                      onClick={onOpenConsultation}
                      className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      Hire for this track →
                    </button>
                  </div>
                </Scroll3DCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. BOTTOM CTA ── */}
      <section className="section-padding bg-gradient-to-b from-[#070D1F] to-[#040817] text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4">
              Don't See Your Exact <span className="text-cyan-400">Technical Stack?</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8 font-normal leading-relaxed">
              We calibrate custom engineering requisitions and niche candidate searches across distributed, embedded, and specialized systems.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation} className="shadow-lg shadow-cyan-500/20">
              Speak with a Technical Recruiter
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};
