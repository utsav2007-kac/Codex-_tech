import React from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Lock,
  Cpu,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';

interface IndustryData {
  slug: string;
  title: string;
  tagline: string;
  challenges: string[];
  rolesPlaced: string[];
  skillsTech: string[];
  complianceNotes: string[];
  hiringMethodology: string;
  sampleStory: { title: string; outcome: string };
}

const INDUSTRY_DATA: Record<string, IndustryData> = {
  'banking-finance': {
    slug: 'banking-finance',
    title: 'Banking & Financial Services',
    tagline: 'Ultra-low latency microservices, distributed ledgers, and PCI-DSS compliance.',
    challenges: [
      'Strict regulatory scrutiny requiring flawless SOC 2, GLBA, and PCI-DSS compliance screening.',
      'Complex legacy core-banking migrations toward modern event-driven cloud architectures.',
      'Intense competition for engineers fluent in real-time streaming (Kafka, Flink, Spark).',
      'Zero-tolerance tolerance for application downtime and transactional data inconsistency.',
    ],
    rolesPlaced: [
      'Senior Java Microservices Architect (FinTech)',
      'Cloud DevOps / Kubernetes Specialist (Banking)',
      'Data Engineer (Real-time Transaction Pipelines)',
      'Cybersecurity SIEM & SOC Analyst',
      'Quantitative Systems Developer (C++ / Python)',
    ],
    skillsTech: ['Spring Boot', 'Apache Kafka', 'AWS / Azure Cloud', 'PostgreSQL / Oracle', 'Docker & Kubernetes', 'Python FinTech', 'C++ Low Latency'],
    complianceNotes: ['Full 7-year multi-jurisdictional criminal vetting', 'Credit report verification (where permissible by law)', 'Strict OFAC and global sanction registry clearance', 'Automated NDA and intellectual property assignments'],
    hiringMethodology: 'We maintain a dedicated bench of FinTech and banking engineers who have already undergone preliminary financial compliance screenings and technical system design assessments.',
    sampleStory: {
      title: 'Placed 4 Senior Core Banking Developers in 16 Days',
      outcome: 'A major payment infrastructure provider integrated our candidates into their live ACH clearing pipeline ahead of peak Q4 volumes.',
    },
  },
  'healthcare': {
    slug: 'healthcare',
    title: 'Healthcare & Life Sciences',
    tagline: 'HIPAA-compliant cloud architectures, EHR integrations, and patient analytics.',
    challenges: [
      'Strict adherence to HIPAA, HITECH, and patient data confidentiality requirements.',
      'Interfacing with disparate Electronic Health Record (EHR) standards (HL7, FHIR).',
      'Scaling machine learning models for diagnostic imaging without compromising patient privacy.',
      'Shortage of software engineers who understand medical compliance protocols.',
    ],
    rolesPlaced: [
      'HealthTech Full Stack Engineer (React / Node)',
      'Healthcare Data Scientist (Predictive Patient Analytics)',
      'FHIR / HL7 Integration Specialist',
      'HIPAA Cloud Infrastructure Security Engineer',
      'Medical Device QA Automation Lead',
    ],
    skillsTech: ['Python', 'FHIR / HL7', 'AWS HealthLake', 'React & TypeScript', 'Snowflake', 'PostgreSQL', 'Docker'],
    complianceNotes: ['Mandatory HIPAA data security protocol training certification', 'Detailed pre-employment medical and background screenings', 'Strict 10-panel drug screening options'],
    hiringMethodology: 'Every candidate submitted to healthcare clients has demonstrated practical experience with HIPAA privacy guards, encryption at rest/in transit, and audit logging frameworks.',
    sampleStory: {
      title: 'HIPAA Cloud Platform Launch Accelerated by 6 Weeks',
      outcome: 'Supplied a 3-person engineering pod that built secure telehealth microservices with zero security compliance audit defects.',
    },
  },
  'insurance': {
    slug: 'insurance',
    title: 'Insurance & InsurTech',
    tagline: 'Actuarial analytics, automated claims processing, and policy engines.',
    challenges: [
      'Modernizing monolithic policy management systems into reactive microservices.',
      'Integrating predictive AI models into real-time underwriting risk calculations.',
      'Managing massive policyholder datasets with strict state insurance commissioner compliance.',
      'High demand for Salesforce Financial Services Cloud and Guidewire specialists.',
    ],
    rolesPlaced: [
      'Salesforce Financial Services Cloud Developer',
      'Actuarial Data Engineer (PySpark & Databricks)',
      'Claims Automation Full Stack Developer',
      'Enterprise Solutions Architect (Guidewire)',
      'Lead QA Automation Engineer (Policy Platforms)',
    ],
    skillsTech: ['Salesforce FSC', 'Guidewire', 'Python / PySpark', 'Java Spring Boot', 'AWS / Azure', 'React', 'Snowflake'],
    complianceNotes: ['State-by-state insurance licensing compliance checks', 'Financial integrity and credit background verification', 'FCRA compliant pre-screening workflows'],
    hiringMethodology: 'We source engineers who understand underwriting workflows, claims lifecycles, and modern InsurTech customer self-service portals.',
    sampleStory: {
      title: 'Automating Claims Processing for Regional Insurer',
      outcome: 'Placed 2 Salesforce developers and an ETL specialist who built an automated claims intake flow that reduced claim processing time by 40%.',
    },
  },
  'retail-ecommerce': {
    slug: 'retail-ecommerce',
    title: 'Retail & E-Commerce',
    tagline: 'High-concurrency storefronts, supply chain logistics, and recommendation systems.',
    challenges: [
      'Preparing infrastructure for massive traffic surges (Black Friday / Cyber Monday).',
      'Building headless commerce frontends with sub-second page load times for CWV.',
      'Complex omni-channel inventory synchronization between physical stores and digital warehouses.',
      'Rapid deployment of AI-powered personalized product recommendations.',
    ],
    rolesPlaced: [
      'Senior Frontend Engineer (Next.js / Headless Commerce)',
      'Backend Microservices Developer (Node / Go / Java)',
      'Inventory & Supply Chain Data Engineer',
      'Site Reliability Engineer (Multi-Region Cloud)',
      'Recommendation Systems ML Specialist',
    ],
    skillsTech: ['Next.js', 'React', 'Node.js', 'Kafka', 'Redis', 'AWS CloudFront', 'Docker / Kubernetes', 'PostgreSQL'],
    complianceNotes: ['PCI-DSS payment gateway compliance vetting', 'Fast digital onboarding for holiday surge contracts', 'Flexible 1099 and W2 contractor models'],
    hiringMethodology: 'We evaluate candidates under high-throughput concurrency scenarios to verify they can engineer distributed caching and fault-tolerant carts.',
    sampleStory: {
      title: 'Zero Downtime During Cyber Week',
      outcome: 'Supplied 3 senior performance engineers who optimized database connection pools and caching, enabling 100% platform availability across peak sales.',
    },
  },
  'telecom': {
    slug: 'telecom',
    title: 'Telecommunications & Networks',
    tagline: '5G network virtualization, SDN, and massive IoT telemetry pipelines.',
    challenges: [
      'Transitioning physical network hardware to Software-Defined Networking (SDN) and NFV.',
      'Processing terabytes of real-time cell tower telemetry and CDR data.',
      'Deploying low-latency edge computing applications close to 5G towers.',
      'Shortage of engineers proficient in low-level networking protocols and cloud orchestration.',
    ],
    rolesPlaced: [
      'Network Virtualization Engineer (SDN / NFV)',
      'Real-Time Telemetry Data Engineer (Kafka / Spark)',
      'Cloud Infrastructure & Edge DevOps Specialist',
      'Embedded Firmware / C++ Developer',
      'Telecom Billing Systems Analyst',
    ],
    skillsTech: ['Linux Internals', 'C / C++', 'Python', 'Kafka', 'Kubernetes Edge', 'Terraform', 'Prometheus / Grafana'],
    complianceNotes: ['Federal telecom compliance screening', 'Multi-state field and hybrid work eligibility', 'Strict intellectual property safeguarding'],
    hiringMethodology: 'Our telecom recruitment pod evaluates engineers on socket programming, Linux kernel parameters, and distributed network monitoring.',
    sampleStory: {
      title: '5G Edge Analytics Platform Deployed Ahead of Schedule',
      outcome: 'Placed 4 specialized Linux network engineers who built an automated telemetry ingestion pipeline processing 200,000 events per second.',
    },
  },
  'manufacturing': {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial IoT',
    tagline: 'Smart factories, predictive maintenance sensors, and enterprise ERP integration.',
    challenges: [
      'Bridging legacy Operational Technology (OT) on factory floors with modern cloud IT.',
      'Implementing real-time computer vision for automated quality inspection lines.',
      'Integrating shop-floor telemetry directly into enterprise SAP S/4HANA workflows.',
      'Ensuring industrial network security against ransomware and operational interruptions.',
    ],
    rolesPlaced: [
      'Industrial IoT Cloud Architect (AWS IoT / Azure IoT Hub)',
      'SAP S/4HANA Supply Chain & MM Consultant',
      'Predictive Maintenance ML Engineer',
      'SCADA & PLC Software Integration Engineer',
      'Computer Vision Quality Assurance Developer',
    ],
    skillsTech: ['SAP S/4HANA', 'Azure IoT', 'Python', 'Computer Vision (OpenCV)', 'MQTT', 'Docker Edge', 'SQL'],
    complianceNotes: ['Factory floor safety compliance checks', 'On-site facility background clearances', 'International supply chain compliance vetting'],
    hiringMethodology: 'We match manufacturing leaders with technical specialists who possess hands-on familiarity with industrial automation and enterprise ERP suites.',
    sampleStory: {
      title: 'Predictive Sensor Architecture Saves $1.2M in Unplanned Downtime',
      outcome: 'Deployed an IoT data engineering team that established real-time vibration telemetry dashboards across 4 automated assembly plants.',
    },
  },
  'government-public-sector': {
    slug: 'government-public-sector',
    title: 'Government & Public Sector',
    tagline: 'Citizen-facing digital services, FedRAMP clouds, and security clearances.',
    challenges: [
      'Navigating strict public procurement rules and rigid federal security mandates (FedRAMP, NIST).',
      'Legacy mainframe and COBOL modernization towards secure cloud architectures.',
      'Requirement for US Citizens holding active or interim security clearances (Secret / Top Secret).',
      'Strict accessibility compliance standards (Section 508 and WCAG 2.1 AA).',
    ],
    rolesPlaced: [
      'Cleared Cloud DevOps Architect (AWS GovCloud)',
      'Section 508 Accessibility Frontend Engineer',
      'Enterprise Java / Spring Modernization Specialist',
      'Information Assurance & FedRAMP Security Officer',
      'Public Records Database Architect',
    ],
    skillsTech: ['AWS GovCloud', 'Java / Spring', 'Section 508 / WCAG', 'Linux', 'Kubernetes', 'Python', 'PostgreSQL'],
    complianceNotes: ['Mandatory US Citizenship verification', 'Security clearance verification (Public Trust, Secret, TS/SCI)', 'Rigorous federal background check compliance'],
    hiringMethodology: 'We maintain an active roster of cleared US citizen technologists ready to mobilize onto prime government and state agency contracts.',
    sampleStory: {
      title: 'State Portal Modernization Completed 100% Section 508 Compliant',
      outcome: 'Supplied 5 cleared frontend and accessibility engineers who modernized a public benefits portal serving over 2 million citizens.',
    },
  },
};

