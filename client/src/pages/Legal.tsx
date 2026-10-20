import React from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, FileText, CheckCircle, Scale, Eye } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { PageHero } from '../components/layout/PageHero';

export const Legal: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Privacy Policy';
  let eyebrow = 'Legal Transparency';
  let lastUpdated = 'October 2026';

  let content = null;

  if (path.includes('terms')) {
    title = 'Terms and Conditions';
    eyebrow = 'Service Agreements';
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-heading font-bold text-navy-900">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the services, digital tools, training curricula, or placement programs provided by Codex Tech-IT ("Company", "we", "us", or "our"), you agree to be legally bound by these Terms and Conditions. If you do not accept these terms, you must discontinue use immediately.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">2. Description of Services</h2>
        <p>
          Codex Tech-IT provides IT technical recruitment, professional staffing, career coaching, resume rebranding, and industry-aligned IT training courses. While we exert commercial diligence to connect qualified candidates with reputable hiring partners, enrollment in our programs or services does not constitute a guaranteed offer of employment unless explicitly outlined in a countersigned client agreement.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">3. Candidate Representations & Warranties</h2>
        <p>
          You represent and warrant that all information, resumes, employment histories, academic credentials, and immigration statuses provided to Codex Tech-IT are authentic, accurate, and up to date. Misrepresentation of skills, identity, or legal work authorization constitutes grounds for immediate termination of representation without recourse.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">4. Intellectual Property</h2>
        <p>
          All course syllabi, assessment frameworks, technical interview question repositories, branding marks, and proprietary diagnostic tools (including the Resume Analyzer and Job Match algorithms) remain the exclusive intellectual property of Codex Tech-IT. Unauthorized reproduction or commercial redistribution is strictly prohibited.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Codex Tech-IT shall not be liable for any indirect, incidental, consequential, or punitive damages arising from interview scheduling outcomes, employer hiring decisions, or third-party platform interruptions.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">6. Governing Law & Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions. Any legal actions or proceedings shall be instituted in Dallas County, Texas.
        </p>
      </div>
    );
  } else if (path.includes('cookie')) {
    title = 'Cookie Policy';
    eyebrow = 'Tracking & Privacy';
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-heading font-bold text-navy-900">1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your computer or mobile device when you browse websites. They allow our systems to recognize your browser, maintain session state, and deliver customized user experiences.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">2. How We Use Cookies</h2>
        <p>
          Codex Tech-IT utilizes cookies for essential operations, including:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Strictly Necessary Cookies:</strong> Essential for site security, session maintenance, and administrative authentication.</li>
          <li><strong>Functional Cookies:</strong> Preserving user preferences such as banner dismissals, cookie consent choices, and form drafts.</li>
          <li><strong>Performance & Analytics:</strong> Aggregated anonymous measurement of page traffic and user interactions to optimize platform responsiveness.</li>
        </ul>

        <h2 className="text-xl font-heading font-bold text-navy-900">3. Managing Your Cookie Preferences</h2>
        <p>
          You can adjust or revoke your cookie preferences at any time using our Cookie Consent Banner or via your browser configuration. Disabling certain cookies may limit your ability to use specific interactive tools.
        </p>
      </div>
    );
  } else if (path.includes('refund')) {
    title = 'Refund & Cancellation Policy';
    eyebrow = 'Financial Policies';
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-heading font-bold text-navy-900">1. IT Training Courses</h2>
        <p>
          Course enrollment fees may be refunded in full if a written cancellation request is received at least 7 calendar days prior to the published batch orientation date. Cancellations requested within 7 calendar days before the first session are eligible for a 75% refund or a 100% credit toward a future batch.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">2. Career Campaign Retainers</h2>
        <p>
          Custom job campaign retainers and career partner plan deposits cover direct labor costs including individual resume rebranding, targeted company research, and dedicated recruiter hours. Once work has commenced, retainers are non-refundable except as explicitly guaranteed in specific contract schedules.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">3. Processing Timelines</h2>
        <p>
          Approved refund requests are credited back to the original method of payment within 7 to 10 business days of written approval by Codex Tech-IT accounting.
        </p>
      </div>
    );
  } else if (path.includes('accessibility')) {
    title = 'Accessibility Statement';
    eyebrow = 'Inclusion Standards';
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-heading font-bold text-navy-900">1. Our Accessibility Commitment</h2>
        <p>
          Codex Tech-IT is dedicated to ensuring digital accessibility for all users, including individuals with disabilities. We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA conformance standards.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">2. Measures Implemented</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Full keyboard navigation with visible focus rings across all interactive links, buttons, and form inputs.</li>
          <li>Screen reader accessible forms with distinct labels, error descriptions, and ARIA attributes.</li>
          <li>Support for user system preferences including <code>prefers-reduced-motion</code> to disable 3D scenes and intense animations.</li>
          <li>Strict color contrast ratios exceeding 4.5:1 for standard body text against background surfaces.</li>
          <li>Dedicated Skip to Main Content navigation mechanism on all pages.</li>
        </ul>

        <h2 className="text-xl font-heading font-bold text-navy-900">3. Feedback & Contact</h2>
        <p>
          If you encounter any accessibility barriers on our website, please email our team at <strong>accessibility@codextechit.com</strong> so we can resolve the issue promptly.
        </p>
      </div>
    );
  } else {
    // Default Privacy Policy
    title = 'Privacy Policy';
    eyebrow = 'Data Protection';
    content = (
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-xl font-heading font-bold text-navy-900">1. Information We Collect</h2>
        <p>
          We collect personal and professional information necessary to deliver talent placement, recruitment, and technical training services. This includes your name, email address, phone number, employment history, resume documents, LinkedIn URL, and immigration/work authorization category.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">2. Purpose of Data Processing</h2>
        <p>
          We use your information exclusively to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Evaluate and optimize technical resumes for applicant tracking systems.</li>
          <li>Present qualified candidate credentials to prospective employer partners.</li>
          <li>Coordinate technical interviews and coaching sessions.</li>
          <li>Deliver relevant industry news, webinars, and job opening updates.</li>
          <li>Comply with federal, state, and local regulatory requirements.</li>
        </ul>

        <h2 className="text-xl font-heading font-bold text-navy-900">3. Non-Disclosure & Security</h2>
        <p>
          We do not sell, rent, or trade your personal information to third-party data brokers. Candidate resumes are submitted to employers strictly with explicit candidate authorization. All sensitive submissions are encrypted in transit via TLS 1.3 and stored in secure MySQL databases.
        </p>

        <h2 className="text-xl font-heading font-bold text-navy-900">4. Your Data Rights</h2>
        <p>
          Under GDPR, CCPA, and applicable state privacy laws, you possess the right to inspect, correct, export, or request the deletion of your personal data stored within our systems. To submit a data request, please email <strong>privacy@codextechit.com</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title={`${title} | Codex Tech-IT`}
        description={`Read the official ${title} of Codex Tech-IT regarding our technical staffing, recruitment, and IT training operations.`}
        canonical={path}
      />

      <PageHero
        breadcrumbs={[{ label: title }]}
        badge={eyebrow}
        title={title}
        subtitle={`Official regulatory policies, consumer protections, and terms of service governing Codex Tech-IT talent placement and IT training operations. Last reviewed: ${lastUpdated}.`}
        primaryCta={{
          label: 'Contact Legal Desk',
          href: '/contact',
        }}
        secondaryCta={{
          label: 'Back to Home',
          href: '/',
        }}
        facts={[
          { label: 'Data Security', value: 'TLS 1.3' },
          { label: 'Privacy Framework', value: 'GDPR / CCPA' },
          { label: 'Screening Standard', value: 'FCRA Aligned' },
        ]}
        visual="legal-shield"
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="p-8 md:p-12 rounded-3xl bg-gray-50/50 border border-gray-200">
            {content}
          </div>
        </div>
      </section>
    </div>
  );
};
