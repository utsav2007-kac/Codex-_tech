import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Sparkles, Loader2, Users } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs')
      .then((res) => {
        if (res.data?.data) {
          setJobs(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const perks = [
    {
      title: 'Competitive Compensation & Bonuses',
      description: 'Performance-driven salary packages with uncapped placement commissions and quarterly profit-sharing bonuses.',
      icon: Zap,
    },
    {
      title: 'Flexible & Remote-Friendly',
      description: 'Hybrid operations across our Dallas and Hyderabad offices, with full remote flexibility for senior roles.',
      icon: Globe,
    },
    {
      title: 'Health & Wellness Coverage',
      description: 'Comprehensive medical, dental, and vision insurance policies for you and your direct dependents.',
      icon: Heart,
    },
    {
      title: 'Continuous Career Development',
      description: 'Dedicated annual learning stipend for cloud certifications, recruiter credentials, and leadership training.',
      icon: Users,
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Careers at Codex Tech-IT | Join Our High-Performance Team"
        description="Join Codex Tech-IT's global staffing, training, and talent acquisition teams. Explore open roles in technical recruiting, engineering, and career coaching."
        canonical="/careers"
      />

      {/* Header */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: 'Careers' }]} />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Work With Us</div>
            <h1 className="text-h1 text-navy-900 mb-6">
              Build the Future of <span className="text-brand-gradient">Technical Staffing.</span>
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              At Codex Tech-IT, we operate with an obsession for candidate success, speed without chaos, and ethical placement standards. Join an ambitious, supportive team connecting top engineers with leading organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Culture & Perks */}
      <section className="section-padding bg-gray-50 border-b border-gray-200/60">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow">Why Codex Tech-IT</div>
            <h2 className="text-h2 text-navy-900">Perks & Culture Designed for Growth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={i} className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{perk.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-12">
            <div className="eyebrow">Current Openings (SAMPLE)</div>
            <h2 className="text-h2 text-navy-900 mb-4">Explore Opportunities to Join Us</h2>
            <p className="text-sm text-slate-500">
              We are actively hiring for recruiters, developers, account managers, and instructors across North America and India.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-3" />
              <p className="text-sm text-slate-500">Retrieving open positions...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-slate-600 mb-4">No positions are currently open. Please check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.slug}
                  className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {job.type}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-navy-900 hover:text-orange-500 transition-colors">
                      <Link to={`/careers/${job.slug}`}>{job.title}</Link>
                    </h3>
                  </div>

                  <div>
                    <Link
                      to={`/careers/${job.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold font-heading hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
