import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, ArrowRight, Users, Sparkles, Building2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionReveal } from '../components/motion/SectionReveal';
import { TiltCard } from '../components/motion/TiltCard';
import { Button } from '../components/ui/Button';

export const About: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  return (
    <div className="bg-white">
      <SEO
        title="About Codex Tech-IT | Our Story, Mission & Values"
        description="Learn about Codex Tech-IT: our origin story, mission to connect the right people with the right opportunities, and our 6 foundational operating values."
        canonical="/about"
      />

      {/* Hero Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'About Us' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Who We Are</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Engineering Careers with <span className="text-brand-gradient">Purpose & Velocity.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Codex Tech-IT was founded to solve a pervasive problem in technical staffing: transactional recruiters who don't understand engineering, and qualified engineers lost in algorithmic screening filters.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Evolution */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-5 text-sm sm:text-base text-slate-600 leading-relaxed">
              <h2 className="text-h2 text-navy-900">
                Bridging the Gap Between <span className="text-brand-gradient">Talent & Opportunity.</span>
              </h2>
              <p>
                In 2021, an experienced team of enterprise cloud architects and technical recruiters noticed a growing breakdown across technical hiring. Candidates with genuine coding capabilities were being rejected by uncalibrated ATS filters, while hiring managers were drowning in hundreds of unqualified applications.
              </p>
              <p>
                Codex Tech-IT was built to bridge this disconnect through a dual-pillar methodology: rigorous technical preparation combined with direct, advocate-led placement. We ensure every candidate we submit is technically vetted, culturally coached, and positioned around measurable project impact.
              </p>
              <p>
                Today, operating across our hubs in Plano, Texas, and Hyderabad, India, we have facilitated over 2,400 successful placements across FinTech, Healthcare, Logistics, and Enterprise SaaS.
              </p>
            </div>

            <div className="lg:col-span-6 bg-navy-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">Our Core Mission</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  "Create meaningful employment by connecting the right people with the right opportunities—faster, fairer, and with complete transparency."
                </p>

                <h3 className="text-xl font-heading font-bold text-white mb-3">Our Vision</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  To become the gold standard in technical career acceleration and enterprise engineering staffing across North America and India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Values */}
      <section className="section-padding bg-gray-50 border-t border-gray-200/60">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Guiding Principles</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              Our 6 Foundational <span className="text-brand-gradient">Values.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              The operating benchmarks that govern every candidate interaction and client partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Candidate-First',
                desc: 'We prioritize the long-term career growth of engineers over short-term transaction fees. Your trajectory is our priority.',
              },
              {
                title: 'Integrity & Transparency',
                desc: 'No hidden clauses, no unrealistic guarantees, and complete honesty regarding market expectations and interview feedback.',
              },
              {
                title: 'Speed Without Chaos',
                desc: 'We optimize every step of the vetting and submission pipeline so hiring proceeds rapidly without sacrificing screening depth.',
              },
              {
                title: 'Ethical Hiring',
                desc: 'Strict adherence to labor regulations, non-discriminatory hiring practices, and compliant visa documentation.',
              },
              {
                title: 'Long-Term Partnership',
                desc: 'We stay connected well beyond placement day, providing ongoing retention coaching and talent growth roadmaps.',
              },
              {
                title: 'Continuous Learning',
                desc: 'The technical landscape evolves constantly. We continuously update our training curricula and interview simulators.',
              },
            ].map((val, idx) => (
              <div key={idx} className="p-7 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-numbers font-bold text-xs mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team (SAMPLE Placeholders as per prompt Section 6.3) */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Leadership</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              Experienced Tech <span className="text-brand-gradient">Leadership.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Guided by veterans with decades of collective experience across software engineering and talent operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Marcus Vance', role: 'Managing Director & Founder', bio: 'Former VP of Talent with 14+ years scaling technical recruiting across US enterprise financial institutions.' },
              { name: 'Elena Rostova', role: 'Head of Career Strategy & Training', bio: 'Certified career strategist who has guided over 1,500 engineers into high-growth software roles.' },
              { name: 'David Keller', role: 'VP of Engineering & Client Solutions', bio: 'Former Cloud Solutions Architect specializing in distributed Java, AWS, and modern DevOps pipelines.' },
            ].map((leader, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-blue-600 text-white font-heading font-bold text-xl flex items-center justify-center mb-4 shadow-md">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-heading font-bold text-base text-navy-900 mb-1">{leader.name}</h3>
                <div className="text-xs font-semibold text-orange-600 mb-3">{leader.role}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{leader.bio}</p>
                <span className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Verified Practitioner (SAMPLE)</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="section-padding bg-gray-50 border-t border-gray-200/60">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-16">
            <div className="eyebrow justify-center">Our Journey</div>
            <h2 className="text-h2 text-navy-900 mb-4">
              Milestones Along <span className="text-brand-gradient">The Way.</span>
            </h2>
          </div>

          <div className="relative border-l-2 border-orange-500/30 pl-6 sm:pl-8 flex flex-col gap-10">
            {[
              { year: '2021', title: 'Codex Tech-IT Founded in Plano, TX', desc: 'Established initial technical recruiting operations focused on US IT staff augmentation in Cloud and Java tracks.' },
              { year: '2022', title: 'Launch of Live IT Training Division', desc: 'Introduced live, instructor-led training with hands-on capstone projects to address emerging tech skill shortages.' },
              { year: '2023', title: 'Global Delivery Center Opened in Hyderabad', desc: 'Expanded offshore technical sourcing and 24/7 mock interview coaching capabilities.' },
              { year: '2024', title: 'Surpassed 2,000 Placed Technical Professionals', desc: 'Achieved an average placement turnaround of 21 business days with over 180 enterprise hiring partners.' },
              { year: '2026', title: 'Next-Gen Autonomous Candidate Diagnostic Suite', desc: 'Engineered ATS Resume, LinkedIn, and Job Match scoring tools to bring transparency to engineering job seekers.' },
            ].map((m, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm" />
                <span className="text-xs font-numbers font-bold text-orange-600 uppercase tracking-wider">{m.year}</span>
                <h3 className="font-heading font-bold text-base text-navy-900 mt-0.5 mb-1">{m.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Ready to Accelerate Your <span className="text-brand-gradient">Career?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Schedule a free 30-minute consultation with a senior technical recruiter today.
          </p>
          <Button variant="primary" size="lg" onClick={onOpenConsultation}>
            Book Free Consultation <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};