export const IndustryDetail: React.FC = () => {
  const { industry: slug } = useParams<{ industry: string }>();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const industry = slug ? INDUSTRY_DATA[slug] : null;

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${industry.title} IT Staffing & Placement`}
        description={industry.tagline}
        canonical={`/industries/${industry.slug}`}
      />

      {/* Hero Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Industries', path: '/industries' },
              { label: industry.title },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Sector-Calibrated Staffing</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              {industry.title}
            </h1>
            <p className="text-lg font-heading font-semibold text-orange-600 mb-4">
              "{industry.tagline}"
            </p>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
              We deploy technical specialists calibrated specifically for {industry.title} architectures, regulatory compliance mandates, and operational tempos.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" href="/employers">
                Request Sector Talent Shortlist <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={onOpenConsultation}>
                Book Technical Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sector Challenges & Hiring Methodology */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Challenges */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="eyebrow">Industry Friction</div>
              <h2 className="text-h2 text-navy-900">
                Key Sector Hiring <span className="text-brand-gradient">Challenges.</span>
              </h2>
              <div className="flex flex-col gap-3">
                {industry.challenges.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology & Compliance */}
            <div className="lg:col-span-6 bg-navy-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="eyebrow text-orange-400">Our Sourcing Model</div>
                <h3 className="text-h3 font-bold text-white mb-4">How We Hire for {industry.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {industry.hiringMethodology}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">Compliance & Vetting Highlights</h4>
                <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                  {industry.complianceNotes.map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-navy-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Typical Shortlist Velocity:</span>
                <span className="text-sm font-bold text-orange-400 ml-2">48 - 72 Business Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles We Place & Tech Stack */}
      <section className="section-padding bg-gray-50 border-t border-gray-200/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Roles We Fill */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-navy-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" /> Roles We Place
              </h3>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-700">
                {industry.rolesPlaced.map((role, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 pb-3 border-b border-gray-100 last:border-b-0">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-semibold">{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-Demand Skills & Tools */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-6 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" /> In-Demand Skills & Tech
                </h3>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {industry.skillsTech.map((tech, idx) => (
                    <span key={idx} className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-semibold text-navy-900 border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Case Study Box */}
              <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-1 block">Verified Result (SAMPLE)</span>
                <h4 className="font-heading font-bold text-sm text-navy-900 mb-1">{industry.sampleStory.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{industry.sampleStory.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sector CTA */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Build Your {industry.title} Engineering Pod
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Tell us your headcount and stack requirements. Receive a curated shortlist within 48 business hours.
          </p>
          <Button variant="primary" size="lg" href="/employers">
            Request Talent Shortlist Now
          </Button>
        </div>
      </section>
    </div>
  );
};
