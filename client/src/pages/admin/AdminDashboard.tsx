import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Briefcase, GraduationCap, Mail, Award,
  ArrowUpRight, Loader2, CheckCircle2, Clock, RefreshCw, MessageSquare, UserCheck,
  AlertCircle, Database, Server
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<{ status?: number; message: string } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [healthInfo, setHealthInfo] = useState<{ environment: string; database: string; status: string } | null>(null);
  const [activeTableTab, setActiveTableTab] = useState<'leads' | 'applications'>('leads');

  const loadDashboardData = async () => {
    setError(null);
    try {
      const [statsRes, healthRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/health').catch(() => null),
      ]);

      if (statsRes.data?.success && statsRes.data?.data) {
        const d = statsRes.data.data;
        setStats(d);
        setRecentLeads(d.recentLeads || []);
        setRecentApplications(d.recentApplications || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(statsRes.data?.error?.message || 'Invalid server response');
      }

      if (healthRes?.data?.success && healthRes.data?.data) {
        setHealthInfo(healthRes.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      const status = err.response?.status;
      const message = err.response?.data?.error?.message || err.message || 'Unable to connect to API server on port 5000.';
      setError({ status, message });
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const cards = [
    {
      label: 'Consultation Leads',
      val: stats?.leads ?? stats?.kpi?.totalLeads ?? 0,
      newCount: stats?.new_leads ?? stats?.kpi?.newLeads ?? 0,
      icon: Users,
      color: 'text-orange-500 bg-orange-50 border-orange-200/60',
      link: '/admin/submissions?tab=leads',
    },
    {
      label: 'Job Applications',
      val: stats?.applications ?? stats?.kpi?.totalApplications ?? 0,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 border-blue-200/60',
      link: '/admin/submissions?tab=applications',
    },
    {
      label: 'Employer Requests',
      val: stats?.employer_requests ?? stats?.kpi?.totalEmployerRequests ?? 0,
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50 border-purple-200/60',
      link: '/admin/submissions?tab=employer-requests',
    },
    {
      label: 'Contact Messages',
      val: stats?.contacts ?? stats?.kpi?.totalContacts ?? 0,
      icon: MessageSquare,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200/60',
      link: '/admin/submissions?tab=contacts',
    },
    {
      label: 'Course Enrollments',
      val: stats?.enrollments ?? stats?.kpi?.totalEnrollments ?? 0,
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      link: '/admin/submissions?tab=enrollments',
    },
    {
      label: 'Active Subscribers',
      val: stats?.subscribers ?? stats?.kpi?.totalSubscribers ?? 0,
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
      link: '/admin/submissions?tab=subscribers',
    },
    {
      label: 'Live Placements',
      val: stats?.live_placements ?? stats?.kpi?.totalLivePlacements ?? 0,
      icon: Award,
      color: 'text-amber-600 bg-amber-50 border-amber-200/60',
      link: '/admin/content',
    },
    {
      label: 'Candidate Referrals',
      val: stats?.referrals ?? stats?.kpi?.totalReferrals ?? 0,
      icon: UserCheck,
      color: 'text-rose-600 bg-rose-50 border-rose-200/60',
      link: '/admin/submissions?tab=referrals',
    },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Admin Overview Dashboard | Codex Tech-IT" />

      {/* Title & Refresh & Database Health Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-heading font-extrabold text-navy-900">Dashboard Overview</h1>
            {healthInfo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{healthInfo.environment}: <strong className="font-mono">{healthInfo.database}</strong> ({healthInfo.status})</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live metrics and submission streams connected directly to MySQL.
            {lastUpdated && <span className="ml-2 font-mono text-slate-400">· Last updated {lastUpdated}</span>}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2 self-start sm:self-auto cursor-pointer"
          disabled={loading || refreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </Button>
      </div>

      {/* ERROR STATE: Never show zeros when an error occurs */}
      {error && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">
                Dashboard Metrics Unavailable {error.status ? `(HTTP ${error.status})` : ''}
              </div>
              <div className="text-xs text-rose-700 mt-1 leading-relaxed">
                {error.message}. Please check that MySQL and the Express API server (port 5000) are running.
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleRefresh}
            className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Request
          </Button>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-8 w-14 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
            <div className="space-y-2 pt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ) : !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={i}
                  to={c.link}
                  className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-orange-300 shadow-sm transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">{c.label}</span>
                    <div className={`w-10 h-10 rounded-xl ${c.color} border flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-heading font-black text-navy-900">{c.val}</div>
                    {c.newCount ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {c.newCount} New
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity Table Container */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => setActiveTableTab('leads')}
                    className={`text-sm font-heading font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                      activeTableTab === 'leads'
                        ? 'bg-navy-900 text-white'
                        : 'text-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    Recent Inquiries ({recentLeads.length})
                  </button>
                  <button
                    onClick={() => setActiveTableTab('applications')}
                    className={`text-sm font-heading font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                      activeTableTab === 'applications'
                        ? 'bg-navy-900 text-white'
                        : 'text-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    Recent Job Applications ({recentApplications.length})
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {activeTableTab === 'leads'
                    ? 'Latest consultation and candidate career requests'
                    : 'Latest engineer submissions for open job positions'}
                </p>
              </div>

              <Link
                to={`/admin/submissions?tab=${activeTableTab}`}
                className="text-xs font-heading font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All {activeTableTab === 'leads' ? 'Inquiries' : 'Applications'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {activeTableTab === 'leads' ? (
              recentLeads.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No candidate inquiries recorded in database yet. Forms submitted on the public website will appear here in real-time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3">Candidate</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Service Interest</th>
                        <th className="pb-3">Visa Status</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-bold text-navy-900">{lead.name}</td>
                          <td className="py-3">
                            <div>{lead.email}</div>
                            <div className="text-[10px] text-slate-400">{lead.phone}</div>
                          </td>
                          <td className="py-3 font-semibold text-blue-600">{lead.service_interest || 'General'}</td>
                          <td className="py-3 text-slate-500">{lead.visa_status || 'N/A'}</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.status === 'NEW'
                                  ? 'bg-amber-50 text-amber-700'
                                  : lead.status === 'CONTACTED'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 text-[11px] text-slate-400">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : recentApplications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No job applications submitted yet. Candidate applications submitted from /careers will appear here in real-time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Applicant</th>
                      <th className="pb-3">Applied Position</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50">
                        <td className="py-3 font-bold text-navy-900">{app.name}</td>
                        <td className="py-3 font-semibold text-blue-600">{app.job?.title || 'General Application'}</td>
                        <td className="py-3">
                          <div>{app.email}</div>
                          <div className="text-[10px] text-slate-400">{app.phone}</div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'NEW'
                                ? 'bg-amber-50 text-amber-700'
                                : app.status === 'CONTACTED'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {app.status || 'NEW'}
                          </span>
                        </td>
                        <td className="py-3 text-[11px] text-slate-400">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
