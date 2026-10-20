import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, UserCheck, Building2, Zap, Clock, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';

export const HowItWorks: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [activeTab, setActiveTab] = useState<'candidates' | 'employers'>('candidates');

  const seekerSteps = [
    {
      step: '01',
      title: 'Free Career Consultation & Profile Audit',
      desc: 'We conduct a comprehensive 45-minute technical audit analyzing your programming stack, career trajectory, visa eligibility, and compensation targets. We identify structural resume issues and establish clear placement milestones.',
    },
    {
      step: '02',
      title: 'Profile Enhancement & Technical Rebranding',
      desc: 'Our certified technical writers reconstruct your resume and LinkedIn profile to ensure 85%+ ATS compatibility. We emphasize production-scale metrics, architectural trade-offs, and in-demand keywords that trigger recruiter searches.',
    },
    {
      step: '03',
      title: 'Targeted Interview Preparation & Mock Rounds',
      desc: 'You complete live 1-on-1 coding challenges and system design mock sessions with active software directors. We practice STAR-format behavioral answers and eliminate communication habits that trigger interview rejections.',
    },
    {
      step: '04',
      title: 'Direct Job Matching & Employer Campaigning',
      desc: 'We introduce your vetted credentials directly to engineering hiring managers across our 180+ verified corporate partner network. No blind resume blasting into black-hole applicant portals.',
    },
    {
      step: '05',
      title: 'Placement, Offer Negotiation & Onboarding',
      desc: 'We support you through round-by-round interview debriefs, evaluate competing offer letters, negotiate competitive base salaries, and coordinate your documentation and first 90 days of onboarding.',
    },
  ];

  const employerSteps = [
    {
      step: '01',
      title: 'Requirement & Culture Calibration',
      desc: 'We meet with your engineering leadership to calibrate on tech stack nuances, delivery sprints, seniority levels, budget caps, and team communication expectations.',
    },
    {
      step: '02',
      title: 'Targeted Sourcing & Network Activation',
      desc: 'We activate our proprietary pre-screened technical candidate database and run specialized sourcing campaigns across developer networks and community hubs.',
    },
    {
      step: '03',
      title: 'Rigorous Technical Screening & Verification',
      desc: 'Every candidate undergoes a 45-minute live technical evaluation by practicing software architects. We confirm clean code standards, architecture fundamentals, and work authorization.',
    },
    {
      step: '04',
      title: 'Shortlist Delivery & Client Interviews',
      desc: 'Within 48 to 72 hours, we deliver a curated shortlist of 2 to 4 candidates ready for your hiring loops. We coordinate scheduling and provide detailed candidate dossiers.',
    },
    {
      step: '05',
      title: 'Offer Finalization & 90-Day Guarantee',
      desc: 'We assist with offer letters, handle background checks, manage multi-state payroll compliance, and back every direct hire with our standard 90-day replacement guarantee.',
    },
  ];

  const steps = activeTab === 'candidates' ? seekerSteps : employerSteps;

  return (
    <div className="bg-white">
      <SEO
        title="How It Works | The Codex Tech-IT Placement Methodology"
        description="Learn how Codex Tech-IT connects candidates with top tech employers in 5 transparent steps. Explore our methodologies for both job seekers and corporate employers."
        canonical="/how-it-works"
      />

      {/* Header */}
      <Scroll3DSection preset="fade3d" className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'How It Works' }]} />
          <SectionReveal variant="tiltUp" className="max-w-3xl mt-4">
            <div className="eyebrow">Proven Methodology</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              How Codex Tech-IT <span className="text-brand-gradient">Delivers Faster.</span>
            </h1>
            <p className="text-body-lg text-slate-800 font-medium leading-relaxed mb-8">
              A transparent, step-by-step framework engineered to eliminate hiring chaos, reduce recruitment friction, and accelerate time-to-hire.
            </p>

            {/* Interactive Tabs */}
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                onClick={() => setActiveTab('candidates')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'candidates' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-700 font-medium hover:text-navy-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>For Job Seekers</span>
              </button>
              <button
                onClick={() => setActiveTab('employers')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'employers' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-700 font-medium hover:text-navy-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Employers</span>
              </button>
            </div>
          </SectionReveal>
        </div>
      </Scroll3DSection>

      {/* Steps Timeline */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="relative border-l-2 border-orange-500/30 pl-8 sm:pl-12 flex flex-col gap-10">
            {steps.map((s, idx) => (
              <Scroll3DCard key={idx} index={idx} maxTilt={4} className="p-6 sm:p-8 rounded-3xl bg-gray-50/70 border border-gray-200/80 shadow-sm relative">
                <div className="absolute -left-[45px] sm:-left-[61px] top-6 w-6 h-6 rounded-full bg-orange-500 border-4 border-white shadow-md flex items-center justify-center" />
                <span className="text-sm font-numbers font-extrabold text-orange-600 uppercase tracking-widest block mb-1">
                  Step {s.step}
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-navy-900 mb-3">
                  {s.title}
                </h2>
                <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
                  {s.desc}
                </p>
              </Scroll3DCard>
            ))}
          </div>

          <SectionReveal variant="tiltUp" className="mt-16 pt-8 border-t border-gray-100 text-center">
            {activeTab === 'candidates' ? (
              <Button variant="primary" size="lg" onClick={onOpenConsultation}>
                Start Your Placement Journey <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button variant="primary" size="lg" href="/employers">
                Request Engineering Talent Shortlist <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            )}
          </SectionReveal>
        </div>
      </Scroll3DSection>
    </div>
  );
};
