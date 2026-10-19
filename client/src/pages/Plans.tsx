import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';

export const Plans: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const plans = [
    {
      name: 'US Career Ready',
      tier: 'Start',
      tagline: 'Ideal for engineers with working applications who need ATS keyword reconstruction and mock review.',
      pricing: 'Contact Us',
      popular: false,
      features: [
        'ATS-optimized resume reconstruction (1-2 pages)',
        'LinkedIn headline and About narrative optimization',
        '3 Live technical mock interview rounds',
        'Direct representation to partner employer network',
        'Standard email support with talent advisor',
        'Job search tracking portal access',
      ],
      notIncluded: [
        'Live IT Training Bootcamp access',
        'Dedicated custom job outreach campaigns',
        'Unlimited mock interview revisions',
      ],
    },
    {
      name: 'Career Accelerator',
      tier: 'Most Popular',
      tagline: 'Comprehensive coaching, direct manager advocacy, and intensive system design preparation.',
      pricing: 'Contact Us',
      popular: true,
      features: [
        'Everything in US Career Ready',
        '6 Live system design & coding mock rounds with feedback',
        'Dedicated Senior Talent Director advocacy',
        'Personalized custom job campaigns (direct manager pitching)',
        'Salary and counter-offer negotiation coaching',
        'STEM-OPT, H-1B transfer, and visa guidance',
        'Direct recruiter phone debriefs between interview rounds',
      ],
      notIncluded: [
        'Full 12-week live IT training track access',
      ],
    },
    {
      name: 'Career Partner',
      tier: 'Executive / Transition',
      tagline: 'Full-spectrum transition support, live IT training bootcamp access, and ongoing mentorship.',
      pricing: 'Contact Us',
      popular: false,
      features: [
        'Everything in Career Accelerator',
        'Full access to 1 live IT training track with capstones',
        'Unlimited technical and behavioral mock interview rounds',
        'Senior director executive sponsorship',
        '24/7 priority access to career advisory pod',
        '90-day post-placement onboarding coaching & retention check-ins',
        'Guaranteed interview schedule SLA',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Career Plans & Packages | US Career Ready, Accelerator & Partner"
        description="Explore Codex Tech-IT career accelerator packages. ATS profile reconstruction, live 1-on-1 mock interviews, direct employer advocacy, and negotiation coaching."
        canonical="/plans"
      />

      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Career Plans' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Clear, Transparent Pricing</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Tailored Career <span className="text-brand-gradient">Acceleration Plans.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-6">
              Standard recruitment placement is always 100% employer-funded. For candidates seeking intensive 1-on-1 executive rebranding, live mock interviews, or bootcamp training, we offer clear accelerator packages.
            </p>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/60 text-xs text-orange-900 font-medium inline-block">
              Notice: Standard recruitment placement has zero fees for job seekers. Accelerator programs have flexible 0% interest monthly installment plans.
            </div>
          </div>
        </div>
      </section>

      {/* 3 Tier Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  p.popular
                    ? 'bg-white border-2 border-orange-500 shadow-elevated relative scale-105 z-10'
                    : 'bg-white border border-gray-200/80 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{p.tier}</span>
                    {p.popular && (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h2 className="font-heading font-bold text-2xl text-navy-900 mb-2">{p.name}</h2>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{p.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className="text-3xl font-heading font-black text-navy-900">{p.pricing}</span>
                    <span className="text-xs text-slate-400 block mt-1">Flexible monthly installments</span>
                  </div>

                  {/* Features list */}
                  <ul className="flex flex-col gap-3 mb-8 text-xs text-slate-600">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {p.notIncluded.map((nf, nfIdx) => (
                      <li key={nfIdx} className="flex items-start gap-2.5 text-slate-400 opacity-60">
                        <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <span className="line-through">{nf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={p.popular ? 'primary' : 'outline'}
                  size="md"
                  onClick={onOpenConsultation}
                  className="w-full"
                >
                  Choose {p.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="max-w-4xl mx-auto mb-20">
            <h3 className="text-h3 font-bold text-navy-900 text-center mb-8">Detailed Feature Comparison</h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-navy-900 text-white">
                      <th className="p-4 font-bold">Feature Deliverable</th>
                      <th className="p-4 font-bold text-center">US Career Ready</th>
                      <th className="p-4 font-bold text-center text-orange-400 bg-navy-800">Career Accelerator</th>
                      <th className="p-4 font-bold text-center">Career Partner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['ATS Resume Rebuild', '1-2 Pages', '1-2 Pages + Revisions', 'Executive Dossier'],
                      ['LinkedIn Optimization', 'Headline + About', 'Full Search Indexing', 'Full Executive Branding'],
                      ['Live Technical Mock Rounds', '3 Sessions', '6 Sessions', 'Unlimited Sessions'],
                      ['System Design Frameworks', 'Core Review', 'Deep Architecture Sprints', 'Full Scalability Mastery'],
                      ['Employer Representation', 'Direct Introductions', 'Priority Direct Advocacy', 'Executive Placement Pipeline'],
                      ['Custom Job Campaigns', 'No', 'Yes (Active Pitching)', 'Yes (White-Glove VIP)'],
                      ['Live IT Training Bootcamp', 'No', 'Optional Add-on', 'Included (1 Complete Track)'],
                      ['Post-Placement Retention Support', '30 Days', '60 Days', '90 Days Dedicated'],
                    ].map(([feat, r1, r2, r3], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="p-4 font-semibold text-navy-900">{feat}</td>
                        <td className="p-4 text-center text-slate-600">{r1}</td>
                        <td className="p-4 text-center font-bold text-navy-900 bg-orange-50/20">{r2}</td>
                        <td className="p-4 text-center text-slate-600">{r3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-h3 font-bold text-navy-900 text-center mb-8">Pricing & Payments FAQ</h3>
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-bold text-navy-900 mb-1">Is job placement really free for candidates?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes. When you are hired through our standard staffing representation, the hiring employer compensates Codex Tech-IT. We never charge candidates for placement into our client network.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-bold text-navy-900 mb-1">How do payment plans work for Accelerator packages?</h4>
                <p className="text-slate-600 leading-relaxed">
                  We offer flexible monthly installment plans with 0% interest to make coaching accessible to transitioning professionals.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-bold text-navy-900 mb-1">What is your refund policy?</h4>
                <p className="text-slate-600 leading-relaxed">
                  We provide a 100% money-back guarantee within the first 7 days of starting any coaching or training program if you are not completely satisfied.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-12 text-center text-[11px] text-slate-400 leading-relaxed">
              * Outcomes-Not-Guaranteed Disclaimer: Career acceleration programs provide intensive coaching, profile reconstruction, and interview preparation. Specific employment offers, compensation amounts, and hiring decisions remain solely at the discretion of prospective corporate employers.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
