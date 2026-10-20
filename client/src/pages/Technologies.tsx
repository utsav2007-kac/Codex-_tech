import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Code2, Server, Cloud, Database, Shield, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHero } from '../components/layout/PageHero';
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

export const Technologies: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = selectedCategory === 'all'
    ? TECH_CATALOG
    : TECH_CATALOG.filter((c) => c.category === selectedCategory);

  return (
    <div className="bg-white">
      <SEO
        title="Technologies & Stacks We Place | Full Stack, Cloud, Data, DevOps"
        description="Explore the technical stacks, languages, and frameworks Codex Tech-IT specializes in—and the precise engineering roles we fill across North America and India."
        canonical="/technologies"
      />

      {/* ── 1. UNIVERSAL PAGE HERO (Two-Column Balanced Grid with Technologies Map Visual) ── */}
      <PageHero
        eyebrow="Engineering Matrix"
        title={
          <>
            Technologies & <span className="text-brand-gradient">Roles We Fill.</span>
          </>
        }
        tagline="Organized by Technical Stack Depth & Enterprise Architecture"
        summary="We do not staff generalists. Our candidate evaluation engines and placement pipelines are organized by technical stack depth."
        breadcrumbs={[{ label: 'Technologies' }]}
        primaryCta={{
          label: 'Explore Tech Stacks',
          onClick: () => {
            const el = document.getElementById('tech-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        secondaryCta={{
          label: 'Discuss Custom Stack',
          onClick: onOpenConsultation,
        }}
        facts={[
          { icon: Server, label: 'Core Categories', value: '6 Disciplines' },
          { icon: Cloud, label: 'Frameworks Supported', value: '45+ Techs' },
          { icon: CheckCircle2, label: 'Pre-Screening', value: '100% Practical' },
        ]}
        visual="technologies-map"
      />

      {/* Category Filter Pills */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="container-custom flex items-center gap-2 overflow-x-auto pb-2 text-xs font-heading font-semibold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {TECH_CATALOG.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.category ? 'bg-orange-500 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Tech Stacks */}
      <Scroll3DSection preset="lift" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((cat, idx) => (
              <Scroll3DCard key={cat.category} index={idx} maxTilt={5} className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl text-navy-900">{cat.category}</h2>
                      <span className="text-xs text-slate-400">Validated Technical Track</span>
                    </div>
                  </div>

                  {/* Tech Pills */}
                  <div className="mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Core Tools & Frameworks</span>
                    <div className="flex flex-wrap gap-2">
                      {cat.techs.map((t, tIdx) => (
                        <span key={tIdx} className="px-3 py-1.5 rounded-lg bg-gray-100 text-navy-900 text-xs font-semibold border border-gray-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Roles We Fill */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Roles We Commonly Fill</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
                      {cat.roles.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button onClick={onOpenConsultation} className="text-xs font-bold text-orange-500 hover:underline cursor-pointer">
                    Submit profile for this track →
                  </button>
                  <button onClick={onOpenConsultation} className="text-xs font-bold text-navy-900 hover:text-orange-500 cursor-pointer">
                    Hire for this track →
                  </button>
                </div>
              </Scroll3DCard>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Bottom CTA */}
      <Scroll3DSection preset="scaleIn" className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <SectionReveal variant="tiltUp">
            <h2 className="text-h2 text-white mb-4">
              Don't See Your Exact <span className="text-brand-gradient">Technical Stack?</span>
            </h2>
            <p className="text-slate-300 text-sm mb-8">
              We support custom requisitions and tailored candidate searches across niche engineering stacks.
            </p>
            <Button variant="primary" size="lg" onClick={onOpenConsultation}>
              Speak with a Technical Recruiter
            </Button>
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
